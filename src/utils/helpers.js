/**
 * Utility helper functions for the bot
 */

/**
 * Sleep for a random duration within a range
 * @param {number} min - Minimum milliseconds
 * @param {number} max - Maximum milliseconds
 * @returns {Promise<void>}
 */
export async function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Generate a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Simulate human-like typing with mistakes
 * @param {Object} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 * @param {Object} options - Typing options
 * @returns {Promise<void>}
 */
export async function humanType(page, selector, text, options = {}) {
  const {
    delay = 120,
    mistakeProbability = 0.05,
    pauseProbability = 0.1,
  } = options;

  await page.focus(selector);
  await randomDelay(100, 300);

  for (let i = 0; i < text.length; i++) {
    // Occasionally make a mistake
    if (Math.random() < mistakeProbability && i < text.length - 1) {
      const wrongChar = String.fromCharCode(text.charCodeAt(i) + randomInt(-2, 2));
      await page.keyboard.type(wrongChar, { delay: delay + randomInt(-50, 50) });
      await randomDelay(100, 300);
      await page.keyboard.press('Backspace');
      await randomDelay(50, 150);
    }

    // Type the correct character
    await page.keyboard.type(text[i], { delay: delay + randomInt(-50, 50) });

    // Occasionally pause while typing
    if (Math.random() < pauseProbability) {
      await randomDelay(300, 800);
    }
  }
}

/**
 * Simulate human-like mouse movement and click
 * @param {Object} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {Promise<void>}
 */
export async function humanClick(page, selector) {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  const box = await element.boundingBox();
  if (!box) {
    throw new Error(`Element not visible: ${selector}`);
  }

  // Calculate a random point within the element
  const x = box.x + box.width * randomFloat(0.3, 0.7);
  const y = box.y + box.height * randomFloat(0.3, 0.7);

  // Move mouse in a human-like way
  await page.mouse.move(x, y, { steps: randomInt(5, 15) });
  await randomDelay(100, 300);

  // Click
  await page.mouse.click(x, y);
  await randomDelay(50, 150);
}

/**
 * Simulate human-like scrolling
 * @param {Object} page - Playwright page object
 * @param {Object} options - Scroll options
 * @returns {Promise<void>}
 */
export async function humanScroll(page, options = {}) {
  const { direction = 'down', distance = 'medium' } = options;

  let scrollAmount;
  switch (distance) {
    case 'small':
      scrollAmount = randomInt(100, 300);
      break;
    case 'medium':
      scrollAmount = randomInt(300, 600);
      break;
    case 'large':
      scrollAmount = randomInt(600, 1000);
      break;
    default:
      scrollAmount = randomInt(300, 600);
  }

  if (direction === 'up') {
    scrollAmount = -scrollAmount;
  }

  // Scroll in multiple steps for more human-like behavior
  const steps = randomInt(3, 7);
  const stepAmount = scrollAmount / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((amount) => {
      window.scrollBy(0, amount);
    }, stepAmount);
    await randomDelay(50, 150);
  }
}

/**
 * Wait for navigation with timeout
 * @param {Object} page - Playwright page object
 * @param {Object} options - Navigation options
 * @returns {Promise<void>}
 */
export async function waitForNavigation(page, options = {}) {
  const { timeout = 60000, waitUntil = 'networkidle' } = options;
  
  try {
    await page.waitForLoadState(waitUntil, { timeout });
  } catch (error) {
    console.warn(`Navigation timeout: ${error.message}`);
  }
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise<any>}
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        await randomDelay(delay, delay * 1.5);
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Extract OTP code from text
 * @param {string} text - Text to search for OTP
 * @returns {string|null} OTP code or null if not found
 */
export function extractOTP(text) {
  // Common OTP patterns
  const patterns = [
    /\b\d{6}\b/,                    // 6-digit code
    /\b\d{4}\b/,                    // 4-digit code
    /\b\d{8}\b/,                    // 8-digit code
    /(?:code|otp|verification)[\s:]+(\d+)/i,  // With label
    /(\d+)[\s]+(?:is your|verification)/i,    // Format: "123456 is your code"
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return null;
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random username
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function generateUsername(firstName, lastName) {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const suffix = randomInt(10, 99999);
  return `${base}${suffix}`;
}

/**
 * Take a screenshot with timestamp
 * @param {Object} page - Playwright page object
 * @param {string} name - Screenshot name
 * @returns {Promise<string>} Path to screenshot
 */
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const screenshotPath = `screenshots/${name}-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

/**
 * Check if element is visible on page
 * @param {Object} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {Promise<boolean>}
 */
export async function isElementVisible(page, selector) {
  try {
    const element = await page.$(selector);
    if (!element) return false;
    return await element.isVisible();
  } catch (error) {
    return false;
  }
}

/**
 * Wait for element to be visible
 * @param {Object} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>}
 */
export async function waitForElement(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch (error) {
    return false;
  }
}

