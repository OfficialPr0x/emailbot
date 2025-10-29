import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">AI-Powered Automation</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              Scale Your{' '}
              <span className="gradient-text">Instagram</span>
              <br />
              Empire On Autopilot
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Create unlimited Instagram & Gmail accounts with AI-powered profiles, 
              stealth automation, and enterprise-grade proxy rotation. 
              <span className="text-white font-semibold"> Zero manual work required.</span>
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              {[
                { icon: Zap, text: '100 Premium Proxies' },
                { icon: Shield, text: 'Stealth Mode' },
                { icon: TrendingUp, text: '99.2% Success Rate' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 glass px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#pricing"
                className="group px-8 py-4 bg-gradient-instagram rounded-full font-bold text-lg btn-ripple hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Creating Accounts</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="#how-it-works"
                className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-purple border-2 border-gray-950"
                    />
                  ))}
                </div>
                <span>2,847+ users</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Floating Card 1 - Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 glass p-4 rounded-2xl glow z-10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-instagram rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-xs text-gray-400">Accounts Created</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 - Live Status */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-10 left-0 glass p-4 rounded-2xl glow z-10"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Live Creating...</span>
              </div>
              <div className="text-xs text-gray-400">@sarah_marketing_2024</div>
              <div className="mt-2 w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-instagram"
                  initial={{ width: '0%' }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Main Dashboard Mockup */}
            <div className="relative glass rounded-3xl p-8 glow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold">Dashboard</h3>
                    <p className="text-sm text-gray-400">Real-time monitoring</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-instagram rounded-xl"></div>
                </div>
                
                {/* Chart Area */}
                <div className="h-48 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-4 flex items-end space-x-2">
                  {[40, 70, 45, 80, 60, 90, 75, 85].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-instagram rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Active', value: '847' },
                    { label: 'Success Rate', value: '99.2%' },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-3 rounded-xl">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


