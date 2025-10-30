import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  Github, 
  MessageCircle, 
  Twitter,
  Youtube,
  Book,
  Sparkles,
  TrendingUp,
  Award,
  Star,
  ExternalLink
} from 'lucide-react'

const resources = [
  {
    icon: Github,
    title: 'GitHub Repository',
    description: 'Star us on GitHub, contribute code, report issues, and view the source',
    link: 'https://github.com/yourusername/myg-instabot',
    color: 'from-gray-700 to-gray-900',
    stats: '1.2k stars'
  },
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description: 'Join our active Discord server for real-time help, discussions, and updates',
    link: 'https://discord.gg/myg-instabot',
    color: 'from-indigo-600 to-purple-600',
    stats: '5k+ members'
  },
  {
    icon: Twitter,
    title: 'Twitter / X',
    description: 'Follow us for updates, tips, and announcements',
    link: 'https://twitter.com/myg_instabot',
    color: 'from-blue-400 to-blue-600',
    stats: '2.5k followers'
  },
  {
    icon: Youtube,
    title: 'YouTube Channel',
    description: 'Video tutorials, demos, and in-depth guides',
    link: 'https://youtube.com/@myg-instabot',
    color: 'from-red-600 to-red-700',
    stats: '10k subscribers'
  },
  {
    icon: Book,
    title: 'Blog & Tutorials',
    description: 'Read our blog for tips, best practices, and case studies',
    link: '/blog',
    color: 'from-green-600 to-emerald-600',
    stats: '100+ articles'
  },
  {
    icon: MessageCircle,
    title: 'Reddit Community',
    description: 'Join discussions, share experiences, and get help from the community',
    link: 'https://reddit.com/r/myginstabot',
    color: 'from-orange-600 to-red-600',
    stats: '3k+ members'
  },
]

const contributors = [
  { name: 'Alex Chen', role: 'Core Developer', avatar: '🦄', contributions: 234 },
  { name: 'Sarah Johnson', role: 'Documentation Lead', avatar: '🚀', contributions: 156 },
  { name: 'Mike Rodriguez', role: 'UI/UX Designer', avatar: '🎨', contributions: 89 },
  { name: 'Emily Zhang', role: 'DevOps Engineer', avatar: '⚡', contributions: 67 },
  { name: 'David Kim', role: 'Community Manager', avatar: '🌟', contributions: 45 },
  { name: 'Lisa Wang', role: 'QA Engineer', avatar: '🔥', contributions: 34 },
]

const showcases = [
  {
    title: 'E-commerce Scaling',
    description: 'Used MyG InstaBot to create 500+ accounts for product promotion',
    author: 'ShopifyGuru',
    metric: '+300% ROI',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Influencer Agency',
    description: 'Automated account creation for 50+ micro-influencers',
    author: 'SocialAgency',
    metric: '10k+ followers/week',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Marketing Automation',
    description: 'Integrated with marketing stack for seamless operations',
    author: 'MarketingPro',
    metric: '95% success rate',
    color: 'from-green-500 to-emerald-500'
  },
]

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000"></div>
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
              <Users className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Community</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black gradient-text mb-4">
            Join the MyG Community
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with thousands of developers, marketers, and automation enthusiasts. 
            Share experiences, get help, and stay updated with the latest features.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Users, label: 'Community Members', value: '15,000+' },
              { icon: Github, label: 'GitHub Stars', value: '1,200+' },
              { icon: MessageCircle, label: 'Discord Messages/Day', value: '500+' },
              { icon: Award, label: 'Active Contributors', value: '50+' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-black text-white mb-8 text-center">
            Community Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${resource.color}`}>
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{resource.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400 font-semibold">{resource.stats}</span>
                    <span className="text-xs text-gray-500">Click to visit →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="glass p-8 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white">Top Contributors</h3>
              <a 
                href="https://github.com/yourusername/myg-instabot/graphs/contributors"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                <span>View all</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributors.map((contributor, index) => (
                <motion.div
                  key={contributor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="text-4xl">{contributor.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{contributor.name}</h4>
                    <p className="text-sm text-gray-400">{contributor.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">{contributor.contributions}</div>
                    <div className="text-xs text-gray-500">commits</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Community Showcases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-white mb-4">Community Showcases</h3>
            <p className="text-gray-400">See what amazing things our community is building</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showcases.map((showcase, index) => (
              <motion.div
                key={showcase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl border border-white/10 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${showcase.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-yellow-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{showcase.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{showcase.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">by {showcase.author}</span>
                    <span className={`text-sm font-bold bg-gradient-to-r ${showcase.color} bg-clip-text text-transparent`}>
                      {showcase.metric}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Get Involved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-xl border border-purple-500/20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative">
            <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-4xl font-black gradient-text mb-4">Get Involved</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a developer, designer, writer, or enthusiast, there's a place for you in our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="https://github.com/yourusername/myg-instabot"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-instagram rounded-full font-bold btn-ripple hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>Contribute on GitHub</span>
              </motion.a>
              <motion.a
                href="https://discord.gg/myg-instabot"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Discord</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

