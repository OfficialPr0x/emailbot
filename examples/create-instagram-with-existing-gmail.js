#!/usr/bin/env node

import 'dotenv/config';
import { WorkflowController } from '../src/core/WorkflowController.js';

/**
 * Example: Create Instagram account using existing Gmail
 */

async function main() {
  console.log('📸 Creating Instagram account with existing Gmail...\n');

  // Replace with your Gmail account credentials
  const gmailAccount = {
    email: 'your-email@gmail.com',
    password: 'your-password',
  };

  // Profile information for Instagram
  const profile = {
    username: 'cooluser123',
    fullName: 'John Doe',
    bio: 'Just living my best life ✨',
    birthDate: '1995-05-15',
    gender: 'male',
  };

  const workflow = new WorkflowController({
    headless: false,
    proxyUrl: process.env.PROXY_URL,
    saveAccounts: true,
  });

  workflow.onStatusUpdate((status) => {
    console.log(`📊 [${status.stage}] ${status.message} (${status.progress}%)`);
  });

  try {
    const result = await workflow.createInstagramOnly(gmailAccount, profile);

    console.log('\n✅ Instagram account created successfully!');
    console.log('\n📸 Account Details:');
    console.log(`   Username: ${result.username}`);
    console.log(`   Email: ${result.email}`);
    console.log(`   Created: ${result.createdAt}`);
    
    console.log('\n💾 Account saved to accounts/ directory');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

