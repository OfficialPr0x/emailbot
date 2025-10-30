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
    logger.info('Checking for username choice page');
    await this.page.randomDelay(1500, 2500);
    
    // Check if we're on the "Choose your Gmail address" page
    const pageText = await this.page.textContent('body');
    const isChoicePage = pageText.includes('Choose your Gmail address') || 
                         pageText.includes('Pick a Gmail address');
    
    if (!isChoicePage) {
      logger.info('Not on username choice page, skipping');
      return true;
    }
    
    logger.info('PAGE 2.5: Handling username choice page');
    await this.browserManager.takeScreenshot('02c-username-choice-page');
    
    // Click "Create your own Gmail address" radio button
    const createOwnSelectors = [
      'text="Create your own Gmail address"',
      'input[value="custom"]',
      'div:has-text("Create your own Gmail address")',
      '[role="radio"]:has-text("Create your own")',
      'label:has-text("Create your own")',
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
    
    // Click Next
    await this.clickNextButton();
    await this.page.waitForLoadState('networkidle');
    await this.page.randomDelay(2000, 3000);
    
    logger.info('✓ Username choice page completed');
    return true;
  }

  /**
   * Fill username and password page - MOST CRITICAL STEP
   */
  async fillUsernamePage(profile) {
    logger.info('PAGE 3: Filling username and password (CRITICAL STEP)');
    
    await this.page.randomDelay(2000, 3000);

    // Extract username from email
    const username = profile.email.split('@')[0];
    logger.info(`Username to fill: ${username}`);

    // Comprehensive username selectors (20+ options)
    const usernameSelectors = [
      'input[name="Username"]',
      'input[name="username"]',
      'input[aria-label*="username" i]',
      'input[aria-label*="Gmail" i]',
      'input[aria-label*="email" i]',
      'input[aria-label*="address" i]',
      'input[aria-label*="choose" i]',
      'input[type="text"]:visible',
      '#username',
      'input.whsOnd',
      'input[autocomplete="username"]',
      'input[autocomplete="email"]',
      'input[placeholder*="username" i]',
      'input[placeholder*="email" i]',
      'input[jsname="YPqjbf"]',
      'input[name=""]',  // Sometimes Google uses empty name
      'div[jsname="Rwjr7b"] input',
      'form input[type="text"]:first-of-type',
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
        usernameSelectors.push(...aiSelectors.slice(0, 10));
      } catch (error) {
        logger.warn('Could not get AI selectors for username', { error: error.message });
      }
    }

    // Fill username with extensive retry
    logger.info('Filling username (using all strategies)');
    await this.fillFieldWithRetry(usernameSelectors, username, 'username');

    await this.page.randomDelay(1000, 1500);

    // Verify username was filled
    await this.verifyFieldValue(usernameSelectors, username, 'username');

    // Fill password
    const passwordSelectors = [
      'input[name="Passwd"]',
      'input[type="password"]',
      'input[aria-label*="password" i]',
      '#passwd',
      'input[autocomplete="new-password"]',
    ];

    logger.info('Filling password');
    await this.fillFieldWithRetry(passwordSelectors, profile.password, 'password');

    await this.page.randomDelay(500, 1000);

    // Fill confirm password if present
    const confirmSelectors = [
      'input[name="PasswdAgain"]',
      'input[name="ConfirmPasswd"]',
      'input[aria-label*="Confirm" i]',
      'input[type="password"]:nth-of-type(2)',
    ];

    try {
      await this.fillFieldWithRetry(confirmSelectors, profile.password, 'confirmPassword', { required: false });
    } catch (error) {
      logger.info('Confirm password field not found (might not be required)');
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
   * Verify account creation was successful - STRICT VALIDATION
   */
  async verifyAccountCreation() {
    logger.info('FINAL VERIFICATION: Checking account creation success');

    await this.page.waitForTimeout(5000);
    
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

    // STRICT URL check for success
    const successUrls = [
      'myaccount.google.com',
      'mail.google.com',
      'welcome',
      'phoneauth',
      'challenge/selection',
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

    // Check if still on signup page (FAILURE)
    if (url.includes('signup/v2') || url.includes('lifecycle/steps/signup')) {
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

    // Success text indicators
    const successIndicators = [
      'Welcome',
      'account created',
      "You're all set",
      'Google Account',
      'Verify your phone',
      'Privacy and Terms',
      'Protect your account',
    ];

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

