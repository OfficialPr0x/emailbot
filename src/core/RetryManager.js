import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('RetryManager');

/**
 * Retry Manager with exponential backoff, error classification, and manual intervention
 * Provides multiple retry strategies for maximum reliability
 */
export class RetryManager {
  constructor(options = {}) {
    this.options = {
      maxRetries: options.maxRetries || parseInt(process.env.MAX_RETRIES_PER_STEP) || 3,  // Reduced from 5 to 3
      initialDelay: options.initialDelay || 500,  // Reduced from 1000ms to 500ms
      maxDelay: options.maxDelay || 8000,  // Reduced from 16000ms to 8000ms
      backoffFactor: options.backoffFactor || 2,
      enableManualIntervention: options.enableManualIntervention !== undefined 
        ? options.enableManualIntervention 
        : (process.env.MANUAL_INTERVENTION_ENABLED === 'true'),
      ...options,
    };

    this.retryHistory = [];
  }

  /**
   * Execute a function with exponential backoff retry
   * @param {Function} fn - Async function to execute
   * @param {Object} options - Retry options
   * @returns {Promise<any>} Result of the function
   */
  async executeWithRetry(fn, options = {}) {
    const {
      operationName = 'operation',
      maxRetries = this.options.maxRetries,
      initialDelay = this.options.initialDelay,
      maxDelay = this.options.maxDelay,
      backoffFactor = this.options.backoffFactor,
      onRetry = null,
      validateResult = null,
    } = options;

    let lastError;
    let delay = initialDelay;
    let attempt = 0;

    logger.info(`Starting ${operationName} with retry capability`, { 
      maxRetries, 
      initialDelay 
    });

    while (attempt < maxRetries) {
      attempt++;

      try {
        logger.info(`Attempt ${attempt}/${maxRetries} for ${operationName}`);
        
        const result = await fn(attempt);

        // Validate result if validator provided
        if (validateResult && !validateResult(result)) {
          throw new Error('Result validation failed');
        }

        logger.info(`${operationName} succeeded on attempt ${attempt}`);
        
        // Record success
        this.recordAttempt(operationName, attempt, true);
        
        return result;
      } catch (error) {
        lastError = error;
        
        const errorType = this.classifyError(error);
        logger.warn(`${operationName} failed on attempt ${attempt}`, {
          error: error.message,
          errorType,
          attemptsRemaining: maxRetries - attempt,
        });

        // Record failure
        this.recordAttempt(operationName, attempt, false, error);

        // Call retry callback if provided
        if (onRetry) {
          try {
            await onRetry(attempt, error, errorType);
          } catch (callbackError) {
            logger.error('Retry callback failed', { error: callbackError.message });
          }
        }

        // If max retries reached, check for manual intervention
        if (attempt >= maxRetries) {
          if (this.options.enableManualIntervention) {
            logger.warn(`All retries exhausted for ${operationName}, manual intervention may be required`);
            // In a real implementation, this could pause and wait for human input
            // For now, we'll just throw the error
          }
          break;
        }

        // Calculate delay with exponential backoff
        const currentDelay = Math.min(delay, maxDelay);
        logger.info(`Waiting ${currentDelay}ms before retry ${attempt + 1}`);
        
        await helpers.randomDelay(currentDelay, currentDelay * 1.5);
        
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }

    logger.error(`${operationName} failed after ${maxRetries} attempts`);
    throw lastError;
  }

  /**
   * Execute with multiple strategies
   * Tries different approaches until one succeeds
   * @param {Array<Function>} strategies - Array of strategy functions
   * @param {Object} options - Options
   * @returns {Promise<any>}
   */
  async executeWithStrategies(strategies, options = {}) {
    const {
      operationName = 'multi-strategy operation',
      retryEachStrategy = true,
      maxRetriesPerStrategy = 2,
    } = options;

    logger.info(`Executing ${operationName} with ${strategies.length} strategies`);

    let lastError;
    let strategyIndex = 0;

    for (const strategy of strategies) {
      strategyIndex++;
      
      try {
        logger.info(`Trying strategy ${strategyIndex}/${strategies.length} for ${operationName}`);
        
        if (retryEachStrategy) {
          // Execute strategy with retry
          return await this.executeWithRetry(
            () => strategy(),
            {
              operationName: `${operationName} (strategy ${strategyIndex})`,
              maxRetries: maxRetriesPerStrategy,
            }
          );
        } else {
          // Execute strategy once
          return await strategy();
        }
      } catch (error) {
        lastError = error;
        logger.warn(`Strategy ${strategyIndex} failed`, {
          error: error.message,
          remainingStrategies: strategies.length - strategyIndex,
        });
        
        // Continue to next strategy
        continue;
      }
    }

    logger.error(`All ${strategies.length} strategies failed for ${operationName}`);
    throw new Error(`All strategies failed: ${lastError?.message}`);
  }

  /**
   * Execute with timeout
   * @param {Function} fn - Function to execute
   * @param {number} timeout - Timeout in milliseconds
   * @param {string} operationName - Name for logging
   * @returns {Promise<any>}
   */
  async executeWithTimeout(fn, timeout, operationName = 'operation') {
    logger.info(`Executing ${operationName} with ${timeout}ms timeout`);

    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${operationName} timed out after ${timeout}ms`)), timeout)
      ),
    ]);
  }

  /**
   * Classify error type for better handling
   * @param {Error} error - Error to classify
   * @returns {string} Error type
   */
  classifyError(error) {
    const message = error.message.toLowerCase();

    if (message.includes('timeout') || message.includes('timed out')) {
      return 'TIMEOUT';
    }
    if (message.includes('not found') || message.includes('no such element')) {
      return 'ELEMENT_NOT_FOUND';
    }
    if (message.includes('validation') || message.includes('verify') || message.includes('invalid value')) {
      return 'VALIDATION_ERROR';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'NETWORK_ERROR';
    }
    if (message.includes('closed') || message.includes('detached')) {
      return 'BROWSER_ERROR';
    }
    if (message.includes('captcha')) {
      return 'CAPTCHA_REQUIRED';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'RATE_LIMITED';
    }

    return 'UNKNOWN';
  }

  /**
   * Get recommended action for error type
   * @param {string} errorType - Error type from classifyError
   * @returns {Object} Recommended action
   */
  getErrorHandlingStrategy(errorType) {
    const strategies = {
      TIMEOUT: {
        action: 'INCREASE_TIMEOUT_AND_RETRY',
        increaseTimeout: true,
        retryWithBackoff: true,
        maxRetries: 3,
      },
      ELEMENT_NOT_FOUND: {
        action: 'TRY_ALTERNATIVE_SELECTORS',
        useAIDiscovery: true,
        retryWithBackoff: true,
        maxRetries: 5,
      },
      VALIDATION_ERROR: {
        action: 'RE_ATTEMPT_WITH_DIFFERENT_STRATEGY',
        clearAndRetry: true,
        retryWithBackoff: true,
        maxRetries: 4,
      },
      NETWORK_ERROR: {
        action: 'RETRY_WITH_EXPONENTIAL_BACKOFF',
        retryWithBackoff: true,
        maxRetries: 5,
        initialDelay: 2000,
      },
      BROWSER_ERROR: {
        action: 'RESTART_BROWSER',
        restartRequired: true,
        maxRetries: 2,
      },
      CAPTCHA_REQUIRED: {
        action: 'MANUAL_INTERVENTION',
        requiresHuman: true,
        pauseWorkflow: true,
      },
      RATE_LIMITED: {
        action: 'WAIT_AND_RETRY',
        retryWithBackoff: true,
        initialDelay: 60000, // 1 minute
        maxRetries: 3,
      },
      UNKNOWN: {
        action: 'RETRY_WITH_BACKOFF',
        retryWithBackoff: true,
        maxRetries: 3,
      },
    };

    return strategies[errorType] || strategies.UNKNOWN;
  }

  /**
   * Record attempt for analytics
   * @param {string} operationName - Operation name
   * @param {number} attempt - Attempt number
   * @param {boolean} success - Whether attempt succeeded
   * @param {Error} error - Error if failed
   */
  recordAttempt(operationName, attempt, success, error = null) {
    this.retryHistory.push({
      operationName,
      attempt,
      success,
      error: error ? error.message : null,
      errorType: error ? this.classifyError(error) : null,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 attempts in memory
    if (this.retryHistory.length > 100) {
      this.retryHistory.shift();
    }
  }

  /**
   * Get retry statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    const totalAttempts = this.retryHistory.length;
    const successfulAttempts = this.retryHistory.filter(a => a.success).length;
    const failedAttempts = totalAttempts - successfulAttempts;

    const errorTypes = {};
    this.retryHistory
      .filter(a => !a.success && a.errorType)
      .forEach(a => {
        errorTypes[a.errorType] = (errorTypes[a.errorType] || 0) + 1;
      });

    const operationStats = {};
    this.retryHistory.forEach(a => {
      if (!operationStats[a.operationName]) {
        operationStats[a.operationName] = { attempts: 0, successes: 0, failures: 0 };
      }
      operationStats[a.operationName].attempts++;
      if (a.success) {
        operationStats[a.operationName].successes++;
      } else {
        operationStats[a.operationName].failures++;
      }
    });

    return {
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      successRate: totalAttempts > 0 ? (successfulAttempts / totalAttempts * 100).toFixed(2) + '%' : 'N/A',
      errorTypes,
      operationStats,
    };
  }

  /**
   * Clear retry history
   */
  clearHistory() {
    this.retryHistory = [];
    logger.info('Retry history cleared');
  }

  /**
   * Create a retry wrapper for a specific operation type
   * @param {string} operationName - Name of the operation
   * @param {Object} defaultOptions - Default options for this operation
   * @returns {Function} Wrapped retry function
   */
  createRetryWrapper(operationName, defaultOptions = {}) {
    return async (fn, options = {}) => {
      return this.executeWithRetry(fn, {
        operationName,
        ...defaultOptions,
        ...options,
      });
    };
  }
}

export default RetryManager;

