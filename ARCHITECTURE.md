# MyG Instagram Bot - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │ REST API │  │ Examples │  │ Direct Integration       │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│              Workflow Controller Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  WorkflowController                                    │ │
│  │  - Orchestrates complete workflow                     │ │
│  │  - Manages state and status updates                   │ │
│  │  - Handles error recovery                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                 Bot Layer                                   │
│  ┌──────────────────┐         ┌────────────────────────┐   │
│  │ EnhancedGmailBot │         │ EnhancedInstagramCreator│  │
│  │ - Multi-stage nav│         │ - Account creation      │  │
│  │ - Form filling   │         │ - Profile setup         │  │
│  │ - Verification   │         │ - Content posting       │  │
│  └──────────────────┘         └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                 Core Services Layer                         │
│  ┌────────────┐ ┌──────────┐ ┌────────────┐ ┌───────────┐ │
│  │ Browser    │ │ Form     │ │ DeepSeek   │ │ OTP       │ │
│  │ Manager    │ │ Filler   │ │ Controller │ │ Retriever │ │
│  └────────────┘ └──────────┘ └────────────┘ └───────────┘ │
│  ┌────────────┐ ┌──────────┐                               │
│  │ Proxy      │ │ Logger   │                               │
│  │ Manager    │ │          │                               │
│  └────────────┘ └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  ┌──────┐  ┌──────────┐  ┌─────────┐  ┌────────────────┐  │
│  │Gmail │  │Instagram │  │DeepSeek │  │ Proxy Services │  │
│  │      │  │          │  │   API   │  │                │  │
│  └──────┘  └──────────┘  └─────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### 1. Client Layer

#### REST API Server
- **File**: `src/api/server.js`
- **Purpose**: Provides HTTP endpoints for account creation
- **Features**:
  - Server-Sent Events (SSE) for real-time updates
  - Proxy testing endpoint
  - Full account creation endpoint
  - Separate Gmail/Instagram creation
  - API documentation endpoint

#### Example Scripts
- **Location**: `examples/`
- **Purpose**: Ready-to-use scripts demonstrating usage
- **Includes**:
  - Full account creation
  - Gmail-only creation
  - Instagram-only creation
  - API client examples

#### Direct Integration
- Import and use components directly in your code
- Full control over workflow and options

### 2. Workflow Controller Layer

#### WorkflowController
- **File**: `src/core/WorkflowController.js`
- **Responsibilities**:
  - Orchestrates the complete workflow
  - Manages progress tracking
  - Provides status callbacks
  - Handles errors and retries
  - Saves account information

**Workflow Stages**:
1. Profile Generation (10%)
2. Gmail Creation (20-40%)
3. Gmail Verification (40%)
4. Instagram Creation (50-70%)
5. Profile Setup (80%)
6. Content Posting (90%)
7. Complete (100%)

### 3. Bot Layer

#### EnhancedGmailBot
- **File**: `src/bots/EnhancedGmailBot.js`
- **Features**:
  - Multi-stage navigation (Google → Sign in → Create account)
  - Human-like behavior simulation
  - Intelligent form filling
  - CAPTCHA detection
  - Account verification

**Process Flow**:
```
Start → Navigate to Google → Click Sign In → Click Create Account
  → Select "For Myself" → Fill Basic Info → Fill Additional Details
  → Accept Terms → Handle CAPTCHA → Verify Creation → Complete
```

#### EnhancedInstagramCreator
- **File**: `src/bots/EnhancedInstagramCreator.js`
- **Features**:
  - Instagram signup automation
  - Email/phone verification handling
  - Profile customization
  - Bio updates
  - Content posting (extensible)

**Process Flow**:
```
Start → Navigate to Instagram → Fill Signup Form → Handle Birthday
  → Email Verification (OTP) → Verify Creation → Setup Profile
  → Post Content (optional) → Complete
```

### 4. Core Services Layer

