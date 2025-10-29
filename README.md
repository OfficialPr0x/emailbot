# MyG Instagram Bot - Complete Full-Stack System

A **professional, production-ready** automation system with a **SEXY AS FUCK React dashboard** for creating and managing Instagram accounts.

> ✅ **PRODUCTION READY** - NO MOCK DATA! Everything uses real database, real API calls, and real-time WebSocket updates!

## 🎨 What's New: GORGEOUS DASHBOARD!

We've added a **stunning, Instagram-inspired React frontend** that makes managing your bot accounts a breeze:

- 🎯 **Real-Time Dashboard**: Live stats, charts, and activity monitoring
- 👥 **Complete CRM**: Manage all accounts with search, filters, and actions  
- 📊 **Beautiful Analytics**: Charts showing performance and trends
- ⚡ **Account Creation Wizard**: Step-by-step guided creation
- 🔴 **Live Monitoring**: Watch accounts being created in real-time
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Fully Responsive**: Works perfectly on all devices

## ✅ Production-Ready Features

### Real Data Architecture
- ✅ **SQLite Database** - No mock data, all real
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **Real API** - All endpoints connected to DB
- ✅ **WebSocket** - Real-time updates everywhere
- ✅ **Job Tracking** - Monitor progress in DB
- ✅ **Activity Logging** - Every event tracked
- ✅ **Stats Calculation** - Real-time from database

### Backend (Bot System)
- **AI-Powered Profile Generation**: Uses DeepSeek AI to generate realistic user profiles
- **Enhanced Browser Automation**: Advanced stealth techniques to avoid detection
- **Multi-Strategy Form Filling**: Multiple fallback strategies for reliable form filling
- **Gmail Account Creation**: Automated Gmail account creation with verification
- **Instagram Account Setup**: Complete Instagram account creation using Gmail
- **Human Behavior Simulation**: Realistic mouse movements, typing patterns, and navigation
- **Proxy Support**: Full proxy support for IP rotation
- **Error Recovery**: Intelligent error handling and retry mechanisms
- **Progress Tracking**: Real-time status updates and progress monitoring

### Frontend (Dashboard)
- **Modern UI**: Instagram-inspired design with beautiful gradients
- **Real-Time Updates**: WebSocket integration for live monitoring
- **Account Management**: Complete CRM for managing all accounts
- **Analytics**: Charts and insights dashboard
- **Live Monitor**: Watch account creation in real-time
- **Settings Panel**: Configure all bot options
- **Notifications**: Toast notifications for important events

## Quick Start (Complete System)

### 1. Install Everything
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install Playwright browsers
npx playwright install chromium
```

### 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma migrate dev --name init
```

### 3. Configure (Optional)
```bash
# Edit .env with your settings
DEEPSEEK_API_KEY=your_key_here
PROXY_URL=
```

### 4. Start Everything
```bash
# Start both backend and frontend
npm run dev:all
```

### 5. Open Dashboard
Visit: **http://localhost:5173**

**That's it!** Your dashboard is ready! 🎉

## Configuration

Edit `.env` file with your settings:

- `DEEPSEEK_API_KEY`: Your DeepSeek API key for AI profile generation
- `PROXY_URL`: Optional proxy URL (format: http://host:port or socks5://host:port)
- `HEADLESS`: Set to `true` for headless browser mode
- `PORT`: API server port (default: 3000)

## Usage

### Option 1: Use the Dashboard (Recommended)

1. Start everything: `npm run dev:all`
2. Open http://localhost:5173
3. Click "Create Account" and follow the wizard
4. Watch your accounts appear in real-time!

### Option 2: Use the API

Start the server:
```bash
npm start
```

API Endpoints:

#### Create Full Account (Gmail + Instagram)
```bash
POST /api/create-account
Content-Type: application/json

{
  "useAiProfile": true,
  "headless": false,
  "proxyUrl": "http://proxy:port",
  "uploadImages": true,
  "initialPostCount": 9
}
```

#### Create Gmail Account Only
```bash
POST /api/create-gmail
Content-Type: application/json

{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1995-05-15",
    "gender": "male"
  },
  "headless": false
}
```

#### Create Instagram Account
```bash
POST /api/create-instagram
Content-Type: application/json

{
  "gmailAccount": {
    "email": "example@gmail.com",
    "password": "password123"
  },
  "profile": {
    "username": "johndoe95",
    "fullName": "John Doe"
  }
}
```

## Architecture

### Core Components:

1. **BrowserManager** - Enhanced browser automation with stealth techniques
2. **FormFiller** - Multi-strategy form filling with AI-powered analysis
3. **DeepSeekController** - AI profile generation using DeepSeek
4. **EnhancedGmailBot** - Gmail account creation with human-like behavior
5. **EnhancedInstagramCreator** - Instagram account setup and content posting
6. **WorkflowController** - Orchestrates the complete workflow
7. **ProxyManager** - Proxy configuration and testing
8. **OTPRetriever** - Email verification and OTP extraction

### Workflow:

1. Generate realistic profile using AI
2. Create Gmail account with multi-stage navigation
3. Verify Gmail account via email
4. Create Instagram account using Gmail
5. Set up Instagram profile
6. Post initial content (optional)

## Error Handling

The system includes comprehensive error handling:

- Automatic retries with exponential backoff
- Context-aware error recovery
- Detailed logging and debugging information
- Graceful fallback strategies

## Security Considerations

- Uses stealth browser configurations
- Implements human-like behavior patterns
- Supports proxy rotation
- Randomized delays and actions
- CAPTCHA detection and handling

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All log levels
- `error.log` - Error logs only
- `info.log` - Info and above

## Disclaimer

This tool is for educational purposes only. Use responsibly and in accordance with Gmail and Instagram's Terms of Service. The authors are not responsible for any misuse of this software.

## License

MIT License - See LICENSE file for details

