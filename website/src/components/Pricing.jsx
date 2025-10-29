import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for testing the waters',
      monthlyPrice: 97,
      yearlyPrice: 970,
      features: [
        '50 accounts/month',
        'AI profile generation',
        'Basic analytics',
        'Email support',
        '10 premium proxies',
        'Standard success rate',
      ],
      cta: 'Start Free Trial',
      popular: false,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Professional',
      icon: Crown,
      description: 'Most popular for agencies',
      monthlyPrice: 297,
      yearlyPrice: 2970,
      features: [
        '500 accounts/month',
        'Advanced AI profiles',
        'Full analytics dashboard',
        'Priority support',
        '50 premium proxies',
        '99.2% success rate',
        'Bulk operations',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Enterprise',
      icon: Rocket,
      description: 'Unlimited scale for pros',
      monthlyPrice: 797,
      yearlyPrice: 7970,
      features: [
        'Unlimited accounts',
        'Custom AI training',
        'White-label dashboard',
        '24/7 dedicated support',
        '100 premium proxies',
        '99.5% success rate',
        'Advanced automation',
        'Custom integrations',
        'Team collaboration',
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-orange-500 to-red-500',
    },
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Pricing That{' '}
            <span className="gradient-text">Actually Makes Sense</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            No hidden fees. No surprise charges. Just transparent pricing that scales with your needs.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center glass rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-instagram text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-instagram text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs glass px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative glass rounded-3xl p-8 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/30' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-instagram px-6 py-2 rounded-full text-sm font-bold glow">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className="w-7 h-7 text-white" />
              </div>

              {/* Plan Info */}
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black gradient-text">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-gray-500 mt-1">
                    ${plan.yearlyPrice} billed annually
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-full font-bold flex items-center justify-center space-x-2 btn-ripple transition-all ${
                  plan.popular
                    ? 'bg-gradient-instagram shadow-lg shadow-purple-500/50'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 glass px-8 py-4 rounded-full">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">14-Day Money-Back Guarantee</div>
              <div className="text-sm text-gray-400">Not satisfied? Get a full refund, no questions asked.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


