import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, ArrowRight, Sparkles } from 'lucide-react'
import PaymentModal from './PaymentModal'

export default function Pricing() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const features = [
    'Unlimited synthetic identities',
    'Gmail + Instagram creation pipeline',
    'Fleet orchestration (grouping, task splitting, dynamic control)',
    'Embedded AI agent per identity (self-healing, adaptive targeting)',
    'Advanced AI strategy fallback (DOM diffing, selector caching)',
    'Dynamic schedule control for messaging & story views',
    'Proxy pool integration + geolocation mapping',
    'Custom profile templating: bios, AI post seeding',
    'Performance audit logs + success tracking',
    'API access for lead extraction & status monitoring',
    'Role-based sub-accounts for team ops',
    'Secure webhook + signal output to external tools',
    'IP fingerprint rotation + headless fleet stealth mode',
    'Full system logs, state recovery snapshots, crash loop protection',
    'Priority roadmap input (Founder exclusive)',
    'Private Founder Discord channel',
    'Early beta access to new features',
    'White-label dashboard option',
  ]

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            One Pass.{' '}
            <span className="gradient-text">Lifetime Access.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No subscriptions. No recurring fees. One payment, unlimited power forever.
          </p>
        </motion.div>

        {/* Founder's Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass rounded-3xl p-10 md:p-12 ring-2 ring-yellow-500 shadow-2xl shadow-yellow-500/30 glow">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 rounded-full font-bold glow flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Founder's Pass</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Left Column - Pricing */}
              <div className="flex flex-col items-center md:items-start justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl md:text-4xl font-black mb-4 text-center md:text-left">
                  Lifetime Access
                </h3>
                
                <p className="text-gray-400 mb-6 text-center md:text-left">
                  One payment. All features. Forever.
                </p>

                {/* Price */}
                <div className="mb-6 text-center md:text-left">
                  <div className="text-sm text-gray-500 mb-2">Regular Value</div>
                  <div className="text-2xl font-bold line-through text-gray-600 mb-3">$1,997</div>
                  <div className="text-sm text-green-500 font-semibold mb-2">Founder's Price</div>
                  <div className="text-6xl font-black gradient-text mb-2">$997</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => setIsPaymentModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto px-10 py-5 bg-gradient-instagram rounded-full font-bold text-lg btn-ripple shadow-lg shadow-purple-500/50 flex items-center justify-center space-x-2"
                >
                  <span>Secure Your Key Now</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-sm text-gray-500 mt-4 text-center md:text-left">
                  After presale: <span className="text-white font-bold">$497/month</span>
                </p>
              </div>

              {/* Right Column - Features */}
              <div>
                <h4 className="text-xl font-bold mb-4">Everything Included:</h4>
                <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-4 glass px-8 py-4 rounded-full">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Lifetime License Guarantee</div>
              <div className="text-sm text-gray-400">One payment, lifetime access. No hidden fees, ever.</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            🔒 Secured by Stripe · 100% Secure Payment · Instant Access
          </p>
        </motion.div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </section>
  )
}


