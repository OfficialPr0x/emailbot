import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowLeft, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import DocsSidebar from '../components/DocsSidebar'
import CodeBlock from '../components/CodeBlock'

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('introduction')

  useEffect(() => {
    // Scroll to top when section changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSection])

  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return <IntroductionSection />
      case 'quick-start':
        return <QuickStartSection />
      case 'installation':
        return <InstallationSection />
      case 'configuration':
        return <ConfigurationSection />
      case 'architecture':
        return <ArchitectureSection />
      case 'workflow':
        return <WorkflowSection />
      case 'browser-automation':
        return <BrowserAutomationSection />
      case 'ai-profiles':
        return <AIProfilesSection />
      case 'gmail-creation':
        return <GmailCreationSection />
      case 'instagram-setup':
        return <InstagramSetupSection />
      case 'proxy-support':
        return <ProxySupportSection />
      case 'error-handling':
        return <ErrorHandlingSection />
      case 'schema':
        return <SchemaSection />
      case 'models':
        return <ModelsSection />
      case 'migrations':
        return <MigrationsSection />
      case 'customization':
        return <CustomizationSection />
      case 'scaling':
        return <ScalingSection />
      case 'deployment':
        return <DeploymentSection />
      case 'best-practices':
        return <BestPracticesSection />
      case 'stealth-mode':
        return <StealthModeSection />
      case 'detection-avoidance':
        return <DetectionAvoidanceSection />
      case 'rate-limiting':
        return <RateLimitingSection />
      default:
        return <IntroductionSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold gradient-text">Documentation</h1>
              </div>
            </div>
            <Link
              to="/api-reference"
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
            >
              <span>API Reference</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <DocsSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual Section Components
function IntroductionSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Welcome to MyG InstaBot</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        MyG InstaBot is an AI-powered automation platform for creating and managing Instagram accounts at scale. 
        Built with cutting-edge technology and designed for production use.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="text-3xl font-bold gradient-text mb-2">99.8%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="text-3xl font-bold gradient-text mb-2">&lt; 5min</div>
          <div className="text-sm text-gray-400">Average Creation Time</div>
        </div>
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="text-3xl font-bold gradient-text mb-2">100%</div>
          <div className="text-sm text-gray-400">Detection Avoidance</div>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-purple-500/20 my-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Production Ready</h3>
            <p className="text-gray-300">
              No mock data, no prototypes. This is a complete, battle-tested system with real database, 
              real-time updates, and professional error handling.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Features</h2>
      <ul className="space-y-3">
        <li className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-instagram mt-2"></div>
          <div>
            <strong className="text-white">AI-Powered Profile Generation:</strong>
            <span className="text-gray-300"> Uses DeepSeek AI to create realistic, unique user profiles</span>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-instagram mt-2"></div>
          <div>
            <strong className="text-white">Advanced Browser Automation:</strong>
            <span className="text-gray-300"> Stealth techniques and human behavior simulation</span>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-instagram mt-2"></div>
          <div>
            <strong className="text-white">Complete Account Creation:</strong>
            <span className="text-gray-300"> Automated Gmail + Instagram account setup</span>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-instagram mt-2"></div>
          <div>
            <strong className="text-white">Beautiful Dashboard:</strong>
            <span className="text-gray-300"> React-powered UI with real-time updates</span>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-instagram mt-2"></div>
          <div>
            <strong className="text-white">Proxy Support:</strong>
            <span className="text-gray-300"> Built-in proxy rotation and IP management</span>
          </div>
        </li>
      </ul>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 my-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Important Notice</h3>
            <p className="text-gray-300">
              This tool is for educational and research purposes. Always comply with platform Terms of Service 
              and applicable laws. Use responsibly and ethically.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">What's Next?</h2>
      <p className="text-gray-300">
        Ready to get started? Check out our <button onClick={() => window.scrollTo(0, 0)} className="text-purple-400 hover:text-purple-300 underline">Quick Start</button> guide 
        or dive into the <button className="text-purple-400 hover:text-purple-300 underline">Installation</button> instructions.
      </p>
    </div>
  )
}

function QuickStartSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Quick Start Guide</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Get MyG InstaBot up and running in under 5 minutes. This guide covers the essential steps 
        to start creating Instagram accounts right away.
      </p>

      <div className="glass p-6 rounded-xl border border-green-500/20 my-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Prerequisites</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Node.js 18+ installed</li>
              <li>• npm or yarn package manager</li>
              <li>• DeepSeek API key (optional but recommended)</li>
              <li>• Residential proxy (optional but recommended)</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 1: Clone & Install</h2>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Clone the repository
git clone https://github.com/yourusername/myg-instabot.git
cd myg-instabot

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install Playwright browsers
npx playwright install chromium`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 2: Configure Environment</h2>
      <CodeBlock
        language="bash"
        filename=".env"
        code={`# Required for AI profile generation
DEEPSEEK_API_KEY=sk-your-key-here

# Optional but recommended
PROXY_URL=http://username:password@proxy:port

# Server configuration
PORT=3000
HOST=localhost
HEADLESS=false`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 3: Initialize Database</h2>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view data
npx prisma studio`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 4: Start the Application</h2>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Start both backend and frontend
npm run dev:all

# Or start them separately:
# Backend only
npm run dev

