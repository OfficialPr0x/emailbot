import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Rocket, Shield, Zap, MessageCircle, Star, Users, Gift } from 'lucide-react'

export default function FounderPerks() {
  const perks = [
    {
      icon: Crown,
      title: 'Lifetime Access',
      description: 'Full Architect-tier features forever. No subscriptions, no recurring fees, no price increases.',
      value: '$17,892',
      valueLabel: '3-year value',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Rocket,
      title: 'Unlimited Identities',
      description: 'Create unlimited synthetic identities. Competitors charge $0.50-2.00 per account. You pay $0.',
      value: '$2,000+',
      valueLabel: 'saved per month',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Advanced AI Healing',
      description: 'Embedded AI agent per identity. Auto-adapts to platform changes. Zero manual updates required.',
      value: '99.2%',
      valueLabel: 'success rate',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Priority Roadmap Input',
      description: 'Direct influence on feature development. Your requests get built first. Regular users wait.',
      value: 'VIP',
      valueLabel: 'access level',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: MessageCircle,
      title: 'Founder Discord Channel',
      description: 'Private community with 347 founders. Share strategies, get support, network with top operators.',
      value: '$2,997',
      valueLabel: 'mastermind value',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Star,
      title: 'Early Beta Access',
      description: 'First access to proxy pooling, webhooks, API v2, and every new feature we build. Forever.',
      value: '∞',
      valueLabel: 'future features',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Users,
      title: 'Role-Based Sub-Accounts',
      description: 'Team collaboration for agencies. $97/mo value for regular users. Included free for founders.',
      value: '$3,492',
      valueLabel: '3-year value',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Gift,
      title: 'White-Label Dashboard',
      description: 'Resell to clients with your branding. Turn your $997 investment into $10K+ monthly revenue.',
      value: '$10K+',
      valueLabel: 'revenue potential',
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
            <span className="gradient-text">$28,381</span> Worth of Value.{' '}
            <br />
            Yours for $997.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            This isn't a "discount." This is founder pricing. These features would cost you $28K+ if bought separately. 
            <span className="text-white font-bold"> Lock in now or pay 28x more later.</span>
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
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{perk.description}</p>
              
              {/* Value Badge */}
              <div className={`mt-auto pt-4 border-t border-white/10`}>
                <div className={`text-2xl font-black bg-gradient-to-r ${perk.gradient} bg-clip-text text-transparent`}>
                  {perk.value}
                </div>
                <div className="text-xs text-gray-500 uppercase">{perk.valueLabel}</div>
              </div>
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

