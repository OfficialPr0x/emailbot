#!/usr/bin/env node

import fetch from 'node-fetch';

/**
 * Example: Using the API to create accounts
 */

const API_URL = 'http://localhost:3000';

// Example 1: Create full account with streaming
async function createAccountWithStreaming() {
  console.log('🚀 Creating account with real-time updates...\n');

  const response = await fetch(`${API_URL}/api/create-account?stream=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      useAiProfile: true,
      headless: false,
      uploadImages: false,
    }),
  });

  // Process streaming response
  const reader = response.body;
  const decoder = new TextDecoder();

  reader.on('data', (chunk) => {
    const text = decoder.decode(chunk);
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));
        
        if (data.completed) {
          console.log('\n✅ Account created!');
          console.log('Gmail:', data.gmailAccount.email);
          console.log('Instagram:', data.instagramAccount.username);
        } else if (data.error) {
          console.error('\n❌ Error:', data.error);
        } else {
          console.log(`📊 ${data.stage}: ${data.message} (${data.progress}%)`);
        }
      }
    }
  });
}

// Example 2: Create Gmail only
async function createGmailOnly() {
  console.log('📧 Creating Gmail account...\n');

  const response = await fetch(`${API_URL}/api/create-gmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      useAiProfile: true,
      headless: false,
    }),
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Gmail created:', result.data.email);
  } else {
    console.error('❌ Error:', result.error);
  }
}

// Example 3: Create Instagram with existing Gmail
async function createInstagramWithGmail() {
  console.log('📸 Creating Instagram account...\n');

  const response = await fetch(`${API_URL}/api/create-instagram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gmailAccount: {
        email: 'your-email@gmail.com',
        password: 'your-password',
      },
      profile: {
        username: 'cooluser123',
        fullName: 'John Doe',
        bio: 'Living my best life ✨',
        birthDate: '1995-05-15',
      },
      headless: false,
    }),
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Instagram created:', result.data.username);
  } else {
    console.error('❌ Error:', result.error);
  }
}

// Example 4: Test proxy
async function testProxy() {
  console.log('🔍 Testing proxy...\n');

  const response = await fetch(`${API_URL}/api/test-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      proxyUrl: 'http://proxy-server:port',
      username: 'user',
      password: 'pass',
    }),
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Proxy working. IP:', result.ip);
  } else {
    console.error('❌ Proxy error:', result.error);
  }
}

// Run examples
const example = process.argv[2] || 'streaming';

switch (example) {
  case 'streaming':
    createAccountWithStreaming();
    break;
  case 'gmail':
    createGmailOnly();
    break;
  case 'instagram':
    createInstagramWithGmail();
    break;
  case 'proxy':
    testProxy();
    break;
  default:
    console.log('Usage: node api-client-example.js [streaming|gmail|instagram|proxy]');
}

