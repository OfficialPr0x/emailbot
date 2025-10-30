import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock } from 'lucide-react'

export default function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const recentPurchases = [
    { name: 'Alex M.', location: 'San Francisco, CA', time: '2 minutes ago', avatar: '🚀' },
    { name: 'Sarah K.', location: 'London, UK', time: '5 minutes ago', avatar: '💎' },
    { name: 'Mike R.', location: 'Austin, TX', time: '8 minutes ago', avatar: '🔥' },
    { name: 'Jessica L.', location: 'Toronto, Canada', time: '12 minutes ago', avatar: '⚡' },
    { name: 'David P.', location: 'Sydney, Australia', time: '15 minutes ago', avatar: '🌟' },
    { name: 'Emily W.', location: 'New York, NY', time: '18 minutes ago', avatar: '👑' },
    { name: 'James H.', location: 'Miami, FL', time: '22 minutes ago', avatar: '🎯' },
    { name: 'Lisa C.', location: 'Dubai, UAE', time: '25 minutes ago', avatar: '💰' },
    { name: 'Tom B.', location: 'Singapore', time: '28 minutes ago', avatar: '🚁' },
    { name: 'Anna S.', location: 'Berlin, Germany', time: '31 minutes ago', avatar: '🎨' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentPurchases.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-8 border-y border-white/10 bg-gradient-to-r from-purple-950/30 to-pink-950/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Live indicator */}
          <div className="flex items-center space-x-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-semibold text-gray-400">LIVE</span>
          </div>

          {/* Purchase ticker */}
          <div className="flex-1 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="glass px-6 py-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-instagram rounded-full flex items-center justify-center text-2xl">
                    {recentPurchases[currentIndex].avatar}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="font-bold text-white">
                      {recentPurchases[currentIndex].name} secured a Founder's Pass
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{recentPurchases[currentIndex].location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{recentPurchases[currentIndex].time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="hidden md:block bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-white">✓ VERIFIED</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Counter */}
          <div className="hidden lg:block glass px-4 py-3 rounded-xl text-center">
            <div className="text-2xl font-black gradient-text">347</div>
            <div className="text-xs text-gray-500">Founders</div>
          </div>
        </div>
      </div>
    </section>
  )
}

