import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  LifeBuoy, 
  MessageCircle, 
  Mail,
  Book,
  Search,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Send
} from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    icon: Book,
    questions: [
      {
        q: 'How do I install MyG InstaBot?',
        a: 'Follow our Quick Start guide in the documentation. Run npm install, set up your database with Prisma, and start the servers. It takes less than 5 minutes!'
      },
      {
        q: 'Do I need a DeepSeek API key?',
        a: 'While not required, we highly recommend it for AI-powered profile generation. Without it, you\'ll need to provide manual profile data for each account.'
      },
      {
        q: 'What are the system requirements?',
        a: 'Node.js 18+, 4GB RAM (8GB recommended), and 2GB free disk space. Works on Windows, macOS, and Linux.'
      },
    ]
  },
  {
    category: 'Configuration',
    icon: AlertCircle,
    questions: [
      {
        q: 'How do I configure a proxy?',
        a: 'Add PROXY_URL to your .env file in the format: http://username:password@host:port. Test it in the Settings page of the dashboard.'
      },
      {
        q: 'Should I use headless mode?',
        a: 'For development and debugging, use headless=false to see what\'s happening. For production, use headless=true for better performance.'
      },
      {
        q: 'Can I use a different database?',
        a: 'Yes! While SQLite is the default, you can easily switch to PostgreSQL or MySQL by updating the DATABASE_URL in your .env file.'
      },
    ]
  },
  {
    category: 'Usage',
    icon: HelpCircle,
    questions: [
      {
        q: 'How many accounts can I create?',
        a: 'There\'s no hard limit, but we recommend rate limiting (3-5 accounts per hour) to avoid detection and IP bans. Always use proxies for bulk creation.'
      },
      {
        q: 'Why did my account creation fail?',
        a: 'Common reasons: poor proxy quality, rate limiting, CAPTCHA challenges, or detection. Check the logs folder and screenshots for debugging.'
      },
      {
        q: 'Can I create accounts without proxies?',
        a: 'Yes, but not recommended for bulk creation. Your IP may get flagged. Use residential proxies for best results.'
      },
    ]
  },
  {
    category: 'Troubleshooting',
    icon: AlertCircle,
    questions: [
      {
        q: 'Browser automation is detected',
        a: 'MyG InstaBot uses advanced stealth techniques, but if detected: 1) Use residential proxies, 2) Reduce creation rate, 3) Enable all stealth features, 4) Check for browser updates.'
      },
      {
        q: 'WebSocket not connecting',
        a: 'Ensure backend is running on port 3000. Check firewall settings. Clear browser cache. Restart both servers.'
      },
      {
        q: 'Database errors',
        a: 'Run: npx prisma migrate reset && npx prisma generate. This will reset and recreate your database.'
      },
    ]
  },
]

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description: 'Get real-time help from our active community',
    action: 'Join Discord',
    link: 'https://discord.gg/myg-instabot',
    color: 'from-indigo-600 to-purple-600'
  },
  {
    icon: Book,
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    action: 'Read Docs',
    link: '/docs',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Contact our support team directly',
    action: 'Send Email',
    link: 'mailto:support@myginstabot.com',
    color: 'from-pink-600 to-rose-600'
  },
]

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  })

  const filteredFAQs = faqs.filter(category => {
    if (selectedCategory === 'all') return true
    return category.category === selectedCategory
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert('Support ticket submitted! We\'ll get back to you within 24 hours.')
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
              <LifeBuoy className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Support</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black gradient-text mb-4">
            How can we help you?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get the support you need, when you need it. Search our knowledge base, 
            contact support, or join our community.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black text-white mb-8 text-center">Support Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <motion.a
                key={channel.title}
                href={channel.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group relative overflow-hidden text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${channel.color} mb-4`}>
                    <channel.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{channel.title}</h4>
                  <p className="text-gray-400 text-sm mb-6">{channel.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-purple-400 font-semibold">
                    <span>{channel.action}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-instagram text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {faqs.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.category
                    ? 'bg-gradient-instagram text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {filteredFAQs.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <category.icon className="w-6 h-6 text-purple-400" />
                  <h4 className="text-xl font-bold text-white">{category.category}</h4>
                </div>
                <div className="space-y-4">
                  {category.questions.map((item, qIndex) => (
                    <div
                      key={qIndex}
                      className="glass p-6 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <h5 className="font-bold text-white">{item.q}</h5>
                      </div>
                      <p className="text-gray-300 ml-8">{item.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass p-8 rounded-xl border border-white/10">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Still need help?</h3>
              <p className="text-gray-400">Send us a message and we'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="low" className="bg-gray-900">Low</option>
                  <option value="normal" className="bg-gray-900">Normal</option>
                  <option value="high" className="bg-gray-900">High</option>
                  <option value="urgent" className="bg-gray-900">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-instagram rounded-xl font-bold btn-ripple hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 glass p-8 rounded-xl border border-blue-500/20"
        >
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-white mb-2">Before contacting support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Check the <Link to="/docs" className="text-purple-400 hover:text-purple-300 underline">documentation</Link> for detailed guides</li>
                <li>• Search existing <a href="https://github.com/yourusername/myg-instabot/issues" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">GitHub issues</a></li>
                <li>• Review the logs folder and screenshots for error details</li>
                <li>• Try the troubleshooting steps in the FAQ above</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