#### BrowserManager
- **File**: `src/core/BrowserManager.js`
- **Purpose**: Enhanced browser automation with stealth
- **Features**:
  - Playwright integration
  - Stealth mode (bypass detection)
  - Random user agents
  - Human-like mouse movements
  - Realistic typing patterns
  - Scroll simulation
  - Proxy support
  - State persistence

**Stealth Techniques**:
- Overrides `navigator.webdriver`
- Mocks plugins and permissions
- Realistic viewport and device settings
- Random timing and delays

#### FormFiller
- **File**: `src/core/FormFiller.js`
- **Purpose**: Reliable form filling with multiple strategies
- **Strategies** (in order of attempt):
  1. Human-like typing with delays
  2. Focus + keyboard typing
  3. Scroll + click + type
  4. Direct DOM manipulation
  5. Find by label and fill

**Features**:
- Automatic retries
- Value verification
- Intelligent field detection
- Dropdown handling
- Click simulation

#### DeepSeekController
- **File**: `src/core/DeepSeekController.js`
- **Purpose**: AI-powered profile generation
- **Generates**:
  - Realistic names
  - Creative usernames
  - Birth dates
  - Bios and interests
  - Locations and occupations
  - Post captions

**Fallback**: Basic profile generation if API unavailable

#### OTPRetriever
- **File**: `src/core/OTPRetriever.js`
- **Purpose**: Email verification and OTP extraction
- **Features**:
  - IMAP connection to Gmail
  - Email monitoring
  - OTP code extraction
  - Verification link retrieval
  - Retry logic with timeouts

**Methods**:
- IMAP-based retrieval (primary)
- Gmail web interface (fallback)

#### ProxyManager
- **File**: `src/core/ProxyManager.js`
- **Purpose**: Proxy configuration and testing
- **Supports**:
  - HTTP/HTTPS proxies
  - SOCKS4/SOCKS5 proxies
  - Authenticated proxies
  - Proxy testing
  - IP address retrieval

#### Logger
- **File**: `src/utils/logger.js`
- **Purpose**: Centralized logging
- **Features**:
  - Multiple log levels (error, warn, info, debug)
  - File rotation
  - Console output (development)
  - Context-aware logging
  - Structured logging (JSON)

### 5. External Services

#### Gmail
- Target: Account creation and email access
- Challenges: CAPTCHA, phone verification, rate limiting

#### Instagram
- Target: Account creation and profile setup
- Challenges: Email verification, CAPTCHA, detection

#### DeepSeek API
- Purpose: AI-powered content generation
- Optional: Falls back to basic generation

#### Proxy Services
- Purpose: IP rotation and geo-spoofing
- Optional but recommended

## Data Flow

### Full Workflow Data Flow

```
1. Client Request
   ↓
2. WorkflowController.executeFullWorkflow()
   ↓
3. DeepSeek generates profile
   ↓
4. EnhancedGmailBot.createGmailAccount(profile)
   ├─→ BrowserManager.initialize()
   ├─→ FormFiller.fillField() × N
   ├─→ OTPRetriever.retrieveOTP() (if needed)
   └─→ Return gmailAccount
   ↓
5. EnhancedInstagramCreator.createInstagramAccount()
   ├─→ BrowserManager.initialize()
   ├─→ FormFiller.fillField() × N
   ├─→ OTPRetriever.retrieveOTP() (if verification)
   └─→ Return instagramAccount
   ↓
6. Profile setup and content posting
   ↓
7. Save account information
   ↓
8. Return complete result to client
```

## Error Handling Strategy

### Levels of Error Handling

1. **Strategy Level** (FormFiller)
   - Try multiple approaches
   - Fallback to simpler methods

2. **Retry Level** (Helpers)
   - Exponential backoff
   - Configurable retry counts

3. **Component Level** (Bots)
   - Catch and log errors
   - Take debug screenshots
   - Attempt recovery

4. **Workflow Level** (Controller)
   - Graceful degradation
   - Status updates
   - Resource cleanup

## Security Features

