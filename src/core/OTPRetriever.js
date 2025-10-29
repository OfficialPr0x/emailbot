import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('OTPRetriever');

/**
 * OTP Retriever for extracting verification codes from Gmail
 */
export class OTPRetriever {
  constructor(email, password, options = {}) {
    this.email = email;
    this.password = password;
    this.options = {
      host: options.host || 'imap.gmail.com',
      port: options.port || 993,
      tls: options.tls !== undefined ? options.tls : true,
      ...options,
    };
  }

  /**
   * Connect to IMAP server
   * @returns {Promise<Imap>}
   */
  async connect() {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: this.email,
        password: this.password,
        host: this.options.host,
        port: this.options.port,
        tls: this.options.tls,
        tlsOptions: { rejectUnauthorized: false },
      });

      imap.once('ready', () => {
        logger.info('IMAP connection established');
        resolve(imap);
      });

      imap.once('error', (err) => {
        logger.error('IMAP connection error', { error: err.message });
        reject(err);
      });

      imap.connect();
    });
  }

  /**
   * Retrieve OTP from email
   * @param {Object} options - Retrieval options
   * @returns {Promise<string|null>}
   */
  async retrieveOTP(options = {}) {
    const {
      from = null,
      subject = null,
      maxWaitTime = 120000, // 2 minutes
      checkInterval = 5000, // 5 seconds
    } = options;

    logger.info('Retrieving OTP from email', { from, subject });

    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const otp = await this.checkForOTP({ from, subject });
        
        if (otp) {
          logger.info('OTP retrieved successfully', { otp });
          return otp;
        }
        
        logger.debug('OTP not found, waiting before retry');
        await helpers.randomDelay(checkInterval, checkInterval + 1000);
      } catch (error) {
        logger.error('Error checking for OTP', { error: error.message });
      }
    }

    logger.error('OTP retrieval timeout');
    return null;
  }

  /**
   * Check for OTP in recent emails
   * @param {Object} options - Search options
   * @returns {Promise<string|null>}
   */
  async checkForOTP(options = {}) {
    const { from, subject } = options;

    let imap;
    try {
      imap = await this.connect();

      return await new Promise((resolve, reject) => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          // Build search criteria
          const searchCriteria = ['UNSEEN'];
          
          if (from) {
            searchCriteria.push(['FROM', from]);
          }
          
          if (subject) {
            searchCriteria.push(['SUBJECT', subject]);
          }

          // Search for recent unread emails
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          searchCriteria.push(['SINCE', yesterday]);

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              resolve(null);
              return;
            }

            logger.debug('Found emails', { count: results.length });

            // Fetch the most recent email
            const fetch = imap.fetch(results.slice(-5), {
              bodies: '',
              markSeen: false,
            });

            let otp = null;

            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, (err, parsed) => {
                  if (err) {
                    logger.error('Email parsing error', { error: err.message });
                    return;
                  }

                  const text = parsed.text || parsed.html || '';
                  const extractedOTP = helpers.extractOTP(text);
                  
                  if (extractedOTP) {
                    logger.info('OTP found in email', { from: parsed.from?.text });
                    otp = extractedOTP;
                  }
                });
              });
            });

            fetch.once('error', (err) => {
              reject(err);
            });

            fetch.once('end', () => {
              imap.end();
              resolve(otp);
            });
          });
        });
      });
    } catch (error) {
      logger.error('Failed to check for OTP', { error: error.message });
      if (imap) {
        imap.end();
      }
      return null;
    }
  }

  /**
   * Retrieve verification code from Gmail page (alternative method)
   * @param {Object} page - Playwright page object
   * @param {string} email - Email address
   * @param {string} password - Email password
   * @returns {Promise<string|null>}
   */
  static async retrieveFromGmailPage(page, email, password) {
    logger.info('Retrieving OTP from Gmail page', { email });

    try {
      // Navigate to Gmail
      await page.goto('https://mail.google.com', { waitUntil: 'networkidle' });
      await helpers.randomDelay(2000, 3000);

      // Check if already logged in
      const isLoggedIn = await page.url().includes('mail.google.com/mail');

      if (!isLoggedIn) {
        // Login to Gmail
        logger.info('Logging in to Gmail');
        
        // Enter email
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.humanType('input[type="email"]', email);
        await helpers.randomDelay(500, 1000);
        
        // Click next
        await page.click('button:has-text("Next")');
        await helpers.randomDelay(2000, 3000);
        
        // Enter password
        await page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await page.humanType('input[type="password"]', password);
        await helpers.randomDelay(500, 1000);
        
        // Click next
        await page.click('button:has-text("Next")');
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        await helpers.randomDelay(2000, 3000);
      }

      // Wait for inbox to load
      await page.waitForSelector('[role="main"]', { timeout: 15000 });
      await helpers.randomDelay(2000, 3000);

      // Look for unread emails
      const emails = await page.$$('[role="row"]');
      
      for (const email of emails.slice(0, 5)) {
        try {
          // Click on the email
          await email.click();
          await helpers.randomDelay(1000, 2000);
          
          // Get email content
          const content = await page.textContent('[role="main"]');
          const otp = helpers.extractOTP(content);
          
          if (otp) {
            logger.info('OTP found in Gmail', { otp });
            return otp;
          }
          
          // Go back to inbox
          await page.goBack();
          await helpers.randomDelay(1000, 2000);
        } catch (error) {
          logger.warn('Error checking email', { error: error.message });
        }
      }

      logger.warn('OTP not found in Gmail');
      return null;
    } catch (error) {
      logger.error('Failed to retrieve OTP from Gmail page', {
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Wait for verification email and extract link
   * @param {Object} options - Options
   * @returns {Promise<string|null>}
   */
  async retrieveVerificationLink(options = {}) {
    const {
      from = null,
      subject = null,
      maxWaitTime = 120000,
      checkInterval = 5000,
    } = options;

    logger.info('Retrieving verification link from email', { from, subject });

    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const link = await this.checkForVerificationLink({ from, subject });
        
        if (link) {
          logger.info('Verification link retrieved successfully');
          return link;
        }
        
        await helpers.randomDelay(checkInterval, checkInterval + 1000);
      } catch (error) {
        logger.error('Error checking for verification link', {
          error: error.message,
        });
      }
    }

    logger.error('Verification link retrieval timeout');
    return null;
  }

  /**
   * Check for verification link in recent emails
   * @param {Object} options - Search options
   * @returns {Promise<string|null>}
   */
  async checkForVerificationLink(options = {}) {
    const { from, subject } = options;

    let imap;
    try {
      imap = await this.connect();

      return await new Promise((resolve, reject) => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          const searchCriteria = ['UNSEEN'];
          
          if (from) {
            searchCriteria.push(['FROM', from]);
          }
          
          if (subject) {
            searchCriteria.push(['SUBJECT', subject]);
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          searchCriteria.push(['SINCE', yesterday]);

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              resolve(null);
              return;
            }

            const fetch = imap.fetch(results.slice(-5), {
              bodies: '',
              markSeen: false,
            });

            let verificationLink = null;

            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, (err, parsed) => {
                  if (err) return;

                  const html = parsed.html || parsed.text || '';
                  
                  // Extract verification links
                  const linkRegex = /https?:\/\/[^\s<>"]+(?:verify|confirm|activation)[^\s<>"]*/gi;
                  const matches = html.match(linkRegex);
                  
                  if (matches && matches.length > 0) {
                    verificationLink = matches[0];
                    logger.info('Verification link found');
                  }
                });
              });
            });

            fetch.once('error', (err) => {
              reject(err);
            });

            fetch.once('end', () => {
              imap.end();
              resolve(verificationLink);
            });
          });
        });
      });
    } catch (error) {
      logger.error('Failed to check for verification link', {
        error: error.message,
      });
      if (imap) {
        imap.end();
      }
      return null;
    }
  }
}

export default OTPRetriever;

