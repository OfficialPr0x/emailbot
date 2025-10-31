import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Calendar,
  Palette,
  User,
  Sparkles,
  Flame,
  Zap,
  Users,
  UserPlus,
  Circle,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

const modules = [
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    enabled: true,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'content',
    name: 'Content Calendar',
    icon: Calendar,
    enabled: true,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'brand',
    name: 'Brand Assets',
    icon: Palette,
    enabled: true,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'persona',
    name: 'Persona Mode',
    icon: User,
    enabled: true,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'niche',
    name: 'Niche Intel',
    icon: Sparkles,
    enabled: true,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'reactor',
    name: 'Creator Reactor',
    icon: Flame,
    enabled: true,
    gradient: true,
    color: 'from-orange-500 via-red-500 to-pink-600',
  },
  {
    id: 'growth',
    name: 'Growth Engine',
    icon: Zap,
    enabled: true,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'influencer',
    name: 'Influencer Engine',
    icon: UserPlus,
    enabled: true,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'audience',
    name: 'Audience Builder',
    icon: Users,
    enabled: true,
    color: 'from-teal-500 to-emerald-500',
  },
]

export default function StudioSidebar({ activeModule }) {
  const { setActiveModule } = useStore()
  const [hoveredModule, setHoveredModule] = useState(null)

  return (
    <motion.div 
      className="w-72 h-screen flex flex-col relative"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Gradient Border Glow */}
      <div 
        className="absolute inset-y-0 right-0 w-[1px] opacity-50"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
        }}
      />

      {/* Logo/Branding */}
      <motion.div 
        className="p-6 pb-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <h1 className="text-2xl font-bold gradient-text-primary smooth-text">
            Creator Studio X
          </h1>
          <p className="text-sm text-slate-400 mt-2 smooth-text">
            Creative Command Nucleus
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            className="h-[2px] mt-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.5), transparent)',
            }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Module Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {modules.map((module, index) => {
          const Icon = module.icon
          const isActive = activeModule === module.id
          const isHovered = hoveredModule === module.id
          const isDisabled = !module.enabled

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <motion.button
                onClick={() => !isDisabled && setActiveModule(module.id)}
                disabled={isDisabled}
                className="w-full relative group"
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator Line */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b ${module.color}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 32, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                </AnimatePresence>

                {/* Button Content */}
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${isActive
                      ? 'glass-medium text-white'
                      : isDisabled
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white'
                    }
                  `}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                      : isHovered && !isDisabled
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                  }}
                >
                  {/* Icon Container */}
                  <motion.div
                    className={`
                      relative flex items-center justify-center w-9 h-9 rounded-lg
                      ${isActive ? 'glass-light' : ''}
                    `}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Icon Glow */}
                    {(isActive || isHovered) && (
                      <motion.div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${module.color} opacity-20 blur-md`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 0.3 : 0.2 }}
                      />
                    )}
                    
                    <Icon 
                      className={`
                        w-5 h-5 relative z-10 transition-all duration-300
                        ${module.gradient && isActive ? 'gradient-text-reactor' : ''}
                      `}
                    />
                  </motion.div>

                  {/* Module Name */}
                  <span className={`
                    font-medium text-sm smooth-text flex-1 text-left
                    ${isActive ? 'font-semibold' : ''}
                  `}>
                    {module.name}
                  </span>

                  {/* Active Pulse Indicator */}
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${module.color.split(' ')[0].replace('from-', 'var(--')})`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </div>

                {/* Hover Glow Effect */}
                {isHovered && !isDisabled && !isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px rgba(168, 85, 247, 0.1)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.button>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer Status */}
      <motion.div 
        className="p-4 mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div 
          className="glass-light rounded-xl p-4"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-200">All Systems Online</p>
              <p className="text-xs text-slate-400 mt-0.5">Ready for creation</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

