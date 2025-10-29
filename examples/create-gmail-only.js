#!/usr/bin/env node

import 'dotenv/config';
import { WorkflowController } from '../src/core/WorkflowController.js';

/**
 * Example: Create Gmail account only
 */

async function main() {
  console.log('📧 Creating Gmail account only...\n');

  const workflow = new WorkflowController({
    useAiProfile: true,
    headless: false,
    proxyUrl: process.env.PROXY_URL,
    saveAccounts: true,
  });

  // Setup status updates
  workflow.onStatusUpdate((status) => {
    console.log(`📊 [${status.stage}] ${status.message} (${status.progress}%)`);
  });

  try {
    const result = await workflow.createGmailOnly();

    console.log('\n✅ Gmail account created successfully!');
    console.log('\n📧 Account Details:');
    console.log(`   Email: ${result.email}`);
    console.log(`   Password: ${result.password}`);
    console.log(`   Name: ${result.firstName} ${result.lastName}`);
    console.log(`   Created: ${result.createdAt}`);
    
    console.log('\n💾 Account saved to accounts/ directory');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

