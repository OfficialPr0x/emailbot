# Quick Start Guide

Get started with MyG Instagram Bot in 5 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies

```bash
npm run setup
```

This installs all required packages and Playwright browsers.

### 2. Configure (Optional)

Create a `.env` file in the project root:

```env
# Optional: Add your DeepSeek API key for AI-powered profiles
DEEPSEEK_API_KEY=your-api-key-here

# Optional: Add proxy for better success rates
PROXY_URL=http://your-proxy:port
```

If you skip this step, the bot will use basic profile generation (no AI needed).

### 3. Start Creating Accounts!

#### Option A: Using the API Server

Start the server:
```bash
npm start
```

Visit: http://localhost:3000/api/docs for full API documentation

Create an account via API:
```bash
curl -X POST http://localhost:3000/api/create-account \
  -H "Content-Type: application/json" \
  -d '{"useAiProfile": true, "headless": false}'
```

#### Option B: Using Example Scripts

Create a full account (Gmail + Instagram):
```bash
npm run example:full
```

Create Gmail only:
```bash
npm run example:gmail
```

## 📊 What Happens?

When you run the bot, it will:

1. ✅ Generate a realistic user profile (with AI if configured)
2. ✅ Create a Gmail account with human-like behavior
3. ✅ Verify the Gmail account
4. ✅ Create an Instagram account using the Gmail
5. ✅ Set up the Instagram profile with bio
6. ✅ Save account details to `accounts/` folder

## 🎯 Quick Examples

### Example 1: Create Full Account with Streaming Updates

```javascript
import { WorkflowController } from './src/core/WorkflowController.js';

const workflow = new WorkflowController({
  headless: false,  // Show browser
  useAiProfile: true,
});

// Get real-time updates
workflow.onStatusUpdate((status) => {
  console.log(`${status.stage}: ${status.message}`);
});

const result = await workflow.executeFullWorkflow();
console.log('Gmail:', result.gmailAccount.email);
console.log('Instagram:', result.instagramAccount.username);
```

### Example 2: Create Gmail Only

```javascript
const result = await workflow.createGmailOnly();
console.log('Email:', result.email);
console.log('Password:', result.password);
```

### Example 3: Use Existing Gmail for Instagram

```javascript
const gmailAccount = {
  email: 'existing@gmail.com',
  password: 'password123'
};

const profile = {
  username: 'cool_user_2024',
  fullName: 'John Doe',
  bio: 'Living my best life ✨'
};

const result = await workflow.createInstagramOnly(gmailAccount, profile);
console.log('Instagram:', result.username);
```

## 🔧 Common Options

```javascript
const workflow = new WorkflowController({
  // Use AI for profile generation (requires API key)
  useAiProfile: true,
  
  // Show/hide browser window
  headless: false,
  
  // Use a proxy (recommended)
  proxyUrl: 'http://proxy:port',
  
  // Upload initial posts (requires image generation)
  uploadImages: false,
  
  // Number of posts to upload
  initialPostCount: 3,
  
  // Save account info to files
  saveAccounts: true,
});
```

## 📝 Tips for Success

### ✅ DO:
- Use a residential proxy for better success rates
- Run in visible browser mode first to see what's happening
- Check the `accounts/` folder for saved account details
- Review `logs/` folder if something goes wrong
- Test with `npm test` before creating accounts

### ❌ DON'T:
- Create too many accounts too quickly (rate limiting!)
- Use the same proxy for multiple accounts
- Run in headless mode until you've tested successfully
- Share your account credentials

## 🐛 Troubleshooting

### Browser won't open?
```bash
npx playwright install chromium
```

### CAPTCHA detected?
- Use a better proxy (residential)
- Solve manually in visible browser mode
- Wait and retry later

### Form filling failed?
- Run in visible mode to see what's happening
- Check logs in `logs/` folder
- Increase delays in the code

### API key errors?
- Verify DEEPSEEK_API_KEY in .env
- Bot will fall back to basic profiles if AI fails

## 📁 Where to Find Things

- **Created accounts**: `accounts/` folder
- **Logs**: `logs/` folder  
- **Screenshots** (on errors): `screenshots/` folder
- **Examples**: `examples/` folder
- **Full documentation**: See README.md

## 🎉 Next Steps

1. Try creating your first account with `npm run example:full`
2. Check out the full API at http://localhost:3000/api/docs
3. Read SETUP.md for advanced configuration
4. Explore examples in the `examples/` folder

## ⚠️ Important Reminders

- **Educational purposes only**
- Violates Gmail/Instagram Terms of Service
- Use at your own risk
- Don't create accounts for spam/abuse
- Respect rate limits

## 🆘 Need Help?

- Check `logs/combined.log` for detailed logs
- Look at `screenshots/` folder for visual debugging
- Review SETUP.md for detailed configuration
- Check README.md for full documentation

---

Ready to go? Run `npm run example:full` and watch the magic happen! ✨

