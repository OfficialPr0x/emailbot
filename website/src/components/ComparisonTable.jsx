import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, Crown, Sparkles } from 'lucide-react'

export default function ComparisonTable() {
  const features = [
    { name: 'Price', founder: '$997 one-time', monthly: '$497/month', competitor: '$299-899/month' },
    { name: 'Synthetic Identities', founder: 'Unlimited', monthly: 'Unlimited', competitor: '10-100' },
    { name: 'Gmail + Instagram Creation', founder: true, monthly: true, competitor: true },
    { name: 'AI Self-Healing', founder: true, monthly: true, competitor: false },
    { name: 'Fleet Orchestration', founder: true, monthly: true, competitor: false },
    { name: 'Priority Support', founder: '24/7', monthly: '24/7', competitor: 'Email only' },
    { name: 'API Access', founder: true, monthly: true, competitor: 'Limited' },
    { name: 'White-Label Dashboard', founder: true, monthly: true, competitor: false },
    { name: 'Founder Discord Channel', founder: true, monthly: false, competitor: false },
    { name: 'Priority Roadmap Input', founder: true, monthly: false, competitor: false },
    { name: 'Early Beta Access', founder: true, monthly: false, competitor: false },
    { name: 'Lifetime Updates', founder: true, monthly: false, competitor: false },
    { name: 'Total Cost (3 years)', founder: '$997', monthly: '$17,892', competitor: '$10,764-32,364' },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">The Clear Winner</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How We <span className="gradient-text">Stack Up</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No hidden fees. No annual increases. No "enterprise" upsells. Just pay once, own forever.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
            <div className="text-sm font-semibold text-gray-400">Feature</div>
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full mb-2">
                <Crown className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Founder's Pass</span>
              </div>
            </div>
            <div className="text-center text-sm font-semibold text-gray-400">Monthly Subscription</div>
            <div className="text-center text-sm font-semibold text-gray-400">Competitors</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className={`grid grid-cols-4 gap-4 p-6 hover:bg-white/5 transition-colors ${
                  feature.name === 'Total Cost (3 years)' ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 font-bold' : ''
                }`}
              >
                <div className="text-sm font-medium flex items-center">
                  {feature.name}
                </div>
                
                {/* Founder's Pass Column */}
                <div className="flex items-center justify-center">
                  {typeof feature.founder === 'boolean' ? (
                    feature.founder ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600" />
                    )
                  ) : (
                    <span className={`text-sm text-center ${
                      feature.name === 'Total Cost (3 years)' ? 'text-2xl font-black gradient-text' : 'text-white font-semibold'
                    }`}>
                      {feature.founder}
                    </span>
                  )}
                </div>

                {/* Monthly Column */}
                <div className="flex items-center justify-center">
                  {typeof feature.monthly === 'boolean' ? (
                    feature.monthly ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600" />
                    )
                  ) : (
                    <span className={`text-sm text-center ${
                      feature.name === 'Total Cost (3 years)' ? 'text-xl font-bold text-red-400 line-through' : 'text-gray-400'
                    }`}>
                      {feature.monthly}
                    </span>
                  )}
                </div>

                {/* Competitor Column */}
                <div className="flex items-center justify-center">
                  {typeof feature.competitor === 'boolean' ? (
                    feature.competitor ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600" />
                    )
                  ) : (
                    <span className={`text-sm text-center ${
                      feature.name === 'Total Cost (3 years)' ? 'text-lg font-bold text-gray-500' : 'text-gray-500'
                    }`}>
                      {feature.competitor}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-2xl font-bold mb-4">
            Save <span className="text-green-400">$16,895</span> over 3 years. 
            <span className="gradient-text"> That's not a discount. That's life-changing.</span>
          </p>
          <p className="text-gray-400">
            Every month you wait costs you $497. Don't let this opportunity slip away.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

