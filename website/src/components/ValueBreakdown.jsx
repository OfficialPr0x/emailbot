import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Infinity, Calculator } from 'lucide-react'

export default function ValueBreakdown() {
  const calculations = [
    {
      title: 'Regular Monthly Cost',
      description: 'Architect tier subscription',
      calculation: '$497/month × 24 months',
      total: '$11,928',
      color: 'from-red-500 to-orange-500',
    },
    {
      title: 'Your Founder Price',
      description: 'One-time payment, lifetime access',
      calculation: '$997 × 1 payment',
      total: '$997',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const savings = [
    { period: 'Year 1', saved: '$4,967', emoji: '💰' },
    { period: 'Year 2', saved: '$10,931', emoji: '🚀' },
    { period: 'Year 3', saved: '$16,895', emoji: '💎' },
    { period: 'Lifetime', saved: 'INFINITE', emoji: '♾️' },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Do The Math</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Save <span className="gradient-text">$10,931</span> in Just 24 Months
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A Founder's Pass pays for itself in <span className="text-white font-bold">2 months</span>. 
            After that? Pure profit. Forever.
          </p>
        </motion.div>

        {/* Cost Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {calculations.map((calc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass rounded-3xl p-8 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${calc.color} opacity-20 blur-3xl`}></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-400 mb-6">{calc.description}</p>
                
                <div className="space-y-4">
                  <div className="text-lg text-gray-300">{calc.calculation}</div>
                  <div className={`text-5xl font-black bg-gradient-to-r ${calc.color} bg-clip-text text-transparent`}>
                    {calc.total}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Savings Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Your Savings Over Time</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {savings.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="text-sm text-gray-400 mb-2">{item.period}</div>
                <div className="text-2xl font-black gradient-text">{item.saved}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ROI Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass rounded-2xl p-8"
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span className="text-3xl font-black">
              <span className="gradient-text">1,097%</span> ROI in Year 1
            </span>
          </div>
          <p className="text-gray-400">
            No other software investment comes close to this return. 
            <span className="text-white font-semibold"> This is the smartest $997 you'll spend this year.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}


