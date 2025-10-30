# Environment Configuration

## Required .env File Setup

Create a `.env` file in the root directory with the following configuration:

```env
# OpenRouter AI Configuration (replaces DeepSeek)
OPENROUTER_API_KEY=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
OPENROUTER_PRIMARY_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_FALLBACK_MODEL=openai/gpt-4o

# Retry Configuration
MAX_RETRIES_PER_STEP=5
EXPONENTIAL_BACKOFF_ENABLED=true
AI_SELECTOR_DISCOVERY_ENABLED=true
STATE_PERSISTENCE_ENABLED=true
MANUAL_INTERVENTION_ENABLED=true

# Enhanced Logging
LOG_LEVEL=debug
SCREENSHOT_ON_ERROR=true
SCREENSHOT_ON_SUCCESS=true

# Database
DATABASE_URL="file:./prisma/dev.db"

# Server Configuration
PORT=3000
NODE_ENV=development

# Proxy Configuration (optional)
# PROXY_URL=
# PROXY_ENABLED=false
```

## Configuration Details

### OpenRouter AI
- **OPENROUTER_API_KEY**: Your OpenRouter API key for AI-powered form analysis
- **OPENROUTER_PRIMARY_MODEL**: Primary AI model (anthropic/claude-3.5-sonnet recommended)
- **OPENROUTER_FALLBACK_MODEL**: Fallback model if primary fails (openai/gpt-4o recommended)

### Retry System
- **MAX_RETRIES_PER_STEP**: Number of retry attempts per operation (default: 5)
- **EXPONENTIAL_BACKOFF_ENABLED**: Enable exponential backoff retry strategy
- **AI_SELECTOR_DISCOVERY_ENABLED**: Enable AI-powered selector discovery as fallback
- **STATE_PERSISTENCE_ENABLED**: Save workflow state for recovery
- **MANUAL_INTERVENTION_ENABLED**: Allow pausing for manual intervention

### Logging
- **LOG_LEVEL**: Logging level (debug, info, warn, error)
- **SCREENSHOT_ON_ERROR**: Take screenshots when errors occur
- **SCREENSHOT_ON_SUCCESS**: Take screenshots on successful steps

## Setup Instructions

1. Copy the configuration above into a new `.env` file
2. The OpenRouter API key is already included
3. Adjust retry and logging settings as needed
4. Run `npm install` to install the new `openai` dependency

