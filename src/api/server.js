import express from 'express';
import { createServer } from 'http';
import { WorkflowController } from '../core/WorkflowController.js';
import { ProxyManager } from '../core/ProxyManager.js';
import ProxyRotator from '../core/ProxyRotator.js';
import { WebSocketServer } from '../websocket/server.js';
import AccountRepository from '../database/repositories/AccountRepository.js';
import JobRepository from '../database/repositories/JobRepository.js';
import ActivityRepository from '../database/repositories/ActivityRepository.js';
import * as Analytics from './analytics.js';
import { createLogger } from '../utils/logger.js';
import 'dotenv/config';

const logger = createLogger('APIServer');

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer(httpServer);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await AccountRepository.findAll({
      status: req.query.status,
      search: req.query.search,
      limit: parseInt(req.query.limit) || 100,
    });
    
    res.json({
      success: true,
      accounts,
      count: accounts.length,
    });
  } catch (error) {
    logger.error('Failed to fetch accounts', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get account stats
app.get('/api/accounts/stats', async (req, res) => {
  try {
    const stats = await AccountRepository.getStats();
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Failed to fetch stats', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get single account
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const account = await AccountRepository.findOne(req.params.id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }
    
    res.json({
      success: true,
      account,
    });
  } catch (error) {
    logger.error('Failed to fetch account', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update account
app.put('/api/accounts/:id', async (req, res) => {
  try {
    const account = await AccountRepository.update(req.params.id, req.body);
    
    wsServer.emitAccountUpdated(account);
    
    res.json({
      success: true,
      account,
    });
  } catch (error) {
    logger.error('Failed to update account', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete account
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    await AccountRepository.delete(req.params.id);
    
    wsServer.emitAccountDeleted(req.params.id);
    
    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete account', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await ActivityRepository.findAll({
      accountId: req.query.accountId,
      jobId: req.query.jobId,
      limit: parseInt(req.query.limit) || 100,
    });
    
    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    logger.error('Failed to fetch activities', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get active jobs
app.get('/api/jobs/active', async (req, res) => {
  try {
    const jobs = await JobRepository.getActiveJobs();
    
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    logger.error('Failed to fetch active jobs', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Analytics endpoints
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const data = await Analytics.getAnalyticsOverview();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Failed to get analytics overview', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/analytics/proxies', async (req, res) => {
  try {
    const data = await Analytics.getProxyStatistics();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Failed to get proxy statistics', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/analytics/test-proxy', async (req, res) => {
  try {
    const { proxyUrl } = req.body;
    if (!proxyUrl) {
      return res.status(400).json({
        success: false,
        error: 'Proxy URL is required',
      });
    }
    
    const result = await Analytics.testProxy(proxyUrl);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error('Failed to test proxy', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/analytics/timeline', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await Analytics.getCreationTimeline(days);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Failed to get timeline', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/analytics/success-rate', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await Analytics.getSuccessRateTrend(days);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Failed to get success rate trend', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test proxy endpoint
app.post('/api/test-proxy', async (req, res) => {
  try {
    const { proxyUrl, username, password } = req.body;

    if (!proxyUrl) {
      return res.status(400).json({
        success: false,
        error: 'Proxy URL is required',
      });
    }

    // Validate proxy URL format
    const validation = ProxyManager.validateProxyUrl(proxyUrl);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
      });
    }

    const proxyManager = new ProxyManager({
      proxyUrl,
      proxyUsername: username,
      proxyPassword: password,
    });

    const testResult = await proxyManager.testProxy();
    const currentIP = testResult.success ? await proxyManager.getCurrentIP() : null;

    res.json({
      success: testResult.success,
      message: testResult.message,
      ip: currentIP,
    });
  } catch (error) {
    logger.error('Proxy test failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create full account (Gmail + Instagram)
app.post('/api/create-account', async (req, res) => {
  try {
    const options = {
      useAiProfile: req.body.useAiProfile !== undefined ? req.body.useAiProfile : true,
      headless: req.body.headless !== undefined ? req.body.headless : false,
      proxyUrl: req.body.proxyUrl || null, // If null, ProxyRotator will auto-select
      uploadImages: req.body.uploadImages !== undefined ? req.body.uploadImages : false,
      initialPostCount: req.body.initialPostCount || 3,
      useProxy: req.body.useProxy !== undefined ? req.body.useProxy : true,
    };

    logger.info('Creating full account', options);

    const workflow = new WorkflowController(options);

    // Setup WebSocket updates
    workflow.onStatusUpdate((status) => {
      wsServer.emitJobProgress(status);
      if (status.stage === 'completed') {
        wsServer.emitJobComplete(status);
      } else if (status.stage === 'error') {
        wsServer.emitJobError(status.jobId, { message: status.error });
      }
    });

    // Setup SSE for status updates
    if (req.query.stream === 'true') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      workflow.onStatusUpdate((status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      });
    }

    const result = await workflow.executeFullWorkflow();

    // Emit account created event
    if (result.accountId) {
      const account = await AccountRepository.findOne(result.accountId);
      wsServer.emitAccountCreated(account);
    }

    // Update stats
    const stats = await AccountRepository.getStats();
    wsServer.emitStatsUpdate(stats);

    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ ...result, completed: true })}\n\n`);
      res.end();
    } else {
      res.json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    logger.error('Account creation failed', { error: error.message });
    
    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

// Create Gmail account only
app.post('/api/create-gmail', async (req, res) => {
  try {
    const options = {
      useAiProfile: req.body.useAiProfile !== undefined ? req.body.useAiProfile : true,
      headless: req.body.headless !== undefined ? req.body.headless : false,
      proxyUrl: req.body.proxyUrl || null,
    };

    const profile = req.body.profile || null;

    logger.info('Creating Gmail account only', options);

    const workflow = new WorkflowController(options);

    // Setup SSE for status updates
    if (req.query.stream === 'true') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      workflow.onStatusUpdate((status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      });
    }

    const result = await workflow.createGmailOnly(profile);

    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ ...result, completed: true })}\n\n`);
      res.end();
    } else {
      res.json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    logger.error('Gmail creation failed', { error: error.message });
    
    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

// Create Instagram account only
app.post('/api/create-instagram', async (req, res) => {
  try {
    const { gmailAccount, profile } = req.body;

    if (!gmailAccount || !gmailAccount.email || !gmailAccount.password) {
      return res.status(400).json({
        success: false,
        error: 'Gmail account information is required',
      });
    }

    if (!profile || !profile.username) {
      return res.status(400).json({
        success: false,
        error: 'Profile information with username is required',
      });
    }

    const options = {
      headless: req.body.headless !== undefined ? req.body.headless : false,
      proxyUrl: req.body.proxyUrl || null,
    };

    logger.info('Creating Instagram account only', {
      email: gmailAccount.email,
      username: profile.username,
    });

    const workflow = new WorkflowController(options);

    // Setup SSE for status updates
    if (req.query.stream === 'true') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      workflow.onStatusUpdate((status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      });
    }

    const result = await workflow.createInstagramOnly(gmailAccount, profile);

    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ ...result, completed: true })}\n\n`);
      res.end();
    } else {
      res.json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    logger.error('Instagram creation failed', { error: error.message });
    
    if (req.query.stream === 'true') {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

// Get API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'MyG Instagram Bot API',
    version: '1.0.0',
    endpoints: {
      '/health': {
        method: 'GET',
        description: 'Health check endpoint',
      },
      '/api/test-proxy': {
        method: 'POST',
        description: 'Test proxy connection',
        body: {
          proxyUrl: 'Proxy URL (required)',
          username: 'Proxy username (optional)',
          password: 'Proxy password (optional)',
        },
      },
      '/api/create-account': {
        method: 'POST',
        description: 'Create full account (Gmail + Instagram)',
        body: {
          useAiProfile: 'Use AI for profile generation (default: true)',
          headless: 'Run browser in headless mode (default: false)',
          proxyUrl: 'Proxy URL (optional)',
          uploadImages: 'Upload initial content (default: false)',
          initialPostCount: 'Number of initial posts (default: 3)',
        },
        query: {
          stream: 'Enable SSE streaming for real-time updates (true/false)',
        },
      },
      '/api/create-gmail': {
        method: 'POST',
        description: 'Create Gmail account only',
        body: {
          useAiProfile: 'Use AI for profile generation (default: true)',
          headless: 'Run browser in headless mode (default: false)',
          proxyUrl: 'Proxy URL (optional)',
          profile: 'Custom profile data (optional)',
        },
      },
      '/api/create-instagram': {
        method: 'POST',
        description: 'Create Instagram account using existing Gmail',
        body: {
          gmailAccount: {
            email: 'Gmail address (required)',
            password: 'Gmail password (required)',
          },
          profile: {
            username: 'Instagram username (required)',
            fullName: 'Full name',
            bio: 'Bio text',
          },
          headless: 'Run browser in headless mode (default: false)',
          proxyUrl: 'Proxy URL (optional)',
        },
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.path,
  });
});

// Start server
httpServer.listen(port, host, () => {
  logger.info(`API server started`, {
    host,
    port,
    url: `http://${host}:${port}`,
  });
  
  // Display startup banner
  import('../utils/banner.js').then(({ displayBanner }) => {
    displayBanner();
    console.log(`\n🚀 Server Status:`);
    console.log(`   📡 API Server: http://${host}:${port}`);
    console.log(`   📚 Documentation: http://${host}:${port}/api/docs`);
    console.log(`   💚 Health Check: http://${host}:${port}/health`);
    console.log(`\n✅ Server is ready to accept requests!\n`);
  });
});

export default app;

