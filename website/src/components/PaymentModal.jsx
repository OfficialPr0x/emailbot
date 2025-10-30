import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Check, Loader2, AlertCircle } from 'lucide-react'
import { createCheckoutSession, redirectToCheckout } from '../services/stripe'

export default function PaymentModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const features = [
    'Unlimited synthetic identities',
    'Full Architect-tier features',
    'Fleet orchestration & dynamic control',
    'Embedded AI agent per identity',
    'Priority roadmap input',
    'Private Founder Discord channel',
    'Early beta access to new features',
    'Role-based sub-accounts',
    'White-label dashboard option',
    'Lifetime access - no subscriptions',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsProcessing(true)

    try {
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${window.location.origin}/?payment=cancelled`

      const session = await createCheckoutSession(email, successUrl, cancelUrl)
      
      // Redirect to Stripe checkout
      await redirectToCheckout(session.id)
    } catch (err) {
      setError('Failed to process payment. Please try again.')
      console.error('Payment error:', err)
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto glow relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">
                    Founder's Pass
                  </h2>
                  <p className="text-gray-400">Lifetime access. One payment. No subscriptions.</p>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Regular</div>
                    <div className="text-2xl font-bold line-through text-gray-600">$1,997</div>
                  </div>
                  <div className="text-4xl text-gray-600">→</div>
                  <div className="text-center">
                    <div className="text-sm text-green-500 font-semibold">Founder's Price</div>
                    <div className="text-5xl font-black gradient-text">$997</div>
                  </div>
                </div>

                {/* Features */}
                <div className="glass rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4">What's Included:</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isProcessing}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 glass px-4 py-3 rounded-xl border border-red-500/50"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-400">{error}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-instagram rounded-full font-bold text-lg btn-ripple hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        <span>Secure Your Founder's Pass - $997</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
                  <p>🔒 Secured by Stripe · SSL Encrypted</p>
                  <p>💳 One-time payment · No recurring charges</p>
                  <p>✅ Instant access after payment</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

