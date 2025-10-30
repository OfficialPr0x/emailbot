#!/usr/bin/env node

import 'dotenv/config';
import { EnhancedGmailBot } from './src/bots/EnhancedGmailBot.js';

/**
 * Test the new unbreakable Gmail workflow
 */

async function testUnbreakableGmail() {
  console.log('🚀 Testing Unbreakable Gmail Workflow\n');
  console.log('═══════════════════════════════════════════════════════');
  
  // Create bot instance
  const bot = new EnhancedGmailBot({
    headless: false,              // Set to true to hide browser
    maxRetriesPerStep: 5,         // Number of retries per step
    enableAI: true,               // Use AI for selector discovery
    enableStateManagement: true,  // Save workflow state
  });

  try {
    // Initialize the bot
    console.log('⚙️  Initializing bot...');
    await bot.initialize();
    console.log('✅ Bot initialized\n');

    // Create profile with unique email
    const timestamp = Date.now();
    const profile = {
      firstName: 'John',
      lastName: 'Smith',
      email: `johnsmith${timestamp}@gmail.com`,
      password: 'SecurePass123!@#',
      birthDate: '1995-06-15',
      gender: 'male',
    };

    console.log('📋 Profile Details:');
    console.log(`   Name: ${profile.firstName} ${profile.lastName}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Password: ${profile.password}`);
    console.log(`   Birth Date: ${profile.birthDate}`);
    console.log(`   Gender: ${profile.gender}`);
    console.log('');

    // Create the Gmail account
    console.log('🎯 Starting account creation...\n');
    const result = await bot.createGmailAccount(profile);

    // Success!
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 🎉 🎉  SUCCESS!  🎉 🎉 🎉');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Gmail account created successfully!');
    console.log('');
    console.log('📧 Account Details:');
    console.log(`   Email: ${result.email}`);
    console.log(`   Password: ${result.password}`);
    console.log(`   Name: ${result.firstName} ${result.lastName}`);
    console.log(`   Account ID: ${result.accountId}`);
    console.log(`   Created: ${result.createdAt}`);
    console.log('');
    console.log('📁 Check these locations:');
    console.log('   Screenshots: screenshots/');
    console.log('   Logs: logs/');
    console.log('   State: accounts/states/');
    console.log('═══════════════════════════════════════════════════════');

    // Get retry statistics
    const stats = bot.retryManager.getStatistics();
    console.log('\n📊 Retry Statistics:');
    console.log(`   Total Attempts: ${stats.totalAttempts}`);
    console.log(`   Successful: ${stats.successfulAttempts}`);
    console.log(`   Failed: ${stats.failedAttempts}`);
    console.log(`   Success Rate: ${stats.successRate}`);
    console.log('');

  } catch (error) {
    console.error('\n');
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ ❌ ❌  FAILED  ❌ ❌ ❌');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('');
    console.error('📁 Debug Information:');
    console.error('   Check screenshots/: For visual debugging');
    console.error('   Check logs/error.log: For detailed errors');
    console.error('   Check accounts/states/: For workflow state');
    console.error('═══════════════════════════════════════════════════════');
    console.error('');
    console.error('Stack:', error.stack);
    
    // Get retry statistics even on failure
    try {
      const stats = bot.retryManager.getStatistics();
      console.error('\n📊 Retry Statistics:');
      console.error(`   Total Attempts: ${stats.totalAttempts}`);
      console.error(`   Successful: ${stats.successfulAttempts}`);
      console.error(`   Failed: ${stats.failedAttempts}`);
      console.error(`   Success Rate: ${stats.successRate}`);
      if (Object.keys(stats.errorTypes).length > 0) {
        console.error('\n   Error Types:');
        Object.entries(stats.errorTypes).forEach(([type, count]) => {
          console.error(`     ${type}: ${count}`);
        });
      }
    } catch (statsError) {
      // Ignore stats error
    }

    process.exit(1);
  } finally {
    // Always close the browser
    console.log('\n🔒 Closing browser...');
    await bot.close();
    console.log('✅ Browser closed\n');
  }
}

// Run the test
testUnbreakableGmail().catch(console.error);

