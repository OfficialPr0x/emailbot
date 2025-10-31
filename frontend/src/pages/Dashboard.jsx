import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Activity,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Area,
  AreaChart,
} from 'recharts'
import toast from 'react-hot-toast'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'

const mockChartData = [
  { date: 'Mon', accounts: 12, growth: 5 },
  { date: 'Tue', accounts: 19, growth: 7 },
  { date: 'Wed', accounts: 15, growth: -4 },
  { date: 'Thu', accounts: 25, growth: 10 },
  { date: 'Fri', accounts: 22, growth: -3 },
  { date: 'Sat', accounts: 30, growth: 8 },
  { date: 'Sun', accounts: 28, growth: -2 },
]

// Animated counter hook
function useAnimatedCounter(targetValue, duration = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * targetValue))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [targetValue, duration])

  return count
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, setStats, accounts, activities, activeJobs } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await accountsAPI.getStats()
      setStats(data.stats || {
        total: 0,
        active: 0,
        creating: 0,
        failed: 0,
        successRate: 0,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load stats')
      setStats({
        total: 0,
        active: 0,
        creating: 0,
        failed: 0,
        successRate: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  // Pre-compute animated values at top level (not inside map)
  const totalAnimated = useAnimatedCounter(stats.total || 0, 1500)
  const activeAnimated = useAnimatedCounter(stats.active || 0, 1500)
  const creatingAnimated = useAnimatedCounter(stats.creating || 0, 1500)
  const successRateAnimated = useAnimatedCounter(stats.successRate || 0, 1500)

  const statCards = [
    {
      title: 'ASSETS DEPLOYED',
      value: stats.total || 0,
      animatedValue: totalAnimated,
      icon: Users,
      trend: '+12%',
      trendUp: true,
      gradient: 'from-cyan-400 to-cyan-500',
    },
    {
      title: 'ASSETS ARMED',
      value: stats.active || 0,
      animatedValue: activeAnimated,
      icon: CheckCircle2,
      trend: '+8%',
      trendUp: true,
      gradient: 'from-emerald-400 to-emerald-500',
    },
    {
      title: 'DEPLOYMENT IN PROGRESS',
      value: stats.creating || 0,
      animatedValue: creatingAnimated,
      icon: Clock,
      trend: 'LIVE',
      gradient: 'from-amber-400 to-amber-500',
      pulse: true,
    },
    {
      title: 'OPERATIONAL SUCCESS RATE',
      value: stats.successRate || 0,
      animatedValue: successRateAnimated,
      icon: TrendingUp,
      trend: '+3%',
      trendUp: true,
      gradient: 'from-blue-400 to-cyan-500',
      isPercentage: true,
    },
  ]

  const quickActions = [
    {
      title: 'DEPLOY ASSET',
      description: 'Initialize new Instagram automation',
      icon: Plus,
      gradient: 'from-emerald-500 to-teal-500',
      to: '/create',
    },
    {
      title: 'TACTICAL INTEL',
      description: 'Performance metrics & analytics',
      icon: BarChart3,
      gradient: 'from-cyan-500 to-blue-500',
      to: '/analytics',
    },
    {
      title: 'LIVE OPERATIONS',
      description: 'Real-time deployment monitoring',
      icon: Activity,
      gradient: 'from-amber-500 to-orange-500',
      to: '/monitor',
    },
    {
      title: 'LAUNCH REACTOR',
      description: 'Content operations command',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-emerald-500',
      to: '/studio',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-5xl font-bold gradient-text-command smooth-text mb-2 tracking-wider font-mono">
              COMMAND CENTER
            </h1>
            <p className="text-slate-400 text-lg">
              Monitor and deploy automation assets across your Instagram fleet
            </p>
          </div>
          <motion.button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg border border-cyan-400/30"
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Deploy Asset
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.title}
              className="glass-tactical rounded-lg p-6 relative overflow-hidden group border border-cyan-500/20"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Background Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">{stat.title}</p>
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center border border-white/10`}
                    animate={stat.pulse ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8],
                    } : {}}
                    transition={stat.pulse ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    } : {}}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 font-mono">
                  {loading ? '...' : stat.isPercentage ? `${stat.animatedValue}%` : stat.animatedValue}
                </h2>

                <div className="flex items-center gap-2">
                  {stat.trendUp && (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={cn(
                    'text-sm font-bold font-mono uppercase tracking-wider',
                    stat.trendUp ? 'text-emerald-400' : 'text-amber-400'
                  )}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Chart Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Growth Chart */}
        <motion.div
          className="glass-tactical rounded-lg p-6 border border-cyan-500/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wider">FLEET EXPANSION TRAJECTORY</h3>
              <p className="text-sm text-slate-400 mt-1">Weekly deployment analysis</p>
            </div>
            <div className="px-3 py-1 rounded-lg glass-tactical border border-cyan-500/20">
              <span className="text-sm text-slate-300 font-mono">Last 7 days</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorAccounts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="accounts"
                stroke="#a855f7"
                strokeWidth={3}
                fill="url(#colorAccounts)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          className="glass-tactical rounded-lg p-6 border border-cyan-500/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                <Activity className="w-5 h-5 text-cyan-400" />
                SYSTEM LOG
              </h3>
              <p className="text-sm text-slate-400 mt-1">Real-time operations feed</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">No recent activity</p>
              </div>
            ) : (
              activities.slice(0, 5).map((activity, index) => {
                const isError = activity.type.includes('error')
                const isSuccess = activity.type.includes('complete')
                
                return (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={cn(
                        'mt-1 w-2 h-2 rounded-full flex-shrink-0',
                        isError && 'bg-red-500',
                        isSuccess && 'bg-emerald-500',
                        !isError && !isSuccess && 'bg-blue-500'
                      )}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-slate-200">{activity.message}</p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-mono uppercase tracking-wider">
          <Zap className="w-6 h-6 text-cyan-400" />
          TACTICAL COMMANDS
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            
            return (
              <motion.button
                key={action.title}
                className="glass-tactical rounded-lg p-6 text-left group relative overflow-hidden border border-cyan-500/20"
                onClick={() => navigate(action.to)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Glow */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`}
                />

                <div className="relative z-10">
                  <div 
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 border border-white/10`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 font-mono uppercase tracking-wider">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-400">{action.description}</p>
                </div>

                <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Active Jobs (if any) */}
      <AnimatePresence>
        {activeJobs.length > 0 && (
          <motion.div
            className="glass-medium rounded-2xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Active Jobs
            </h3>
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between glass-light rounded-xl p-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{job.stage}</p>
                    <p className="text-xs text-slate-400 mt-1">{job.message}</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
                    {job.progress}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

