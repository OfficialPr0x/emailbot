import { createLogger } from '../utils/logger.js';
import { OpenRouterController } from './OpenRouterController.js';

const logger = createLogger('AIFormAnalyzer');

/**
 * AI Form Analyzer for intelligent page structure analysis
 * Uses AI to dynamically discover form fields and generate selectors
 */
export class AIFormAnalyzer {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
    this.aiController = new OpenRouterController(options.apiKey, options);
    this.analysisCache = new Map();
  }

  /**
   * Analyze current page and identify form fields
   * @returns {Promise<Object>} Analysis result
   */
  async analyzePage() {
    logger.info('Analyzing current page with AI');

    try {
      // Get page information
      const url = this.page.url();
      const title = await this.page.title();
      
      // Get page HTML (truncated for API limits)
      const html = await this.page.content();
      const truncatedHtml = this.truncateHtml(html, 5000);  // Reduced from 8000 to 5000 for faster processing

      // Check cache - use URL + step hash for better hits
      const cacheKey = this.generateCacheKey(url, truncatedHtml);
      if (this.analysisCache.has(cacheKey)) {
        logger.info('✓ Using cached page analysis - 0ms');
        return this.analysisCache.get(cacheKey);
      }

      // Get visible text
      const visibleText = await this.getVisibleText();

      const prompt = `Analyze this Google account signup page and identify all form fields.

URL: ${url}
Page Title: ${title}
Visible Text: ${visibleText}

HTML (truncated):
${truncatedHtml}

Provide a JSON response with:
{
  "pageType": "name_page | birthday_page | username_page | password_page | terms_page | verification_page | success_page | unknown",
  "confidence": 0.0-1.0,
  "fields": [
    {
      "fieldName": "descriptive name",
      "fieldType": "text | email | password | select | date",
      "selectors": ["selector1", "selector2", "selector3"],
      "required": true|false,
      "placeholder": "placeholder text if any"
    }
  ],
  "buttons": [
    {
      "buttonName": "Next | Submit | I Agree | etc",
      "selectors": ["selector1", "selector2"]
    }
  ],
  "nextAction": "description of what to do next"
}

Respond ONLY with valid JSON.`;

      const messages = [
        {
          role: 'system',
          content: 'You are an expert at analyzing web forms for automation. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.aiController.makeRequest(messages, { maxTokens: 2000 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in AI response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      // Cache the result
      this.analysisCache.set(cacheKey, analysis);

      logger.info('Page analysis completed', {
        pageType: analysis.pageType,
        confidence: analysis.confidence,
        fieldCount: analysis.fields?.length || 0,
      });

      return analysis;
    } catch (error) {
      logger.error('Page analysis failed', { error: error.message });
      return {
        pageType: 'unknown',
        confidence: 0,
        fields: [],
        buttons: [],
        nextAction: 'Analysis failed',
      };
    }
  }

  /**
   * Find selectors for a specific field using AI
   * @param {string} fieldName - Name of the field to find
   * @param {Object} context - Additional context
   * @returns {Promise<Array<string>>} Array of selectors
   */
  async findFieldSelectors(fieldName, context = {}) {
    logger.info('Finding selectors for field', { fieldName });

    try {
      // First, try page analysis
      const pageAnalysis = await this.analyzePage();
      
      // Look for matching field in analysis
      const matchingField = pageAnalysis.fields?.find(f => 
        f.fieldName.toLowerCase().includes(fieldName.toLowerCase()) ||
        fieldName.toLowerCase().includes(f.fieldName.toLowerCase())
      );

      if (matchingField && matchingField.selectors?.length > 0) {
        logger.info('Found field selectors from page analysis', {
          fieldName,
          selectorCount: matchingField.selectors.length,
        });
        
        // Filter out <select> selectors for Google domains (they use div-based dropdowns)
        const filteredSelectors = this.filterSelectorsForDomain(matchingField.selectors);
        return filteredSelectors;
      }

      // If not found in analysis, use dedicated selector generation
      const selectors = await this.aiController.generateAlternativeSelectors(fieldName, {
        pageUrl: this.page.url(),
        pageType: pageAnalysis.pageType,
        ...context,
      });

      logger.info('Generated alternative selectors', {
        fieldName,
        selectorCount: selectors.length,
      });

      // Filter out <select> selectors for Google domains
      const filteredSelectors = this.filterSelectorsForDomain(selectors);
      return filteredSelectors;
    } catch (error) {
      logger.error('Failed to find field selectors', { 
        fieldName, 
        error: error.message 
      });
      return [];
    }
  }

  /**
   * Filter selectors based on domain characteristics
   * Google uses div-based dropdowns, not <select> elements
   * @param {Array<string>} selectors - Array of selectors to filter
   * @returns {Array<string>} Filtered selectors
   */
  filterSelectorsForDomain(selectors) {
    const currentUrl = this.page.url();
    const isGoogle = currentUrl.includes('google.com');
    
    if (!isGoogle) {
      return selectors; // No filtering needed for non-Google domains
    }
    
    // Filter out <select> selectors for Google domains
    const filtered = selectors.filter(sel => !sel.startsWith('select['));
    
    if (filtered.length < selectors.length) {
      logger.debug('Filtered out <select> selectors for Google domain', {
        original: selectors.length,
        filtered: filtered.length,
        removed: selectors.length - filtered.length,
      });
    }
    
    return filtered.length > 0 ? filtered : selectors; // Return original if all filtered out
  }

  /**
   * Detect current step in signup flow
   * @returns {Promise<Object>} Step detection result
   */
  async detectCurrentStep() {
    logger.info('Detecting current step in signup flow');

    try {
      const url = this.page.url();
      const html = await this.page.content();
      const truncatedHtml = this.truncateHtml(html, 5000);

      // Use the flow detection method from OpenRouterController
      const result = await this.aiController.detectFormFlowChanges(truncatedHtml, 'unknown');

      logger.info('Step detection completed', {
        detectedStep: result.detectedStep,
        confidence: result.confidence,
      });

      return result;
    } catch (error) {
      logger.error('Step detection failed', { error: error.message });
      return {
        detectedStep: 'unknown',
        confidence: 0,
        suggestions: 'Could not detect step',
      };
    }
  }

  /**
   * Verify we're on the expected page
   * @param {string} expectedPage - Expected page type
   * @returns {Promise<boolean>} True if on expected page
   */
  async verifyExpectedPage(expectedPage) {
    logger.info('Verifying expected page', { expectedPage });

    try {
      const analysis = await this.analyzePage();
      
      const match = analysis.pageType === expectedPage && analysis.confidence > 0.7;

      logger.info('Page verification result', {
        expectedPage,
        detectedPage: analysis.pageType,
        confidence: analysis.confidence,
        match,
      });

      return match;
    } catch (error) {
      logger.error('Page verification failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get suggestions for filling a field
   * @param {string} fieldName - Field name
   * @param {string} currentValue - Current value in field
   * @returns {Promise<Object>} Suggestions
   */
  async getFieldFillingSuggestions(fieldName, currentValue = '') {
    logger.info('Getting filling suggestions', { fieldName });

    try {
      const html = await this.getFieldContextHtml(fieldName);

      const prompt = `Analyze this HTML context for the "${fieldName}" field and provide filling suggestions.

HTML Context:
${html}

Current Value: "${currentValue}"

Provide JSON response:
{
  "fieldIdentified": true|false,
  "bestSelector": "css selector",
  "fillStrategy": "type | fill | click-and-type | select",
  "validationNeeded": true|false,
  "suggestions": "specific advice for filling this field"
}

Respond ONLY with valid JSON.`;

      const messages = [
        {
          role: 'system',
          content: 'You are an expert at web form automation. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.aiController.makeRequest(messages, { maxTokens: 500 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        fieldIdentified: false,
        suggestions: 'Could not analyze field',
      };
    } catch (error) {
      logger.error('Failed to get filling suggestions', { error: error.message });
      return {
        fieldIdentified: false,
        suggestions: 'Analysis failed',
      };
    }
  }

  /**
   * Analyze error state and provide recovery suggestions
   * @param {string} errorMessage - Error message
   * @param {string} failedStep - Step that failed
   * @returns {Promise<Object>} Recovery suggestions
   */
  async analyzeErrorAndSuggestRecovery(errorMessage, failedStep) {
    logger.info('Analyzing error for recovery', { failedStep, errorMessage });

    try {
      const url = this.page.url();
      const html = await this.page.content();
      const truncatedHtml = this.truncateHtml(html, 5000);
      const visibleText = await this.getVisibleText();

      const prompt = `An error occurred during "${failedStep}" step. Analyze the current page and suggest recovery.

Error: ${errorMessage}
Current URL: ${url}
Visible Text: ${visibleText}

HTML (truncated):
${truncatedHtml}

Provide JSON response:
{
  "errorType": "element_not_found | validation_error | unexpected_page | captcha | rate_limited | other",
  "currentPageState": "description",
  "possibleCause": "explanation",
  "recoverySuggestions": ["suggestion1", "suggestion2"],
  "alternativeSelectors": ["selector1", "selector2"],
  "shouldRetry": true|false,
  "shouldRestart": true|false
}

Respond ONLY with valid JSON.`;

      const messages = [
        {
          role: 'system',
          content: 'You are an expert at debugging web automation failures. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.aiController.makeRequest(messages, { maxTokens: 1000 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        logger.info('Error analysis completed', {
          errorType: analysis.errorType,
          shouldRetry: analysis.shouldRetry,
        });
        return analysis;
      }

      return {
        errorType: 'other',
        shouldRetry: true,
      };
    } catch (error) {
      logger.error('Error analysis failed', { error: error.message });
      return {
        errorType: 'other',
        shouldRetry: true,
        recoverySuggestions: [],
      };
    }
  }

  /**
   * Get visible text from page
   * @returns {Promise<string>}
   */
  async getVisibleText() {
    try {
      return await this.page.evaluate(() => {
        return document.body.innerText.substring(0, 1000);
      });
    } catch (error) {
      logger.warn('Could not get visible text', { error: error.message });
      return '';
    }
  }

  /**
   * Get HTML context around a field
   * @param {string} fieldName - Field name
   * @returns {Promise<string>}
   */
  async getFieldContextHtml(fieldName) {
    try {
      // Try to find the field and get its parent context
      const html = await this.page.evaluate((name) => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        for (const input of inputs) {
          const attrs = ['name', 'id', 'placeholder', 'aria-label', 'type'];
          for (const attr of attrs) {
            const value = input.getAttribute(attr);
            if (value && value.toLowerCase().includes(name.toLowerCase())) {
              // Return parent context
              const parent = input.closest('form') || input.closest('div');
              return parent ? parent.outerHTML : input.outerHTML;
            }
          }
        }
        return '';
      }, fieldName);

      return html.substring(0, 3000);
    } catch (error) {
      logger.warn('Could not get field context HTML', { error: error.message });
      return '';
    }
  }

  /**
   * Truncate HTML intelligently
   * @param {string} html - Full HTML
   * @param {number} maxLength - Maximum length
   * @returns {string}
   */
  truncateHtml(html, maxLength) {
    if (html.length <= maxLength) {
      return html;
    }

    // Try to truncate at a reasonable point (end of tag)
    const truncated = html.substring(0, maxLength);
    const lastTagEnd = truncated.lastIndexOf('>');
    
    if (lastTagEnd > maxLength * 0.8) {
      return truncated.substring(0, lastTagEnd + 1);
    }

    return truncated + '...';
  }

  /**
   * Generate cache key for analysis
   * @param {string} url - Page URL
   * @param {string} html - Page HTML
   * @returns {string}
   */
  generateCacheKey(url, html) {
    // Simple hash function for cache key
    const str = url + html.substring(0, 1000);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  /**
   * Clear analysis cache
   */
  clearCache() {
    this.analysisCache.clear();
    logger.info('Analysis cache cleared');
  }
}

export default AIFormAnalyzer;

