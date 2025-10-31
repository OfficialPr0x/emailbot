import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Plus,
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'COMMAND', to: '/', icon: LayoutDashboard, color: 'from-cyan-400 to-cyan-500' },
  { name: 'ASSETS', to: '/accounts', icon: Users, color: 'from-emerald-400 to-emerald-500' },
  { name: 'REACTOR', to: '/studio', icon: Sparkles, gradient: true, color: 'from-cyan-400 via-emerald-400 to-cyan-500' },
  { name: 'DEPLOY', to: '/create', icon: Plus, color: 'from-emerald-500 to-teal-500' },
  { name: 'OPERATIONS', to: '/monitor', icon: Activity, color: 'from-amber-400 to-amber-500' },
  { name: 'INTEL', to: '/analytics', icon: BarChart3, color: 'from-blue-400 to-cyan-500' },
  { name: 'CONFIG', to: '/settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore()
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-72'
      )}
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Tactical Border Glow */}
      <div 
        className="absolute inset-y-0 right-0 w-[1px] opacity-50"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.5), transparent)',
        }}
      />

      {/* Logo */}
      <motion.div 
        className="flex h-20 items-center justify-between px-4 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://res.cloudinary.com/dolij7wjr/image/upload/v1761773520/ChatGPT_Image_Oct_29_2025_05_31_26_PM_ujms0h.png"
                alt="MyG Command Logo"
                className="h-12 w-12 rounded-lg ring-2 ring-cyan-500/50"
              />
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 blur-md opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text-command smooth-text tracking-wider">
                MyG COMMAND
              </h1>
              <p className="text-xs text-slate-400 smooth-text font-mono">Tactical Operations</p>
            </div>
          </div>
        )}
        <motion.button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg glass-light text-slate-300 hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              sidebarCollapsed && 'rotate-180'
            )}
          />
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-4">
        {navigation.map((item, index) => {
          const Icon = item.icon
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {({ isActive }) => (
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.div
                    className="w-full relative group"
                    whileHover={{ scale: isActive ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active Indicator Line */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b ${item.color}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 32, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Button Content */}
                    <div
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200',
                        isActive
                          ? 'glass-tactical text-white'
                          : 'text-slate-300 hover:text-white',
                        sidebarCollapsed && 'justify-center'
                      )}
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(0, 255, 148, 0.05))'
                          : hoveredItem === item.to
                          ? 'rgba(0, 229, 255, 0.05)'
                          : 'transparent',
                      }}
                    >
                      {/* Icon Container */}
                      <motion.div
                        className={cn(
                          'relative flex items-center justify-center w-9 h-9 rounded-lg',
                          isActive && 'glass-light'
                        )}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {/* Icon Glow */}
                        {(isActive || hoveredItem === item.to) && (
                          <motion.div
                            className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.color} opacity-20 blur-md`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isActive ? 0.3 : 0.2 }}
                          />
                        )}
                        
                        <Icon 
                          className={cn(
                            'w-5 h-5 relative z-10 transition-all duration-300',
                            item.gradient && isActive && 'gradient-text-primary'
                          )}
                        />
                      </motion.div>

                      {/* Module Name */}
                      {!sidebarCollapsed && (
                        <span className={cn(
                          'font-medium text-sm smooth-text flex-1',
                          isActive && 'font-semibold'
                        )}>
                          {item.name}
                        </span>
                      )}

                      {/* Active Pulse Indicator */}
                      {!sidebarCollapsed && isActive && (
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
                          {item.gradient ? (
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <motion.div 
          className="p-4 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div 
            className="glass-tactical rounded-lg p-4"
            style={{
              borderTop: '1px solid rgba(0, 229, 255, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center relative">
                <Zap className="w-5 h-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-lg bg-emerald-500"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">SYSTEM ARMED</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">Unlimited operations</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}

