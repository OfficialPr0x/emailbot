import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Flame, Clock } from 'lucide-react'
import PaymentModal from './PaymentModal'

export default function CTA() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass rounded-3xl p-12 md:p-16 overflow-hidden glow"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-full mb-6 glow"
            >
              <Flame className="w-4 h-4 text-white animate-pulse" />
              <span className="text-sm font-bold text-white">Only 1,000 Lifetime Keys</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            >
              <span className="gradient-text">$997 Once.</span> Yours Forever.{' '}
              <br className="hidden md:block" />
              No Subscriptions. Ever.
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Join 347 founders who locked in lifetime access. After 1,000 keys sell out, 
              you'll pay <span className="text-red-400 font-bold line-through">$497/month</span> or miss out forever.
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              {[
                { icon: Crown, text: 'Lifetime access - $997' },
                { icon: Flame, text: '653 keys remaining' },
                { icon: Clock, text: 'Price increases at 750 keys' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 glass px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4 justify-center"
            >
              <motion.button
                onClick={() => setIsPaymentModalOpen(true)}
                className="group px-10 py-5 bg-gradient-instagram rounded-full font-bold text-xl btn-ripple hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="w-6 h-6" />
                <span>Claim Your Lifetime Pass</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Trust Line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm text-gray-500"
            >
              🔥 127 keys claimed in last 24h · 💰 Save $16,895+ · 🔒 Secured by Stripe · ⚡ Instant access
            </motion.p>
            
            {/* Payment Modal */}
            <PaymentModal 
              isOpen={isPaymentModalOpen} 
              onClose={() => setIsPaymentModalOpen(false)} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}


