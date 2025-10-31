import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Moon, Sun, User, Activity, CheckCircle, XCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '@/lib/utils'

export default function Header() {
  const { theme, toggleTheme, activities } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Count recent activities (last 5 minutes)
  const recentActivities = activities.filter(activity => {
    const activityTime = new Date(activity.timestamp)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return activityTime > fiveMinutesAgo
  })
  const unreadCount = recentActivities.length

  const getActivityIcon = (type) => {
    if (type.includes('error')) return XCircle
    if (type.includes('complete')) return CheckCircle
    return Activity
  }

  return (
    <motion.header 
      className="sticky top-0 z-30 flex h-20 items-center justify-between px-6 lg:px-8"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div>
            <h2 className="text-xl font-bold gradient-text-command smooth-text tracking-wider font-mono">
              SYSTEM ONLINE — ACCESS GRANTED
            </h2>
            <p className="text-sm text-slate-400 mt-0.5 smooth-text">
              Command & Scale Your Instagram Fleet
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg glass-tactical text-slate-300 hover:text-white border border-cyan-500/20"
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center text-xs font-bold text-white font-mono"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div 
                  className="absolute right-0 mt-2 w-96 rounded-lg z-50 max-h-[32rem] overflow-hidden"
                  style={{
                    background: 'rgba(10, 14, 26, 0.95)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="p-4 border-b border-cyan-500/20">
                    <h3 className="font-bold text-white smooth-text flex items-center gap-2 font-mono uppercase tracking-wider text-sm">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      System Activity
                    </h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        {unreadCount} new {unreadCount === 1 ? 'notification' : 'notifications'}
                      </p>
                    )}
                  </div>
                  <div className="divide-y divide-white/5 overflow-y-auto max-h-[24rem]">
                    {activities.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No recent activity</p>
                      </div>
                    ) : (
                      activities.slice(0, 10).map((activity, index) => {
                        const Icon = getActivityIcon(activity.type)
                        const isError = activity.type.includes('error')
                        const isSuccess = activity.type.includes('complete')
                        
                        return (
                          <motion.div 
                            key={activity.id} 
                            className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                isError && 'bg-red-500/20',
                                isSuccess && 'bg-emerald-500/20',
                                !isError && !isSuccess && 'bg-blue-500/20'
                              )}>
                                <Icon className={cn(
                                  'w-4 h-4',
                                  isError && 'text-red-400',
                                  isSuccess && 'text-emerald-400',
                                  !isError && !isSuccess && 'text-blue-400'
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200">{activity.message}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(activity.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.button
          className="flex h-10 w-10 items-center justify-center rounded-lg glass-tactical text-slate-300 hover:text-white border border-cyan-500/20"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* User Menu */}
        <motion.button 
          className="ml-2 relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 relative overflow-hidden border border-cyan-400/30">
            <User className="h-5 w-5 text-white relative z-10" />
            
            {/* Hover Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-50 transition-opacity"
              initial={false}
            />
          </div>
          
          {/* Ring Animation */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-cyan-500"
            initial={{ scale: 1, opacity: 0 }}
            whileHover={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>
    </motion.header>
  )
}

