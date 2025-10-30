import React from 'react'
import { useUser, UserButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Settings, 
  Activity, 
  Zap,
  TrendingUp,
  Mail,
  Instagram
} from 'lucide-react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Active Accounts', value: '0', icon: Users, color: 'text-blue-400' },
    { label: 'Total Created', value: '0', icon: TrendingUp, color: 'text-green-400' },
    { label: 'API Requests', value: '0', icon: Activity, color: 'text-purple-400' },
    { label: 'Success Rate', value: '0%', icon: Zap, color: 'text-yellow-400' },
  ]

  const quickActions = [
    { 
      title: 'Create Gmail Account', 
      description: 'Generate a new Gmail account with AI', 
      icon: Mail, 
      gradient: 'from-blue-500 to-cyan-500',
      link: '#'
    },
    { 
      title: 'Create Instagram Account', 
      description: 'Set up Instagram with existing Gmail', 
      icon: Instagram, 
      gradient: 'from-pink-500 to-purple-500',
      link: '#'
    },
    { 
      title: 'View Analytics', 
      description: 'Track your account performance', 
      icon: TrendingUp, 
      gradient: 'from-green-500 to-emerald-500',
      link: '#'
    },
    { 
      title: 'Settings', 
      description: 'Configure your preferences', 
      icon: Settings, 
      gradient: 'from-gray-500 to-slate-500',
      link: '#'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="flex items-center space-x-3">
                <img
                  src="https://res.cloudinary.com/dolij7wjr/image/upload/v1761774571/649d7188-741a-4898-90e1-2ab07bc09c6f_coslbt.png"
                  alt="MyG InstaBot Logo"
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-2xl font-black gradient-text">MyG InstaBot™</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 border-2 border-purple-500'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName || 'User'}</span>!
          </h1>
          <p className="text-gray-400">
            Manage your Instagram automation and track your account creation progress.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-transparent opacity-20`}></div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Backend Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-8 border border-purple-500/30"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-instagram flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Connect to Backend API</h3>
              <p className="text-gray-400 mb-4">
                This dashboard is ready to integrate with your backend at <code className="text-purple-400 bg-white/10 px-2 py-1 rounded">http://localhost:3000</code>. 
                You can now implement API calls to create accounts, view analytics, and manage your automation.
              </p>
              <Link 
                to="/api-reference"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-instagram rounded-lg hover:opacity-90 transition-opacity"
              >
                <span className="font-semibold">View API Documentation</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

