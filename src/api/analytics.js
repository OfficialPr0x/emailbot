import AccountRepository from '../database/repositories/AccountRepository.js';
import JobRepository from '../database/repositories/JobRepository.js';
import ActivityRepository from '../database/repositories/ActivityRepository.js';
import ProxyRotator from '../core/ProxyRotator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Analytics');

/**
 * Get analytics overview
 */
export async function getAnalyticsOverview() {
  try {
    // Get account stats
    const accountStats = await AccountRepository.getStats();
    
    // Get all accounts for analysis
    const allAccounts = await AccountRepository.findAll({ limit: 1000 });
    
    // Calculate this week's accounts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = allAccounts.filter(acc => new Date(acc.createdAt) >= oneWeekAgo).length;
    
    // Calculate daily creation for last 7 days
    const dailyCreation = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const created = allAccounts.filter(acc => {
        const accDate = new Date(acc.createdAt);
        return accDate >= dayStart && accDate <= dayEnd;
      });
      
      const failed = created.filter(acc => acc.status === 'failed');
      
      dailyCreation[dayName] = {
        created: created.length,
        failed: failed.length,
      };
    }
    
    // Get proxy stats
    const proxyStats = ProxyRotator.getStats();
    
    return {
      overview: {
        totalCreated: accountStats.total,
        successRate: accountStats.successRate,
        thisWeek,
        failed: accountStats.failed,
      },
      weeklyPerformance: dailyCreation,
      accountStatus: {
        active: accountStats.active,
        pending: accountStats.creating,
        failed: accountStats.failed,
      },
      proxyStats: {
        total: proxyStats.total,
        used: proxyStats.used,
        working: proxyStats.details.filter(p => p.successes > 0).length,
        failing: proxyStats.details.filter(p => p.failures > p.successes && p.uses > 0).length,
        details: proxyStats.details.slice(0, 20), // Top 20
      },
    };
  } catch (error) {
    logger.error('Failed to get analytics overview', { error: error.message });
    throw error;
  }
}

/**
 * Get detailed proxy statistics
 */
export async function getProxyStatistics() {
  try {
    const proxyStats = ProxyRotator.getStats();
    
    // Categorize proxies
    const working = proxyStats.details.filter(p => {
      if (p.uses === 0) return false;
      return p.successes > p.failures;
    });
    
    const failing = proxyStats.details.filter(p => {
      if (p.uses === 0) return false;
      return p.failures > p.successes;
    });
    
    const untested = proxyStats.total - proxyStats.used;
    
    return {
      total: proxyStats.total,
      working: working.length,
      failing: failing.length,
      untested,
      details: proxyStats.details,
      workingProxies: working,
      failingProxies: failing,
    };
  } catch (error) {
    logger.error('Failed to get proxy statistics', { error: error.message });
    throw error;
  }
}

/**
 * Test a specific proxy
 */
export async function testProxy(proxyUrl) {
  try {
    const { ProxyManager } = await import('../core/ProxyManager.js');
    const manager = new ProxyManager({ proxyUrl });
    const result = await manager.testProxy();
    
    if (result.success) {
      ProxyRotator.markSuccess(proxyUrl);
    } else {
      ProxyRotator.markFailure(proxyUrl);
    }
    
    return result;
  } catch (error) {
    logger.error('Failed to test proxy', { error: error.message, proxyUrl });
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Get account creation timeline
 */
export async function getCreationTimeline(days = 30) {
  try {
    const allAccounts = await AccountRepository.findAll({ limit: 10000 });
    
    const timeline = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayAccounts = allAccounts.filter(acc => {
        const accDate = new Date(acc.createdAt);
        return accDate >= dayStart && accDate <= dayEnd;
      });
      
      timeline.push({
        date: dateStr,
        total: dayAccounts.length,
        active: dayAccounts.filter(a => a.status === 'active').length,
        failed: dayAccounts.filter(a => a.status === 'failed').length,
      });
    }
    
    return timeline;
  } catch (error) {
    logger.error('Failed to get creation timeline', { error: error.message });
    throw error;
  }
}

/**
 * Get success rate over time
 */
export async function getSuccessRateTrend(days = 7) {
  try {
    const allAccounts = await AccountRepository.findAll({ limit: 10000 });
    
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayAccounts = allAccounts.filter(acc => {
        const accDate = new Date(acc.createdAt);
        return accDate >= dayStart && accDate <= dayEnd;
      });
      
      const successRate = dayAccounts.length > 0
        ? ((dayAccounts.filter(a => a.status === 'active').length / dayAccounts.length) * 100).toFixed(1)
        : 0;
      
      trend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        rate: parseFloat(successRate),
      });
    }
    
    return trend;
  } catch (error) {
    logger.error('Failed to get success rate trend', { error: error.message });
    throw error;
  }
}


