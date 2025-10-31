import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, Lock, Zap } from 'lucide-react'

export default function RiskReversal() {
  const guarantees = [
    {
      icon: Shield,
      title: 'Lifetime License Guarantee',
      description: 'Your license never expires. No renewals, no hidden fees, no bait-and-switch. Once you buy it, you own it forever.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Price Lock Promise',
      description: 'You pay $997 today and never pay again. Even when we raise prices to $1,497 or introduce mandatory subscriptions, you\'re locked in.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'No waiting. No approval process. No onboarding calls. The moment your payment clears, you get your license key and full dashboard access.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Check,
      title: 'All Future Updates Included',
      description: 'Every new feature, integration, and improvement we build—you get it for free. Forever. Proxy pooling, webhooks, API v2, everything.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const trustBadges = [
    { icon: '🔒', text: 'SSL Encrypted' },
    { icon: '💳', text: 'Stripe Secured' },
    { icon: '⚡', text: 'Instant Delivery' },
    { icon: '🛡️', text: 'GDPR Compliant' },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Zero Risk</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            You're <span className="gradient-text">100% Protected</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We've removed every possible reason to hesitate. This is the safest, smartest investment you'll make.
          </p>
        </motion.div>

        {/* Guarantees Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${guarantee.color} rounded-xl flex items-center justify-center mb-4`}>
                <guarantee.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{guarantee.title}</h3>
              <p className="text-gray-400 leading-relaxed">{guarantee.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 glass px-6 py-3 rounded-full"
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-sm font-semibold text-gray-300">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 glass rounded-2xl p-8"
        >
          <p className="text-lg text-gray-400 mb-4">
            <span className="text-white font-bold">347 founders trusted us.</span> Zero regrets. 
            Zero chargebacks. Zero complaints.
          </p>
          <p className="text-2xl font-black">
            Your turn to join the <span className="gradient-text">smartest decision</span> you'll make this year.
          </p>
        </motion.div>
      </div>
    </section>
  )
}


