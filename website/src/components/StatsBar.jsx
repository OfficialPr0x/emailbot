import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function StatsBar() {
  const [currentPurchase, setCurrentPurchase] = useState(0)

  const recentPurchases = [
    { name: '@alex_marketing', time: '2min ago' },
    { name: '@sarah_growth', time: '5min ago' },
    { name: '@mike_agency', time: '12min ago' },
    { name: '@jessica_smm', time: '18min ago' },
    { name: '@david_digital', time: '25min ago' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPurchase((prev) => (prev + 1) % recentPurchases.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [recentPurchases.length])

  const stats = [
    {
      label: 'Keys Claimed',
      value: '23',
      suffix: '/100',
      color: 'text-red-500',
    },
    {
      label: 'Keys Remaining',
      value: '77',
      suffix: '',
      color: 'text-green-500',
    },
    {
      label: 'Time to Launch',
      value: '16',
      suffix: ' days',
      color: 'text-yellow-500',
    },
  ]

  return (
    <section className="py-12 border-y border-white/10 bg-gradient-to-r from-purple-950/20 to-pink-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}

          {/* Live Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center col-span-2 lg:col-span-1 flex items-center justify-center"
          >
            <div className="glass px-4 py-3 rounded-xl flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Latest</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPurchase}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-bold text-white"
                  >
                    {recentPurchases[currentPurchase].name}
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-gray-400">
                  {recentPurchases[currentPurchase].time}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


