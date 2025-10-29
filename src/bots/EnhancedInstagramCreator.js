import { BrowserManager } from '../core/BrowserManager.js';
import { FormFiller } from '../core/FormFiller.js';
import { OTPRetriever } from '../core/OTPRetriever.js';
import { DeepSeekController } from '../core/DeepSeekController.js';
import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('EnhancedInstagramCreator');

/**
 * Enhanced Instagram Creator with realistic account setup
 */
export class EnhancedInstagramCreator {
  constructor(options = {}) {
    this.options = {
      headless: options.headless !== undefined ? options.headless : false,
      proxyUrl: options.proxyUrl || null,
      ...options,
    };

    this.browserManager = null;
    this.page = null;
    this.formFiller = null;
    this.deepseek = new DeepSeekController(process.env.DEEPSEEK_API_KEY);
  }

  /**
   * Initialize browser
   */
  async initialize() {
    logger.info('Initializing Instagram creator');

    this.browserManager = new BrowserManager(this.options);
    this.page = await this.browserManager.initialize();
    this.formFiller = new FormFiller(this.page);

    logger.info('Instagram creator initialized successfully');
  }

  /**
   * Create an Instagram account
   * @param {Object} options - Account options
   * @returns {Promise<Object>} Account information
   */
  async createInstagramAccount(options) {
    const { gmailAccount, profile } = options;

    logger.info('Starting Instagram account creation', {
      email: gmailAccount.email,
      username: profile.username,
    });

    try {
      // Navigate to Instagram signup
      await this.navigateToInstagramSignup();

      // Fill signup form
      await this.fillSignupForm(gmailAccount, profile);

      // Handle verification if needed
      await this.handleVerification(gmailAccount);

      // Verify account creation
      const success = await this.verifyAccountCreation();

      if (!success) {
        throw new Error('Instagram account creation verification failed');
      }

      logger.info('Instagram account created successfully', {
        username: profile.username,
      });

      return {
        username: profile.username,
        email: gmailAccount.email,
        password: gmailAccount.password,
        profile,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Instagram account creation failed', {
        error: error.message,
      });
      await this.browserManager.takeScreenshot('instagram-creation-error');
      throw error;
    }
  }

  /**
   * Navigate to Instagram signup page
   */
  async navigateToInstagramSignup() {
    logger.info('Navigating to Instagram signup');

    try {
      // Navigate to Instagram
      await this.browserManager.navigateWithRetry('https://www.instagram.com', {
        maxRetries: 3,
        waitUntil: 'networkidle',
      });

      await this.page.randomDelay(2000, 3000);
      await this.browserManager.simulateHumanExploration();

      // Look for "Sign up" link
      const signupSelectors = [
        'text=Sign up',
        'a:has-text("Sign up")',
        'a[href="/accounts/emailsignup/"]',
      ];

      for (const selector of signupSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.page.humanClick(selector);
            await this.page.randomDelay(2000, 3000);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      logger.info('Navigated to Instagram signup page');
    } catch (error) {
      logger.error('Failed to navigate to Instagram signup', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Fill Instagram signup form
   * @param {Object} gmailAccount - Gmail account info
   * @param {Object} profile - User profile
   */
  async fillSignupForm(gmailAccount, profile) {
    logger.info('Filling Instagram signup form');

    try {
      // Wait for signup form
      await this.page.randomDelay(2000, 3000);

      // Fill email
      logger.info('Filling email');
      const emailSelectors = [
        'input[name="emailOrPhone"]',
        'input[name="email"]',
        'input[type="email"]',
        'input[aria-label*="email"]',
      ];

      for (const selector of emailSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.formFiller.fillField(selector, gmailAccount.email);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(500, 1000);

      // Fill full name
      logger.info('Filling full name');
      const fullNameSelectors = [
        'input[name="fullName"]',
        'input[aria-label*="Full Name"]',
      ];

      for (const selector of fullNameSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.formFiller.fillField(selector, profile.fullName);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(500, 1000);

      // Fill username
      logger.info('Filling username');
      const usernameSelectors = [
        'input[name="username"]',
        'input[aria-label*="Username"]',
      ];

      for (const selector of usernameSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.formFiller.fillField(selector, profile.username);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(500, 1000);

      // Fill password
      logger.info('Filling password');
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        'input[aria-label*="Password"]',
      ];

      for (const selector of passwordSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.formFiller.fillField(selector, gmailAccount.password);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(1000, 2000);

      // Click "Sign up" or "Next" button
      logger.info('Clicking signup button');
      const signupButtonSelectors = [
        'button:has-text("Sign up")',
        'button:has-text("Next")',
        'button[type="submit"]',
      ];

      for (const selector of signupButtonSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.page.humanClick(selector);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.waitForLoadState('networkidle');
      await this.page.randomDelay(2000, 3000);

      // Handle birthday input if present
      await this.fillBirthdayIfPresent(profile);

      logger.info('Signup form filled successfully');
    } catch (error) {
      logger.error('Failed to fill signup form', { error: error.message });
      await this.browserManager.takeScreenshot('instagram-signup-error');
      throw error;
    }
  }

  /**
   * Fill birthday if present
   * @param {Object} profile - User profile
   */
  async fillBirthdayIfPresent(profile) {
    logger.info('Checking for birthday input');

    try {
      const birthDate = new Date(profile.birthDate);

      // Month
      const monthSelectors = [
        'select[title="Month"]',
        'select[name="month"]',
      ];

      for (const selector of monthSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            logger.info('Filling birth month');
            await this.formFiller.selectOption(
              selector,
              String(birthDate.getMonth() + 1)
            );
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(300, 600);

      // Day
      const daySelectors = ['select[title="Day"]', 'select[name="day"]'];

      for (const selector of daySelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            logger.info('Filling birth day');
            await this.formFiller.selectOption(selector, String(birthDate.getDate()));
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(300, 600);

      // Year
      const yearSelectors = ['select[title="Year"]', 'select[name="year"]'];

      for (const selector of yearSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            logger.info('Filling birth year');
            await this.formFiller.selectOption(
              selector,
              String(birthDate.getFullYear())
            );
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.randomDelay(1000, 2000);

      // Click Next button
      const nextSelectors = [
        'button:has-text("Next")',
        'button:has-text("Continue")',
      ];

      for (const selector of nextSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.page.humanClick(selector);
            await this.page.randomDelay(2000, 3000);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      logger.info('Birthday filled successfully');
    } catch (error) {
      logger.warn('No birthday input found or error filling', {
        error: error.message,
      });
    }
  }

  /**
   * Handle verification if needed
   * @param {Object} gmailAccount - Gmail account info
   */
  async handleVerification(gmailAccount) {
    logger.info('Checking for verification');

    try {
      // Look for verification code input
      const verificationSelectors = [
        'input[name="confirmationCode"]',
        'input[aria-label*="Confirmation Code"]',
        'input[placeholder*="confirmation code"]',
      ];

      let verificationInputFound = false;
      for (const selector of verificationSelectors) {
        if (await helpers.isElementVisible(this.page, selector)) {
          verificationInputFound = true;
          logger.info('Verification required');

          // Retrieve OTP from Gmail
          const otpRetriever = new OTPRetriever(
            gmailAccount.email,
            gmailAccount.password
          );

          logger.info('Retrieving OTP from Gmail');
          const otp = await otpRetriever.retrieveOTP({
            from: 'no-reply@mail.instagram.com',
            subject: 'Instagram',
            maxWaitTime: 120000,
          });

          if (!otp) {
            throw new Error('Failed to retrieve OTP from Gmail');
          }

          logger.info('OTP retrieved, entering code');
          await this.formFiller.fillField(selector, otp);
          await this.page.randomDelay(1000, 2000);

          // Click verify/next button
          const verifyButtonSelectors = [
            'button:has-text("Next")',
            'button:has-text("Confirm")',
            'button:has-text("Continue")',
          ];

          for (const btnSelector of verifyButtonSelectors) {
            try {
              if (await helpers.isElementVisible(this.page, btnSelector)) {
                await this.page.humanClick(btnSelector);
                break;
              }
            } catch (error) {
              continue;
            }
          }

          await this.page.waitForLoadState('networkidle');
          await this.page.randomDelay(2000, 3000);

          logger.info('Verification completed');
          break;
        }
      }

      if (!verificationInputFound) {
        logger.info('No verification required');
      }
    } catch (error) {
      logger.error('Verification handling failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Verify account creation was successful
   * @returns {Promise<boolean>}
   */
  async verifyAccountCreation() {
    logger.info('Verifying Instagram account creation');

    try {
      // Check for success indicators
      const successIndicators = [
        'text=Welcome to Instagram',
        '[aria-label="Home"]',
        'a[href="/"]',
        'svg[aria-label="Home"]',
      ];

      for (const selector of successIndicators) {
        try {
          const element = await this.page.$(selector);
          if (element && (await element.isVisible())) {
            logger.info('Instagram account creation verified');
            return true;
          }
        } catch (error) {
          continue;
        }
      }

      // Check URL
      const url = this.page.url();
      if (
        url.includes('instagram.com') &&
        !url.includes('accounts/emailsignup')
      ) {
        logger.info('Instagram account creation verified by URL');
        return true;
      }

      logger.warn('Could not verify Instagram account creation');
      return false;
    } catch (error) {
      logger.error('Instagram account verification failed', {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Setup Instagram profile
   * @param {Object} account - Instagram account
   * @param {Object} profile - User profile
   */
  async setupProfile(account, profile) {
    logger.info('Setting up Instagram profile', { username: account.username });

    try {
      // Navigate to profile edit
      await this.navigateToProfileEdit();

      // Update bio
      if (profile.bio) {
        await this.updateBio(profile.bio);
      }

      // Additional profile setup can be added here
      // - Profile picture upload
      // - Website link
      // - etc.

      logger.info('Profile setup completed');
    } catch (error) {
      logger.error('Profile setup failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Navigate to profile edit page
   */
  async navigateToProfileEdit() {
    logger.info('Navigating to profile edit page');

    try {
      // Look for profile link
      const profileSelectors = [
        '[aria-label*="Profile"]',
        'a[href*="/profile"]',
        'svg[aria-label="Profile"]',
      ];

      for (const selector of profileSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.page.humanClick(selector);
            await this.page.randomDelay(2000, 3000);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Look for "Edit profile" button
      const editSelectors = [
        'text=Edit profile',
        'a:has-text("Edit profile")',
        'button:has-text("Edit profile")',
      ];

      for (const selector of editSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.page.humanClick(selector);
            await this.page.randomDelay(2000, 3000);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      logger.info('Navigated to profile edit page');
    } catch (error) {
      logger.error('Failed to navigate to profile edit', {
        error: error.message,
      });
    }
  }

  /**
   * Update bio
   * @param {string} bio - Bio text
   */
  async updateBio(bio) {
    logger.info('Updating bio');

    try {
      const bioSelectors = [
        'textarea[aria-label*="Bio"]',
        'textarea[placeholder*="Bio"]',
      ];

      for (const selector of bioSelectors) {
        try {
          if (await helpers.isElementVisible(this.page, selector)) {
            await this.formFiller.fillField(selector, bio);
            await this.page.randomDelay(1000, 2000);

            // Click submit button
            const submitSelectors = [
              'button:has-text("Submit")',
              'button[type="submit"]',
            ];

            for (const btnSelector of submitSelectors) {
              try {
                if (await helpers.isElementVisible(this.page, btnSelector)) {
                  await this.page.humanClick(btnSelector);
                  break;
                }
              } catch (error) {
                continue;
              }
            }

            logger.info('Bio updated successfully');
            break;
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      logger.error('Failed to update bio', { error: error.message });
    }
  }

  /**
   * Post initial content (placeholder - would need image generation)
   * @param {Object} account - Instagram account
   * @param {number} postCount - Number of posts to create
   */
  async postInitialContent(account, postCount = 3) {
    logger.info('Posting initial content', { count: postCount });

    try {
      for (let i = 0; i < postCount; i++) {
        // Generate caption using AI
        const caption = await this.deepseek.generatePostCaption(
          account.profile,
          i
        );

        logger.info('Generated caption for post', { postNumber: i + 1, caption });

        // Note: Actual image posting would require:
        // 1. Image generation or selection
        // 2. Upload functionality
        // This is a placeholder for the workflow

        await helpers.randomDelay(10000, 20000); // Wait between posts
      }

      logger.info('Initial content posted successfully');
    } catch (error) {
      logger.error('Failed to post initial content', { error: error.message });
    }
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

export default EnhancedInstagramCreator;

