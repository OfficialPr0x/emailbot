import { createLogger } from '../utils/logger.js';
import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

const logger = createLogger('ProxyManager');

/**
 * Proxy Manager for testing and configuring proxies
 */
export class ProxyManager {
  constructor(options = {}) {
    this.proxyUrl = options.proxyUrl || process.env.PROXY_URL || null;
    this.proxyUsername = options.proxyUsername || process.env.PROXY_USERNAME || null;
    this.proxyPassword = options.proxyPassword || process.env.PROXY_PASSWORD || null;
  }

  /**
   * Get proxy configuration for Playwright
   */
  getProxyConfig() {
    if (!this.proxyUrl) {
      return null;
    }

    const config = {
      server: this.proxyUrl,
    };

    if (this.proxyUsername && this.proxyPassword) {
      config.username = this.proxyUsername;
      config.password = this.proxyPassword;
    }

    return config;
  }

  /**
   * Get proxy agent for HTTP requests
   */
  getProxyAgent(url) {
    if (!this.proxyUrl) {
      return null;
    }

    const proxyUrl = this.buildProxyUrl();

    if (this.proxyUrl.startsWith('socks')) {
      return new SocksProxyAgent(proxyUrl);
    } else if (url.startsWith('https')) {
      return new HttpsProxyAgent(proxyUrl);
    } else {
      return new HttpProxyAgent(proxyUrl);
    }
  }

  /**
   * Build full proxy URL with authentication
   */
  buildProxyUrl() {
    if (!this.proxyUrl) {
      return null;
    }

    if (this.proxyUsername && this.proxyPassword) {
      const url = new URL(this.proxyUrl);
      url.username = this.proxyUsername;
      url.password = this.proxyPassword;
      return url.toString();
    }

    return this.proxyUrl;
  }

  /**
   * Test proxy connection
   */
  async testProxy() {
    if (!this.proxyUrl) {
      logger.info('No proxy configured');
      return { success: true, message: 'No proxy configured' };
    }

    logger.info('Testing proxy connection', { proxy: this.proxyUrl });

    try {
      const agent = this.getProxyAgent('https://www.google.com');
      
      const response = await fetch('https://www.google.com', {
        method: 'GET',
        agent,
        timeout: 10000,
      });

      if (response.ok) {
        logger.info('Proxy connection successful');
        return { success: true, message: 'Proxy connection successful' };
      } else {
        logger.warn('Proxy connection failed', { status: response.status });
        return {
          success: false,
          message: `Proxy returned status ${response.status}`,
        };
      }
    } catch (error) {
      logger.error('Proxy connection failed', { error: error.message });
      return {
        success: false,
        message: `Proxy connection failed: ${error.message}`,
      };
    }
  }

  /**
   * Get current IP address through proxy
   */
  async getCurrentIP() {
    try {
      const agent = this.getProxyAgent('https://api.ipify.org');
      
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        agent,
        timeout: 10000,
      });

      if (response.ok) {
        const data = await response.json();
        logger.info('Current IP address', { ip: data.ip });
        return data.ip;
      } else {
        logger.warn('Failed to get IP address', { status: response.status });
        return null;
      }
    } catch (error) {
      logger.error('Failed to get IP address', { error: error.message });
      return null;
    }
  }

  /**
   * Validate proxy format
   */
  static validateProxyUrl(url) {
    if (!url) {
      return { valid: false, message: 'Proxy URL is required' };
    }

    try {
      const proxyUrl = new URL(url);
      const validProtocols = ['http:', 'https:', 'socks4:', 'socks5:'];

      if (!validProtocols.includes(proxyUrl.protocol)) {
        return {
          valid: false,
          message: `Invalid protocol. Supported: ${validProtocols.join(', ')}`,
        };
      }

      if (!proxyUrl.hostname) {
        return { valid: false, message: 'Proxy hostname is required' };
      }

      return { valid: true, message: 'Proxy URL is valid' };
    } catch (error) {
      return { valid: false, message: `Invalid proxy URL: ${error.message}` };
    }
  }
}

export default ProxyManager;