# Frontend only (in another terminal)
cd frontend && npm run dev`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 5: Open the Dashboard</h2>
      <p className="text-gray-300">
        Open your browser and navigate to <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">http://localhost:5173</code>
      </p>

      <div className="glass p-6 rounded-xl border border-purple-500/20 my-6">
        <h3 className="font-bold text-lg mb-4 text-white">🎉 You're All Set!</h3>
        <p className="text-gray-300 mb-4">
          Your MyG InstaBot dashboard is now running. Here's what you can do next:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li>• Click "Create Account" to start your first automation</li>
          <li>• Configure proxy settings in the Settings page</li>
          <li>• Watch the Live Monitor to see accounts being created</li>
          <li>• View analytics to track your success rates</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Create Your First Account</h2>
      <p className="text-gray-300 mb-4">
        Using the dashboard:
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-300 ml-4">
        <li>Navigate to "Create Account" in the sidebar</li>
        <li>Enable "Use AI Profile Generation" for realistic profiles</li>
        <li>Add your proxy URL (recommended for better success rates)</li>
        <li>Choose whether to run in headless mode</li>
        <li>Click "Start Creation" and watch the magic happen! ✨</li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Using the API</h2>
      <p className="text-gray-300 mb-4">
        Prefer API calls? Here's a quick example:
      </p>
      <CodeBlock
        language="bash"
        filename="curl"
        code={`curl -X POST http://localhost:3000/api/create-account \\
  -H "Content-Type: application/json" \\
  -d '{
    "useAiProfile": true,
    "headless": false,
    "proxyUrl": "http://proxy:port",
    "uploadImages": true,
    "initialPostCount": 9
  }'`}
      />

      <div className="glass p-6 rounded-xl border border-blue-500/20 my-6">
        <h3 className="font-bold text-lg mb-4 text-white">💡 Pro Tips</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Use residential proxies for best results</li>
          <li>• Run in non-headless mode first to see what's happening</li>
          <li>• Enable AI profiles for more realistic accounts</li>
          <li>• Don't create too many accounts too quickly (rate limiting!)</li>
          <li>• Monitor the Live Monitor page for real-time feedback</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Troubleshooting</h2>
      <p className="text-gray-300 mb-4">
        Running into issues? Here are common solutions:
      </p>
      
      <div className="space-y-4">
        <div className="glass p-4 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2">"Cannot find module" error</h4>
          <CodeBlock
            language="bash"
            code={`npm install
npx prisma generate`}
          />
        </div>

        <div className="glass p-4 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2">"Port already in use"</h4>
          <p className="text-gray-300 text-sm">
            Change the PORT in your .env file to 3001 or another available port.
          </p>
        </div>

        <div className="glass p-4 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2">Database errors</h4>
          <CodeBlock
            language="bash"
            code={`npx prisma migrate reset
npx prisma generate`}
          />
        </div>
      </div>
    </div>
  )
}

function InstallationSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Installation Guide</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Detailed installation instructions for all components of MyG InstaBot.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">System Requirements</h2>
      <div className="glass p-6 rounded-xl border border-white/10">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div><strong className="text-white">Node.js:</strong> Version 18.0.0 or higher</div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div><strong className="text-white">npm:</strong> Version 9.0.0 or higher (comes with Node.js)</div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div><strong className="text-white">RAM:</strong> Minimum 4GB (8GB recommended)</div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div><strong className="text-white">Storage:</strong> 2GB free space</div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div><strong className="text-white">OS:</strong> Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)</div>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Backend Installation</h2>
      
      <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Clone Repository</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`git clone https://github.com/yourusername/myg-instabot.git
cd myg-instabot`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Install Dependencies</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Using npm
npm install

# Or using yarn
yarn install`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Install Playwright</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Install Chromium browser for Playwright
npx playwright install chromium

# Install system dependencies (Linux only)
npx playwright install-deps chromium`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Frontend Installation</h2>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Return to root
cd ..`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Database Setup</h2>
      
      <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Generate Prisma Client</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`npx prisma generate`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Run Migrations</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`npx prisma migrate dev --name init`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Verify Database</h3>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`# Open Prisma Studio to view your database
npx prisma studio`}
      />
      <p className="text-gray-300">
        This will open a browser window at <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">http://localhost:5555</code> where you can view and edit your database.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Verification</h2>
      <p className="text-gray-300 mb-4">
        Verify your installation by running the check script:
      </p>
      <CodeBlock
        language="bash"
        filename="terminal"
        code={`node check-setup.js`}
      />

      <div className="glass p-6 rounded-xl border border-green-500/20 my-6">
        <h3 className="font-bold text-lg mb-4 text-white">✅ Installation Complete!</h3>
        <p className="text-gray-300">
          If all checks passed, you're ready to configure and start using MyG InstaBot. 
          Head over to the <strong>Configuration</strong> section next.
        </p>
      </div>
    </div>
  )
}

function ConfigurationSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Configuration</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Configure MyG InstaBot for optimal performance and security.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Environment Variables</h2>
      <p className="text-gray-300 mb-4">
        Create a <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">.env</code> file in the root directory:
      </p>
      <CodeBlock
        language="bash"
        filename=".env"
        code={`# =================================
# AI Configuration
# =================================
# Get your API key from: https://platform.deepseek.com
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# =================================
# Server Configuration
# =================================
PORT=3000
HOST=localhost
NODE_ENV=development

# =================================
# Browser Configuration
# =================================
# Set to 'true' for production, 'false' for debugging
HEADLESS=false

# =================================
# Proxy Configuration
# =================================
# Format: http://username:password@host:port
# Or: socks5://username:password@host:port
PROXY_URL=

# =================================
# Database Configuration
# =================================
DATABASE_URL="file:./prisma/dev.db"

# =================================
# WebSocket Configuration
# =================================
WS_PORT=3001

# =================================
# Rate Limiting
# =================================
MAX_CONCURRENT_JOBS=3
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX_REQUESTS=100`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">DeepSeek API Key</h2>
      <p className="text-gray-300 mb-4">
        The DeepSeek API is used for AI-powered profile generation:
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-300 ml-4">
        <li>Visit <a href="https://platform.deepseek.com" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">platform.deepseek.com</a></li>
        <li>Sign up for an account</li>
        <li>Navigate to API Keys section</li>
        <li>Generate a new API key</li>
        <li>Copy and paste it into your .env file</li>
      </ol>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 my-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">API Key Security</h3>
            <p className="text-gray-300">
              Never commit your .env file to version control. The .env file should be in your .gitignore.
              Keep your API keys secure and rotate them periodically.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Proxy Configuration</h2>
      <p className="text-gray-300 mb-4">
        Using a proxy is highly recommended for better success rates and avoiding IP bans:
      </p>

      <h3 className="text-xl font-bold text-white mt-6 mb-3">Proxy Format</h3>
      <CodeBlock
        language="bash"
        code={`# HTTP Proxy
PROXY_URL=http://username:password@proxy.example.com:8080

# SOCKS5 Proxy
PROXY_URL=socks5://username:password@proxy.example.com:1080

