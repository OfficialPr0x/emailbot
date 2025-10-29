# MyG Instagram Bot - Setup Guide

This guide will help you set up and run the MyG Instagram Bot on your system.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **DeepSeek API Key** (optional, for AI-powered profile generation) - [Get one here](https://platform.deepseek.com/)

## Installation Steps

### 1. Clone or Download the Project

```bash
cd emailbot
```

### 2. Install Dependencies

Run the automated setup:

```bash
npm run setup
```

Or manually:

```bash
npm install
npx playwright install chromium
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# DeepSeek API Configuration (Optional but recommended)
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Proxy Configuration (Optional)
PROXY_URL=
PROXY_USERNAME=
PROXY_PASSWORD=

# Browser Configuration
HEADLESS=false
BROWSER_TYPE=chromium

# Server Configuration
PORT=3000
HOST=localhost

# Logging
LOG_LEVEL=info
```

### 4. Test Your Setup

Run the basic tests:

```bash
npm test
```

This will test:
- ✅ Proxy connection (if configured)
- ✅ DeepSeek API (if configured)

## Usage

### Option 1: Using the API Server

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`

**API Endpoints:**

- `GET /health` - Health check
- `GET /api/docs` - API documentation
- `POST /api/test-proxy` - Test proxy connection
- `POST /api/create-account` - Create full account (Gmail + Instagram)
- `POST /api/create-gmail` - Create Gmail only
- `POST /api/create-instagram` - Create Instagram only

**Example API Request:**

```bash
curl -X POST http://localhost:3000/api/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "useAiProfile": true,
    "headless": false,
    "uploadImages": false
  }'
```

### Option 2: Using Example Scripts

#### Create Full Account (Gmail + Instagram):

```bash
npm run example:full
```

#### Create Gmail Only:

```bash
npm run example:gmail
```

#### Create Instagram with Existing Gmail:

Edit `examples/create-instagram-with-existing-gmail.js` with your Gmail credentials, then:

```bash
npm run example:instagram
```

### Option 3: Direct Integration

```javascript
import { WorkflowController } from './src/core/WorkflowController.js';

const workflow = new WorkflowController({
  useAiProfile: true,
  headless: false,
  proxyUrl: null,
});

// Create full account
const result = await workflow.executeFullWorkflow();
console.log('Gmail:', result.gmailAccount.email);
console.log('Instagram:', result.instagramAccount.username);
```

## Configuration Options

### Workflow Options

```javascript
{
  useAiProfile: true,        // Use AI for realistic profile generation
  headless: false,           // Run browser in headless mode
  proxyUrl: null,            // Proxy URL (optional)
  uploadImages: false,       // Upload initial posts
  initialPostCount: 3,       // Number of posts to upload
  saveAccounts: true,        // Save account info to files
}
```

### Proxy Configuration

Supported proxy formats:
- HTTP: `http://host:port`
- HTTPS: `https://host:port`
- SOCKS4: `socks4://host:port`
- SOCKS5: `socks5://host:port`

With authentication:
- `http://username:password@host:port`

### Browser Options

- **Headless Mode**: Set `headless: true` to run browser without GUI
- **Viewport**: Customize viewport size in `BrowserManager`
- **User Agent**: Automatically rotates user agents

## Testing

### Run Basic Tests:

```bash
npm test
```

### Test Gmail Creation:

```bash
npm run test:gmail
```

⚠️ This will create a real Gmail account!

### Test Full Workflow:

```bash
npm run test:full
```

⚠️ This will create both Gmail and Instagram accounts!

## Troubleshooting

### Issue: Browser not launching

**Solution:** Install Playwright browsers manually:

```bash
npx playwright install chromium
```

### Issue: DeepSeek API errors

**Solutions:**
- Check your API key in `.env`
- Verify API key has credits
- Bot will fall back to basic profile generation if API fails

### Issue: Proxy connection failed

**Solutions:**
- Verify proxy URL format
- Test proxy independently
- Check proxy credentials
- Try without proxy first

### Issue: CAPTCHA detected

**Solutions:**
- Use a premium proxy
- Run in non-headless mode and solve manually
- Add CAPTCHA solving service (2captcha, anti-captcha)
- Wait and retry - Google's CAPTCHA rate-limits

### Issue: Form filling failures

The bot uses multiple fallback strategies. If all fail:
- Check if website structure changed
- Update selectors in form filler
- Increase delays between actions
- Run in non-headless mode to debug

### Issue: Email verification timeout

**Solutions:**
- Check Gmail credentials are correct
- Ensure IMAP is enabled for the account
- Increase `maxWaitTime` in OTP retrieval
- Check spam folder

## Project Structure

```
emailbot/
├── src/
│   ├── api/
│   │   └── server.js           # API server
│   ├── bots/
│   │   ├── EnhancedGmailBot.js        # Gmail automation
│   │   └── EnhancedInstagramCreator.js # Instagram automation
│   ├── core/
│   │   ├── BrowserManager.js          # Browser automation
│   │   ├── FormFiller.js              # Form filling strategies
│   │   ├── DeepSeekController.js      # AI profile generation
│   │   ├── OTPRetriever.js            # Email verification
│   │   ├── ProxyManager.js            # Proxy management
│   │   └── WorkflowController.js      # Main orchestrator
│   ├── utils/
│   │   ├── logger.js           # Logging utilities
│   │   └── helpers.js          # Helper functions
│   └── index.js                # Entry point
├── examples/                   # Example usage scripts
├── accounts/                   # Saved account information
├── logs/                       # Application logs
├── screenshots/                # Debug screenshots
├── package.json
├── .env                        # Configuration
└── README.md
```

## Logs and Debugging

Logs are stored in the `logs/` directory:
- `combined.log` - All log levels
- `error.log` - Error logs only
- `info.log` - Info and above

Set log level in `.env`:
```env
LOG_LEVEL=debug  # Options: error, warn, info, debug
```

## Saved Accounts

Created accounts are automatically saved to `accounts/` directory with timestamps:
- `gmail-YYYY-MM-DDTHH-mm-ss.json`
- `instagram-YYYY-MM-DDTHH-mm-ss.json`
- `complete-YYYY-MM-DDTHH-mm-ss.json`

## Security Recommendations

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong proxies** - Residential proxies work best
3. **Rotate proxies** - Don't use the same proxy for multiple accounts
4. **Rate limiting** - Don't create too many accounts too quickly
5. **Account storage** - Encrypt saved account files if storing long-term
6. **API security** - Add authentication if exposing API publicly

## Performance Tips

1. **Use proxies** - Reduces chance of rate limiting
2. **Run headless** - Faster execution (set `headless: true`)
3. **Disable images** - Faster page loads (optional browser flag)
4. **Parallel execution** - Run multiple instances with different proxies
5. **Use AI profiles** - More realistic accounts less likely to be flagged

## Legal Disclaimer

This tool is for **educational purposes only**. 

⚠️ **Important:**
- Creating fake accounts violates Gmail and Instagram Terms of Service
- Automated account creation may be illegal in your jurisdiction
- Use of this tool is at your own risk
- The authors are not responsible for any misuse

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section above
2. Review logs in `logs/` directory
3. Check screenshots in `screenshots/` directory for visual debugging

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Run basic tests: `npm test`
3. ✅ Try example scripts in `examples/` directory
4. ✅ Review API documentation: `http://localhost:3000/api/docs`
5. ✅ Start creating accounts!

Happy automating! 🚀

