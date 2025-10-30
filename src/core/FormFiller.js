import { createLogger } from '../utils/logger.js';
import * as helpers from '../utils/helpers.js';
import { AIFormAnalyzer } from './AIFormAnalyzer.js';

const logger = createLogger('FormFiller');

/**
 * Enhanced Form Filler with 15+ strategies and AI-powered analysis
 */
export class FormFiller {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
    this.aiAnalyzer = options.aiAnalyzer || null;
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

      // Strategy 6: XPath selector
      async () => {
        logger.debug('Trying strategy 6: XPath selector');
        try {
          // Convert simple selector to XPath if possible
          let xpath = selector;
          if (selector.startsWith('//') === false) {
            // Simple conversion for input names
            xpath = `//input[@name='${selector.replace(/[^\w]/g, '')}']`;
          }
          
          const element = await this.page.$(`xpath=${xpath}`);
          if (!element) return false;
          
          await element.click();
          await helpers.randomDelay(100, 200);
          
          if (clearFirst) {
            await element.fill('');
          }
          
          await element.type(value, { delay: 100 });
          return true;
        } catch (error) {
          return false;
        }
      },

      // Strategy 7: Find by placeholder
      async () => {
        logger.debug('Trying strategy 7: Placeholder match');
        try {
          const inputs = await this.page.$$('input, textarea');
          for (const input of inputs) {
            const placeholder = await input.getAttribute('placeholder');
            if (placeholder && placeholder.toLowerCase().includes(selector.toLowerCase())) {
              await input.focus();
              await helpers.randomDelay(100, 200);
              
              if (clearFirst) {
                await input.fill('');
              }
              
              await input.type(value, { delay: 100 });
              return true;
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Strategy 8: Find by aria-label
      async () => {
        logger.debug('Trying strategy 8: ARIA label match');
        try {
          const elements = await this.page.$$('[aria-label]');
          for (const element of elements) {
            const ariaLabel = await element.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.toLowerCase().includes(selector.toLowerCase())) {
              await element.focus();
              await helpers.randomDelay(100, 200);
              
              if (clearFirst) {
                await element.fill('');
              }
              
              await element.type(value, { delay: 100 });
              return true;
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Strategy 9: Find visible input by position
      async () => {
        logger.debug('Trying strategy 9: Visible input by position');
        try {
          const inputs = await this.page.$$('input[type="text"]:visible, input:not([type]):visible');
          if (inputs.length > 0) {
            // Try first visible input
            const input = inputs[0];
            await input.focus();
            await helpers.randomDelay(100, 200);
            
            if (clearFirst) {
              await input.fill('');
            }
            
            await input.type(value, { delay: 100 });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Strategy 10: Click + select all + paste simulation
      async () => {
        logger.debug('Trying strategy 10: Click + select + paste sim');
        try {
          await this.page.click(selector);
          await helpers.randomDelay(200, 300);
          await this.page.keyboard.press('Control+A');
          await helpers.randomDelay(100, 150);
          
          // Type each character for paste simulation
          for (const char of value) {
            await this.page.keyboard.press(char);
            await helpers.randomDelay(20, 40);
          }
          return true;
        } catch (error) {
          return false;
        }
      },

      // Strategy 11: Force focus and type
      async () => {
        logger.debug('Trying strategy 11: Force focus and type');
        return await this.page.evaluate(
          ({ sel, val }) => {
            const element = document.querySelector(sel);
            if (!element) return false;
            
            element.focus();
            element.value = '';
            
            // Simulate typing with events
            for (let i = 0; i < val.length; i++) {
              element.value += val[i];
              element.dispatchEvent(new KeyboardEvent('keydown', { key: val[i], bubbles: true }));
              element.dispatchEvent(new KeyboardEvent('keypress', { key: val[i], bubbles: true }));
              element.dispatchEvent(new InputEvent('input', { data: val[i], bubbles: true }));
              element.dispatchEvent(new KeyboardEvent('keyup', { key: val[i], bubbles: true }));
            }
            
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            return true;
          },
          { sel: selector, val: value }
        );
      },

      // Strategy 12: Find by data attributes
      async () => {
        logger.debug('Trying strategy 12: Data attribute match');
        try {
          const elements = await this.page.$$('[data-name], [data-field], [data-type]');
          for (const element of elements) {
            const dataName = await element.getAttribute('data-name') || 
                           await element.getAttribute('data-field') || 
                           await element.getAttribute('data-type');
            if (dataName && dataName.toLowerCase().includes(selector.toLowerCase())) {
              await element.focus();
              await helpers.randomDelay(100, 200);
              
              if (clearFirst) {
                await element.fill('');
              }
              
              await element.type(value, { delay: 100 });
              return true;
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Strategy 13: Parent-child relationship
      async () => {
        logger.debug('Trying strategy 13: Parent-child relationship');
        try {
          // Look for form container and find input within
          const forms = await this.page.$$('form, div[role="form"]');
          for (const form of forms) {
            const inputs = await form.$$('input');
            if (inputs.length > 0) {
              const input = inputs[0];
              await input.focus();
              await helpers.randomDelay(100, 200);
              
              if (clearFirst) {
                await input.fill('');
              }
              
              await input.type(value, { delay: 100 });
              return true;
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Strategy 14: Try with :not() exclusions
      async () => {
        logger.debug('Trying strategy 14: Exclusion-based selector');
        try {
          const exclusionSelector = `${selector}:not([type="hidden"]):not([disabled])`;
          const element = await this.page.$(exclusionSelector);
          if (!element) return false;
          
          await element.focus();
          await helpers.randomDelay(100, 200);
          
          if (clearFirst) {
            await element.fill('');
          }
          
          await element.type(value, { delay: 100 });
          return true;
        } catch (error) {
          return false;
        }
      },

      // Strategy 15: AI-powered selector discovery (if available)
      async () => {
        if (!this.aiAnalyzer) return false;
        
        logger.debug('Trying strategy 15: AI-powered selector discovery');
        try {
          const fieldName = selector.replace(/[^\w]/g, '');
          const aiSelectors = await this.aiAnalyzer.findFieldSelectors(fieldName);
          
          for (const aiSelector of aiSelectors.slice(0, 3)) {
            try {
              const element = await this.page.$(aiSelector);
              if (element && await element.isVisible()) {
                await element.focus();
                await helpers.randomDelay(100, 200);
                
                if (clearFirst) {
                  await element.fill('');
                }
                
                await element.type(value, { delay: 100 });
                return true;
              }
            } catch (e) {
              continue;
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

    // Check if we're on Google - prioritize Google strategies
    const isGoogle = this.page.url().includes('google.com');

    // Convert numeric month to month name if needed (ONLY for month fields)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    let searchValue = value;
    
    // Only convert to month name if selector contains "month" and value is 1-12
    const isMonthField = selector.toLowerCase().includes('month');
    if (isMonthField && !isNaN(value) && parseInt(value) >= 1 && parseInt(value) <= 12) {
      const monthIndex = parseInt(value) - 1;
      searchValue = monthNames[monthIndex];
      logger.info('Converted numeric month to name', { numeric: value, name: searchValue });
    }

    const strategies = [
      // Strategy 1: Google Custom Dropdown (DIV-based) - PRIORITY for Google
      async () => {
        if (!isGoogle) return false;
        
        logger.debug('Trying strategy 1: Google custom dropdown', { selector, searchValue });
        try {
          // Find the element - could be div or button
          const element = await this.page.$(selector);
          if (!element) {
            logger.debug('Element not found', { selector });
            return false;
          }

          // Check if it's a custom Google dropdown
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          logger.debug('Element found', { tagName, selector });
          
          if (tagName !== 'div' && tagName !== 'button') {
            logger.debug('Not a div or button, skipping', { tagName });
            return false;
          }

          // Click to open dropdown
          await element.click();
          logger.debug('Clicked element to open dropdown');
          await helpers.randomDelay(800, 1200);
          
          // Take screenshot of opened dropdown for debugging
          if (this.page.screenshot) {
            try {
              await this.page.screenshot({ 
                path: `screenshots/dropdown-opened-${Date.now()}.png` 
              });
              logger.debug('Screenshot taken of opened dropdown');
            } catch (e) {
              // Ignore screenshot errors
            }
          }

          // Wait for options to appear - try multiple possible selectors
          let optionsAppeared = false;
          const possibleSelectors = [
            'div[role="option"]',
            'div[role="listbox"]',
            'div[jsname][role="option"]',
            'div[data-value]',
            'ul[role="listbox"]',
            'div.VfPpkd-rymPhb-fpDzbe-fmcmS'  // Google Material Design menu
          ];
          
          for (const sel of possibleSelectors) {
            try {
              await this.page.waitForSelector(sel, { 
                timeout: 2000,
                state: 'visible' 
              });
              logger.debug('Dropdown options appeared', { selector: sel });
              optionsAppeared = true;
              break;
            } catch (e) {
              continue;
            }
          }
          
          if (!optionsAppeared) {
            logger.debug('No dropdown options appeared with any selector, trying to proceed anyway');
          }

          // Find and click the matching option - try multiple strategies
          // First, try to get options with role="option" (most reliable for Google)
          let options = await this.page.$$('div[role="option"]');
          
          if (options.length === 0) {
            // Fallback: try other selectors
            logger.debug('No role="option" elements found, trying alternative selectors');
            const alternativeSelectors = [
              'div[role="listbox"] div[jsname]',
              'ul[role="listbox"] li',
              'div[data-value]',
              'div[role="listbox"] > div',
              'div.VfPpkd-rymPhb-ibnC6b > div',  // Material Design
              '[role="listbox"] [role="presentation"]'
            ];
            
            for (const altSel of alternativeSelectors) {
              options = await this.page.$$(altSel);
              if (options.length > 0) {
                logger.debug(`Found ${options.length} options with selector: ${altSel}`);
                break;
              }
            }
          }

          logger.debug(`Found ${options.length} dropdown options`);
          
          // Log all available options for debugging
          const allOptionsText = [];
          for (let i = 0; i < options.length; i++) {
            try {
              const opt = options[i];
              const text = await opt.textContent();
              const dataValue = await opt.getAttribute('data-value');
              const isVisible = await opt.isVisible();
              allOptionsText.push({ index: i, text: text?.trim(), dataValue, isVisible });
            } catch (e) {
              allOptionsText.push({ index: i, error: e.message });
            }
          }
          logger.info('Available dropdown options', { options: allOptionsText, searchingFor: searchValue });
          
          // Try to match by text content (month name or other values)
          for (const opt of options) {
            try {
              const text = await opt.textContent();
              const dataValue = await opt.getAttribute('data-value');
              const isVisible = await opt.isVisible();
              
              if (!isVisible) continue;
              
              logger.debug('Checking option', { text: text?.trim(), dataValue, searchValue });
              
              // Match by text (for month names) or data-value (for numeric values)
              if (text && text.trim() === searchValue) {
                logger.info('Found exact text match', { text: text.trim(), searchValue });
                await opt.scrollIntoViewIfNeeded();
                await opt.click();
                await helpers.randomDelay(200, 400);
                logger.info('✓ Google dropdown option selected by text', { value: searchValue });
                return true;
              }
              
              if (dataValue && dataValue === value) {
                logger.info('Found data-value match', { dataValue, value });
                await opt.scrollIntoViewIfNeeded();
                await opt.click();
                await helpers.randomDelay(200, 400);
                logger.info('✓ Google dropdown option selected by data-value', { value });
                return true;
              }
            } catch (e) {
              logger.debug('Error checking option', { error: e.message });
              continue;
            }
          }

          // If exact match fails, try by index for numeric values (original value, not converted)
          if (!isNaN(value)) {
            const index = parseInt(value) - 1; // Convert 1-based to 0-based
            logger.debug('Trying index-based selection', { value, index, optionsLength: options.length });
            
            if (index >= 0 && index < options.length) {
              const opt = options[index];
              const isVisible = await opt.isVisible();
              
              if (isVisible) {
                await opt.click();
                await helpers.randomDelay(200, 400);
                logger.info('✓ Google dropdown option selected by index', { value, index });
                return true;
              } else {
                logger.debug('Option at index not visible', { index });
              }
            }
          }

          logger.debug('No matching option found in Google dropdown');
          
          // Last resort: try clicking text anywhere on page
          try {
            logger.debug('Trying last resort: clicking visible text on page', { searchValue });
            const textElements = await this.page.$$(`text=${searchValue}`);
            for (const el of textElements) {
              try {
                const isVisible = await el.isVisible();
                if (isVisible) {
                  await el.click();
                  await helpers.randomDelay(200, 400);
                  logger.info('✓ Clicked option by text', { searchValue });
                  return true;
                }
              } catch (e) {
                continue;
              }
            }
          } catch (e) {
            logger.debug('Text-based click failed', { error: e.message });
          }
          
          return false;
        } catch (error) {
          logger.debug('Google dropdown strategy failed', { error: error.message, stack: error.stack });
          return false;
        }
      },

      // Strategy 2: Standard select (for normal dropdowns) - with type guard
      async () => {
        logger.debug('Trying strategy 2: Standard HTML select');
        const element = await this.page.$(selector);
        if (!element) return false;
        
        // Fast-fail: Check if element is actually a <select>
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        if (tagName !== 'select') {
          logger.debug(`Skipping standard select strategy - element is <${tagName}>, not <select>`, { selector });
          return false;
        }
        
        await this.page.waitForSelector(selector, { visible: true, timeout: 3000 });
        
        // Try selecting by value first
        try {
          await this.page.selectOption(selector, value);
          logger.info('Selected option by value', { value });
          return true;
        } catch (e) {
          // If that fails, try selecting by label (text)
          logger.debug('Value selection failed, trying label selection', { searchValue });
          try {
            await this.page.selectOption(selector, { label: searchValue });
            logger.info('Selected option by label', { label: searchValue });
            return true;
          } catch (e2) {
            logger.debug('Label selection also failed', { error: e2.message });
            return false;
          }
        }
      },

      // Strategy 3: Click and keyboard navigation
      async () => {
        await this.page.click(selector, { timeout: 3000 });
        await helpers.randomDelay(200, 300);
        
        // Try to find the option by text
        const optionText = value;
        for (let i = 0; i < optionText.length; i++) {
          await this.page.keyboard.press(optionText[i]);
          await helpers.randomDelay(30, 50);
        }
        
        await helpers.randomDelay(100, 200);
        await this.page.keyboard.press('Enter');
        return true;
      },

      // Strategy 4: DOM manipulation
      async () => {
        return await this.page.evaluate(
          ({ sel, val }) => {
            const select = document.querySelector(sel);
            if (!select) return false;

            // Try to find option by value
            let option = Array.from(select.options || []).find(
              (opt) => opt.value === val || opt.text === val
            );

            if (!option) return false;

            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            select.dispatchEvent(new Event('input', { bubbles: true }));
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