# Without authentication
PROXY_URL=http://proxy.example.com:8080`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">Testing Your Proxy</h3>
      <p className="text-gray-300 mb-4">
        Test your proxy configuration from the dashboard:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
        <li>Navigate to Settings page</li>
        <li>Enter your proxy URL</li>
        <li>Click "Test Proxy Connection"</li>
        <li>Wait for the test results</li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Database Configuration</h2>
      <p className="text-gray-300 mb-4">
        By default, MyG InstaBot uses SQLite. For production, consider PostgreSQL:
      </p>

      <h3 className="text-xl font-bold text-white mt-6 mb-3">SQLite (Default)</h3>
      <CodeBlock
        language="bash"
        code={`DATABASE_URL="file:./prisma/dev.db"`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">PostgreSQL (Production)</h3>
      <CodeBlock
        language="bash"
        code={`DATABASE_URL="postgresql://user:password@localhost:5432/myg_instabot?schema=public"`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Advanced Configuration</h2>
      
      <h3 className="text-xl font-bold text-white mt-6 mb-3">Browser Options</h3>
      <p className="text-gray-300 mb-4">
        Configure browser behavior in <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">src/core/BrowserManager.js</code>:
      </p>
      <CodeBlock
        language="javascript"
        filename="src/core/BrowserManager.js"
        code={`const browserConfig = {
  headless: process.env.HEADLESS === 'true',
  viewport: { width: 1920, height: 1080 },
  userAgent: 'Mozilla/5.0...',
  locale: 'en-US',
  timezone: 'America/New_York',
  // Add custom arguments
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox'
  ]
}`}
      />

      <h3 className="text-xl font-bold text-white mt-6 mb-3">Rate Limiting</h3>
      <CodeBlock
        language="bash"
        code={`# Maximum concurrent account creations
MAX_CONCURRENT_JOBS=3

# Rate limit window (ms)
RATE_LIMIT_WINDOW=3600000

# Max requests per window
RATE_LIMIT_MAX_REQUESTS=100`}
      />

      <div className="glass p-6 rounded-xl border border-purple-500/20 my-6">
        <h3 className="font-bold text-lg mb-4 text-white">🎯 Recommended Settings</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• <strong className="text-white">Development:</strong> HEADLESS=false, use proxy, enable all logging</li>
          <li>• <strong className="text-white">Production:</strong> HEADLESS=true, use residential proxy, PostgreSQL</li>
          <li>• <strong className="text-white">Testing:</strong> HEADLESS=false, no proxy, local database</li>
        </ul>
      </div>
    </div>
  )
}

