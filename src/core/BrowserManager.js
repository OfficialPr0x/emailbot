import { chromium } from 'playwright';
import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger('BrowserManager');

/**
 * Enhanced Browser Manager with stealth capabilities and human-like behavior
 */
export class BrowserManager {
  constructor(options = {}) {
    this.options = {
      headless: options.headless !== undefined ? options.headless : false,
      proxyUrl: options.proxyUrl || null,
      userDataDir: options.userDataDir || null,
      viewport: options.viewport || { width: 1920, height: 1080 },
      ...options,
    };

    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Initialize browser with stealth configuration
   */
  async initialize() {
    logger.info('Initializing browser with stealth configuration');

    try {
      const launchOptions = {
        headless: this.options.headless,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-site-isolation-trials',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      };

      // Add proxy if provided
      if (this.options.proxyUrl) {
        launchOptions.proxy = {
          server: this.options.proxyUrl,
        };
        logger.info('Using proxy', { proxy: this.options.proxyUrl });
      }

      // Launch browser
      this.browser = await chromium.launch(launchOptions);

      // Create context with stealth settings
      const contextOptions = {
        viewport: this.options.viewport,
        userAgent: this.getRandomUserAgent(),
        locale: 'en-US',
        timezoneId: 'America/New_York',
        permissions: ['geolocation', 'notifications'],
        geolocation: { latitude: 40.7128, longitude: -74.0060 }, // New York
        colorScheme: 'light',
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false,
      };

      // Add user data dir if provided
      if (this.options.userDataDir) {
        contextOptions.storageState = this.options.userDataDir;
      }

      this.context = await this.browser.newContext(contextOptions);

      // Add stealth scripts to hide automation
      await this.context.addInitScript(() => {
        // Override the navigator.webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });

        // Override the plugins array
        Object.defineProperty(navigator, 'plugins', {
          get: () => [
            {
              0: { type: 'application/pdf' },
              description: 'Portable Document Format',
              filename: 'internal-pdf-viewer',
              length: 1,
              name: 'Chrome PDF Plugin',
            },
            {
              0: { type: 'application/x-nacl' },
              description: 'Native Client Executable',
              filename: 'internal-nacl-plugin',
              length: 1,
              name: 'Native Client',
            },
          ],
        });

        // Override the languages property
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });

        // Mock permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters)
        );

        // Add chrome runtime
        window.chrome = {
          runtime: {},
        };
      });

      // Create new page
      this.page = await this.context.newPage();

      // Add human-like methods to page
      this.addHumanMethods();

      logger.info('Browser initialized successfully');
      return this.page;
    } catch (error) {
      logger.error('Failed to initialize browser', { error: error.message });
      throw error;
    }
  }

  /**
   * Add human-like interaction methods to page
   */
  addHumanMethods() {
    // Add humanType method
    this.page.humanType = async (selector, text, options = {}) => {
      return helpers.humanType(this.page, selector, text, options);
    };

    // Add humanClick method
    this.page.humanClick = async (selector) => {
      return helpers.humanClick(this.page, selector);
    };

    // Add humanScroll method
    this.page.humanScroll = async (options = {}) => {
      return helpers.humanScroll(this.page, options);
    };

    // Add randomDelay method
    this.page.randomDelay = async (min, max) => {
      return helpers.randomDelay(min, max);
    };
  }

  /**
   * Get a random user agent
   */
  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  /**
   * Navigate to URL with retry logic
   */
  async navigateWithRetry(url, options = {}) {
    const {
      maxRetries = 3,
      waitUntil = 'networkidle',
      initialTimeout = 60000,
    } = options;

    logger.info('Navigating to URL', { url });

    return helpers.retryWithBackoff(
      async () => {
        await this.page.goto(url, {
          waitUntil,
          timeout: initialTimeout,
        });
        await this.page.randomDelay(1000, 2000);
      },
      { maxRetries }
    );
  }

  /**
   * Simulate human exploration of a page
   */
  async simulateHumanExploration() {
    const viewportSize = this.page.viewportSize();
    
    // Random mouse movements
    const movements = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < movements; i++) {
      const x = Math.floor(Math.random() * (viewportSize.width - 100)) + 50;
      const y = Math.floor(Math.random() * (viewportSize.height - 100)) + 50;
      
      await this.page.mouse.move(x, y, { steps: 10 });
      await helpers.randomDelay(300, 500);
    }

    // Occasional scrolling
    if (Math.random() > 0.7) {
      const direction = Math.random() > 0.5 ? 'down' : 'up';
      await this.page.humanScroll({ direction, distance: 'small' });
    }
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name) {
    return helpers.takeScreenshot(this.page, name);
  }

  /**
   * Save browser state
   */
  async saveState(path) {
    try {
      await this.context.storageState({ path });
      logger.info('Browser state saved', { path });
    } catch (error) {
      logger.error('Failed to save browser state', { error: error.message });
    }
  }

  /**
   * Close browser
   */
  async close() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      logger.info('Browser closed');
    } catch (error) {
      logger.error('Error closing browser', { error: error.message });
    }
  }
}

export default BrowserManager;

