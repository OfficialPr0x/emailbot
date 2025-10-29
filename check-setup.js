#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 Checking MyG Instagram Bot Setup...\n');

let allGood = true;

// Check 1: Node modules
console.log('📦 Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ✅ Backend dependencies installed');
} else {
  console.log('   ❌ Backend dependencies missing');
  console.log('   → Run: npm install');
  allGood = false;
}

if (fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'))) {
  console.log('   ✅ Frontend dependencies installed');
} else {
  console.log('   ❌ Frontend dependencies missing');
  console.log('   → Run: cd frontend && npm install');
  allGood = false;
}

// Check 2: Database
console.log('\n🗄️ Checking database...');
if (fs.existsSync(path.join(__dirname, 'prisma', 'dev.db'))) {
  console.log('   ✅ Database exists');
} else {
  console.log('   ❌ Database not initialized');
  console.log('   → Run: npx prisma migrate dev --name init');
  allGood = false;
}

// Check 3: Prisma Client
console.log('\n⚙️ Checking Prisma Client...');
if (fs.existsSync(path.join(__dirname, 'node_modules', '.prisma', 'client'))) {
  console.log('   ✅ Prisma Client generated');
} else {
  console.log('   ❌ Prisma Client not generated');
  console.log('   → Run: npx prisma generate');
  allGood = false;
}

// Check 4: Environment
console.log('\n🌍 Checking environment...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('   ✅ .env file exists');
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  if (envContent.includes('DEEPSEEK_API_KEY') && !envContent.includes('your_key_here')) {
    console.log('   ✅ DEEPSEEK_API_KEY configured');
  } else {
    console.log('   ⚠️  DEEPSEEK_API_KEY not configured (optional for testing)');
  }
} else {
  console.log('   ⚠️  .env file missing (optional)');
  console.log('   → Run: cp .env.example .env');
}

// Check 5: Directories
console.log('\n📁 Checking directories...');
const requiredDirs = ['logs', 'accounts', 'screenshots'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✅ Created ${dir}/ directory`);
  } else {
    console.log(`   ✅ ${dir}/ directory exists`);
  }
});

// Final status
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ All checks passed! You\'re ready to go!');
  console.log('\n🚀 Start the bot:');
  console.log('   npm run dev:all');
  console.log('\n📱 Then open:');
  console.log('   http://localhost:5173');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('\n💡 Quick fix:');
  console.log('   npm run setup');
  console.log('   npm run setup:db');
}
console.log('='.repeat(50) + '\n');

process.exit(allGood ? 0 : 1);

