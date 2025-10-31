import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger('ProxyRotator');

/**
 * Automatic proxy rotation from proxy list
 */
export class ProxyRotator {
  constructor() {
    this.proxies = [];
    this.currentIndex = 0;
    this.usedProxies = new Map(); // Track usage and success rate
    this.loadProxies();
  }

  /**
   * Load proxies from proxies.txt file
   */
  loadProxies() {
    try {
      const proxyFile = path.join(__dirname, '..', '..', 'proxies.txt');
      
      if (!fs.existsSync(proxyFile)) {
        logger.warn('No proxies.txt file found. Accounts will be created without proxy.');
        return;
      }

      const content = fs.readFileSync(proxyFile, 'utf-8');
      this.proxies = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => `http://${line}`);

      logger.info(`Loaded ${this.proxies.length} proxies from proxies.txt`);
      
      // Shuffle proxies for better distribution
      this.shuffleProxies();
    } catch (error) {
      logger.error('Failed to load proxies', { error: error.message });
    }
  }

  /**
   * Shuffle proxy list for better distribution
   */
  shuffleProxies() {
    for (let i = this.proxies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.proxies[i], this.proxies[j]] = [this.proxies[j], this.proxies[i]];
    }
  }

  /**
   * Get next proxy in rotation with cooldown consideration
   * @param {number} cooldownMinutes - Minimum minutes between uses (default: 30)
   * @returns {string|null} Next proxy URL
   */
  getNextProxy(cooldownMinutes = 30) {
    if (this.proxies.length === 0) {
      return null;
    }

    const now = new Date();
    const cooldownMs = cooldownMinutes * 60 * 1000;

    // Try to find a proxy that hasn't been used recently
    let attempts = 0;
    const maxAttempts = this.proxies.length * 2; // Allow checking all proxies twice

    while (attempts < maxAttempts) {
      const proxy = this.proxies[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
      attempts++;

      // Initialize tracking if needed
      if (!this.usedProxies.has(proxy)) {
        this.usedProxies.set(proxy, {
          uses: 0,
          successes: 0,
          failures: 0,
          lastUsed: null,
        });
      }

      const stats = this.usedProxies.get(proxy);
      
      // Check if proxy is in cooldown
      if (stats.lastUsed) {
        const timeSinceLastUse = now - stats.lastUsed;
        if (timeSinceLastUse < cooldownMs) {
          // Skip this proxy, it's in cooldown
          continue;
        }
      }

      // Check if proxy has too many recent failures
      if (stats.failures > 3 && stats.successes === 0) {
        // Skip proxies with multiple failures and no successes
        continue;
      }

      // This proxy is good to use
      stats.uses++;
      stats.lastUsed = new Date();

      logger.info('Selected proxy with cooldown', {
        proxy: this.maskProxy(proxy),
        uses: stats.uses,
        successRate: stats.uses > 0 ? ((stats.successes / stats.uses) * 100).toFixed(1) + '%' : 'N/A',
        cooldownMinutes,
      });

      return proxy;
    }

    // If no proxy is available due to cooldown, use the next one anyway
    logger.warn('All proxies in cooldown, using next available proxy');
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;

    // Initialize tracking
    if (!this.usedProxies.has(proxy)) {
      this.usedProxies.set(proxy, {
        uses: 0,
        successes: 0,
        failures: 0,
        lastUsed: null,
      });
    }

    const stats = this.usedProxies.get(proxy);
    stats.uses++;
    stats.lastUsed = new Date();

    logger.info('Selected proxy', {
      proxy: this.maskProxy(proxy),
      uses: stats.uses,
      successRate: stats.uses > 0 ? ((stats.successes / stats.uses) * 100).toFixed(1) + '%' : 'N/A',
    });

    return proxy;
  }

  /**
   * Get a random proxy (alternative to rotation)
   * @returns {string|null} Random proxy URL
   */
  getRandomProxy() {
    if (this.proxies.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.proxies.length);
    const proxy = this.proxies[randomIndex];

    // Initialize tracking
    if (!this.usedProxies.has(proxy)) {
      this.usedProxies.set(proxy, {
        uses: 0,
        successes: 0,
        failures: 0,
        lastUsed: null,
      });
    }

    const stats = this.usedProxies.get(proxy);
    stats.uses++;
    stats.lastUsed = new Date();

    return proxy;
  }

  /**
   * Mark proxy as successful
   * @param {string} proxy - Proxy URL
   */
  markSuccess(proxy) {
    if (this.usedProxies.has(proxy)) {
      this.usedProxies.get(proxy).successes++;
      logger.info('Proxy success recorded', { proxy: this.maskProxy(proxy) });
    }
  }

  /**
   * Mark proxy as failed
   * @param {string} proxy - Proxy URL
   */
  markFailure(proxy) {
    if (this.usedProxies.has(proxy)) {
      this.usedProxies.get(proxy).failures++;
      logger.warn('Proxy failure recorded', { proxy: this.maskProxy(proxy) });
    }
  }

  /**
   * Get proxy statistics
   * @returns {Object} Proxy stats
   */
  getStats() {
    const stats = {
      total: this.proxies.length,
      used: this.usedProxies.size,
      details: [],
    };

    for (const [proxy, data] of this.usedProxies.entries()) {
      stats.details.push({
        proxy: this.maskProxy(proxy),
        uses: data.uses,
        successes: data.successes,
        failures: data.failures,
        successRate: data.uses > 0 ? ((data.successes / data.uses) * 100).toFixed(1) + '%' : 'N/A',
        lastUsed: data.lastUsed,
      });
    }

    return stats;
  }

  /**
   * Mask proxy IP for logging (security)
   * @param {string} proxy - Proxy URL
   * @returns {string} Masked proxy
   */
  maskProxy(proxy) {
    if (!proxy) return 'none';
    const match = proxy.match(/(\d+\.\d+\.\d+\.)\d+/);
    if (match) {
      return proxy.replace(match[1] + match[0].split('.')[3], match[1] + 'xxx');
    }
    return proxy;
  }

  /**
   * Reload proxies from file
   */
  reload() {
    logger.info('Reloading proxy list...');
    this.proxies = [];
    this.currentIndex = 0;
    this.loadProxies();
  }

  /**
   * Get total proxy count
   * @returns {number} Number of proxies
   */
  getProxyCount() {
    return this.proxies.length;
  }
}

// Singleton instance
export default new ProxyRotator();