### Browser Security
- Stealth mode to avoid detection
- Random user agents
- Realistic timing and behavior
- Proxy support

### Data Security
- Account info saved locally (optional)
- Passwords stored in plain text (⚠️ secure your files!)
- No data sent to external services (except DeepSeek API)

### Network Security
- Proxy support for IP rotation
- HTTPS for API calls
- Timeout handling

## Performance Considerations

### Optimization Strategies

1. **Parallel Processing**
   - Can run multiple instances with different proxies
   - Each workflow is independent

2. **Resource Management**
   - Browser cleanup after each workflow
   - Connection pooling for IMAP

3. **Caching**
   - Browser state persistence
   - Cookie management

4. **Timeouts**
   - All operations have timeouts
   - Prevents hanging on failures

## Extensibility

### Adding New Features

#### Add a New Platform
1. Create `EnhancedXXXCreator.js` in `src/bots/`
2. Extend `WorkflowController` with new method
3. Add API endpoint in `src/api/server.js`

#### Add CAPTCHA Solving
1. Create `CaptchaSolver.js` in `src/core/`
2. Integrate with 2captcha, anti-captcha, etc.
3. Call from bots when CAPTCHA detected

#### Add Image Generation
1. Create `ImageGenerator.js` in `src/core/`
2. Integrate with DALL-E, Midjourney, etc.
3. Use in `postInitialContent()`

#### Add Phone Verification
1. Create `PhoneVerification.js` in `src/core/`
2. Integrate with SMS service
3. Use in verification flows

## Testing Strategy

### Unit Tests
- Individual component testing
- Mock external dependencies
- Test error handling

### Integration Tests
- `npm run test:gmail` - Test Gmail creation
- `npm run test:full` - Test complete workflow

### Manual Testing
- Run in visible browser mode
- Monitor logs in real-time
- Check screenshots on errors

## Deployment Options

### Option 1: Local Development
- Run on your machine
- Perfect for testing and small-scale use

### Option 2: VPS/Cloud Server
- Deploy to DigitalOcean, AWS, etc.
- Run 24/7
- Scale horizontally

### Option 3: Docker Container
- Create Dockerfile
- Consistent environment
- Easy deployment

### Option 4: Serverless
- AWS Lambda, Google Cloud Functions
- Pay per execution
- Auto-scaling

## Monitoring and Logging

### What to Monitor

1. **Success Rate**
   - Track successful vs failed creations
   - Identify failure patterns

2. **Performance Metrics**
   - Time per workflow stage
   - Resource usage

3. **Error Patterns**
   - Common failure points
   - CAPTCHA frequency

4. **Account Quality**
   - Verification success
   - Account longevity

### Log Analysis

- Use `logs/combined.log` for full history
- Filter by context for specific components
- Track error trends over time

## Best Practices

### Development
- ✅ Test in visible browser mode first
- ✅ Use realistic delays between actions
- ✅ Handle all error cases
- ✅ Log extensively for debugging
- ✅ Take screenshots on errors

### Production
- ✅ Use premium residential proxies
- ✅ Rotate proxies between accounts
- ✅ Implement rate limiting
- ✅ Monitor success rates
- ✅ Encrypt stored account data

### Maintenance
- ✅ Update selectors when sites change
- ✅ Monitor for new CAPTCHA types
- ✅ Keep dependencies updated
- ✅ Review logs regularly
- ✅ Test after major updates

## Future Enhancements

### Planned Features
- [ ] CAPTCHA solving integration
- [ ] Image generation for posts
- [ ] Phone verification service
- [ ] Account warm-up sequences
- [ ] Multi-platform support
- [ ] Advanced analytics dashboard
- [ ] Account management features
- [ ] Automated posting scheduler

### Community Contributions
- Fork and extend for your needs
- Add new platform integrations
- Improve detection evasion
- Enhance AI capabilities

---

For implementation details, see the source code documentation.
For usage instructions, see README.md and QUICKSTART.md.
For setup instructions, see SETUP.md.

