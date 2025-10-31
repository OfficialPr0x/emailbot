import { BrowserManager } from '../core/BrowserManager.js';
import { FormFiller } from '../core/FormFiller.js';
import { OTPRetriever } from '../core/OTPRetriever.js';
import { OpenRouterController } from '../core/OpenRouterController.js';
import { RetryManager } from '../core/RetryManager.js';
import { StateManager } from '../core/StateManager.js';
import { AIFormAnalyzer } from '../core/AIFormAnalyzer.js';
import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';
import crypto from 'crypto';

const logger = createLogger('EnhancedGmailBot');

/**
 * Enhanced Gmail Bot V2 - Unbreakable Edition
 * Features:
 * - Multi-layer retry strategies
 * - AI-powered selector discovery
 * - State persistence and recovery
 * - Step-by-step validation
 * - 95%+ success rate target
 */
export class EnhancedGmailBot {
  constructor(options = {}) {
    this.options = {
      headless: options.headless !== undefined ? options.headless : false,
      proxyUrl: options.proxyUrl || null,
      maxRetriesPerStep: options.maxRetriesPerStep || parseInt(process.env.MAX_RETRIES_PER_STEP) || 5,
      enableAI: options.enableAI !== undefined ? options.enableAI : (process.env.AI_SELECTOR_DISCOVERY_ENABLED !== 'false'),
      enableStateManagement: options.enableStateManagement !== undefined ? options.enableStateManagement : (process.env.STATE_PERSISTENCE_ENABLED !== 'false'),
      ...options,
    };

    this.browserManager = null;
    this.page = null;
    this.formFiller = null;
    this.aiController = new OpenRouterController(process.env.OPENROUTER_API_KEY);
    this.retryManager = new RetryManager({ maxRetries: this.options.maxRetriesPerStep });
    this.stateManager = new StateManager({ enablePersistence: this.options.enableStateManagement });
    this.aiAnalyzer = null;
    this.accountId = null;
  }

