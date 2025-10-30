import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, TrendingUp } from 'lucide-react'

export default function KeysRemaining({ totalKeys = 1000, soldKeys = 0 }) {
  const remaining = totalKeys - soldKeys
  const percentageSold = (soldKeys / totalKeys) * 100
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    if (soldKeys > 0) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [soldKeys])

  const getUrgencyLevel = () => {
    if (percentageSold >= 90) return 'critical'
    if (percentageSold >= 70) return 'high'
    if (percentageSold >= 50) return 'medium'
    return 'low'
  }

  const urgencyLevel = getUrgencyLevel()

  const urgencyColors = {
    critical: 'from-red-500 to-orange-500',
    high: 'from-orange-500 to-yellow-500',
    medium: 'from-yellow-500 to-green-500',
    low: 'from-green-500 to-blue-500',
  }

  const urgencyMessages = {
    critical: '🔥 ALMOST SOLD OUT!',
    high: '⚡ Selling Fast!',
    medium: '🚀 Limited Spots',
    low: '✨ Early Access',
  }

  return (
    <motion.div
      animate={showPulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="inline-flex flex-col items-center space-y-3"
    >
      {/* Main Counter */}
      <div className="glass px-6 py-4 rounded-2xl glow">
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className={`w-12 h-12 bg-gradient-to-br ${urgencyColors[urgencyLevel]} rounded-xl flex items-center justify-center`}>
            <Flame className="w-6 h-6 text-white" />
          </div>

          {/* Counter */}
          <div className="flex flex-col">
            <div className="text-3xl font-black">
              <AnimatePresence mode="wait">
                <motion.span
                  key={remaining}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="gradient-text"
                >
                  {remaining}
                </motion.span>
              </AnimatePresence>
              <span className="text-gray-500">/{totalKeys}</span>
            </div>
            <div className="text-sm text-gray-400 font-medium">Keys Remaining</div>
          </div>

          {/* Urgency Badge */}
          <div className={`px-3 py-1 bg-gradient-to-r ${urgencyColors[urgencyLevel]} rounded-full`}>
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {urgencyMessages[urgencyLevel]}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentageSold}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${urgencyColors[urgencyLevel]}`}
          />
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <span className="text-gray-400 font-medium">LIVE PRESALE</span>
      </div>
    </motion.div>
  )
}

