import { createLogger } from '../utils/logger.js';
import axios from 'axios';
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
   * Get axios proxy configuration
   */
  getAxiosProxyConfig() {
    if (!this.proxyUrl) {
      return null;
    }

    try {
      const url = new URL(this.proxyUrl);
      
      const config = {
        protocol: url.protocol.replace(':', ''),
        host: url.hostname,
        port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80)
      };

      if (this.proxyUsername && this.proxyPassword) {
        config.auth = {
          username: this.proxyUsername,
          password: this.proxyPassword
        };
      }

      return config;
    } catch (error) {
      logger.error('Failed to parse proxy URL for axios', { error: error.message });
      return null;
    }
  }
  /**
   * Get proxy agent for HTTP requests (legacy support)
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
   * Test proxy connection using axios
   */
  async testProxy() {
    if (!this.proxyUrl) {
      logger.info('No proxy configured');
      return { success: true, message: 'No proxy configured' };
    }

    logger.info('Testing proxy connection', { proxy: this.proxyUrl });

    try {
      const proxyConfig = this.getAxiosProxyConfig();
      
      const response = await axios.get('https://ip.oxylabs.io/location', {
        proxy: proxyConfig,
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.status === 200) {
        logger.info('Proxy connection successful', { 
          status: response.status,
          ip: response.data?.ip || 'Unknown',
          country: response.data?.country || 'Unknown'
        });
        return { 
          success: true, 
          message: 'Proxy connection successful',
          data: response.data
        };
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
   * Get current IP address through proxy using axios
   */
  async getCurrentIP() {
    try {
      const proxyConfig = this.getAxiosProxyConfig();
      
      const response = await axios.get('https://api.ipify.org?format=json', {
        proxy: proxyConfig,
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.status === 200) {
        const data = response.data;
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

