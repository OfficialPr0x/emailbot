import { EnhancedGmailBot } from '../bots/EnhancedGmailBot.js';
import { EnhancedInstagramCreator } from '../bots/EnhancedInstagramCreator.js';
import { OpenRouterController } from './OpenRouterController.js';
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

    this.aiController = new OpenRouterController(process.env.OPENROUTER_API_KEY);
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
   * Emit detailed progress update with action log
   * @param {Object} job - Job object
   * @param {number} progress - Progress percentage
   * @param {string} stage - Stage identifier
   * @param {string} message - Detailed message
   * @param {string} actionType - Type of action (info, success, warning, error)
   */
  async emitProgressUpdate(job, progress, stage, message, actionType = 'info') {
    if (job) {
      await JobRepository.updateProgress(job.id, progress, stage, message);
    }
    this.updateStatus({
      stage,
      progress,
      message,
      actionType,
      jobId: job?.id,
    });
    logger.info(`[${stage}] ${message}`, { progress });
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
      await this.emitProgressUpdate(job, 10, 'profile_generation', 'Starting profile generation...', 'info');
      await this.emitProgressUpdate(job, 12, 'profile_generation', 'Contacting AI service...', 'info');

      const profile = this.options.useAiProfile
        ? await this.aiController.generateProfileInfo()
        : this.aiController.generateBasicProfile();

      await this.emitProgressUpdate(job, 15, 'profile_generation', `Profile created for ${profile.fullName}`, 'success');
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
      await this.emitProgressUpdate(job, 20, 'gmail_creation', 'Initializing Gmail bot...', 'info');
      
      gmailBot = new EnhancedGmailBot({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await this.emitProgressUpdate(job, 22, 'gmail_creation', 'Launching browser instance...', 'info');
      await gmailBot.initialize();

      await this.emitProgressUpdate(job, 25, 'gmail_creation', 'Navigating to Gmail signup...', 'info');
      await this.emitProgressUpdate(job, 28, 'gmail_creation', 'Filling account details...', 'info');
      
      const gmailAccount = await gmailBot.createGmailAccount(profile);

      await this.emitProgressUpdate(job, 38, 'gmail_created', 'Gmail verification complete', 'success');
      await this.emitProgressUpdate(job, 40, 'gmail_created', `✓ Gmail created: ${gmailAccount.email}`, 'success');
      
      await AccountRepository.update(dbAccount.id, { status: 'active' });
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'gmail_created',
        message: `Gmail created: ${gmailAccount.email}`,
      });

      logger.info('Gmail account created', { email: gmailAccount.email });

      // Step 3: Create Instagram account
      await this.emitProgressUpdate(job, 45, 'instagram_creation', 'Preparing Instagram setup...', 'info');
      await this.emitProgressUpdate(job, 48, 'instagram_creation', 'Initializing Instagram bot...', 'info');

      instagramCreator = new EnhancedInstagramCreator({
        headless: this.options.headless,
        proxyUrl: this.options.proxyUrl,
      });

      await this.emitProgressUpdate(job, 50, 'instagram_creation', 'Launching browser for Instagram...', 'info');
      await instagramCreator.initialize();

      await this.emitProgressUpdate(job, 55, 'instagram_creation', 'Navigating to Instagram signup...', 'info');
      await this.emitProgressUpdate(job, 58, 'instagram_creation', 'Filling registration form...', 'info');
      
      const instagramAccount = await instagramCreator.createInstagramAccount({
        gmailAccount,
        profile,
      });

      await this.emitProgressUpdate(job, 68, 'instagram_profile', 'Setting up profile details...', 'info');
      await this.emitProgressUpdate(job, 70, 'instagram_profile', `✓ Instagram created: @${instagramAccount.username}`, 'success');
      
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

      logger.info('Instagram account created', {
        username: instagramAccount.username,
      });

      // Step 4: Setup Instagram profile
      await this.emitProgressUpdate(job, 75, 'instagram_profile', 'Configuring profile bio...', 'info');
      await this.emitProgressUpdate(job, 78, 'instagram_profile', 'Adding profile picture...', 'info');

      await instagramCreator.setupProfile(instagramAccount, profile);
      
      await this.emitProgressUpdate(job, 82, 'instagram_profile', '✓ Profile setup complete', 'success');
      await ActivityRepository.create({
        accountId: dbAccount.id,
        jobId: job.id,
        type: 'profile_setup',
        message: 'Profile setup completed',
      });

      logger.info('Instagram profile setup completed');

      // Step 5: Post initial content (if enabled)
      if (this.options.uploadImages) {
        await this.emitProgressUpdate(job, 85, 'content_posting', 'Preparing initial content...', 'info');
        await this.emitProgressUpdate(job, 88, 'content_posting', 'Uploading posts...', 'info');

        await instagramCreator.postInitialContent(
          instagramAccount,
          this.options.initialPostCount
        );

        await this.emitProgressUpdate(job, 92, 'content_posting', `✓ Posted ${this.options.initialPostCount} images`, 'success');
        await ActivityRepository.create({
          accountId: dbAccount.id,
          jobId: job.id,
          type: 'content_posted',
          message: `Posted ${this.options.initialPostCount} images`,
        });

        logger.info('Initial content posted');
      }

      // Complete
      await this.emitProgressUpdate(job, 95, 'completed', 'Finalizing account...', 'info');
      await this.emitProgressUpdate(job, 97, 'completed', 'Saving to database...', 'info');
      
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

      await this.emitProgressUpdate(job, 100, 'completed', '🎉 Account creation completed successfully!', 'success');

      logger.info('Full workflow completed successfully');

      return result;
    } catch (error) {
      logger.error('Workflow execution failed', { error: error.message });

      // Emit error update
      this.updateStatus({
        stage: 'error',
        progress: 0,
        message: `❌ Error: ${error.message}`,
        actionType: 'error',
        error: error.message,
        jobId: job?.id,
      });

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
          ? await this.aiController.generateProfileInfo()
          : this.aiController.generateBasicProfile();
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

