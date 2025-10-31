import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Lock, Zap } from 'lucide-react'

export default function ScarcityTiers() {
  const tiers = [
    {
      range: 'Keys 1-500',
      price: '$997',
      status: 'Current Price',
      progress: 69, // 347/500 = 69%
      remaining: 153,
      statusColor: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      icon: Zap,
    },
    {
      range: 'Keys 501-750',
      price: '$1,497',
      status: 'Tier 2',
      progress: 0,
      remaining: 250,
      statusColor: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      icon: TrendingUp,
    },
    {
      range: 'Keys 751-1,000',
      price: '$1,997',
      status: 'Final Tier',
      progress: 0,
      remaining: 250,
      statusColor: 'text-red-400',
      bgColor: 'from-red-500/20 to-pink-500/20',
      icon: Lock,
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Price Increases Automatically</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            The Price <span className="gradient-text">Doubles</span> as Keys Sell Out
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're not raising prices because we want to. We're raising them because scarcity creates value. 
            <span className="text-white font-bold"> Every 250 keys sold = automatic price increase.</span>
          </p>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-2xl p-6 relative overflow-hidden ${
                index === 0 ? 'ring-2 ring-green-500 glow' : ''
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.bgColor} opacity-50`}></div>
              
              {/* Current badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                  ACTIVE NOW
                </div>
              )}

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center mb-4">
                  <tier.icon className="w-6 h-6" />
                </div>

                {/* Range */}
                <div className="text-sm text-gray-400 mb-2">{tier.range}</div>
                
                {/* Price */}
                <div className="text-4xl font-black mb-4">{tier.price}</div>
                
                {/* Status */}
                <div className={`text-sm font-semibold ${tier.statusColor} mb-4`}>
                  {tier.status}
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tier.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-full bg-gradient-to-r ${tier.bgColor.replace('/20', '')}`}
                    />
                  </div>
                </div>

                {/* Remaining */}
                <div className="text-sm text-gray-500">
                  {tier.remaining} keys remaining in this tier
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Urgency Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center border-2 border-red-500/50"
        >
          <div className="text-2xl font-bold mb-4">
            ⚠️ Next price jump: <span className="text-red-400">153 keys away</span>
          </div>
          <p className="text-gray-400 mb-6">
            At current sales velocity, Tier 1 pricing will be gone in{' '}
            <span className="text-white font-bold">72 hours</span>. 
            Don't pay $500 more because you waited.
          </p>
          <div className="inline-flex items-center space-x-8 glass px-6 py-4 rounded-xl">
            <div>
              <div className="text-sm text-gray-500">Your Price Now</div>
              <div className="text-3xl font-black text-green-400">$997</div>
            </div>
            <div className="text-3xl text-gray-600">→</div>
            <div>
              <div className="text-sm text-gray-500">Price if You Wait</div>
              <div className="text-3xl font-black text-red-400">$1,497+</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


