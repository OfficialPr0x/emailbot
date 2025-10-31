import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Instagram, 
  TrendingUp, 
  ArrowRight,
  Plus,
  BarChart3,
  Calendar,
  Palette,
  User,
  Zap,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function StudioSelection() {
  const navigate = useNavigate()
  const { accounts, setAccounts } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await accountsAPI.getAll()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Failed to load accounts:', error)
      toast.error('Failed to load accounts', {
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      })
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const activeAccounts = accounts.filter(acc => acc.status === 'active')

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 blur-2xl opacity-50" />
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <div>
          <h1 className="text-5xl font-bold gradient-text-primary smooth-text mb-3">
            Creator Studio X
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select an account to manage content, analyze performance, and grow your Instagram presence
          </p>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
      >
        {[
          { label: 'Total Accounts', value: accounts.length, icon: Instagram, gradient: 'from-purple-500 to-pink-500' },
          { label: 'Active Accounts', value: activeAccounts.length, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Studio Ready', value: activeAccounts.length, icon: Sparkles, gradient: 'from-violet-500 to-fuchsia-500' },
        ].map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.label}
              className="glass-medium rounded-2xl p-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Account Selection Grid */}
      <AnimatePresence mode="wait">
        {accounts.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Select an Account
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } },
              }}
            >
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  className="glass-medium rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  onClick={() => navigate(`/studio/${account.id}`)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Status Badge */}
                  <div className={cn(
                    'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold',
                    account.status === 'active' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  )}>
                    {account.status}
                  </div>

                  {/* Account Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold"
                      whileHover={{ rotate: 5 }}
                    >
                      {account.username?.charAt(0)?.toUpperCase() || 'A'}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg group-hover:gradient-text-primary transition-all truncate">
                        {account.username || 'N/A'}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: 'Followers', value: account.followers || 0 },
                      { label: 'Following', value: account.following || 0 },
                      { label: 'Posts', value: account.posts || 0 },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Open Studio Button */}
                  <motion.button
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 group/btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/studio/${account.id}`)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Open Studio
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Empty State */
          <motion.div
            key="empty"
            className="glass-medium rounded-2xl p-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Instagram className="w-20 h-20 mx-auto mb-6 text-slate-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Accounts Yet
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Create your first Instagram account to start using Creator Studio X
              </p>
              <motion.button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 mx-auto"
                onClick={() => navigate('/create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Create First Account
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Overview */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          What You Can Do in Studio X
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            {
              title: 'Analytics',
              description: 'Track growth, engagement, and shadowban risk',
              icon: BarChart3,
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              title: 'Content Calendar',
              description: 'Plan and schedule posts, reels, and stories',
              icon: Calendar,
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              title: 'Brand Assets',
              description: 'Manage profile, bio, and visual identity',
              icon: Palette,
              gradient: 'from-violet-500 to-purple-500',
            },
            {
              title: 'Persona Mode',
              description: 'Switch content personalities on the fly',
              icon: User,
              gradient: 'from-emerald-500 to-teal-500',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                className="glass-light rounded-2xl p-6 text-center group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

