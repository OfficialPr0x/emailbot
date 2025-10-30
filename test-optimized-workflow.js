#!/usr/bin/env node

import 'dotenv/config';
import { EnhancedGmailBot } from './src/bots/EnhancedGmailBot.js';

/**
 * Test the OPTIMIZED unbreakable Gmail workflow
 * Expected: 2-3x faster, especially on dropdown selections
 */

async function testOptimizedWorkflow() {
  console.log('🚀 Testing OPTIMIZED Gmail Workflow\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('⚡ Optimizations Applied:');
  console.log('  ✅ Google custom dropdown handler (20-40x faster)');
  console.log('  ✅ Retry delays: 1000ms → 500ms');
  console.log('  ✅ Max retries: 5 → 3');
  console.log('  ✅ AI timeout: 30s → 10s');
  console.log('  ✅ Enhanced diagnostic logging');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const startTime = Date.now();
  
  const bot = new EnhancedGmailBot({
    headless: false,              // Watch it work
    maxRetriesPerStep: 3,         // Optimized (was 5)
    enableAI: true,               // AI with 10s timeout
    enableStateManagement: true,  // Save state
  });

  try {
    console.log('⚙️  Initializing bot...');
    await bot.initialize();
    console.log('✅ Bot initialized\n');

    const timestamp = Date.now();
    const profile = {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: `sarahjohnson${timestamp}@gmail.com`,
      password: 'SuperSecure123!@#',
      birthDate: '1998-03-22',
      gender: 'female',
    };

    console.log('📋 Profile:');
    console.log(`   Email: ${profile.email}`);
    console.log(`   Name: ${profile.firstName} ${profile.lastName}\n`);

    console.log('🎯 Starting OPTIMIZED workflow...\n');
    console.log('⏱️  Watch for:');
    console.log('   • Dropdowns selecting in 1-2s (not 40s!)');
    console.log('   • Faster retry cycles (500ms delays)');
    console.log('   • AI cache hits (0ms)');
    console.log('');

    const result = await bot.createGmailAccount(profile);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

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
    console.log('');
    console.log(`⏱️  Total Time: ${elapsed}s`);
    console.log('');
    console.log('📊 Performance Notes:');
    console.log('   Expected with optimizations: ~60-90s');
    console.log('   Before optimizations: ~120-180s');
    if (elapsed < 90) {
      console.log('   ✅ Performance target achieved!');
    } else if (elapsed < 120) {
      console.log('   ⚠️  Slower than target but within acceptable range');
    } else {
      console.log('   ❌ Slower than expected - check logs');
    }
    console.log('═══════════════════════════════════════════════════════');

    // Get retry statistics
    const stats = bot.retryManager.getStatistics();
    console.log('\n📊 Retry Statistics:');
    console.log(`   Total Attempts: ${stats.totalAttempts}`);
    console.log(`   Successful: ${stats.successfulAttempts}`);
    console.log(`   Failed: ${stats.failedAttempts}`);
    console.log(`   Success Rate: ${stats.successRate}`);
    
    if (Object.keys(stats.errorTypes).length > 0) {
      console.log('\n   Error Breakdown:');
      Object.entries(stats.errorTypes).forEach(([type, count]) => {
        console.log(`     ${type}: ${count}`);
      });
    }

  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.error('\n');
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ ❌ ❌  FAILED  ❌ ❌ ❌');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error(`Time before failure: ${elapsed}s`);
    console.error('');
    console.error('📁 Enhanced Diagnostics Available:');
    console.error('   • screenshots/{step}-failed.png - Visual state');
    console.error('   • screenshots/{step}-failed.html - HTML snapshot');
    console.error('   • logs/error.log - Detailed errors');
    console.error('   • accounts/states/ - Workflow state');
    console.error('═══════════════════════════════════════════════════════');
    console.error('');

    try {
      const stats = bot.retryManager.getStatistics();
      console.error('📊 Retry Statistics:');
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
      // Ignore
    }

    process.exit(1);
  } finally {
    console.log('\n🔒 Closing browser...');
    await bot.close();
    console.log('✅ Browser closed\n');
  }
}

// Run the optimized test
console.log('\n🎯 OPTIMIZED WORKFLOW TEST');
console.log('Expected improvements:');
console.log('  • 2-3x faster overall');
console.log('  • Dropdowns: 40s → 2s (20x faster)');
console.log('  • Retries: 31s → 7s total delay');
console.log('  • AI: 30s → 10s timeout\n');

testOptimizedWorkflow().catch(console.error);

