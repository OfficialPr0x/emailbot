import { EnhancedGmailBot } from '../bots/EnhancedGmailBot.js';
import { EnhancedInstagramCreator } from '../bots/EnhancedInstagramCreator.js';
import { DeepSeekController } from './DeepSeekController.js';
import { ProxyManager } from './ProxyManager.js';
import ProxyRotator from './ProxyRotator.js';
import AccountRepository from '../database/repositories/AccountRepository.js';
import JobRepository from '../database/repositories/JobRepository.js';
import ActivityRepository from '../database/repositories/ActivityRepository.js';
import { createLogger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger('WorkflowController');

/**
 * Full Workflow Controller orchestrating the complete account creation process
 */
export class WorkflowController {
  constructor(options = {}) {
    this.options = {
      useAiProfile: options.useAiProfile !== undefined ? options.useAiProfile : true,
      headless: options.headless !== undefined ? options.headless : false,
      proxyUrl: options.proxyUrl || null,
      uploadImages: options.uploadImages !== undefined ? options.uploadImages : false,
      initialPostCount: options.initialPostCount || 3,
      saveAccounts: options.saveAccounts !== undefined ? options.saveAccounts : true,
      ...options,
    };

    this.deepseek = new DeepSeekController(process.env.DEEPSEEK_API_KEY);
    this.proxyManager = new ProxyManager({ proxyUrl: this.options.proxyUrl });
    this.statusCallbacks = [];
    this.currentStatus = {};

    // Ensure accounts directory exists
    this.accountsDir = path.join(path.dirname(__dirname), '..', 'accounts');
    if (!fs.existsSync(this.accountsDir)) {
      fs.mkdirSync(this.accountsDir, { recursive: true });
    }
  }

  /**
   * Register status callback
   * @param {Function} callback - Callback function
   */
  onStatusUpdate(callback) {
    this.statusCallbacks.push(callback);
  }

  /**
   * Update status and notify callbacks
   * @param {Object} status - Status object
   */
  updateStatus(status) {
    this.currentStatus = { ...this.currentStatus, ...status, timestamp: new Date().toISOString() };
    logger.info('Status update', status);
    
    this.statusCallbacks.forEach((callback) => {
      try {
        callback(this.currentStatus);
      } catch (error) {
        logger.error('Error in status callback', { error: error.message });
      }
    });
  }

  /**
   * Execute the full workflow
   * @returns {Promise<Object>} Complete account information
   */
  async executeFullWorkflow() {
    logger.info('Starting full workflow execution');
    
    let gmailBot = null;
    let instagramCreator = null;
    let job = null;
    let dbAccount = null;

    try {
      // Create job in database
      job = await JobRepository.create({
        type: 'full',
        config: this.options,
      });

      // Step 0: Test proxy if configured
      if (this.options.proxyUrl) {
        await JobRepository.updateProgress(job.id, 5, 'proxy_test', 'Testing proxy connection...');
        this.updateStatus({
          stage: 'proxy_test',
          progress: 5,
          message: 'Testing proxy connection...',
          jobId: job.id,
        });

        const proxyTest = await this.proxyManager.testProxy();
        if (!proxyTest.success) {
          throw new Error(`Proxy test failed: ${proxyTest.message}`);
        }

        logger.info('Proxy test successful');
      }

      // Step 1: Generate profile
      await JobRepository.updateProgress(job.id, 10, 'profile_generation', 'Generating realistic user profile...');
      this.updateStatus({
        stage: 'profile_generation',
        progress: 10,
        message: 'Generating realistic user profile...',
        jobId: job.id,
      });

      const profile = this.options.useAiProfile
        ? await this.deepseek.generateProfileInfo()
        : this.deepseek.generateBasicProfile();

      logger.info('Profile generated', { username: profile.username });

      // Create pending account in database
      dbAccount = await AccountRepository.create({
        email: profile.email,
        password: profile.password,
        username: profile.username,
        fullName: profile.fullName,
        birthDate: profile.birthDate,
        gender: profile.gender,
        bio: profile.bio,
        location: profile.location,
        occupation: profile.occupation,
        profile: profile,
        proxyUrl: this.options.proxyUrl,
        status: 'pending',
      });

      await JobRepository.update(job.id, { accountId: dbAccount.id });
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'account_created',
        message: `Account created: ${profile.email}`,
      });

      // Step 2: Create Gmail account
      await JobRepository.updateProgress(job.id, 20, 'gmail_creation', 'Creating Gmail account...');
      this.updateStatus({
        stage: 'gmail_creation',
        progress: 20,
        message: 'Creating Gmail account...',
        jobId: job.id,
      });

      gmailBot = new EnhancedGmailBot({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await gmailBot.initialize();

      const gmailAccount = await gmailBot.createGmailAccount(profile);

      await JobRepository.updateProgress(job.id, 40, 'gmail_created', 'Gmail account created successfully');
      await AccountRepository.update(dbAccount.id, { status: 'active' });
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'gmail_created',
        message: `Gmail created: ${gmailAccount.email}`,
      });

      this.updateStatus({
        stage: 'gmail_created',
        progress: 40,
        message: 'Gmail account created successfully',
        jobId: job.id,
      });

      logger.info('Gmail account created', { email: gmailAccount.email });

      // Step 3: Create Instagram account
      await JobRepository.updateProgress(job.id, 50, 'instagram_creation', 'Creating Instagram account...');
      this.updateStatus({
        stage: 'instagram_creation',
        progress: 50,
        message: 'Creating Instagram account...',
        jobId: job.id,
      });

      instagramCreator = new EnhancedInstagramCreator({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await instagramCreator.initialize();

      const instagramAccount = await instagramCreator.createInstagramAccount({
        gmailAccount,
        profile,
      });

      await JobRepository.updateProgress(job.id, 70, 'instagram_created', 'Instagram account created successfully');
      await AccountRepository.update(dbAccount.id, { 
        username: instagramAccount.username,
        instagramId: instagramAccount.username,
      });
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'instagram_created',
        message: `Instagram created: @${instagramAccount.username}`,
      });

      this.updateStatus({
        stage: 'instagram_created',
        progress: 70,
        message: 'Instagram account created successfully',
        jobId: job.id,
      });

      logger.info('Instagram account created', {
        username: instagramAccount.username,
      });

      // Step 4: Setup Instagram profile
      await JobRepository.updateProgress(job.id, 80, 'profile_setup', 'Setting up Instagram profile...');
      this.updateStatus({
        stage: 'profile_setup',
        progress: 80,
        message: 'Setting up Instagram profile...',
        jobId: job.id,
      });

      await instagramCreator.setupProfile(instagramAccount, profile);
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'profile_setup',
        message: 'Profile setup completed',
      });

      logger.info('Instagram profile setup completed');

      // Step 5: Post initial content (if enabled)
      if (this.options.uploadImages) {
        await JobRepository.updateProgress(job.id, 90, 'content_posting', 'Posting initial content...');
        this.updateStatus({
          stage: 'content_posting',
          progress: 90,
          message: 'Posting initial content...',
          jobId: job.id,
        });

        await instagramCreator.postInitialContent(
          instagramAccount,
          this.options.initialPostCount
        );

        await ActivityRepository.create({
          accountId: dbAccount.id,
          jobId: job.id,
          type: 'content_posted',
          message: `Posted ${this.options.initialPostCount} images`,
        });

        logger.info('Initial content posted');
      }

      // Complete
      await JobRepository.complete(job.id, dbAccount.id);
      await AccountRepository.update(dbAccount.id, { 
        status: 'active',
        verified: true,
        lastActive: new Date(),
      });
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'job_complete',
        message: 'Account creation completed successfully',
      });

      // Mark proxy as successful
      if (this.options.proxyUrl) {
        ProxyRotator.markSuccess(this.options.proxyUrl);
      }

      const result = {
        success: true,
        accountId: dbAccount.id,
        gmailAccount,
        instagramAccount,
        profile,
        createdAt: new Date().toISOString(),
      };

      this.updateStatus({
        stage: 'completed',
        progress: 100,
        message: 'Workflow completed successfully',
        jobId: job.id,
        accountId: dbAccount.id,
      });

      logger.info('Full workflow completed successfully');

      return result;
    } catch (error) {
      logger.error('Workflow execution failed', { error: error.message });

      // Mark proxy as failed
      if (this.options.proxyUrl) {
        ProxyRotator.markFailure(this.options.proxyUrl);
      }

      if (job) {
        await JobRepository.fail(job.id, error.message);
      }
      if (dbAccount) {
        await AccountRepository.update(dbAccount.id, { status: 'failed' });
        await ActivityRepository.create({
          accountId: dbAccount.id,
          jobId: job?.id,
          type: 'job_error',
          message: `Error: ${error.message}`,
        });
      }

      this.updateStatus({
        stage: 'error',
        progress: 0,
        message: `Workflow failed: ${error.message}`,
        error: error.message,
        jobId: job?.id,
      });

      throw error;
    } finally {
      // Cleanup
      try {
        if (gmailBot) {
          await gmailBot.close();
        }
        if (instagramCreator) {
          await instagramCreator.close();
        }
      } catch (error) {
        logger.error('Error during cleanup', { error: error.message });
      }
    }
  }

  /**
   * Create only Gmail account
   * @param {Object} profile - User profile
   * @returns {Promise<Object>} Gmail account info
   */
  async createGmailOnly(profile = null) {
    logger.info('Creating Gmail account only');

    let gmailBot = null;

    try {
      // Generate profile if not provided
      if (!profile) {
        this.updateStatus({
          stage: 'profile_generation',
          progress: 10,
          message: 'Generating profile...',
        });

        profile = this.options.useAiProfile
          ? await this.deepseek.generateProfileInfo()
          : this.deepseek.generateBasicProfile();
      }

      // Create Gmail account
      this.updateStatus({
        stage: 'gmail_creation',
        progress: 30,
        message: 'Creating Gmail account...',
      });

      gmailBot = new EnhancedGmailBot({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await gmailBot.initialize();

      const gmailAccount = await gmailBot.createGmailAccount(profile);

      this.updateStatus({
        stage: 'completed',
        progress: 100,
        message: 'Gmail account created successfully',
      });

      // Save account info
      if (this.options.saveAccounts) {
        await this.saveAccountInfo('gmail', gmailAccount);
      }

      logger.info('Gmail account created successfully', {
        email: gmailAccount.email,
      });

      return gmailAccount;
    } catch (error) {
      logger.error('Gmail creation failed', { error: error.message });
      this.updateStatus({
        stage: 'error',
        message: `Gmail creation failed: ${error.message}`,
      });
      throw error;
    } finally {
      if (gmailBot) {
        await gmailBot.close();
      }
    }
  }

  /**
   * Create only Instagram account
   * @param {Object} gmailAccount - Gmail account info
   * @param {Object} profile - User profile
   * @returns {Promise<Object>} Instagram account info
   */
  async createInstagramOnly(gmailAccount, profile) {
    logger.info('Creating Instagram account only');

    let instagramCreator = null;

    try {
      this.updateStatus({
        stage: 'instagram_creation',
        progress: 30,
        message: 'Creating Instagram account...',
      });

      instagramCreator = new EnhancedInstagramCreator({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await instagramCreator.initialize();

      const instagramAccount = await instagramCreator.createInstagramAccount({
        gmailAccount,
        profile,
      });

      this.updateStatus({
        stage: 'completed',
        progress: 100,
        message: 'Instagram account created successfully',
      });

      // Save account info
      if (this.options.saveAccounts) {
        await this.saveAccountInfo('instagram', instagramAccount);
      }

      logger.info('Instagram account created successfully', {
        username: instagramAccount.username,
      });

      return instagramAccount;
    } catch (error) {
      logger.error('Instagram creation failed', { error: error.message });
      this.updateStatus({
        stage: 'error',
        message: `Instagram creation failed: ${error.message}`,
      });
      throw error;
    } finally {
      if (instagramCreator) {
        await instagramCreator.close();
      }
    }
  }

  /**
   * Save account information to file
   * @param {string} type - Account type
   * @param {Object} data - Account data
   */
  async saveAccountInfo(type, data) {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const filename = `${type}-${timestamp}.json`;
      const filepath = path.join(this.accountsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      logger.info('Account info saved', { filepath });
    } catch (error) {
      logger.error('Failed to save account info', { error: error.message });
    }
  }

  /**
   * Get current status
   * @returns {Object} Current status
   */
  getStatus() {
    return this.currentStatus;
  }
}

export default WorkflowController;

