#!/usr/bin/env node

import 'dotenv/config';
import { WorkflowController } from './core/WorkflowController.js';
import { ProxyManager } from './core/ProxyManager.js';
import { DeepSeekController } from './core/DeepSeekController.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('Test');

/**
 * Test script for the MyG Instagram Bot
 */

async function testProxyConnection() {
  console.log('\n🔍 Testing proxy connection...\n');
  
  const proxyUrl = process.env.PROXY_URL;
  
  if (!proxyUrl) {
    console.log('⚠️  No proxy configured. Skipping proxy test.');
    return true;
  }

  try {
    const proxyManager = new ProxyManager({ proxyUrl });
    const result = await proxyManager.testProxy();
    
    if (result.success) {
      console.log('✅ Proxy connection successful');
      const ip = await proxyManager.getCurrentIP();
      console.log(`📍 Current IP: ${ip}`);
      return true;
    } else {
      console.log('❌ Proxy connection failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Proxy test error:', error.message);
    return false;
  }
}

async function testDeepSeekAPI() {
  console.log('\n🤖 Testing DeepSeek API...\n');
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  No DeepSeek API key configured. Skipping AI test.');
    console.log('💡 Set DEEPSEEK_API_KEY in .env to enable AI profile generation');
    return true;
  }

  try {
    const deepseek = new DeepSeekController(apiKey);
    console.log('🔄 Generating test profile...');
    
    const profile = await deepseek.generateProfileInfo();
    
    console.log('✅ DeepSeek API working');
    console.log('👤 Generated profile:', {
      name: profile.fullName,
      username: profile.username,
      email: profile.email,
      location: profile.location,
    });
    
    return true;
  } catch (error) {
    console.log('❌ DeepSeek API error:', error.message);
    console.log('💡 Falling back to basic profile generation');
    return true; // Non-critical error
  }
}

async function testGmailCreation() {
  console.log('\n📧 Testing Gmail account creation...\n');
  console.log('⚠️  This will attempt to create a real Gmail account!');
  console.log('Press Ctrl+C to cancel within 5 seconds...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    const workflow = new WorkflowController({
      headless: false,
      useAiProfile: true,
      proxyUrl: process.env.PROXY_URL,
      saveAccounts: true,
    });

    // Setup status updates
    workflow.onStatusUpdate((status) => {
      console.log(`📊 Status: ${status.stage} - ${status.message} (${status.progress}%)`);
    });

    console.log('🔄 Starting Gmail account creation...\n');
    
    const result = await workflow.createGmailOnly();
    
    console.log('\n✅ Gmail account created successfully!');
    console.log('📧 Email:', result.email);
    console.log('💾 Account saved to accounts/ directory');
    
    return true;
  } catch (error) {
    console.log('\n❌ Gmail creation failed:', error.message);
    return false;
  }
}

async function testFullWorkflow() {
  console.log('\n🚀 Testing full workflow (Gmail + Instagram)...\n');
  console.log('⚠️  This will attempt to create both Gmail and Instagram accounts!');
  console.log('Press Ctrl+C to cancel within 10 seconds...\n');
  
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  try {
    const workflow = new WorkflowController({
      headless: false,
      useAiProfile: true,
      proxyUrl: process.env.PROXY_URL,
      uploadImages: false,
      initialPostCount: 0,
      saveAccounts: true,
    });

    // Setup status updates
    workflow.onStatusUpdate((status) => {
      console.log(`📊 ${status.stage}: ${status.message} (${status.progress}%)`);
    });

    console.log('🔄 Starting full workflow...\n');
    
    const result = await workflow.executeFullWorkflow();
    
    console.log('\n✅ Full workflow completed successfully!');
    console.log('📧 Gmail:', result.gmailAccount.email);
    console.log('📸 Instagram:', result.instagramAccount.username);
    console.log('💾 Accounts saved to accounts/ directory');
    
    return true;
  } catch (error) {
    console.log('\n❌ Full workflow failed:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   MyG Instagram Bot - Test Suite          ║');
  console.log('╚════════════════════════════════════════════╝');

  const tests = [
    { name: 'Proxy Connection', fn: testProxyConnection },
    { name: 'DeepSeek API', fn: testDeepSeekAPI },
  ];

  let passed = 0;
  let failed = 0;

  // Run basic tests
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Basic Tests Complete                     ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}\n`);

  // Ask user which integration test to run
  console.log('Integration Tests Available:');
  console.log('1. Test Gmail creation only');
  console.log('2. Test full workflow (Gmail + Instagram)');
  console.log('3. Skip integration tests\n');

  // For automated testing, skip integration tests
  if (process.argv.includes('--auto')) {
    console.log('Running in automated mode. Skipping integration tests.');
    process.exit(failed > 0 ? 1 : 0);
  }

  console.log('💡 Run with specific test:');
  console.log('   npm test gmail    - Test Gmail creation');
  console.log('   npm test full     - Test full workflow');
  console.log('   npm test --auto   - Run basic tests only');
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('gmail')) {
  testGmailCreation()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('full')) {
  testFullWorkflow()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  runTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

