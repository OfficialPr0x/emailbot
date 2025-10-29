import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('FormFiller');

/**
 * Enhanced Form Filler with multiple strategies and AI-powered analysis
 */
export class FormFiller {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
  }

  /**
   * Fill a form field with multiple fallback strategies
   * @param {string} selector - CSS selector for the field
   * @param {string} value - Value to fill
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Success status
   */
  async fillField(selector, value, options = {}) {
    const {
      retries = 3,
      verifyValue = true,
      clearFirst = true,
    } = options;

    logger.info('Filling field', { selector, valueLength: value.length });

    const strategies = [
      // Strategy 1: Standard selector with humanType
      async () => {
        logger.debug('Trying strategy 1: Standard humanType');
        await this.page.waitForSelector(selector, { visible: true, timeout: 5000 });
        
        if (clearFirst) {
          await this.page.click(selector);
          await this.page.keyboard.press('Control+A');
          await this.page.keyboard.press('Backspace');
          await helpers.randomDelay(100, 200);
        }
        
        await this.page.humanType(selector, value, {
          delay: 120 + Math.random() * 80,
          mistakeProbability: 0.05,
          pauseProbability: 0.1,
        });
        return true;
      },

      // Strategy 2: Focus + keyboard.type
      async () => {
        logger.debug('Trying strategy 2: Focus + keyboard.type');
        const element = await this.page.$(selector);
        if (!element) return false;

        await element.focus();
        await helpers.randomDelay(100, 300);
        
        if (clearFirst) {
          await this.page.keyboard.press('Control+A');
          await this.page.keyboard.press('Backspace');
          await helpers.randomDelay(100, 200);
        }
        
        await this.page.keyboard.type(value, { delay: 100 });
        return true;
      },

      // Strategy 3: Scroll into view + click + type
      async () => {
        logger.debug('Trying strategy 3: Scroll + click + type');
        const element = await this.page.$(selector);
        if (!element) return false;

        await element.scrollIntoViewIfNeeded();
        await helpers.randomDelay(300, 500);

        const box = await element.boundingBox();
        if (!box) return false;

        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await this.page.mouse.move(x, y, { steps: 5 });
        await this.page.mouse.click(x, y);
        await helpers.randomDelay(200, 400);

        if (clearFirst) {
          await this.page.keyboard.press('Control+A');
          await this.page.keyboard.press('Backspace');
          await helpers.randomDelay(100, 200);
        }

        await this.page.keyboard.type(value, { delay: 100 });
        return true;
      },

      // Strategy 4: Direct DOM manipulation
      async () => {
        logger.debug('Trying strategy 4: DOM manipulation');
        return await this.page.evaluate(
          ({ sel, val }) => {
            const element = document.querySelector(sel);
            if (!element) return false;

            element.value = val;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            return true;
          },
          { sel: selector, val: value }
        );
      },

      // Strategy 5: Fill by label
      async () => {
        logger.debug('Trying strategy 5: Fill by label');
        try {
          const labels = await this.page.$$('label');
          for (const label of labels) {
            const text = await label.textContent();
            if (text && text.toLowerCase().includes(selector.toLowerCase())) {
              const forAttr = await label.getAttribute('for');
              if (forAttr) {
                const input = await this.page.$(`#${forAttr}`);
                if (input) {
                  await input.focus();
                  await helpers.randomDelay(100, 200);
                  
                  if (clearFirst) {
                    await this.page.keyboard.press('Control+A');
                    await this.page.keyboard.press('Backspace');
                  }
                  
                  await this.page.keyboard.type(value, { delay: 100 });
                  return true;
                }
              }
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    ];

    // Try each strategy until one succeeds
    for (let attempt = 0; attempt < retries; attempt++) {
      for (const strategy of strategies) {
        try {
          const success = await strategy();
          
          if (success) {
            // Verify the value was set correctly
            if (verifyValue) {
              await helpers.randomDelay(200, 400);
              const actualValue = await this.page.evaluate((sel) => {
                const element = document.querySelector(sel);
                return element ? element.value : null;
              }, selector);

              if (actualValue && actualValue.includes(value)) {
                logger.info('Field filled successfully', { selector });
                return true;
              } else {
                logger.warn('Field value mismatch', {
                  selector,
                  expected: value,
                  actual: actualValue,
                });
                continue;
              }
            }
            
            logger.info('Field filled successfully', { selector });
            return true;
          }
        } catch (error) {
          logger.warn('Form filling strategy failed', {
            error: error.message,
            attempt,
          });
        }
      }

      if (attempt < retries - 1) {
        logger.warn('All strategies failed, retrying', { attempt: attempt + 1 });
        await helpers.randomDelay(1000, 2000);
      }
    }

    logger.error('All form filling strategies failed', { selector });
    throw new Error(`All form filling strategies failed for selector: ${selector}`);
  }

  /**
   * Select an option from a dropdown
   * @param {string} selector - CSS selector for the select element
   * @param {string} value - Value to select
   * @returns {Promise<boolean>}
   */
  async selectOption(selector, value, options = {}) {
    logger.info('Selecting option', { selector, value });

    const strategies = [
      // Strategy 1: Standard select
      async () => {
        await this.page.waitForSelector(selector, { visible: true, timeout: 5000 });
        await this.page.selectOption(selector, value);
        return true;
      },

      // Strategy 2: Click and keyboard navigation
      async () => {
        await this.page.click(selector);
        await helpers.randomDelay(300, 500);
        
        // Try to find the option by text
        const optionText = value;
        for (let i = 0; i < optionText.length; i++) {
          await this.page.keyboard.press(optionText[i]);
          await helpers.randomDelay(50, 100);
        }
        
        await helpers.randomDelay(200, 400);
        await this.page.keyboard.press('Enter');
        return true;
      },

      // Strategy 3: DOM manipulation
      async () => {
        return await this.page.evaluate(
          ({ sel, val }) => {
            const select = document.querySelector(sel);
            if (!select) return false;

            // Try to find option by value
            let option = Array.from(select.options).find(
              (opt) => opt.value === val || opt.text === val
            );

            if (!option) return false;

            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          },
          { sel: selector, val: value }
        );
      },
    ];

    // Try each strategy
    for (const strategy of strategies) {
      try {
        const success = await strategy();
        if (success) {
          logger.info('Option selected successfully', { selector, value });
          return true;
        }
      } catch (error) {
        logger.warn('Select strategy failed', { error: error.message });
      }
    }

    throw new Error(`Failed to select option for selector: ${selector}`);
  }

  /**
   * Click a button or clickable element
   * @param {string} selector - CSS selector for the element
   * @returns {Promise<boolean>}
   */
  async clickElement(selector, options = {}) {
    logger.info('Clicking element', { selector });

    const strategies = [
      // Strategy 1: Human click
      async () => {
        await this.page.waitForSelector(selector, { visible: true, timeout: 5000 });
        await this.page.humanClick(selector);
        return true;
      },

      // Strategy 2: Standard click
      async () => {
        await this.page.waitForSelector(selector, { visible: true, timeout: 5000 });
        await this.page.click(selector);
        return true;
      },

      // Strategy 3: Force click with evaluate
      async () => {
        return await this.page.evaluate((sel) => {
          const element = document.querySelector(sel);
          if (!element) return false;
          element.click();
          return true;
        }, selector);
      },

      // Strategy 4: Click by text
      async () => {
        const text = selector.replace(/[^a-zA-Z0-9\s]/g, '');
        await this.page.click(`text=${text}`);
        return true;
      },
    ];

    // Try each strategy
    for (const strategy of strategies) {
      try {
        const success = await strategy();
        if (success) {
          logger.info('Element clicked successfully', { selector });
          await helpers.randomDelay(500, 1000);
          return true;
        }
      } catch (error) {
        logger.warn('Click strategy failed', { error: error.message });
      }
    }

    throw new Error(`Failed to click element: ${selector}`);
  }

  /**
   * Fill an entire form with multiple fields
   * @param {Object} formData - Object with field selectors as keys and values
   * @returns {Promise<boolean>}
   */
  async fillForm(formData) {
    logger.info('Filling form', { fieldCount: Object.keys(formData).length });

    try {
      for (const [selector, value] of Object.entries(formData)) {
        await this.fillField(selector, value);
        await helpers.randomDelay(500, 1000);
      }

      logger.info('Form filled successfully');
      return true;
    } catch (error) {
      logger.error('Failed to fill form', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if a field is visible and interactable
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>}
   */
  async isFieldVisible(selector) {
    try {
      const element = await this.page.$(selector);
      if (!element) return false;

      const isVisible = await element.isVisible();
      const isEnabled = await element.isEnabled();
      
      return isVisible && isEnabled;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get field value
   * @param {string} selector - CSS selector
   * @returns {Promise<string|null>}
   */
  async getFieldValue(selector) {
    try {
      return await this.page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.value : null;
      }, selector);
    } catch (error) {
      logger.error('Failed to get field value', { selector, error: error.message });
      return null;
    }
  }

  /**
   * Wait for form to be ready
   * @param {string} formSelector - CSS selector for form
   * @returns {Promise<boolean>}
   */
  async waitForForm(formSelector, timeout = 10000) {
    try {
      await this.page.waitForSelector(formSelector, {
        visible: true,
        timeout,
      });
      await helpers.randomDelay(500, 1000);
      return true;
    } catch (error) {
      logger.error('Form not found', { formSelector, error: error.message });
      return false;
    }
  }
}

export default FormFiller;

