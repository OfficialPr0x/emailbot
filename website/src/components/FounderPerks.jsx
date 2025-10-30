import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Rocket, Shield, Zap, MessageCircle, Star, Users, Gift } from 'lucide-react'

export default function FounderPerks() {
  const perks = [
    {
      icon: Crown,
      title: 'Lifetime Access',
      description: 'Full Architect-tier features forever. No subscriptions, no recurring fees.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Rocket,
      title: 'Unlimited Identities',
      description: 'Create unlimited synthetic identities with fleet orchestration and dynamic control.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Advanced AI Healing',
      description: 'Embedded AI agent per identity with self-healing and adaptive targeting.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Priority Roadmap Input',
      description: 'Direct influence on feature development and update priorities.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: MessageCircle,
      title: 'Founder Discord Channel',
      description: 'Private community access with direct line to the core team.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Star,
      title: 'Early Beta Access',
      description: 'First access to new integrations, proxy pooling, and webhook features.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Users,
      title: 'Role-Based Sub-Accounts',
      description: 'Team collaboration tools with permission management.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Gift,
      title: 'White-Label Dashboard',
      description: 'Optional custom branding for your agency or business.',
      gradient: 'from-teal-500 to-cyan-500',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Founder's Pass Exclusive</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need.{' '}
            <span className="gradient-text">One Payment.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get lifetime access to all features, forever. No subscriptions, no hidden fees, no limits.
          </p>
        </motion.div>

        {/* Perks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${perk.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <perk.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{perk.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{perk.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 glass px-8 py-4 rounded-full">
            <div className="text-left">
              <div className="text-sm text-gray-400">Regular Value</div>
              <div className="text-2xl font-black line-through text-gray-600">$1,997</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="text-left">
              <div className="text-sm text-gray-400">Founder's Price</div>
              <div className="text-3xl font-black gradient-text">$997</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="text-left">
              <div className="text-sm text-gray-400">After Launch</div>
              <div className="text-xl font-bold text-white">$497<span className="text-sm text-gray-500">/month</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