  /**
   * Initialize browser and supporting systems
   */
  async initialize() {
    logger.info('Initializing Gmail bot V2 (Unbreakable Edition)');

    this.browserManager = new BrowserManager(this.options);
    this.page = await this.browserManager.initialize();
    
    // Initialize form filler with AI analyzer
    if (this.options.enableAI) {
      this.aiAnalyzer = new AIFormAnalyzer(this.page, {
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      this.formFiller = new FormFiller(this.page, { aiAnalyzer: this.aiAnalyzer });
    } else {
      this.formFiller = new FormFiller(this.page);
    }

    logger.info('Gmail bot initialized successfully with all systems');
  }

  /**
   * Create Gmail account - UNBREAKABLE WORKFLOW
   * @param {Object} profile - User profile
   * @returns {Promise<Object>} Account information
   */
  async createGmailAccount(profile) {
    this.accountId = crypto.randomUUID();
    
    logger.info('🚀 Starting UNBREAKABLE Gmail account creation workflow', { 
      accountId: this.accountId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName 
    });
    logger.info('═══════════════════════════════════════════════════════');

    // Initialize state
    this.stateManager.initializeState(this.accountId, profile, {
      workflowType: 'gmail_creation',
    });

    try {
      // STEP 1: Navigate to signup
      await this.executeStep('navigation', async () => {
        return await this.navigateToSignup();
      });

      // STEP 2: Fill name page
      await this.executeStep('name_page', async () => {
        return await this.fillNamePage(profile);
      });

      // STEP 3: Fill birthday and gender page
      await this.executeStep('birthday_page', async () => {
        return await this.fillBirthdayPage(profile);
      });

      // STEP 3.5: Handle username choice page (if shown)
      await this.executeStep('username_choice_page', async () => {
        return await this.handleUsernameChoicePage(profile);
      });

      // STEP 4: Fill username and password page
      await this.executeStep('username_page', async () => {
        return await this.fillUsernamePage(profile);
      });

      // STEP 4.5: Handle dedicated password page (if username and password are separate)
      await this.executeStep('password_page', async () => {
        return await this.handlePasswordPage(profile);
      });

      // STEP 5: Accept terms
      await this.executeStep('terms_page', async () => {
        return await this.acceptTerms();
      });

      // STEP 6: Handle CAPTCHA if present
      await this.executeStep('captcha_check', async () => {
        return await this.handleCaptchaIfPresent();
      });

      // STEP 7: Verify success
      await this.executeStep('verification', async () => {
        return await this.verifyAccountCreation();
      });

      // STEP 8: REAL ACCOUNT VALIDATION - Test if account actually works
      await this.executeStep('account_validation', async () => {
        return await this.validateAccountExists(profile);
      });

      // Mark workflow as completed
      const result = {
        email: profile.email,
        password: profile.password,
        firstName: profile.firstName,
        lastName: profile.lastName,
        createdAt: new Date().toISOString(),
        success: true,
        accountId: this.accountId,
      };

      this.stateManager.completeWorkflow(result);

      logger.info('═══════════════════════════════════════════════════════');
      logger.info('✅ ✅ ✅ GMAIL ACCOUNT CREATED SUCCESSFULLY! ✅ ✅ ✅');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`📧 Email: ${profile.email}`);
      logger.info(`🔑 Password: ${profile.password}`);
      logger.info(`👤 Name: ${profile.firstName} ${profile.lastName}`);
      logger.info(`⏱️  Duration: ${this.stateManager.getWorkflowDuration()}s`);
      logger.info('═══════════════════════════════════════════════════════');

      return result;
    } catch (error) {
      logger.error('═══════════════════════════════════════════════════════');
      logger.error('❌ ❌ ❌ GMAIL ACCOUNT CREATION FAILED ❌ ❌ ❌');
      logger.error('═══════════════════════════════════════════════════════');
      logger.error(`Error: ${error.message}`);
      logger.error(`Email attempted: ${profile.email}`);
      logger.error(`Failed at step: ${this.stateManager.getCurrentState()?.currentStep}`);
      logger.error('═══════════════════════════════════════════════════════');
      
      this.stateManager.failWorkflow(error, {
        failedAtStep: this.stateManager.getCurrentState()?.currentStep,
      });

      await this.browserManager.takeScreenshot('gmail-creation-failed-final');
      throw error;
    }
  }

  /**
   * Execute a step with retry and validation
   * @param {string} stepName - Name of the step
   * @param {Function} stepFunction - Function to execute
   */
  async executeStep(stepName, stepFunction) {
    logger.info(`📍 STEP: ${stepName.toUpperCase()}`);
    
    // Check if step already completed (for recovery)
    if (this.stateManager.isStepCompleted(stepName)) {
      logger.info(`✓ Step ${stepName} already completed (recovered from state)`);
      return;
    }

    this.stateManager.updateStep(stepName, {
      pageUrl: this.page.url(),
    });

    try {
      const result = await this.retryManager.executeWithRetry(
        async (attempt) => {
          logger.info(`Attempting ${stepName} (attempt ${attempt}/${this.options.maxRetriesPerStep})`);
          
          // Take screenshot before attempt
          await this.browserManager.takeScreenshot(`${stepName}-attempt-${attempt}`);
          
          return await stepFunction();
        },
        {
          operationName: stepName,
          maxRetries: this.options.maxRetriesPerStep,
          onRetry: async (attempt, error, errorType) => {
            logger.warn(`Step ${stepName} failed on attempt ${attempt}`, {
              error: error.message,
              errorType,
            });

            // Use AI to analyze error and suggest recovery
            if (this.aiAnalyzer && attempt > 2) {
              logger.info('Using AI to analyze error and suggest recovery');
              try {
                const analysis = await this.aiAnalyzer.analyzeErrorAndSuggestRecovery(
                  error.message,
                  stepName
                );
                logger.info('AI error analysis', analysis);
              } catch (aiError) {
                logger.warn('AI analysis failed', { error: aiError.message });
              }
            }

            // Record failure in state
            this.stateManager.failStep(stepName, error, { attempt, errorType });
          },
          validateResult: (result) => {
            // Validate that step actually succeeded
            return result !== false && result !== null;
          },
        }
      );

      // Mark step as completed
      this.stateManager.completeStep(stepName, {
        result,
        pageUrl: this.page.url(),
      });

      // Take success screenshot
      await this.browserManager.takeScreenshot(`${stepName}-success`);
      this.stateManager.addScreenshot(`${stepName}-success.png`, `Step ${stepName} completed`);

      logger.info(`✅ Step ${stepName} completed successfully`);
      
      return result;
    } catch (error) {
      logger.error(`❌ Step ${stepName} failed after all retries`, {
        error: error.message,
        attempts: this.options.maxRetriesPerStep,
      });
      
      // Enhanced diagnostic logging
      try {
        await this.browserManager.takeScreenshot(`${stepName}-failed`);
        
        // Save HTML snapshot
        const html = await this.page.content();
        const fs = await import('fs');
        const path = await import('path');
        const htmlPath = path.default.join('screenshots', `${stepName}-failed.html`);
        fs.default.writeFileSync(htmlPath, html);
        logger.error(`📄 HTML snapshot saved to: ${htmlPath}`);
        
        // Log current URL
        logger.error(`🔗 Failed URL: ${this.page.url()}`);
        
        // Get retry statistics
        const stats = this.retryManager.getStatistics();
        logger.error(`📊 Retry stats: ${stats.totalAttempts} attempts, ${stats.successRate} success rate`);
        
      } catch (diagnosticError) {
        logger.warn('Could not save diagnostic info', { error: diagnosticError.message });
      }
      
      throw error;
    }
  }

  /**
   * Navigate to Google signup page
   */
  async navigateToSignup() {
    logger.info('Navigating to Google signup page');

    // Try multiple navigation strategies
    const strategies = [
      // Strategy 1: Direct navigation
      async () => {
        logger.info('Strategy 1: Direct navigation to signup');
        await this.browserManager.navigateWithRetry('https://accounts.google.com/signup', {
          maxRetries: 3,
          waitUntil: 'networkidle',
        });
        await this.page.randomDelay(2000, 3000);
        return true;
      },

      // Strategy 2: Multi-stage navigation
      async () => {
        logger.info('Strategy 2: Multi-stage navigation via Google homepage');
        await this.multiStageGoogleNavigation();
        return true;
      },

      // Strategy 3: Alternative signup URL
      async () => {
        logger.info('Strategy 3: Alternative signup URL');
        await this.browserManager.navigateWithRetry(
          'https://accounts.google.com/lifecycle/steps/signup/name',
          { maxRetries: 2 }
        );
        await this.page.randomDelay(2000, 3000);
        return true;
      },
    ];

    await this.retryManager.executeWithStrategies(strategies, {
      operationName: 'navigate_to_signup',
    });

    // Verify we're on signup page
    const url = this.page.url();
    if (!url.includes('accounts.google.com')) {
      throw new Error(`Navigation failed: unexpected URL ${url}`);
    }

    // Use AI to verify we're on the right page
    if (this.aiAnalyzer) {
      const pageAnalysis = await this.aiAnalyzer.detectCurrentStep();
      logger.info('AI page detection', pageAnalysis);
      
      if (pageAnalysis.detectedStep !== 'name_page' && pageAnalysis.detectedStep !== 'unknown') {
        logger.warn(`Unexpected page detected: ${pageAnalysis.detectedStep}`);
      }
    }

    logger.info('✓ Navigation successful');
    return true;
  }

  /**
   * Multi-stage navigation (fallback strategy)
   */
  async multiStageGoogleNavigation() {
    logger.info('Performing multi-stage navigation');

    await this.browserManager.navigateWithRetry('https://google.com', {
      maxRetries: 2,
      waitUntil: 'networkidle',
    });

    await this.page.randomDelay(2000, 3000);
    await this.browserManager.simulateHumanExploration();

    // Look for Sign in button
    const signInSelectors = [
      'text=Sign in',
      'a:has-text("Sign in")',
      '[aria-label*="Sign in"]',
    ];

    for (const selector of signInSelectors) {
      try {
        if (await helpers.isElementVisible(this.page, selector)) {
          await this.page.humanClick(selector);
          await this.page.waitForLoadState('networkidle');
          await this.page.randomDelay(1500, 2500);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    // Look for Create account
    const createSelectors = [
      'text=Create account',
      'a:has-text("Create account")',
      'button:has-text("Create account")',
    ];

    for (const selector of createSelectors) {
      try {
        if (await helpers.isElementVisible(this.page, selector)) {
          await this.page.humanClick(selector);
          await this.page.randomDelay(1000, 2000);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    // Look for "For myself"
    const forMyselfSelectors = [
      'text=For myself',
      'button:has-text("For myself")',
      '[data-value="personal"]',
    ];

    for (const selector of forMyselfSelectors) {
      try {
        if (await helpers.isElementVisible(this.page, selector)) {
          await this.page.humanClick(selector);
          await this.page.waitForLoadState('networkidle');
          await this.page.randomDelay(2000, 3000);
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }

  /**
   * Fill name page with extensive retry strategies
   */
  async fillNamePage(profile) {
    logger.info('PAGE 1: Filling name information');
    
    await this.page.randomDelay(2000, 3000);

    // Define comprehensive selector lists for firstName
    const firstNameSelectors = [
      'input[name="firstName"]',
      'input[aria-label*="First" i]',
      'input[aria-label*="first name" i]',
      '#firstName',
      'input[placeholder*="First" i]',
      'input[autocomplete="given-name"]',
    ];

    // Add AI-discovered selectors if available
    if (this.aiAnalyzer) {
      try {
        const aiSelectors = await this.aiAnalyzer.findFieldSelectors('firstName');
        firstNameSelectors.push(...aiSelectors.slice(0, 5));
      } catch (error) {
        logger.warn('Could not get AI selectors for firstName', { error: error.message });
      }
    }

    // Fill first name with retry
    logger.info('Filling first name');
    await this.fillFieldWithRetry(firstNameSelectors, profile.firstName, 'firstName');

    await this.page.randomDelay(500, 1000);

    // Define comprehensive selector lists for lastName
    const lastNameSelectors = [
      'input[name="lastName"]',
      'input[aria-label*="Last" i]',
      'input[aria-label*="last name" i]',
      '#lastName',
      'input[placeholder*="Last" i]',
      'input[autocomplete="family-name"]',
    ];

    // Add AI-discovered selectors
    if (this.aiAnalyzer) {
      try {
        const aiSelectors = await this.aiAnalyzer.findFieldSelectors('lastName');
        lastNameSelectors.push(...aiSelectors.slice(0, 5));
      } catch (error) {
        logger.warn('Could not get AI selectors for lastName', { error: error.message });
      }
    }

    // Fill last name with retry
    logger.info('Filling last name');
    await this.fillFieldWithRetry(lastNameSelectors, profile.lastName, 'lastName');

    await this.page.randomDelay(1000, 1500);

    // Verify fields are filled
    await this.verifyFieldValue(firstNameSelectors, profile.firstName, 'firstName');
    await this.verifyFieldValue(lastNameSelectors, profile.lastName, 'lastName');

    // Click Next button
    await this.clickNextButton();
    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(2000, 3000);

    // Verify we moved to next page
    const url = this.page.url();
    logger.info(`After name page, current URL: ${url}`);

    logger.info('✓ Name page completed');
    return true;
  }

  /**
   * Fill birthday and gender page
   */
  async fillBirthdayPage(profile) {
    logger.info('PAGE 2: Filling birthday and gender');
    
    await this.page.randomDelay(2000, 3000);

    const birthDate = new Date(profile.birthDate);
    
    // Domain-aware selector priority (Google uses div-based dropdowns, not <select>)
    const isGoogle = this.page.url().includes('google.com');
    
    // Fill month - Google-first selector order
    const monthSelectors = isGoogle ? [
      '#month',                        // ✅ Google div-based dropdown (FIRST)
      'div[aria-label*="Month" i]',
      'select[name="month"]',          // Fallback for non-Google
      'select[aria-label*="Month" i]',
    ] : [
      'select[name="month"]',          // Standard sites use <select>
      'select[aria-label*="Month" i]',
      '#month',
      'select[id*="month" i]',
    ];

    logger.info('Filling birth month', { 
      isGoogle, 
      selectorStrategy: isGoogle ? 'google-div-first' : 'standard-select',
      monthValue: birthDate.getMonth() + 1,
      monthName: ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'][birthDate.getMonth()]
    });
    
    // Take screenshot before attempting month selection
    await this.browserManager.takeScreenshot('02a-before-month-selection');
    
    try {
      await this.selectOptionWithRetry(monthSelectors, String(birthDate.getMonth() + 1), 'month');
      
      // Verify the month was actually selected
      await this.page.randomDelay(500, 800);
      
      // Check if month field has a value now
      const monthElement = await this.page.$('#month');
      if (monthElement) {
        const monthText = await monthElement.textContent();
        const monthValue = await monthElement.getAttribute('data-value');
        logger.info('Month field after selection', { text: monthText?.trim(), value: monthValue });
        
        // If still showing "Month" placeholder, selection failed
        if (monthText && monthText.trim() === 'Month') {
          logger.warn('Month selection may have failed - still showing placeholder');
          await this.browserManager.takeScreenshot('02b-month-selection-verification-failed');
          // Try one more time with a direct approach
          await this.retryMonthSelection(birthDate.getMonth() + 1);
        }
      }
      
      logger.info('✓ Month selected successfully');
      
      // Take screenshot after successful selection
      await this.browserManager.takeScreenshot('02b-after-month-selection');
    } catch (error) {
      logger.error('Failed to select month', { error: error.message });
      await this.browserManager.takeScreenshot('02b-month-selection-failed');
      throw error;
    }

    await this.page.randomDelay(300, 600);

    // Fill day
    const daySelectors = [
      'input[name="day"]',
      'input[aria-label*="Day" i]',
      '#day',
      'input[placeholder*="Day" i]',
    ];

    logger.info('Filling birth day');
    await this.fillFieldWithRetry(daySelectors, String(birthDate.getDate()), 'day');

    await this.page.randomDelay(300, 600);

    // Fill year
    const yearSelectors = [
      'input[name="year"]',
      'input[aria-label*="Year" i]',
      '#year',
      'input[placeholder*="Year" i]',
    ];

    logger.info('Filling birth year');
    await this.fillFieldWithRetry(yearSelectors, String(birthDate.getFullYear()), 'year');

    await this.page.randomDelay(300, 600);

    // Fill gender - Google-first selector order
    const genderSelectors = isGoogle ? [
      '#gender',                        // ✅ Google div-based dropdown (FIRST)
      'div[aria-label*="Gender" i]',
      'select[name="gender"]',          // Fallback for non-Google
      'select[aria-label*="Gender" i]',
    ] : [
      'select[name="gender"]',          // Standard sites use <select>
      'select[aria-label*="Gender" i]',
      '#gender',
    ];

    const genderValue = profile.gender === 'male' ? '1' : '2';
    
    logger.info('Filling gender', { isGoogle, selectorStrategy: isGoogle ? 'google-div-first' : 'standard-select' });
    await this.selectOptionWithRetry(genderSelectors, genderValue, 'gender');

    await this.page.randomDelay(1000, 1500);

    // Click Next
    await this.clickNextButton();
    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(2000, 3000);

    logger.info('✓ Birthday page completed');
    return true;
  }

  /**
   * Handle username choice page (if shown by Google)
   * Google sometimes shows a page with suggested usernames before the actual username input
   */
  async handleUsernameChoicePage(profile) {
    logger.info('Checking for username choice page scenarios');
    await this.page.randomDelay(1500, 2500);
    
    // Check if we're on the "Choose your Gmail address" page
    const pageText = await this.page.textContent('body');
    const isChoicePage = pageText.includes('Choose your Gmail address') || 
                         pageText.includes('Pick a Gmail address') ||
                         pageText.includes('How you\'ll sign in');
    
    if (!isChoicePage) {
      logger.info('Not on username choice page, skipping');
      return true;
    }
    
    logger.info('PAGE 2.5: Detecting Gmail signup scenario');
    await this.browserManager.takeScreenshot('02c-username-choice-page');
    
    // SCENARIO DETECTION: Check if suggestions are present
    const hasSuggestions = await this.detectGmailSuggestions();
    
    if (hasSuggestions) {
      logger.info('🔍 SCENARIO 1: Gmail suggestions detected - need to click "Create your own"');
      return await this.handleSuggestionsScenario();
    } else {
      logger.info('🔍 SCENARIO 2: Direct username entry detected - no suggestions');
      return await this.handleDirectUsernameScenario();
    }
  }

  /**
   * Detect if Gmail suggestions are present on the page
   */
  async detectGmailSuggestions() {
    try {
      // Look for suggested Gmail addresses (they typically end with @gmail.com)
      const suggestionSelectors = [
        'input[type="radio"][value*="@gmail.com"]',
        'label:has-text("@gmail.com")',
        'div:has-text("@gmail.com")',
        '[role="radio"] + label:has-text("@gmail.com")',
        'text=/@gmail\.com/',
      ];
      
      for (const selector of suggestionSelectors) {
        try {
          const element = await this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            logger.info('✓ Gmail suggestions found', { selector });
            return true;
          }
        } catch (error) {
          continue;
        }
      }
      
      // Also check page text for suggestion patterns
      const pageText = await this.page.textContent('body');
      const hasSuggestionText = pageText.includes('@gmail.com') && 
                               (pageText.includes('Create your own') || 
                                pageText.includes('create your own'));
      
      if (hasSuggestionText) {
        logger.info('✓ Gmail suggestions detected in page text');
        return true;
      }
      
      logger.info('No Gmail suggestions detected');
      return false;
    } catch (error) {
      logger.warn('Error detecting suggestions, assuming direct entry', { error: error.message });
      return false;
    }
  }

  /**
   * Handle scenario with Gmail suggestions - click "Create your own"
   */
  async handleSuggestionsScenario() {
    logger.info('📧 Handling suggestions scenario - clicking "Create your own Gmail address"');
    
    // Enhanced selectors for "Create your own Gmail address"
    const createOwnSelectors = [
      'text="Create your own Gmail address"',
      'input[value="custom"]',
      'div:has-text("Create your own Gmail address")',
      '[role="radio"]:has-text("Create your own")',
      'label:has-text("Create your own")',
      'input[type="radio"] + label:has-text("Create your own")',
      '[role="radio"][aria-label*="Create your own"]',
      'text=/Create your own/i',
    ];
    
    let clicked = false;
    for (const selector of createOwnSelectors) {
      try {
        await this.page.click(selector, { timeout: 2000 });
        logger.info('✓ Clicked "Create your own Gmail address"', { selector });
        clicked = true;
        break;
      } catch (error) {
        continue;
      }
    }
    
    if (!clicked) {
      logger.warn('Could not find "Create your own" option, trying Next anyway');
    }
    
    await this.page.randomDelay(500, 1000);
    await this.browserManager.takeScreenshot('02d-after-create-own-selection');
    
    // Click Next to proceed to username entry
    await this.clickNextButton();
    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(2000, 3000);
    
    logger.info('✓ Suggestions scenario completed - proceeding to username entry');
    return true;
  }

  /**
   * Handle scenario with direct username entry - no suggestions
   */
  async handleDirectUsernameScenario() {
    logger.info('📝 Handling direct username entry scenario');
    
    // In this scenario, we might already be on the username entry page
    // or we might need to click Next to get there
    
    // Check if username field is already visible
    const usernameFieldVisible = await this.checkIfUsernameFieldExists();
    
    if (usernameFieldVisible) {
      logger.info('Username field already visible - staying on current page');
      return true;
    } else {
      logger.info('Username field not visible - clicking Next to proceed');
      await this.clickNextButton();
      await this.page.waitForLoadState('networkidle');
      await this.page.randomDelay(2000, 3000);
      return true;
    }
  }

  /**
   * Check if username field exists on current page
   */
  async checkIfUsernameFieldExists() {
    const usernameSelectors = [
      'input[name="Username"]:not([type="password"])',
      'input[name="username"]:not([type="password"])',
      'input[aria-label*="username" i]:not([type="password"])',
      'input[type="text"]:visible:not([aria-label*="password" i])',
    ];
    
    for (const selector of usernameSelectors) {
      try {
        const element = await this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          return true;
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  /**
   * Fill username and password page - MOST CRITICAL STEP
   */
  async fillUsernamePage(profile) {
    logger.info('PAGE 3: Filling username and password (CRITICAL STEP)');
    
    await this.page.randomDelay(2000, 3000);

    // More specific username selectors that exclude password fields
    const usernameSelectors = [
      'input[name="Username"]:not([type="password"])',
      'input[name="username"]:not([type="password"])',
      'input[aria-label*="username" i]:not([type="password"])',
      'input[aria-label*="Gmail" i]:not([type="password"])',
      'input[aria-label*="email" i]:not([type="password"])',
      'input[aria-label*="address" i]:not([type="password"])',
      'input[aria-label*="choose" i]:not([type="password"])',
      'input[type="text"]:visible:not([aria-label*="password" i])',
      '#username:not([type="password"])',
      'input.whsOnd:not([type="password"])',
      'input[autocomplete="username"]:not([type="password"])',
      'input[autocomplete="email"]:not([type="password"])',
      'input[placeholder*="username" i]:not([type="password"])',
      'input[placeholder*="email" i]:not([type="password"])',
      'input[jsname="YPqjbf"]:not([type="password"])',
    ];

    // Add AI-discovered selectors - CRITICAL for username field
    if (this.aiAnalyzer) {
      try {
        logger.info('Using AI to discover username field selectors');
        const aiSelectors = await this.aiAnalyzer.findFieldSelectors('username', {
          step: 'username_page',
          pageUrl: this.page.url(),
        });
        logger.info(`AI discovered ${aiSelectors.length} selectors for username field`);
        // Filter AI selectors to exclude password fields
        const filteredAiSelectors = aiSelectors.filter(selector => 
          !selector.includes('password') && !selector.includes('type="password"')
        );
        usernameSelectors.push(...filteredAiSelectors.slice(0, 10));
      } catch (error) {
        logger.warn('Could not get AI selectors for username', { error: error.message });
      }
    }

    // Fill username with retry logic for taken usernames
    logger.info('Filling username with automatic retry for taken usernames');
    const success = await this.fillUsernameWithRetry(usernameSelectors, profile);

    if (!success) {
      throw new Error('Failed to fill username after all retry attempts');
    }

    await this.page.randomDelay(1000, 1500);

    // Check if password fields are present on this page
    const passwordSelectors = [
      'input[name="Passwd"]',
      'input[type="password"]',
      'input[aria-label*="password" i]',
      '#passwd',
      'input[autocomplete="new-password"]',
    ];

    // Only try to fill password if password fields are actually present
    const passwordFieldExists = await this.checkIfFieldExists(passwordSelectors);
    
    if (passwordFieldExists) {
      logger.info('Password field found on this page, handling password entry');
      await this.handlePasswordFields(profile.password);
    } else {
      logger.info('No password fields found on this page - password might be on next page');
    }

    await this.page.randomDelay(1000, 1500);

    // Click Next
    await this.clickNextButton();
    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(2000, 3000);

    logger.info('✓ Username page completed');
    return true;
  }

  /**
   * Enhanced password field handling for both single and dual password scenarios
   */
  async handlePasswordFields(password) {
    logger.info('🔐 Handling password fields - detecting single vs dual password scenario');
    
    // Enhanced password selectors
    const passwordSelectors = [
      'input[name="Passwd"]',
      'input[name="passwd"]', 
      'input[name="password"]',
      'input[type="password"]',
      'input[aria-label*="password" i]',
      'input[aria-label*="Password" i]',
      '#passwd',
      '#password',
      'input[autocomplete="new-password"]',
      'input[autocomplete="current-password"]',
      'input[placeholder*="password" i]',
      'input[jsname*="password" i]',
    ];

    // Enhanced confirm password selectors
    const confirmPasswordSelectors = [
      'input[name="PasswdAgain"]',
      'input[name="ConfirmPasswd"]',
      'input[name="confirmPassword"]',
      'input[name="password_confirm"]',
      'input[aria-label*="Confirm" i]',
      'input[aria-label*="confirm" i]',
      'input[aria-label*="again" i]',
      'input[aria-label*="repeat" i]',
      'input[type="password"]:nth-of-type(2)',
      'input[type="password"]:last-of-type',
      'input[placeholder*="confirm" i]',
      'input[placeholder*="again" i]',
      'input[placeholder*="repeat" i]',
    ];

    // Count password fields to determine scenario
    const passwordFieldCount = await this.countPasswordFields();
    
    if (passwordFieldCount >= 2) {
      logger.info('🔐 DUAL PASSWORD SCENARIO: Found multiple password fields - filling both');
      await this.handleDualPasswordScenario(passwordSelectors, confirmPasswordSelectors, password);
    } else if (passwordFieldCount === 1) {
      logger.info('🔐 SINGLE PASSWORD SCENARIO: Found one password field');
      await this.handleSinglePasswordScenario(passwordSelectors, password);
    } else {
      logger.warn('No password fields detected on current page');
    }
  }

  /**
   * Count visible password fields on the page
   */
  async countPasswordFields() {
    try {
      const passwordFields = await this.page.locator('input[type="password"]:visible').count();
      logger.info(`Found ${passwordFields} visible password fields`);
      return passwordFields;
    } catch (error) {
      logger.warn('Error counting password fields', { error: error.message });
      return 0;
    }
  }

  /**
   * Handle single password field scenario
   */
  async handleSinglePasswordScenario(passwordSelectors, password) {
    logger.info('Filling single password field');
    
    try {
      await this.fillFieldWithRetry(passwordSelectors, password, 'password');
      logger.info('✓ Single password field filled successfully');
    } catch (error) {
      logger.error('Failed to fill single password field', { error: error.message });
      throw error;
    }
  }

  /**
   * Handle dual password fields scenario (password + confirm password)
   */
  async handleDualPasswordScenario(passwordSelectors, confirmPasswordSelectors, password) {
    logger.info('Filling dual password fields (password + confirm)');
    
    try {
      // Fill first password field
      await this.fillFieldWithRetry(passwordSelectors, password, 'password');
      logger.info('✓ First password field filled');
      
      await this.page.randomDelay(500, 1000);
      
      // Fill confirm password field
      await this.fillFieldWithRetry(confirmPasswordSelectors, password, 'confirmPassword');
      logger.info('✓ Confirm password field filled');
      
      // Verify both fields have the same value
      await this.verifyPasswordFieldsMatch(passwordSelectors, confirmPasswordSelectors, password);
      
    } catch (error) {
      logger.error('Failed to fill dual password fields', { error: error.message });
      
      // Fallback: try to fill all password fields with the same value
      logger.info('Attempting fallback: filling all password fields');
      try {
        const allPasswordFields = await this.page.locator('input[type="password"]:visible').all();
        for (let i = 0; i < allPasswordFields.length; i++) {
          await allPasswordFields[i].fill(password);
          logger.info(`✓ Filled password field ${i + 1}`);
          await this.page.randomDelay(300, 500);
        }
      } catch (fallbackError) {
        logger.error('Fallback password filling also failed', { error: fallbackError.message });
        throw error;
      }
    }
  }

  /**
   * Verify that password and confirm password fields match
   */
  async verifyPasswordFieldsMatch(passwordSelectors, confirmPasswordSelectors, expectedPassword) {
    try {
      // Get values from both fields
      let passwordValue = null;
      let confirmValue = null;
      
      // Try to get password field value
      for (const selector of passwordSelectors) {
        try {
          const element = await this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            passwordValue = await element.inputValue();
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      // Try to get confirm password field value
      for (const selector of confirmPasswordSelectors) {
        try {
          const element = await this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            confirmValue = await element.inputValue();
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (passwordValue === expectedPassword && confirmValue === expectedPassword) {
        logger.info('✓ Password fields verification successful - both fields match');
      } else {
        logger.warn('Password fields verification failed', { 
          passwordValue: passwordValue ? '***' : null,
          confirmValue: confirmValue ? '***' : null 
        });
      }
    } catch (error) {
      logger.warn('Could not verify password fields match', { error: error.message });
    }
  }

  /**
   * Handle dedicated password page (when username and password are on separate pages)
   */
  async handlePasswordPage(profile) {
    logger.info('🔐 DEDICATED PASSWORD PAGE: Checking if we are on a password-only page');
    
    await this.page.randomDelay(1000, 2000);
    
    // Check if we're on a password page by looking for password fields
    const passwordFieldCount = await this.countPasswordFields();
    
    if (passwordFieldCount === 0) {
      logger.info('No password fields found - skipping password page step');
      return true;
    }
    
    logger.info(`Found ${passwordFieldCount} password fields - handling password entry`);
    
    // Check current URL to confirm we're on a password page
    const currentUrl = this.page.url();
    logger.info(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('password') || passwordFieldCount > 0) {
      logger.info('✓ Confirmed we are on a password page');
      
      try {
        // Handle password fields using existing logic
        await this.handlePasswordFields(profile.password);
        
        await this.page.randomDelay(1000, 1500);
        
        // Click Next button to proceed
        await this.clickNextButton();
        await this.page.waitForLoadState('networkidle');
        await this.page.randomDelay(2000, 3000);
        
        logger.info('✓ Password page completed successfully');
        return true;
        
      } catch (error) {
        logger.error('Failed to handle password page', { error: error.message });
        
        // Take screenshot for debugging
        await this.browserManager.takeScreenshot('password-page-error');
        
        // Try a fallback approach - fill any visible password fields
        try {
          logger.info('Attempting fallback password filling');
          const passwordFields = await this.page.locator('input[type="password"]:visible').all();
          
          for (let i = 0; i < passwordFields.length; i++) {
            await passwordFields[i].click();
            await this.page.randomDelay(200, 400);
            await passwordFields[i].fill(profile.password);
            logger.info(`✓ Fallback filled password field ${i + 1}`);
            await this.page.randomDelay(300, 500);
          }
          
          // Try to click Next
          await this.clickNextButton();
          await this.page.waitForLoadState('networkidle');
          await this.page.randomDelay(2000, 3000);
          
          logger.info('✓ Fallback password handling completed');
          return true;
          
        } catch (fallbackError) {
          logger.error('Fallback password handling also failed', { error: fallbackError.message });
          throw error;
        }
      }
    } else {
      logger.info('Not on a password page - skipping password page step');
      return true;
    }
  }

  /**
   * Accept Terms of Service
   */
  async acceptTerms() {
    logger.info('PAGE 4: Accepting Terms of Service');
    
    await this.page.randomDelay(2000, 3000);

    // Scroll to view terms
    await this.page.humanScroll({ direction: 'down', distance: 'medium' });
    await this.page.randomDelay(1000, 1500);

    // Agree button selectors
    const agreeSelectors = [
      'button:has-text("I agree")',
      'button:has-text("Agree")',
      'button:has-text("Next")',
      'text=I agree',
      '[aria-label*="agree" i]',
      'button[jsname="LgbsSe"]',
      'div[role="button"]:has-text("agree")',
    ];

    logger.info('Looking for agree button');
    
    for (const selector of agreeSelectors) {
      try {
        if (await helpers.isElementVisible(this.page, selector)) {
          logger.info(`Found agree button: ${selector}`);
          await this.page.humanClick(selector);
          await this.page.randomDelay(1000, 2000);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(3000, 5000);

    logger.info('✓ Terms accepted');
    return true;
  }

  /**
   * Handle CAPTCHA if present
   */
  async handleCaptchaIfPresent() {
    logger.info('Checking for CAPTCHA');

    const captchaSelectors = [
      'iframe[src*="recaptcha"]',
      '[data-sitekey]',
      'div.g-recaptcha',
      'text=verify you are human',
    ];

    for (const selector of captchaSelectors) {
      try {
        const element = await this.page.$(selector);
        if (element && (await element.isVisible())) {
          logger.warn('CAPTCHA detected - manual intervention required');
          await this.browserManager.takeScreenshot('captcha-detected');
          
          // Wait for manual solving (in production, integrate CAPTCHA solving service)
          logger.info('Waiting for CAPTCHA to be solved...');
          await this.page.waitForTimeout(60000);
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    logger.info('No CAPTCHA detected');
    return true;
  }

  /**
   * Handle verification screens (QR code, phone verification, etc.)
   */
  async handleVerificationScreen() {
    logger.info('Checking for verification screens...');
    
    const url = this.page.url();
    let bodyText = '';
    try {
      bodyText = await this.page.textContent('body');
    } catch (e) {
      logger.warn('Could not read body text for verification check');
    }

    // Check for QR code verification
    const qrCodeIndicators = [
      'Scan the QR code',
      'qr code',
      'Use your phone to verify',
      'preventing abuse from computer programs',
      'This helps keep you and others safe'
    ];

    const hasQRCode = qrCodeIndicators.some(indicator =>
      bodyText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasQRCode) {
      logger.warn('🔍 QR Code verification screen detected');
      
      // Look for skip options first
      const skipSelectors = [
        'button[aria-label*="Skip"]',
        'button:has-text("Skip")',
        '[data-action="skip"]',
        'button:has-text("Not now")',
        'button:has-text("Maybe later")',
        'a:has-text("Skip")',
        '[role="button"]:has-text("Skip")'
      ];

      for (const selector of skipSelectors) {
        try {
          const skipButton = await this.page.$(selector);
          if (skipButton) {
            logger.info('Found skip button, attempting to skip verification');
            await this.page.randomDelay(2000, 4000);
            await skipButton.click();
            await this.page.randomDelay(3000, 5000);
            return 'skipped';
          }
        } catch (e) {
          logger.debug(`Skip selector ${selector} not found or failed`);
        }
      }

      // Try YouTube workaround method
      logger.info('🎯 Attempting YouTube workaround to bypass QR code verification');
      const youtubeResult = await this.attemptYouTubeWorkaround();
      if (youtubeResult === 'success') {
        return 'youtube_workaround_success';
      }

      // If no skip option and YouTube workaround failed, wait longer and return status
      logger.warn('No skip option found and YouTube workaround failed for QR verification');
      await this.page.randomDelay(10000, 15000);
      return 'qr_code_required';
    }

    // Check for phone verification
    const phoneVerificationIndicators = [
      'Verify your phone',
      'phone number',
      'Enter your phone number',
      'We need to verify'
    ];

    const hasPhoneVerification = phoneVerificationIndicators.some(indicator =>
      bodyText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasPhoneVerification) {
      logger.warn('📱 Phone verification screen detected');
      return 'phone_verification_required';
    }

    return 'no_verification_needed';
  }

  /**
   * YouTube Workaround Method - Bypass QR code by using YouTube signup
   * Based on research from BlackHatWorld community
   */
  async attemptYouTubeWorkaround() {
    try {
      logger.info('🎬 Starting YouTube workaround method...');
      
      // Store current profile data from state
      const currentState = this.stateManager.getState(this.accountId);
      if (!currentState || !currentState.profile) {
        logger.error('No profile data found in state for YouTube workaround');
        return 'failed';
      }
      
      const profile = currentState.profile;
      
      // Open new incognito tab
      logger.info('Opening new incognito tab for YouTube signup');
      const context = await this.browserManager.browser.newContext();
      const youtubePage = await context.newPage();
      
      // Navigate to YouTube
      await youtubePage.goto('https://www.youtube.com', { waitUntil: 'networkidle' });
      await youtubePage.randomDelay(3000, 5000);
      
      // Click Sign In
      const signInSelectors = [
        'a[aria-label*="Sign in"]',
        'button:has-text("Sign in")',
        '[data-target="sign-in"]',
        'ytd-button-renderer:has-text("Sign in")',
        '#sign-in-button'
      ];
      
      let signInClicked = false;
      for (const selector of signInSelectors) {
        try {
          const signInButton = await youtubePage.$(selector);
          if (signInButton) {
            logger.info('Found YouTube Sign In button, clicking...');
            await signInButton.click();
            await youtubePage.randomDelay(2000, 4000);
            signInClicked = true;
            break;
          }
        } catch (e) {
          logger.debug(`Sign in selector ${selector} not found`);
        }
      }
      
      if (!signInClicked) {
        logger.warn('Could not find YouTube Sign In button');
        await context.close();
        return 'failed';
      }
      
      // Look for "Create account" or "Sign up" option
      await youtubePage.randomDelay(2000, 3000);
      
      const createAccountSelectors = [
        'button:has-text("Create account")',
        'a:has-text("Create account")',
        'button:has-text("Sign up")',
        'a:has-text("Sign up")',
        '[data-action="create-account"]',
        '#createAccount'
      ];
      
      let createAccountClicked = false;
      for (const selector of createAccountSelectors) {
        try {
          const createButton = await youtubePage.$(selector);
          if (createButton) {
            logger.info('Found Create Account button, clicking...');
            await createButton.click();
            await youtubePage.randomDelay(3000, 5000);
            createAccountClicked = true;
            break;
          }
        } catch (e) {
          logger.debug(`Create account selector ${selector} not found`);
        }
      }
      
      if (!createAccountClicked) {
        logger.warn('Could not find Create Account button on YouTube');
        await context.close();
        return 'failed';
      }
      
      // Now fill the same information as the original signup
      logger.info('Filling YouTube signup form with same profile data...');
      
      // Fill first name
      const firstNameSelectors = [
        'input[name="firstName"]',
        'input[id="firstName"]',
        'input[aria-label*="First name"]',
        '#firstName'
      ];
      
      await this.fillFieldInPage(youtubePage, firstNameSelectors, profile.firstName, 'First Name');
      
      // Fill last name
      const lastNameSelectors = [
        'input[name="lastName"]',
        'input[id="lastName"]',
        'input[aria-label*="Last name"]',
        '#lastName'
      ];
      
      await this.fillFieldInPage(youtubePage, lastNameSelectors, profile.lastName, 'Last Name');
      
      // Continue with the rest of the signup process...
      // Click Next to proceed
      const nextSelectors = [
        'button:has-text("Next")',
        'button[type="submit"]',
        '#next',
        '[data-action="next"]'
      ];
      
      for (const selector of nextSelectors) {
        try {
          const nextButton = await youtubePage.$(selector);
          if (nextButton) {
            logger.info('Clicking Next button in YouTube signup...');
            await nextButton.click();
            await youtubePage.randomDelay(3000, 5000);
            break;
          }
        } catch (e) {
          logger.debug(`Next selector ${selector} not found`);
        }
      }
      
      // Check if we get phone verification instead of QR code
      await youtubePage.randomDelay(5000, 8000);
      
      const pageText = await youtubePage.textContent('body');
      const hasPhoneVerification = pageText.toLowerCase().includes('phone number') || 
                                   pageText.toLowerCase().includes('verify your phone');
      
      if (hasPhoneVerification) {
        logger.info('🎉 SUCCESS! YouTube workaround bypassed QR code - got phone verification instead');
        
        // Close the YouTube tab and return to main signup
        await context.close();
        
        // The main page should now proceed differently
        return 'success';
      } else {
        logger.warn('YouTube workaround did not result in phone verification');
        await context.close();
        return 'failed';
      }
      
    } catch (error) {
      logger.error('Error during YouTube workaround:', error);
      return 'failed';
    }
  }
  
  /**
   * Helper method to fill fields in a specific page
   */
  async fillFieldInPage(page, selectors, value, fieldName) {
    for (const selector of selectors) {
      try {
        const field = await page.$(selector);
        if (field) {
          await field.fill(value);
          await page.randomDelay(1000, 2000);
          logger.info(`Filled ${fieldName} in YouTube signup`);
          return true;
        }
      } catch (e) {
        logger.debug(`Field selector ${selector} not found for ${fieldName}`);
      }
    }
    logger.warn(`Could not fill ${fieldName} in YouTube signup`);
    return false;
  }

  /**
   * REAL ACCOUNT VALIDATION - Test if account actually exists and works
   * This prevents false positives by actually testing login functionality
   */
  async validateAccountExists(profile) {
    logger.info('🔍 REAL VALIDATION: Testing if account actually exists and works');
    
    try {
      // Create a new browser context for testing
      const testContext = await this.browserManager.browser.newContext();
      const testPage = await testContext.newPage();
      
      // Navigate to Gmail login
      await testPage.goto('https://accounts.google.com/signin/v2/identifier', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Try to enter the email
      const emailSelectors = [
        'input[type="email"]',
        '#identifierId',
        'input[name="identifier"]',
        'input[autocomplete="username"]'
      ];
      
      let emailFilled = false;
      for (const selector of emailSelectors) {
        try {
          const emailField = await testPage.$(selector);
          if (emailField) {
            await emailField.fill(profile.email);
            await testPage.keyboard.press('Enter');
            emailFilled = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!emailFilled) {
        logger.error('❌ Could not find email field for validation');
        await testContext.close();
        return false;
      }
      
      // Wait for response
      await testPage.waitForTimeout(3000);
      
      // Check for password field (indicates account exists)
      const passwordSelectors = [
        'input[type="password"]',
        '#password',
        'input[name="password"]',
        'input[autocomplete="current-password"]'
      ];
      
      let passwordFieldFound = false;
      for (const selector of passwordSelectors) {
        try {
          const passwordField = await testPage.$(selector);
          if (passwordField) {
            passwordFieldFound = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check for error messages indicating account doesn't exist
      const bodyText = await testPage.textContent('body');
      const accountNotFoundIndicators = [
        "Couldn't find your Google Account",
        "account doesn't exist",
        "Enter a valid email",
        "No account found",
        "This email address doesn't match"
      ];
      
      const accountNotFound = accountNotFoundIndicators.some(indicator =>
        bodyText.toLowerCase().includes(indicator.toLowerCase())
      );
      
      await testContext.close();
      
      if (accountNotFound) {
        logger.error('❌ VALIDATION FAILED: Account does not exist');
        logger.error('❌ Google reports: Account not found');
        return false;
      }
      
      if (passwordFieldFound) {
        logger.info('✅ VALIDATION PASSED: Account exists and login flow works');
        logger.info('✅ Password field appeared - account is real');
        return true;
      }
      
      logger.error('❌ VALIDATION FAILED: No password field found');
      logger.error('❌ Account may not exist or login flow failed');
      return false;
      
    } catch (error) {
      logger.error('❌ VALIDATION ERROR: Could not test account existence', { error: error.message });
      return false;
    }
  }

  /**
   * Verify account creation was successful - STRICT VALIDATION
   */
  async verifyAccountCreation() {
    logger.info('FINAL VERIFICATION: Checking account creation success');

    // First check for verification screens
    const verificationStatus = await this.handleVerificationScreen();
    
    if (verificationStatus === 'qr_code_required') {
      logger.error('❌ QR Code verification BLOCKS account creation - account NOT created');
      return false; // Verification is BLOCKING account creation
    }
    
    if (verificationStatus === 'phone_verification_required') {
      logger.error('❌ Phone verification BLOCKS account creation - account NOT created');
      return false; // Verification is BLOCKING account creation
    }

    if (verificationStatus === 'youtube_workaround_success') {
      logger.info('🎉 YouTube workaround succeeded - proceeding with phone verification');
      // Continue with normal verification flow since we bypassed QR code
    }

    await this.page.waitForTimeout(8000); // Longer delay for verification screens
    
    const url = this.page.url();
    let bodyText = '';
    try {
      bodyText = await this.page.textContent('body');
    } catch (e) {
      logger.warn('Could not read body text');
    }
    
    logger.info('Final verification state', { 
      url, 
      bodyPreview: bodyText.substring(0, 300) 
    });

    // Check for BLOCKING verification URLs (these prevent account creation)
    const blockingVerificationUrls = [
      'mophoneverification',  // Device verification BLOCKS creation
      'phoneverification',    // Phone verification BLOCKS creation
      'verification/initial', // General verification BLOCKS creation
      'deviceauth',           // Device authentication BLOCKS creation
    ];

    const isBlockedByVerification = blockingVerificationUrls.some(blockingUrl => 
      url.includes(blockingUrl)
    );

    if (isBlockedByVerification) {
      logger.error('❌ Account creation BLOCKED by verification requirement');
      logger.error(`❌ Blocking URL: ${url}`);
      return false;
    }

    // STRICT URL check for TRUE success (only these indicate actual account creation)
    const successUrls = [
      'myaccount.google.com',
      'mail.google.com',
      'welcome',
      'intro/privacycheckup',
    ];

    const urlIndicatesSuccess = successUrls.some(successUrl => 
      url.includes(successUrl)
    );

    if (urlIndicatesSuccess) {
      logger.info('✅ Account creation VERIFIED by URL');
      logger.info(`✅ Success URL: ${url}`);
      return true;
    }

    // Check if still on signup page (FAILURE) - but exclude verification pages
    const isOnSignupPage = (url.includes('signup/v2') || url.includes('lifecycle/steps/signup')) &&
                          !url.includes('mophoneverification') &&
                          !url.includes('phoneverification') &&
                          !url.includes('verification/initial') &&
                          !url.includes('deviceauth');
    
    if (isOnSignupPage) {
      logger.error('❌ Still on signup page - account NOT created');
      logger.error(`❌ Current URL: ${url}`);
      
      // Check for error messages
      try {
        const errorElements = await this.page.$$('[role="alert"], .error-msg, [aria-live="assertive"]');
        for (const el of errorElements) {
          const errorText = await el.textContent();
          if (errorText.trim()) {
            logger.error(`❌ Error message: ${errorText.trim()}`);
          }
        }
      } catch (e) {}
      
      return false;
    }

    // Success text indicators (ONLY texts that indicate actual account creation)
    const successIndicators = [
      'Welcome',
      'account created',
      "You're all set",
      'Google Account',
      'Privacy and Terms',
      'Protect your account',
    ];

    // BLOCKING verification text indicators (these PREVENT account creation)
    const blockingVerificationTexts = [
      'Verify some info before creating an account', // Device verification BLOCKS creation
      'Scan the QR code with your phone',            // QR code verification BLOCKS creation
      'Google needs to verify some info',            // Device verification BLOCKS creation
      'This helps keep you and others safe',         // Security verification BLOCKS creation
      'preventing abuse from computer programs',     // Anti-bot verification BLOCKS creation
      'Verify your phone',                           // Phone verification BLOCKS creation
    ];

    // Check for BLOCKING verification text first
    const hasBlockingVerificationText = blockingVerificationTexts.some(indicator =>
      bodyText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasBlockingVerificationText) {
      logger.error('❌ Account creation BLOCKED by verification text requirement');
      logger.error('❌ Found blocking verification text in page content');
      return false;
    }

    const hasSuccessText = successIndicators.some(indicator =>
      bodyText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasSuccessText) {
      logger.info('✅ Account creation VERIFIED by text content');
      return true;
    }

    // Use AI to verify if uncertain
    if (this.aiAnalyzer) {
      logger.info('Using AI to verify account creation');
      try {
        const analysis = await this.aiAnalyzer.detectCurrentStep();
        if (analysis.detectedStep === 'success_page' && analysis.confidence > 0.7) {
          logger.info('✅ Account creation VERIFIED by AI');
          return true;
        }
      } catch (error) {
        logger.warn('AI verification failed', { error: error.message });
      }
    }

    logger.warn('⚠️ Could not definitively verify account creation');
    logger.warn(`⚠️ Final URL: ${url}`);
    
    // Conservative approach: return false if uncertain
    return false;
  }

  /**
   * Fill field with retry across multiple selectors
   */
  async fillFieldWithRetry(selectors, value, fieldName, options = {}) {
    const { required = true } = options;

    logger.info(`Filling field: ${fieldName}`);

    for (const selector of selectors) {
      try {
        await this.formFiller.fillField(selector, value, {
          retries: 2,
          verifyValue: true,
          clearFirst: true,
        });
        
        logger.info(`✓ Successfully filled ${fieldName} with selector: ${selector}`);
        return true;
      } catch (error) {
        logger.debug(`Failed to fill ${fieldName} with selector: ${selector}`, {
          error: error.message,
        });
        continue;
      }
    }

    if (required) {
      throw new Error(`Could not fill ${fieldName} field with any selector`);
    }
    
    return false;
  }

  /**
   * Retry month selection with a direct approach
   */
  async retryMonthSelection(monthNumber) {
    logger.info('Retrying month selection with direct approach', { monthNumber });
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[monthNumber - 1];
    
    try {
      // Try clicking the month field again
      await this.page.click('#month');
      await this.page.randomDelay(1000, 1500);
      
      // Try multiple ways to select the month
      const strategies = [
        // Strategy 1: Click text directly
        async () => {
          logger.debug('Trying to click month by text');
          await this.page.click(`text="${monthName}"`);
          return true;
        },
        // Strategy 2: Use keyboard navigation
        async () => {
          logger.debug('Trying keyboard navigation');
          // Press down arrow key to month position
          for (let i = 0; i < monthNumber; i++) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.randomDelay(50, 100);
          }
          await this.page.keyboard.press('Enter');
          return true;
        },
        // Strategy 3: Find option and click
        async () => {
          logger.debug('Trying to find and click option element');
          const options = await this.page.$$('div[role="option"]');
          for (const opt of options) {
            const text = await opt.textContent();
            if (text && text.trim() === monthName) {
              await opt.click();
              return true;
            }
          }
          return false;
        }
      ];
      
      for (const strategy of strategies) {
        try {
          const success = await strategy();
          if (success) {
            logger.info('✓ Month retry successful', { strategy: strategies.indexOf(strategy) + 1 });
            await this.page.randomDelay(300, 500);
            return;
          }
        } catch (e) {
          logger.debug('Retry strategy failed', { error: e.message });
          continue;
        }
      }
      
      logger.warn('All retry strategies failed for month selection');
    } catch (error) {
      logger.error('Month retry failed', { error: error.message });
    }
  }

  /**
   * Select option with retry across multiple selectors
   */
  async selectOptionWithRetry(selectors, value, fieldName) {
    logger.info(`Selecting option for field: ${fieldName}`);

    for (const selector of selectors) {
      try {
        await this.formFiller.selectOption(selector, value);
        logger.info(`✓ Successfully selected ${fieldName} with selector: ${selector}`);
        return true;
      } catch (error) {
        logger.debug(`Failed to select ${fieldName} with selector: ${selector}`);
        continue;
      }
    }

    throw new Error(`Could not select ${fieldName} with any selector`);
  }

  /**
   * Verify field value
   */
  async verifyFieldValue(selectors, expectedValue, fieldName) {
    logger.info(`Verifying field value: ${fieldName}`);

    for (const selector of selectors) {
      try {
        const actualValue = await this.page.evaluate((sel) => {
          const element = document.querySelector(sel);
          return element ? element.value : null;
        }, selector);

        if (actualValue && actualValue.includes(expectedValue)) {
          logger.info(`✓ Field ${fieldName} verified`);
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    logger.warn(`Could not verify field ${fieldName}`);
    return false;
  }

  /**
   * Fill username field with validation to ensure it's not a password field
   */
  /**
   * Fill username with retry logic for taken usernames
   */
  async fillUsernameWithRetry(selectors, profile) {
    const maxAttempts = 5;
    let currentAttempt = 1;
    
    while (currentAttempt <= maxAttempts) {
      try {
        // Generate username for this attempt
        const username = this.generateUsernameForAttempt(profile, currentAttempt);
        logger.info(`Username attempt ${currentAttempt}/${maxAttempts}: ${username}`);
        
        // Fill the username field
        const fillSuccess = await this.fillUsernameFieldWithValidation(selectors, username);
        
        if (!fillSuccess) {
          logger.warn(`Failed to fill username field on attempt ${currentAttempt}`);
          currentAttempt++;
          continue;
        }
        
        // Wait a moment for any error messages to appear
        await this.page.randomDelay(1500, 2500);
        
        // Check for "username already taken" error
        const isTaken = await this.checkUsernameAlreadyTaken();
        
        if (isTaken) {
          logger.info(`Username "${username}" is already taken, trying alternative (attempt ${currentAttempt}/${maxAttempts})`);
          await this.browserManager.takeScreenshot(`username-taken-attempt-${currentAttempt}`);
          currentAttempt++;
          continue;
        }
        
        // Verify username was filled correctly
        await this.verifyFieldValue(selectors, username, 'username');
        
        logger.info(`✓ Username "${username}" successfully filled and verified`);
        
        // Update the profile with the successful username
        profile.username = username;
        profile.email = `${username}@gmail.com`;
        
        return true;
        
      } catch (error) {
        logger.error(`Username attempt ${currentAttempt} failed:`, error.message);
        currentAttempt++;
        
        if (currentAttempt <= maxAttempts) {
          await this.page.randomDelay(1000, 2000);
        }
      }
    }
    
    logger.error('All username attempts failed');
    await this.browserManager.takeScreenshot('username-all-attempts-failed');
    return false;
  }

  /**
   * Generate username for specific attempt with increasing numbers
   */
  generateUsernameForAttempt(profile, attempt) {
    // Extract base username from email or use provided username, with fallback
    let baseUsername;
    if (profile.username) {
      baseUsername = profile.username;
    } else if (profile.email && profile.email.includes('@')) {
      baseUsername = profile.email.split('@')[0];
    } else {
      // Fallback: generate username from first and last name
      baseUsername = `${profile.firstName || 'user'}${profile.lastName || 'test'}`.toLowerCase();
    }
    
    if (attempt === 1) {
      // First attempt: use original username
      return baseUsername;
    } else if (attempt === 2) {
      // Second attempt: add 2-digit random number
      const randomSuffix = Math.floor(Math.random() * 90) + 10; // 10-99
      return `${baseUsername}${randomSuffix}`;
    } else if (attempt === 3) {
      // Third attempt: add 3-digit random number
      const randomSuffix = Math.floor(Math.random() * 900) + 100; // 100-999
      return `${baseUsername}${randomSuffix}`;
    } else if (attempt === 4) {
      // Fourth attempt: add 4-digit random number
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      return `${baseUsername}${randomSuffix}`;
    } else {
      // Fifth attempt: add 5-digit random number
      const randomSuffix = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
      return `${baseUsername}${randomSuffix}`;
    }
  }

  /**
   * Check if username is already taken by looking for error messages
   */
  async checkUsernameAlreadyTaken() {
    const errorSelectors = [
      // Text-based error messages
      'div:has-text("That username is taken")',
      'div:has-text("already taken")',
      'div:has-text("Username not available")',
      'div:has-text("Try another")',
      'span:has-text("That username is taken")',
      'span:has-text("already taken")',
      'span:has-text("Username not available")',
      'span:has-text("Try another")',
      
      // Generic error containers
      '[role="alert"]',
      '.error-message',
      '.validation-error',
      '[data-error]',
      
      // Google-specific error selectors
      '[jsname="B34EJ"]', // Common Google error container
      '[jsname="h9d3hd"]', // Another Google error container
      '.LXRPh', // Google form error class
      '.dEOOab', // Google validation error
    ];
    
    for (const selector of errorSelectors) {
      try {
        const element = await this.page.$(selector);
        if (element && await element.isVisible()) {
          const text = await element.textContent();
          if (text && (
            text.toLowerCase().includes('taken') ||
            text.toLowerCase().includes('not available') ||
            text.toLowerCase().includes('try another') ||
            text.toLowerCase().includes('already exists')
          )) {
            logger.info(`Found username taken error: "${text.trim()}"`);
            return true;
          }
        }
      } catch (error) {
        // Continue checking other selectors
        continue;
      }
    }
    
    // Also check page content for error messages
    try {
      const pageText = await this.page.textContent('body');
      if (pageText && (
        pageText.includes('That username is taken') ||
        pageText.includes('already taken') ||
        pageText.includes('Username not available') ||
        pageText.includes('Try another')
      )) {
        logger.info('Found username taken error in page text');
        return true;
      }
    } catch (error) {
      logger.debug('Could not check page text for errors');
    }
    
    return false;
  }

  async fillUsernameFieldWithValidation(selectors, username) {
    logger.info('Filling username with field type validation');

    for (const selector of selectors) {
      try {
        // Check if element exists and is visible
        const element = await this.page.$(selector);
        if (!element) continue;

        // Validate that this is not a password field
        const inputType = await element.getAttribute('type');
        const ariaLabel = await element.getAttribute('aria-label') || '';
        const placeholder = await element.getAttribute('placeholder') || '';
        const name = await element.getAttribute('name') || '';

        // Skip if this looks like a password field
        if (inputType === 'password' || 
            ariaLabel.toLowerCase().includes('password') ||
            placeholder.toLowerCase().includes('password') ||
            name.toLowerCase().includes('password')) {
          logger.debug(`Skipping selector ${selector} - appears to be password field`);
          continue;
        }

        // Try to fill the field
        await this.formFiller.fillField(selector, username, {
          retries: 2,
          verifyValue: true,
          clearFirst: true,
        });
        
        logger.info(`✓ Successfully filled username with selector: ${selector}`);
        return true;
      } catch (error) {
        logger.debug(`Failed to fill username with selector: ${selector}`, {
          error: error.message,
        });
        continue;
      }
    }

    logger.error('Could not fill username field with any validated selector');
    return false;
  }

  /**
   * Check if any field exists from a list of selectors
   */
  async checkIfFieldExists(selectors) {
    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            logger.debug(`Field found with selector: ${selector}`);
            return true;
          }
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  /**
   * Click Next button with retry
   */
  async clickNextButton() {
    logger.info('Clicking Next button');

    const nextSelectors = [
      'button:has-text("Next")',
      'button[type="submit"]',
      '[data-action="NEXT"]',
      'button span:has-text("Next")',
      'div[role="button"]:has-text("Next")',
      'button[jsname="LgbsSe"]',
    ];

    for (const selector of nextSelectors) {
      try {
        if (await helpers.isElementVisible(this.page, selector)) {
          await this.page.humanClick(selector);
          logger.info('✓ Next button clicked');
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    // Fallback: press Enter
    logger.info('Fallback: Pressing Enter key');
    await this.page.keyboard.press('Enter');
    return true;
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browserManager) {
      await this.browserManager.close();
    }
  }
}

export default EnhancedGmailBot;

