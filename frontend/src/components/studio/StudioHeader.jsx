import { motion } from 'framer-motion'
import { ArrowLeft, Instagram, TrendingUp, Activity, Wifi, WifiOff, AlertTriangle, Command, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function StudioHeader() {
  const navigate = useNavigate()
  const { studioData } = useStore()
  const { currentAccount, proxyStatus, shadowbanRisk, metrics } = studioData

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <motion.div 
      className="relative px-6 py-4"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Bottom Gradient Border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
        }}
      />

      <div className="flex items-center justify-between">
        {/* Left: Back Button + Account Info */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => navigate('/accounts')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-light text-slate-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium smooth-text">Back</span>
          </motion.button>

          {/* Separator */}
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Account Info */}
          <div className="flex items-center gap-3">
            {/* Avatar with Gradient Ring */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-60"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white/20">
                {currentAccount?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h2 className="text-base font-semibold text-white smooth-text flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>{currentAccount?.username || 'Loading...'}</span>
              </h2>
              <p className="text-xs text-slate-400 smooth-text">
                {currentAccount?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Stats + Status Indicators */}
        <div className="flex items-center gap-6">
          {/* Quick Stats - Glassmorphic Cards */}
          <div className="flex items-center gap-3">
            {/* Followers */}
            <motion.div 
              className="glass-light rounded-lg px-4 py-2.5"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 smooth-text">Followers</p>
                  <p className="text-sm font-bold text-white smooth-text">
                    {formatNumber(currentAccount?.followers || 0)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Posts */}
            <motion.div 
              className="glass-light rounded-lg px-4 py-2.5"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 smooth-text">Posts</p>
                  <p className="text-sm font-bold text-white smooth-text">
                    {currentAccount?.posts || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Engagement */}
            <motion.div 
              className="glass-light rounded-lg px-4 py-2.5"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">%</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 smooth-text">Engagement</p>
                  <p className="text-sm font-bold text-white smooth-text">
                    {metrics?.latest?.engagementRate?.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            {/* Proxy Status */}
            <motion.div 
              className="glass-light rounded-lg px-3 py-2 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              {proxyStatus?.status === 'online' ? (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                  <span className="text-xs font-medium text-emerald-400 smooth-text">
                    Proxy Online
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-medium text-rose-400 smooth-text">
                    Proxy Offline
                  </span>
                </>
              )}
            </motion.div>

            {/* Shadowban Warning */}
            {shadowbanRisk > 0.5 && (
              <motion.div 
                className="glass-light rounded-lg px-3 py-2 flex items-center gap-2"
                style={{
                  background: shadowbanRisk > 0.7 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(251, 191, 36, 0.1)',
                  borderColor: shadowbanRisk > 0.7 
                    ? 'rgba(239, 68, 68, 0.3)' 
                    : 'rgba(251, 191, 36, 0.3)',
                  borderWidth: '1px',
                }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <AlertTriangle className={`w-4 h-4 ${shadowbanRisk > 0.7 ? 'text-rose-400' : 'text-amber-400'}`} />
                <span className={`text-xs font-medium smooth-text ${shadowbanRisk > 0.7 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {shadowbanRisk > 0.7 ? 'High Risk' : 'Medium Risk'}
                </span>
              </motion.div>
            )}

            {/* Command Palette Trigger (Future Feature) */}
            <motion.button
              className="glass-light rounded-lg px-3 py-2 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Command className="w-4 h-4" />
              <span className="text-xs font-medium smooth-text">⌘K</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