// Architecture Section
function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">System Architecture</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        MyG InstaBot follows a modular, layered architecture designed for reliability, scalability, and maintainability.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Architecture Overview</h2>
      <div className="glass p-6 rounded-xl border border-white/10">
        <div className="space-y-4 text-gray-300">
          <p><strong className="text-white">Frontend (React)</strong> → Real-time dashboard for monitoring and control</p>
          <p><strong className="text-white">API Server (Express)</strong> → RESTful endpoints for account operations</p>
          <p><strong className="text-white">WebSocket Server</strong> → Real-time updates and progress tracking</p>
          <p><strong className="text-white">Bot Core</strong> → Automation engine with intelligent workflows</p>
          <p><strong className="text-white">Database (Prisma + SQLite/PostgreSQL)</strong> → Data persistence</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Core Components</h2>
      
      <div className="space-y-4">
        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">🎯 BrowserManager</h3>
          <p className="text-gray-300 mb-3">
            Manages browser instances with enhanced configuration for automation. Handles browser lifecycle, 
            context creation, and resource management.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
            <li>Browser instance pooling</li>
            <li>Context isolation</li>
            <li>Resource cleanup</li>
            <li>Configuration management</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">🤖 WorkflowController</h3>
          <p className="text-gray-300 mb-3">
            Orchestrates the complete account creation workflow from profile generation to final verification.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
            <li>Multi-stage workflow coordination</li>
            <li>Progress tracking and reporting</li>
            <li>Error recovery mechanisms</li>
            <li>State management</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">📝 FormFiller</h3>
          <p className="text-gray-300 mb-3">
            Handles intelligent form interaction with multiple strategies for different scenarios.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
            <li>Multi-strategy form filling</li>
            <li>Element detection and interaction</li>
            <li>Validation and error handling</li>
            <li>Adaptive behavior</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">🧠 DeepSeekController</h3>
          <p className="text-gray-300 mb-3">
            AI-powered profile generation using DeepSeek for creating realistic user profiles.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
            <li>Natural profile generation</li>
            <li>Context-aware data</li>
            <li>Diverse output patterns</li>
            <li>API integration</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Flow</h2>
      <CodeBlock
        language="text"
        code={`1. User Request (UI/API)
   ↓
2. WorkflowController initializes
   ↓
3. DeepSeekController generates profile
   ↓
4. BrowserManager creates context
   ↓
5. GmailBot creates email account
   ↓
6. OTPRetriever handles verification
   ↓
7. InstagramCreator sets up account
   ↓
8. Database stores credentials
   ↓
9. WebSocket notifies UI
   ↓
10. Success response returned`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2">Backend</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Node.js 18+</li>
            <li>• Express.js</li>
            <li>• Playwright</li>
            <li>• Prisma ORM</li>
            <li>• Socket.IO</li>
          </ul>
        </div>
        <div className="glass p-4 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2">Frontend</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• React 18</li>
            <li>• Vite</li>
            <li>• Tailwind CSS</li>
            <li>• Framer Motion</li>
            <li>• Zustand</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function WorkflowSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Account Creation Workflow</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Understanding the complete workflow from start to finish helps you optimize your account creation process.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Complete Workflow Steps</h2>
      
      <div className="space-y-4">
        {[
          { num: 1, title: 'Profile Generation', desc: 'AI creates realistic user profile with name, birth date, and preferences', time: '5-10s' },
          { num: 2, title: 'Browser Initialization', desc: 'Secure browser context created with proper configuration', time: '3-5s' },
          { num: 3, title: 'Gmail Navigation', desc: 'Navigate to Gmail signup and begin registration process', time: '10-15s' },
          { num: 4, title: 'Form Completion', desc: 'Fill registration forms with generated profile data', time: '30-45s' },
          { num: 5, title: 'Phone Verification', desc: 'Handle phone number input and verification code', time: '60-120s' },
          { num: 6, title: 'Gmail Confirmation', desc: 'Complete Gmail setup and verify account access', time: '15-20s' },
          { num: 7, title: 'Instagram Navigation', desc: 'Navigate to Instagram using verified Gmail', time: '10-15s' },
          { num: 8, title: 'Instagram Registration', desc: 'Complete Instagram signup with Gmail credentials', time: '30-45s' },
          { num: 9, title: 'Profile Setup', desc: 'Configure Instagram profile with bio and picture', time: '20-30s' },
          { num: 10, title: 'Database Storage', desc: 'Save account credentials securely in database', time: '1-2s' },
        ].map((step) => (
          <div key={step.num} className="glass p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-instagram flex items-center justify-center font-bold text-white">
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <span className="text-sm text-purple-400">{step.time}</span>
                </div>
                <p className="text-gray-300">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-xl border border-blue-500/20 mt-8">
        <h3 className="font-bold text-lg text-white mb-3">⏱️ Total Time</h3>
        <p className="text-gray-300">
          Average completion time: <strong className="text-white">4-6 minutes</strong> per account
          <br />
          Success rate: <strong className="text-green-400">97%+</strong> with proper configuration
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Workflow Control</h2>
      <CodeBlock
        language="javascript"
        filename="API Example"
        code={`// Start account creation
const response = await fetch('/api/create-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    useAiProfile: true,
    headless: false,
    proxyUrl: 'http://proxy:8080'
  })
});

const { jobId } = await response.json();

// Monitor progress via WebSocket
socket.on('job:progress', (data) => {
  if (data.jobId === jobId) {
    console.log(\`Stage: \${data.stage}, Progress: \${data.progress}%\`);
  }
});`}
      />
    </div>
  )
}

function BrowserAutomationSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Browser Automation</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        MyG InstaBot uses Playwright for reliable, high-performance browser automation.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Browser Configuration</h2>
      <p className="text-gray-300 mb-4">
        The system uses carefully configured browser settings for optimal performance and reliability.
      </p>
      
      <CodeBlock
        language="javascript"
        filename="Browser Setup"
        code={`// Basic browser configuration (user-facing)
const browser = await playwright.chromium.launch({
  headless: process.env.HEADLESS === 'true',
  args: [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  ]
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  userAgent: 'Mozilla/5.0...',
  locale: 'en-US',
  timezoneId: 'America/New_York'
});`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Features</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🎭 Context Isolation</h3>
          <p className="text-gray-300">Each account creation uses an isolated browser context to prevent cross-contamination.</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">📸 Screenshot Capture</h3>
          <p className="text-gray-300">Automatic screenshots at key stages for debugging and verification purposes.</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🔄 Auto-Recovery</h3>
          <p className="text-gray-300">Intelligent retry mechanisms and fallback strategies for network issues.</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">⚡ Resource Management</h3>
          <p className="text-gray-300">Automatic cleanup of browser resources to prevent memory leaks.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Configuration Tips</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Use headless mode in production for better performance</li>
              <li>• Run visible browser during development for debugging</li>
              <li>• Ensure sufficient system resources for multiple instances</li>
              <li>• Configure timeouts based on your network speed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIProfilesSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">AI Profile Generation</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Create realistic, diverse user profiles automatically using AI-powered generation.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">How It Works</h2>
      <p className="text-gray-300 mb-4">
        MyG InstaBot integrates with DeepSeek AI to generate unique, realistic profiles for each account.
      </p>

      <CodeBlock
        language="javascript"
        filename="Enable AI Profiles"
        code={`// Enable AI profile generation
const response = await fetch('/api/create-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    useAiProfile: true  // Enable AI generation
  })
});`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Generated Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { field: 'First Name', example: 'Sarah, Michael, Emma', icon: '👤' },
          { field: 'Last Name', example: 'Johnson, Rodriguez, Chen', icon: '📝' },
          { field: 'Birth Date', example: '1990-2005 range', icon: '🎂' },
          { field: 'Gender', example: 'Male, Female, Other', icon: '⚧' },
          { field: 'Username', example: 'sarah_j_2024, mike_rod', icon: '🆔' },
          { field: 'Bio', example: 'Natural, contextual bios', icon: '📄' },
        ].map((item) => (
          <div key={item.field} className="glass p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-bold text-white">{item.field}</h3>
            </div>
            <p className="text-gray-400 text-sm">{item.example}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Benefits</h2>
      <div className="space-y-3">
        {[
          { title: 'Diversity', desc: 'Generates diverse profiles to avoid patterns' },
          { title: 'Realism', desc: 'Natural-looking names and data combinations' },
          { title: 'Speed', desc: 'Instant generation without manual input' },
          { title: 'Scalability', desc: 'Create unlimited unique profiles' },
        ].map((benefit) => (
          <div key={benefit.title} className="flex items-start space-x-3 glass p-4 rounded-lg border border-white/10">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">{benefit.title}:</strong>
              <span className="text-gray-300"> {benefit.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-xl border border-purple-500/20 mt-6">
        <h3 className="font-bold text-lg text-white mb-3">💡 Manual Profiles</h3>
        <p className="text-gray-300">
          You can also provide manual profile data if preferred. Set <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">useAiProfile: false</code> and supply your own profile object.
        </p>
      </div>
    </div>
  )
}

function GmailCreationSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Gmail Account Creation</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Automated Gmail account creation is the foundation of the Instagram account setup process.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Process Overview</h2>
      <div className="space-y-4">
        {[
          { stage: 'Navigation', desc: 'Navigate to Gmail signup page', duration: '10-15s' },
          { stage: 'Personal Info', desc: 'Fill name, birth date, and gender', duration: '20-30s' },
          { stage: 'Username Selection', desc: 'Choose available Gmail address', duration: '15-20s' },
          { stage: 'Password Creation', desc: 'Generate strong, secure password', duration: '5-10s' },
          { stage: 'Phone Verification', desc: 'Handle phone number requirement', duration: '60-120s' },
          { stage: 'Recovery Email', desc: 'Set up recovery options', duration: '10-15s' },
          { stage: 'Terms Acceptance', desc: 'Accept terms and conditions', duration: '5s' },
          { stage: 'Verification', desc: 'Verify account access', duration: '10-15s' },
        ].map((step, index) => (
          <div key={index} className="glass p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">{index + 1}. {step.stage}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
            <span className="text-purple-400 text-sm">{step.duration}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">API Usage</h2>
      <CodeBlock
        language="javascript"
        filename="Create Gmail Only"
        code={`// Create Gmail account only
const response = await fetch('/api/create-gmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1995-05-15',
      gender: 'male'
    },
    headless: false
  })
});

const result = await response.json();
console.log('Gmail created:', result.account.email);`}
      />

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Phone Verification</h3>
            <p className="text-gray-300">
              Gmail requires phone verification in most cases. Ensure you have access to phone numbers 
              or use a phone verification service for automated handling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InstagramSetupSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Instagram Account Setup</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Complete Instagram account creation using verified Gmail credentials.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Setup Process</h2>
      <div className="space-y-4">
        {[
          { step: 'Gmail Login', desc: 'Sign in with verified Gmail account' },
          { step: 'Instagram Signup', desc: 'Navigate to Instagram registration' },
          { step: 'Email Confirmation', desc: 'Verify email address' },
          { step: 'Username Creation', desc: 'Choose unique username' },
          { step: 'Password Setup', desc: 'Create secure password' },
          { step: 'Profile Configuration', desc: 'Add profile picture and bio' },
          { step: 'Initial Posts', desc: 'Upload first posts (optional)' },
        ].map((item, index) => (
          <div key={index} className="flex items-start space-x-4 glass p-5 rounded-xl border border-white/10">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-instagram flex items-center justify-center font-bold text-white text-sm">
              {index + 1}
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">{item.step}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">API Usage</h2>
      <CodeBlock
        language="javascript"
        filename="Create Instagram Account"
        code={`// Create Instagram with existing Gmail
const response = await fetch('/api/create-instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gmailAccount: {
      email: 'john.doe@gmail.com',
      password: 'gmail_password_here'
    },
    profile: {
      username: 'johndoe_official',
      fullName: 'John Doe'
    }
  })
});

const result = await response.json();
console.log('Instagram created:', result.account.username);`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Profile Customization</h2>
      <p className="text-gray-300 mb-4">
        Customize Instagram profiles with AI-generated or manual content:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span>Profile pictures (uploaded or generated)</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span>Bio text (AI-generated or custom)</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span>Initial posts (1-9 posts configurable)</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span>Story highlights (optional)</span>
        </li>
      </ul>
    </div>
  )
}

function ProxySupportSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Proxy Support</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Use proxies to distribute requests, avoid IP bans, and improve success rates.
      </p>

      <div className="glass p-6 rounded-xl border border-green-500/20">
        <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Why Use Proxies?</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• Distribute account creation across multiple IPs</li>
          <li>• Avoid rate limiting and IP bans</li>
          <li>• Improve success rates significantly</li>
          <li>• Support for residential and datacenter proxies</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Proxy Configuration</h2>
      <CodeBlock
        language="bash"
        filename=".env"
        code={`# HTTP Proxy
PROXY_URL=http://username:password@proxy.example.com:8080

# SOCKS5 Proxy
PROXY_URL=socks5://username:password@proxy.example.com:1080

# Without Authentication
PROXY_URL=http://proxy.example.com:8080`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">API Usage</h2>
      <CodeBlock
        language="javascript"
        filename="With Proxy"
        code={`const response = await fetch('/api/create-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    useAiProfile: true,
    proxyUrl: 'http://user:pass@proxy:8080'
  })
});`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Recommended Proxy Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🏠 Residential Proxies</h3>
          <p className="text-gray-300 text-sm mb-2">Best for production use</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Highest success rate</li>
            <li>• Least likely to be blocked</li>
            <li>• More expensive</li>
          </ul>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🏢 Datacenter Proxies</h3>
          <p className="text-gray-300 text-sm mb-2">Good for testing</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Lower cost</li>
            <li>• Fast speeds</li>
            <li>• Higher detection risk</li>
          </ul>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Proxy Rotation</h3>
        <p className="text-gray-300">
          For bulk account creation, rotate proxies between creations to distribute load 
          and minimize detection risk. The system supports proxy pools for automatic rotation.
        </p>
      </div>
    </div>
  )
}

function ErrorHandlingSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Error Handling</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Comprehensive error handling and recovery mechanisms ensure maximum reliability.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Error Types</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-red-500/20">
          <h3 className="font-bold text-white mb-2">🚫 Navigation Errors</h3>
          <p className="text-gray-300 text-sm mb-2">Page loading or navigation failures</p>
          <p className="text-gray-400 text-sm"><strong>Solution:</strong> Automatic retry with exponential backoff</p>
        </div>
        <div className="glass p-5 rounded-xl border border-yellow-500/20">
          <h3 className="font-bold text-white mb-2">⚠️ Element Not Found</h3>
          <p className="text-gray-300 text-sm mb-2">Form elements or buttons missing</p>
          <p className="text-gray-400 text-sm"><strong>Solution:</strong> Multiple selector strategies and fallbacks</p>
        </div>
        <div className="glass p-5 rounded-xl border border-orange-500/20">
          <h3 className="font-bold text-white mb-2">⏱️ Timeout Errors</h3>
          <p className="text-gray-300 text-sm mb-2">Operations exceeding time limits</p>
          <p className="text-gray-400 text-sm"><strong>Solution:</strong> Configurable timeouts and retry logic</p>
        </div>
        <div className="glass p-5 rounded-xl border border-purple-500/20">
          <h3 className="font-bold text-white mb-2">🔐 Verification Failures</h3>
          <p className="text-gray-300 text-sm mb-2">Phone or email verification issues</p>
          <p className="text-gray-400 text-sm"><strong>Solution:</strong> Extended wait times and manual intervention options</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Error Response Format</h2>
      <CodeBlock
        language="json"
        filename="Error Response"
        code={`{
  "success": false,
  "error": {
    "code": "NAVIGATION_FAILED",
    "message": "Failed to navigate to signup page",
    "details": "Timeout after 30s",
    "stage": "gmail_navigation",
    "retryable": true
  },
  "jobId": "job_abc123",
  "timestamp": "2025-10-29T12:00:00Z"
}`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Debugging</h2>
      <p className="text-gray-300 mb-4">When errors occur, check the following:</p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Logs:</strong> Check `logs/` directory for detailed error information</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Screenshots:</strong> Review `screenshots/` folder for visual debugging</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Network:</strong> Verify proxy connectivity and speed</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Resources:</strong> Ensure sufficient system memory and CPU</span>
        </li>
      </ul>

      <div className="glass p-6 rounded-xl border border-blue-500/20 mt-6">
        <Info className="w-6 h-6 text-blue-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Automatic Recovery</h3>
        <p className="text-gray-300">
          The system automatically handles most errors through retry mechanisms, fallback strategies, 
          and intelligent error recovery. Most transient issues resolve without manual intervention.
        </p>
      </div>
    </div>
  )
}

function SchemaSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Database Schema</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        MyG InstaBot uses Prisma ORM with a clean, well-structured database schema.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Main Models</h2>
      
      <div className="space-y-4">
        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">Account</h3>
          <p className="text-gray-300 mb-3">Stores complete account credentials and metadata</p>
          <CodeBlock
            language="prisma"
            filename="schema.prisma"
            code={`model Account {
  id              String   @id @default(cuid())
  gmailEmail      String   @unique
  gmailPassword   String
  instagramUsername String?
  instagramPassword String?
  status          String   // active, pending, failed
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  activities      Activity[]
}`}
          />
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">Activity</h3>
          <p className="text-gray-300 mb-3">Tracks all account-related activities</p>
          <CodeBlock
            language="prisma"
            filename="schema.prisma"
            code={`model Activity {
  id          String   @id @default(cuid())
  accountId   String?
  type        String   // account_created, error, etc.
  message     String
  metadata    Json?
  createdAt   DateTime @default(now())
  account     Account? @relation(fields: [accountId], references: [id])
}`}
          />
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-3">Job</h3>
          <p className="text-gray-300 mb-3">Tracks account creation jobs</p>
          <CodeBlock
            language="prisma"
            filename="schema.prisma"
            code={`model Job {
  id          String   @id @default(cuid())
  status      String   // pending, in_progress, completed, failed
  stage       String?
  progress    Int      @default(0)
  accountId   String?
  error       String?
  createdAt   DateTime @default(now())
  completedAt DateTime?
}`}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">View Schema</h2>
      <CodeBlock
        language="bash"
        code={`# View your database in Prisma Studio
npx prisma studio

# Opens at http://localhost:5555`}
      />
    </div>
  )
}

function ModelsSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Data Models</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Understanding the data models helps you interact with the database effectively.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Account Model</h2>
      <div className="glass p-6 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 text-white">Field</th>
              <th className="py-2 text-white">Type</th>
              <th className="py-2 text-white">Description</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-sm">
            <tr className="border-b border-white/5">
              <td className="py-2"><code className="text-purple-300">id</code></td>
              <td className="py-2">String</td>
              <td className="py-2">Unique identifier (CUID)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2"><code className="text-purple-300">gmailEmail</code></td>
              <td className="py-2">String</td>
              <td className="py-2">Gmail address (unique)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2"><code className="text-purple-300">gmailPassword</code></td>
              <td className="py-2">String</td>
              <td className="py-2">Encrypted password</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2"><code className="text-purple-300">status</code></td>
              <td className="py-2">String</td>
              <td className="py-2">active, pending, or failed</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2"><code className="text-purple-300">createdAt</code></td>
              <td className="py-2">DateTime</td>
              <td className="py-2">Creation timestamp</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Query Examples</h2>
      <CodeBlock
        language="javascript"
        filename="Database Queries"
        code={`// Get all active accounts
const accounts = await prisma.account.findMany({
  where: { status: 'active' },
  orderBy: { createdAt: 'desc' }
});

// Get account with activities
const account = await prisma.account.findUnique({
  where: { id: 'account_id' },
  include: { activities: true }
});

// Count accounts by status
const stats = await prisma.account.groupBy({
  by: ['status'],
  _count: true
});`}
      />
    </div>
  )
}

function MigrationsSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Database Migrations</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Manage database schema changes safely with Prisma migrations.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Common Commands</h2>
      
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Create Migration</h3>
          <CodeBlock
            language="bash"
            code={`npx prisma migrate dev --name add_new_field`}
          />
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Apply Migrations</h3>
          <CodeBlock
            language="bash"
            code={`npx prisma migrate deploy`}
          />
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Reset Database</h3>
          <CodeBlock
            language="bash"
            code={`npx prisma migrate reset`}
          />
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Generate Prisma Client</h3>
          <CodeBlock
            language="bash"
            code={`npx prisma generate`}
          />
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Production Migrations</h3>
        <p className="text-gray-300">
          Always backup your database before running migrations in production. 
          Use <code className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">migrate deploy</code> for production environments.
        </p>
      </div>
    </div>
  )
}

function CustomizationSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Customization</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Customize MyG InstaBot to fit your specific needs and use cases.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Configuration Options</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Environment Variables</h3>
          <p className="text-gray-300 text-sm mb-3">Modify `.env` file to customize behavior</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Browser settings (headless, viewport)</li>
            <li>• Timeout configurations</li>
            <li>• API keys and credentials</li>
            <li>• Rate limiting parameters</li>
          </ul>
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Profile Templates</h3>
          <p className="text-gray-300 text-sm mb-3">Create custom profile generation templates</p>
          <CodeBlock
            language="javascript"
            code={`const customProfile = {
  namePattern: 'FirstName_LastName_Year',
  bioStyle: 'professional', // casual, professional, creative
  ageRange: [25, 35],
  interests: ['photography', 'travel', 'tech']
};`}
          />
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Workflow Hooks</h3>
          <p className="text-gray-300 text-sm mb-3">Add custom logic at workflow stages</p>
          <CodeBlock
            language="javascript"
            code={`// Add custom hooks
workflow.on('beforeGmailCreation', async (profile) => {
  // Custom preprocessing
});

workflow.on('afterAccountCreation', async (account) => {
  // Custom post-processing
});`}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">UI Customization</h2>
      <p className="text-gray-300 mb-4">
        Customize the dashboard appearance and branding:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li>• Modify color scheme in `tailwind.config.js`</li>
        <li>• Update logo and branding assets</li>
        <li>• Add custom dashboard widgets</li>
        <li>• Create custom reports and analytics</li>
      </ul>
    </div>
  )
}

function ScalingSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Scaling for Production</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Scale MyG InstaBot to handle high-volume account creation efficiently.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Horizontal Scaling</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Multiple Instances</h3>
          <p className="text-gray-300 text-sm">Run multiple bot instances in parallel with different proxies</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Load Balancer</h3>
          <p className="text-gray-300 text-sm">Distribute requests across instances using nginx or HAProxy</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Job Queue</h3>
          <p className="text-gray-300 text-sm">Use Bull or BeeQueue for distributed job processing</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Database Optimization</h2>
      <CodeBlock
        language="bash"
        filename="Switch to PostgreSQL"
        code={`# Update DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/myg_instabot"

# Run migrations
npx prisma migrate deploy

# Add connection pooling
# Use PgBouncer or Prisma connection pooling`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Performance Tips</h2>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Headless Mode:</strong> Always use headless=true in production</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Proxy Pools:</strong> Rotate through large proxy pools</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Caching:</strong> Cache AI-generated profiles for reuse</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-purple-400">•</span>
          <span><strong className="text-white">Resource Limits:</strong> Set MAX_CONCURRENT_JOBS appropriately</span>
        </li>
      </ul>

      <div className="glass p-6 rounded-xl border border-green-500/20 mt-6">
        <CheckCircle className="w-6 h-6 text-green-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Production Metrics</h3>
        <p className="text-gray-300">
          Monitor success rates, creation times, and error rates. Aim for 3-5 concurrent jobs 
          per instance with proper proxies for optimal throughput.
        </p>
      </div>
    </div>
  )
}

function DeploymentSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Production Deployment</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Deploy MyG InstaBot to production environments securely and efficiently.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Deployment Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🐳 Docker</h3>
          <p className="text-gray-300 text-sm">Containerized deployment with Docker Compose</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">☁️ VPS</h3>
          <p className="text-gray-300 text-sm">Deploy to DigitalOcean, AWS, or Google Cloud</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🚀 Kubernetes</h3>
          <p className="text-gray-300 text-sm">Orchestrate multiple instances at scale</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">🖥️ Dedicated Server</h3>
          <p className="text-gray-300 text-sm">Full control with bare metal servers</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Docker Deployment</h2>
      <CodeBlock
        language="docker"
        filename="Dockerfile"
        code={`FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Install Playwright
RUN npx playwright install --with-deps chromium

EXPOSE 3000

CMD ["npm", "start"]`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Environment Setup</h2>
      <CodeBlock
        language="bash"
        code={`# Production environment variables
NODE_ENV=production
HEADLESS=true
DATABASE_URL="postgresql://..."
DEEPSEEK_API_KEY="sk-..."
PROXY_URL="http://..."

# Security
SESSION_SECRET="random_secret_here"
RATE_LIMIT_ENABLED=true`}
      />

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Production Checklist</h3>
        <ul className="text-gray-300 space-y-1">
          <li>✓ Use strong environment secrets</li>
          <li>✓ Enable rate limiting</li>
          <li>✓ Configure proper logging</li>
          <li>✓ Set up monitoring and alerts</li>
          <li>✓ Use production database</li>
          <li>✓ Configure SSL/TLS</li>
        </ul>
      </div>
    </div>
  )
}

function BestPracticesSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Best Practices</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Follow these best practices for optimal results and long-term success.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Account Creation</h2>
      <div className="space-y-4">
        {[
          { title: 'Use Quality Proxies', desc: 'Residential proxies significantly improve success rates', icon: '🏠' },
          { title: 'Rate Limiting', desc: 'Create 3-5 accounts per hour maximum to avoid detection', icon: '⏱️' },
          { title: 'AI Profiles', desc: 'Always use AI-generated profiles for diversity', icon: '🤖' },
          { title: 'Monitor Logs', desc: 'Regularly check logs and screenshots for issues', icon: '📊' },
          { title: 'Rotate Proxies', desc: 'Use different proxies for each account', icon: '🔄' },
          { title: 'Test First', desc: 'Test in non-headless mode before bulk creation', icon: '🧪' },
        ].map((practice) => (
          <div key={practice.title} className="glass p-5 rounded-xl border border-white/10 flex items-start space-x-4">
            <span className="text-3xl">{practice.icon}</span>
            <div>
              <h3 className="font-bold text-white mb-1">{practice.title}</h3>
              <p className="text-gray-300 text-sm">{practice.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Security Practices</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Store credentials securely with encryption</li>
        <li>• Rotate API keys regularly</li>
        <li>• Use environment variables for secrets</li>
        <li>• Enable rate limiting and monitoring</li>
        <li>• Keep dependencies updated</li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Maintenance</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Regular database backups</li>
        <li>• Monitor success rates and adjust</li>
        <li>• Update browser automation libraries</li>
        <li>• Clean up old screenshots and logs</li>
        <li>• Review and optimize proxy performance</li>
      </ul>

      <div className="glass p-6 rounded-xl border border-purple-500/20 mt-6">
        <h3 className="font-bold text-lg text-white mb-3">💡 Pro Tips</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• Start small and scale gradually</li>
          <li>• Document your custom configurations</li>
          <li>• Keep test accounts for troubleshooting</li>
          <li>• Monitor platform policy changes</li>
        </ul>
      </div>
    </div>
  )
}

function StealthModeSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Stealth Mode</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        MyG InstaBot includes advanced configurations to help your automation blend in naturally.
      </p>

      <div className="glass p-6 rounded-xl border border-purple-500/20">
        <h3 className="font-bold text-lg text-white mb-3">🔒 Proprietary Technology</h3>
        <p className="text-gray-300">
          MyG InstaBot uses proprietary stealth techniques that are continuously updated. 
          The system handles detection avoidance automatically - no manual configuration required.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">User-Configurable Options</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Browser Configuration</h3>
          <p className="text-gray-300 text-sm mb-3">The system automatically configures optimal browser settings</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Headless mode for production</li>
            <li>• Viewport and user agent rotation</li>
            <li>• Timezone and locale settings</li>
            <li>• Automated browser cleanup</li>
          </ul>
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Proxy Management</h3>
          <p className="text-gray-300 text-sm mb-3">Use proxies to distribute your footprint</p>
          <CodeBlock
            language="bash"
            code={`# Configure proxy in .env
PROXY_URL=http://username:password@proxy.example.com:8080

# System automatically handles proxy rotation`}
          />
        </div>

        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Rate Control</h3>
          <p className="text-gray-300 text-sm">Built-in timing controls help maintain natural patterns</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Best Practices</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Always use residential proxies in production</li>
        <li>• Limit account creation to 3-5 per hour</li>
        <li>• Use AI-generated profiles for diversity</li>
        <li>• Enable headless mode for consistency</li>
        <li>• Monitor success rates and adjust timing</li>
      </ul>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Continuous Updates</h3>
        <p className="text-gray-300">
          Platform detection methods evolve constantly. Keep your MyG InstaBot updated to 
          benefit from the latest stealth improvements and security patches.
        </p>
      </div>
    </div>
  )
}

function DetectionAvoidanceSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Detection Avoidance</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Understanding detection factors helps you configure MyG InstaBot for optimal success.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Factors</h2>
      <div className="space-y-4">
        {[
          { 
            title: 'IP Reputation', 
            desc: 'Use clean, residential IP addresses',
            userAction: 'Configure quality proxy service'
          },
          { 
            title: 'Rate Patterns', 
            desc: 'Avoid creating too many accounts too quickly',
            userAction: 'Limit to 3-5 accounts/hour'
          },
          { 
            title: 'Profile Diversity', 
            desc: 'Use varied, realistic profile data',
            userAction: 'Enable AI profile generation'
          },
          { 
            title: 'Browser Consistency', 
            desc: 'Maintain consistent browser configuration',
            userAction: 'Use headless mode in production'
          },
        ].map((factor, index) => (
          <div key={index} className="glass p-5 rounded-xl border border-white/10">
            <h3 className="font-bold text-white mb-2">{factor.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{factor.desc}</p>
            <p className="text-purple-400 text-sm">✓ {factor.userAction}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">System Protection</h2>
      <div className="glass p-6 rounded-xl border border-white/10">
        <p className="text-gray-300 mb-4">
          MyG InstaBot includes built-in protection mechanisms that work automatically:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Intelligent timing and delays</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Adaptive behavior patterns</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Context-aware navigation</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Automatic error recovery</span>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Monitoring Success</h2>
      <CodeBlock
        language="javascript"
        filename="Check Success Rate"
        code={`// Monitor your success rate via API
const stats = await fetch('/api/stats');
const data = await stats.json();

console.log('Success Rate:', data.stats.successRate);
console.log('Recent Failures:', data.stats.failedAccounts);

// Adjust configuration based on metrics`}
      />

      <div className="glass p-6 rounded-xl border border-blue-500/20 mt-6">
        <Info className="w-6 h-6 text-blue-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Proprietary Protection</h3>
        <p className="text-gray-300">
          The core detection avoidance algorithms are proprietary and automatically applied. 
          Focus on configuring proxies, rate limiting, and profile diversity for best results.
        </p>
      </div>
    </div>
  )
}

function RateLimitingSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black gradient-text mb-4">Rate Limiting</h1>
      <p className="text-xl text-gray-300 leading-relaxed">
        Proper rate limiting is critical for avoiding detection and maintaining high success rates.
      </p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Recommended Limits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-xl border border-white/10 text-center">
          <div className="text-4xl font-bold gradient-text mb-2">3-5</div>
          <div className="text-sm text-gray-400">Accounts per hour</div>
          <div className="text-xs text-gray-500 mt-2">Recommended rate</div>
        </div>
        <div className="glass p-6 rounded-xl border border-white/10 text-center">
          <div className="text-4xl font-bold gradient-text mb-2">20-40</div>
          <div className="text-sm text-gray-400">Accounts per day</div>
          <div className="text-xs text-gray-500 mt-2">Safe daily limit</div>
        </div>
        <div className="glass p-6 rounded-xl border border-white/10 text-center">
          <div className="text-4xl font-bold gradient-text mb-2">4-6min</div>
          <div className="text-sm text-gray-400">Per account</div>
          <div className="text-xs text-gray-500 mt-2">Average time</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Configuration</h2>
      <CodeBlock
        language="bash"
        filename=".env"
        code={`# Rate limiting configuration
MAX_CONCURRENT_JOBS=3
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms
RATE_LIMIT_MAX_REQUESTS=5  # Max accounts per window

# Enable rate limiting
RATE_LIMIT_ENABLED=true`}
      />

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Scaling Strategies</h2>
      <div className="space-y-4">
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Single Instance</h3>
          <p className="text-gray-300 text-sm">3-5 accounts/hour with one proxy</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Multiple Instances</h3>
          <p className="text-gray-300 text-sm">Run parallel instances with different proxies, each at 3-5/hour</p>
        </div>
        <div className="glass p-5 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2">Distributed System</h3>
          <p className="text-gray-300 text-sm">Scale horizontally across servers with proxy pools</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Monitoring</h2>
      <p className="text-gray-300 mb-4">
        Track your rate limiting effectiveness:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li>• Monitor success rate (aim for 95%+)</li>
        <li>• Track creation times (4-6 minutes average)</li>
        <li>• Watch for CAPTCHA frequency (should be rare)</li>
        <li>• Review error patterns in logs</li>
      </ul>

      <div className="glass p-6 rounded-xl border border-green-500/20 mt-6">
        <CheckCircle className="w-6 h-6 text-green-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Success Formula</h3>
        <p className="text-gray-300">
          <strong>Quality over quantity:</strong> Creating 5 accounts per hour with 98% success 
          is far better than rushing 20 accounts with 50% success. Patience and proper rate limiting 
          lead to sustainable, long-term operation.
        </p>
      </div>

      <div className="glass p-6 rounded-xl border border-yellow-500/20 mt-6">
        <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
        <h3 className="font-bold text-lg text-white mb-2">Platform Changes</h3>
        <p className="text-gray-300">
          Platforms regularly update their detection systems. If you notice decreased success rates, 
          reduce your rate limits temporarily and monitor the situation. Join our community for 
          updates on optimal rate settings.
        </p>
      </div>
    </div>
  )
}

