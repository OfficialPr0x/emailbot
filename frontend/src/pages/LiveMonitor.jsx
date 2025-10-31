import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Mail, 
  Instagram, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { jobsAPI, activitiesAPI } from '@/services/api'
import { formatRelativeTime, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function LiveMonitor() {
  const { activities, activeJobs, setActivities } = useStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeJobs: 0,
    successRate: 0,
    avgTime: '0m',
  })

  useEffect(() => {
    loadData()
    // Refresh every 3 seconds for live feel
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update stats when jobs change
    setStats({
      activeJobs: activeJobs.length,
      successRate: activities.filter(a => a.type === 'account_created').length > 0
        ? Math.round((activities.filter(a => a.type === 'account_created').length / activities.filter(a => a.type.includes('complete') || a.type.includes('error')).length) * 100)
        : 0,
      avgTime: '2m 34s',
    })
  }, [activeJobs, activities])

  const loadData = async () => {
    try {
      const [jobsData, activitiesData] = await Promise.all([
        jobsAPI.getActive(),
        activitiesAPI.getAll({ limit: 50 })
      ])
      
      // Update store if needed
      if (activitiesData.activities) {
        setActivities(activitiesData.activities)
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'account_created':
        return CheckCircle2
      case 'job_error':
        return XCircle
      case 'job_complete':
        return CheckCircle2
      case 'job_progress':
        return Clock
      default:
        return Activity
    }
  }

  const getActivityColor = (type) => {
    if (type.includes('error')) return 'text-red-400 bg-red-500/20'
    if (type.includes('complete') || type.includes('created')) return 'text-emerald-400 bg-emerald-500/20'
    return 'text-blue-400 bg-blue-500/20'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold gradient-text-primary smooth-text mb-2">
              Live Monitor
            </h1>
            <div className="text-slate-400 text-lg flex items-center gap-2">
              <motion.span
                className="inline-flex"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </motion.span>
              Real-time updates from your automation
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {[
          { label: 'Active Jobs', value: stats.activeJobs, icon: Zap, gradient: 'from-amber-500 to-orange-500' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Avg Time', value: stats.avgTime, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
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
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white">{stat.value}</h2>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          Active Jobs
        </h2>

        <AnimatePresence mode="wait">
          {activeJobs.length === 0 ? (
            <motion.div
              key="empty"
              className="glass-medium rounded-2xl p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Activity className="w-16 h-16 text-slate-600 mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">No active jobs</h3>
                <p className="text-slate-400">
                  Start creating an account to see live progress here
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="glass-medium rounded-2xl p-6 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Live indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full glass-light">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-semibold text-emerald-400">LIVE</span>
                  </div>

                  {/* Job Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">{job.stage}</h3>
                    <p className="text-sm text-slate-400">{job.message}</p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-white">{job.progress}%</span>
                    </div>
                    
                    {/* Circular Progress */}
                    <div className="relative w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Feed */}
      <div className="glass-medium rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              Activity Feed
            </h2>
            <p className="text-sm text-slate-400 mt-1">Recent events and notifications</p>
          </div>
          <motion.div
            className="px-3 py-1 rounded-lg glass-light"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-semibold text-slate-300">Auto-refresh: 3s</span>
          </motion.div>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
              <p className="text-slate-400">
                Activity will appear here as you use the bot
              </p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.type)
              
              return (
                <motion.div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 rounded-xl glass-light border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-tight">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-500 capitalize">
                        {activity.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

