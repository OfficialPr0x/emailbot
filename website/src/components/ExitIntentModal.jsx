import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Crown, TrendingUp, Clock } from 'lucide-react'

export default function ExitIntentModal({ onOpenPaymentModal }) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only show if mouse leaves from top of window and hasn't been shown yet
      if (e.clientY <= 0 && !hasShown && !sessionStorage.getItem('exitIntentShown')) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitIntentShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleClaim = () => {
    setIsVisible(false)
    onOpenPaymentModal()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              className="glass rounded-3xl max-w-2xl w-full p-8 md:p-12 glow relative border-2 border-red-500/50"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Urgent Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-full animate-pulse">
                  <AlertCircle className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">⚠️ WAIT! DON'T MISS THIS</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
                Are You Sure You Want to{' '}
                <span className="text-red-500">Walk Away</span>?
              </h2>

              {/* Subheadline */}
              <p className="text-xl text-gray-300 text-center mb-8">
                You're about to <span className="text-white font-bold">lose the chance</span> to lock in the lowest price ever. 
                After these 1,000 keys sell out, you'll pay <span className="text-red-400 font-bold line-through">$497/month</span> or be locked out forever.
              </p>

              {/* What You're Leaving Behind */}
              <div className="glass rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-center">What You're Leaving Behind:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
                    <div className="text-3xl font-black text-red-400 mb-1">$16,895</div>
                    <div className="text-xs text-gray-400">You'll pay this much more</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                    <div className="text-3xl font-black text-yellow-400 mb-1">653</div>
                    <div className="text-xs text-gray-400">Keys disappearing fast</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <div className="text-3xl font-black text-purple-400 mb-1">∞</div>
                    <div className="text-xs text-gray-400">Lifetime of updates lost</div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-lg font-semibold">
                    <span className="text-green-400">347 founders</span> already locked in
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-sm">
                    Next price jump in <span className="text-red-400 font-bold">153 keys</span>
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4">
                <motion.button
                  onClick={handleClaim}
                  className="w-full py-5 bg-gradient-instagram rounded-full font-bold text-xl btn-ripple hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="w-6 h-6" />
                  <span>Yes! Lock In My Founder's Pass - $997</span>
                </motion.button>

                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  No thanks, I'll pay $497/month instead
                </button>
              </div>

              {/* Countdown Pressure */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  This modal will only appear once. If you leave, you may never see this price again.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

