#!/usr/bin/env node

import 'dotenv/config';
import { WorkflowController } from '../src/core/WorkflowController.js';

/**
 * Example: Create a complete account (Gmail + Instagram)
 */

async function main() {
  console.log('🚀 Creating complete account (Gmail + Instagram)...\n');

  const workflow = new WorkflowController({
    useAiProfile: true,        // Use AI to generate realistic profile
    headless: false,           // Show browser window (set to true for headless)
    proxyUrl: process.env.PROXY_URL,  // Optional proxy
    uploadImages: false,       // Skip image posting for now
    initialPostCount: 0,       // Number of initial posts
    saveAccounts: true,        // Save account info to files
  });

  // Setup real-time status updates
  workflow.onStatusUpdate((status) => {
    console.log(`📊 [${status.stage}] ${status.message} (${status.progress}%)`);
  });

  try {
    const result = await workflow.executeFullWorkflow();

    console.log('\n✅ Account created successfully!');
    console.log('\n📧 Gmail Account:');
    console.log(`   Email: ${result.gmailAccount.email}`);
    console.log(`   Password: ${result.gmailAccount.password}`);
    
    console.log('\n📸 Instagram Account:');
    console.log(`   Username: ${result.instagramAccount.username}`);
    console.log(`   Email: ${result.instagramAccount.email}`);
    
    console.log('\n👤 Profile Information:');
    console.log(`   Name: ${result.profile.fullName}`);
    console.log(`   Bio: ${result.profile.bio || 'N/A'}`);
    console.log(`   Location: ${result.profile.location || 'N/A'}`);
    
    console.log('\n💾 Account information saved to accounts/ directory');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

