import { createLogger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger('StateManager');

/**
 * State Manager for workflow state persistence and recovery
 * Enables resuming workflows from last successful step
 */
export class StateManager {
  constructor(options = {}) {
    this.options = {
      stateDir: options.stateDir || path.join(path.dirname(__dirname), '..', 'accounts', 'states'),
      enablePersistence: options.enablePersistence !== undefined 
        ? options.enablePersistence 
        : (process.env.STATE_PERSISTENCE_ENABLED !== 'false'),
      autoSave: options.autoSave !== undefined ? options.autoSave : true,
      ...options,
    };

    // Ensure state directory exists
    if (this.options.enablePersistence && !fs.existsSync(this.options.stateDir)) {
      fs.mkdirSync(this.options.stateDir, { recursive: true });
      logger.info('Created state directory', { path: this.options.stateDir });
    }

    this.currentState = null;
    this.accountId = null;
  }

  /**
   * Initialize state for a new workflow
   * @param {string} accountId - Account ID
   * @param {Object} profile - User profile
   * @param {Object} options - Additional options
   * @returns {Object} Initial state
   */
  initializeState(accountId, profile, options = {}) {
    this.accountId = accountId;
    
    this.currentState = {
      accountId,
      profile,
      workflowType: options.workflowType || 'gmail_creation',
      currentStep: 'initialized',
      completedSteps: [],
      failedSteps: [],
      attemptCount: 0,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      pageUrl: null,
      screenshots: [],
      metadata: options.metadata || {},
      status: 'in_progress',
    };

    logger.info('Initialized workflow state', { 
      accountId, 
      workflowType: this.currentState.workflowType 
    });

    if (this.options.autoSave) {
      this.saveState();
    }

    return this.currentState;
  }

  /**
   * Update current step
   * @param {string} stepName - Name of the current step
   * @param {Object} additionalData - Additional data to store
   */
  updateStep(stepName, additionalData = {}) {
    if (!this.currentState) {
      logger.warn('Attempted to update step without initialized state');
      return;
    }

    this.currentState.currentStep = stepName;
    this.currentState.lastUpdated = new Date().toISOString();
    this.currentState.attemptCount = (this.currentState.attemptCount || 0) + 1;

    // Merge additional data
    Object.assign(this.currentState, additionalData);

    logger.info('Updated workflow step', { 
      accountId: this.accountId, 
      step: stepName,
      attemptCount: this.currentState.attemptCount,
    });

    if (this.options.autoSave) {
      this.saveState();
    }
  }

  /**
   * Mark a step as completed
   * @param {string} stepName - Name of the completed step
   * @param {Object} stepData - Data from the completed step
   */
  completeStep(stepName, stepData = {}) {
    if (!this.currentState) {
      logger.warn('Attempted to complete step without initialized state');
      return;
    }

    if (!this.currentState.completedSteps.includes(stepName)) {
      this.currentState.completedSteps.push(stepName);
    }

    // Store step-specific data
    if (!this.currentState.stepData) {
      this.currentState.stepData = {};
    }
    this.currentState.stepData[stepName] = {
      ...stepData,
      completedAt: new Date().toISOString(),
    };

    this.currentState.lastUpdated = new Date().toISOString();

    logger.info('Marked step as completed', { 
      accountId: this.accountId, 
      step: stepName,
      totalCompleted: this.currentState.completedSteps.length,
    });

    if (this.options.autoSave) {
      this.saveState();
    }
  }

  /**
   * Mark a step as failed
   * @param {string} stepName - Name of the failed step
   * @param {Error} error - Error that caused the failure
   * @param {Object} errorContext - Additional context about the error
   */
  failStep(stepName, error, errorContext = {}) {
    if (!this.currentState) {
      logger.warn('Attempted to fail step without initialized state');
      return;
    }

    const failureRecord = {
      stepName,
      error: error.message,
      errorStack: error.stack,
      timestamp: new Date().toISOString(),
      ...errorContext,
    };

    this.currentState.failedSteps.push(failureRecord);
    this.currentState.lastUpdated = new Date().toISOString();

    logger.warn('Marked step as failed', { 
      accountId: this.accountId, 
      step: stepName,
      error: error.message,
    });

    if (this.options.autoSave) {
      this.saveState();
    }
  }

  /**
   * Add screenshot reference to state
   * @param {string} screenshotPath - Path to screenshot
   * @param {string} description - Description of screenshot
   */
  addScreenshot(screenshotPath, description = '') {
    if (!this.currentState) {
      return;
    }

    this.currentState.screenshots.push({
      path: screenshotPath,
      description,
      step: this.currentState.currentStep,
      timestamp: new Date().toISOString(),
    });

    logger.debug('Added screenshot to state', { 
      path: screenshotPath, 
      step: this.currentState.currentStep 
    });

    if (this.options.autoSave) {
      this.saveState();
    }
  }

  /**
   * Update page URL in state
   * @param {string} url - Current page URL
   */
  updatePageUrl(url) {
    if (!this.currentState) {
      return;
    }

    this.currentState.pageUrl = url;
    this.currentState.lastUpdated = new Date().toISOString();

    if (this.options.autoSave) {
      this.saveState();
    }
  }

  /**
   * Mark workflow as completed
   * @param {Object} result - Final result data
   */
  completeWorkflow(result = {}) {
    if (!this.currentState) {
      logger.warn('Attempted to complete workflow without initialized state');
      return;
    }

    this.currentState.status = 'completed';
    this.currentState.completedAt = new Date().toISOString();
    this.currentState.result = result;
    this.currentState.lastUpdated = new Date().toISOString();

    logger.info('Marked workflow as completed', { 
      accountId: this.accountId,
      duration: this.getWorkflowDuration(),
    });

    this.saveState();
  }

  /**
   * Mark workflow as failed
   * @param {Error} error - Error that caused the failure
   * @param {Object} errorContext - Additional context
   */
  failWorkflow(error, errorContext = {}) {
    if (!this.currentState) {
      logger.warn('Attempted to fail workflow without initialized state');
      return;
    }

    this.currentState.status = 'failed';
    this.currentState.failedAt = new Date().toISOString();
    this.currentState.finalError = {
      message: error.message,
      stack: error.stack,
      ...errorContext,
    };
    this.currentState.lastUpdated = new Date().toISOString();

    logger.error('Marked workflow as failed', { 
      accountId: this.accountId,
      error: error.message,
      duration: this.getWorkflowDuration(),
    });

    this.saveState();
  }

  /**
   * Save current state to disk
   * @returns {boolean} Success status
   */
  saveState() {
    if (!this.options.enablePersistence || !this.currentState || !this.accountId) {
      return false;
    }

    try {
      const filename = `${this.accountId}-state.json`;
      const filepath = path.join(this.options.stateDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(this.currentState, null, 2));
      
      logger.debug('Saved workflow state', { 
        accountId: this.accountId, 
        filepath,
        step: this.currentState.currentStep,
      });

      return true;
    } catch (error) {
      logger.error('Failed to save workflow state', { 
        accountId: this.accountId, 
        error: error.message 
      });
      return false;
    }
  }

  /**
   * Load state from disk
   * @param {string} accountId - Account ID
   * @returns {Object|null} Loaded state or null
   */
  loadState(accountId) {
    if (!this.options.enablePersistence) {
      return null;
    }

    try {
      const filename = `${accountId}-state.json`;
      const filepath = path.join(this.options.stateDir, filename);

      if (!fs.existsSync(filepath)) {
        logger.warn('State file not found', { accountId, filepath });
        return null;
      }

      const stateData = fs.readFileSync(filepath, 'utf8');
      const state = JSON.parse(stateData);

      this.currentState = state;
      this.accountId = accountId;

      logger.info('Loaded workflow state', { 
        accountId, 
        currentStep: state.currentStep,
        completedSteps: state.completedSteps.length,
        status: state.status,
      });

      return state;
    } catch (error) {
      logger.error('Failed to load workflow state', { 
        accountId, 
        error: error.message 
      });
      return null;
    }
  }

  /**
   * Check if a state file exists for an account
   * @param {string} accountId - Account ID
   * @returns {boolean}
   */
  hasState(accountId) {
    if (!this.options.enablePersistence) {
      return false;
    }

    const filename = `${accountId}-state.json`;
    const filepath = path.join(this.options.stateDir, filename);
    return fs.existsSync(filepath);
  }

  /**
   * Delete state file
   * @param {string} accountId - Account ID
   * @returns {boolean} Success status
   */
  deleteState(accountId) {
    if (!this.options.enablePersistence) {
      return false;
    }

    try {
      const filename = `${accountId}-state.json`;
      const filepath = path.join(this.options.stateDir, filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        logger.info('Deleted workflow state', { accountId });
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to delete workflow state', { 
        accountId, 
        error: error.message 
      });
      return false;
    }
  }

  /**
   * Get workflow duration in seconds
   * @returns {number|null}
   */
  getWorkflowDuration() {
    if (!this.currentState || !this.currentState.startTime) {
      return null;
    }

    const startTime = new Date(this.currentState.startTime);
    const endTime = new Date(this.currentState.lastUpdated);
    return Math.floor((endTime - startTime) / 1000);
  }

  /**
   * Get current state (without saving)
   * @returns {Object|null}
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Check if step was completed
   * @param {string} stepName - Step name
   * @returns {boolean}
   */
  isStepCompleted(stepName) {
    return this.currentState && this.currentState.completedSteps.includes(stepName);
  }

  /**
   * Get list of all state files
   * @returns {Array<Object>} Array of state file info
   */
  listAllStates() {
    if (!this.options.enablePersistence) {
      return [];
    }

    try {
      const files = fs.readdirSync(this.options.stateDir);
      const stateFiles = files.filter(f => f.endsWith('-state.json'));

      return stateFiles.map(filename => {
        const filepath = path.join(this.options.stateDir, filename);
        const stats = fs.statSync(filepath);
        const accountId = filename.replace('-state.json', '');

        try {
          const stateData = fs.readFileSync(filepath, 'utf8');
          const state = JSON.parse(stateData);

          return {
            accountId,
            filename,
            filepath,
            status: state.status,
            currentStep: state.currentStep,
            completedSteps: state.completedSteps.length,
            lastUpdated: state.lastUpdated,
            fileSize: stats.size,
            modifiedTime: stats.mtime,
          };
        } catch (error) {
          logger.warn('Could not parse state file', { filename, error: error.message });
          return {
            accountId,
            filename,
            filepath,
            status: 'corrupted',
            error: error.message,
          };
        }
      });
    } catch (error) {
      logger.error('Failed to list state files', { error: error.message });
      return [];
    }
  }

  /**
   * Clean up old state files
   * @param {number} maxAgeHours - Maximum age in hours
   * @returns {number} Number of deleted files
   */
  cleanupOldStates(maxAgeHours = 72) {
    if (!this.options.enablePersistence) {
      return 0;
    }

    try {
      const files = fs.readdirSync(this.options.stateDir);
      const stateFiles = files.filter(f => f.endsWith('-state.json'));
      const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
      const now = Date.now();

      let deletedCount = 0;

      for (const filename of stateFiles) {
        const filepath = path.join(this.options.stateDir, filename);
        const stats = fs.statSync(filepath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > maxAgeMs) {
          fs.unlinkSync(filepath);
          deletedCount++;
          logger.info('Deleted old state file', { filename, ageHours: (fileAge / (60 * 60 * 1000)).toFixed(1) });
        }
      }

      logger.info('Cleanup completed', { deletedCount, maxAgeHours });
      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup old states', { error: error.message });
      return 0;
    }
  }
}

export default StateManager;

