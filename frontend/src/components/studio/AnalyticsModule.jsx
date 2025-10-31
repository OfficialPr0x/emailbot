import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Activity, Users, Heart, MessageCircle, 
  Eye, Target, Zap, Award, Calendar, RefreshCw, Download
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import studioAPI from '@/services/studioAPI'
import { fadeInUp, staggerChildren, childVariant } from '@/lib/animations'

// Animated Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return animation.stop
  }, [value, count])

  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, change, gradient, prefix = '', suffix = '' }) {
  const isPositive = change >= 0

  return (
    <motion.div
      className="glass-medium rounded-2xl p-6 neu-shadow-md hover-lift relative overflow-hidden"
      variants={childVariant}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <motion.div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-bold">
                {isPositive ? '+' : ''}{change}
              </span>
            </motion.div>
          )}
        </div>

        <div>
          <p className="text-sm text-slate-400 smooth-text mb-1">{label}</p>
          <p className="text-3xl font-bold text-white smooth-text">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function AnalyticsModule() {
  const { accountId } = useParams()
  const { studioData } = useStore()
  const { metrics, shadowbanRisk, proxyStatus } = studioData

  const [timelineData, setTimelineData] = useState([])
  const [timeRange, setTimeRange] = useState('30')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTimeline()
  }, [accountId, timeRange])

  const loadTimeline = async () => {
    try {
      setLoading(true)
      const result = await studioAPI.getMetricsTimeline(accountId, { limit: parseInt(timeRange) })
      setTimelineData(result.data || [])
    } catch (error) {
      console.error('Failed to load timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getShadowbanColor = (risk) => {
    if (risk < 0.3) return 'from-emerald-500 to-teal-500'
    if (risk < 0.7) return 'from-amber-500 to-orange-500'
    return 'from-rose-500 to-red-500'
  }

  const getShadowbanStatus = (risk) => {
    if (risk < 0.3) return 'Safe'
    if (risk < 0.7) return 'Warning'
    return 'High Risk'
  }

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text-accent smooth-text">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1 smooth-text">
            Track performance, engagement, and account health
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="glass-medium rounded-xl p-1 flex gap-1">
            {['7', '30', '90'].map((days) => (
              <motion.button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all relative
                  ${timeRange === days ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {timeRange === days && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                    layoutId="activeTimeRange"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{days} Days</span>
              </motion.button>
            ))}
          </div>

          {/* Refresh Button */}
          <motion.button
            onClick={loadTimeline}
            className="glass-light p-3 rounded-xl text-slate-300 hover:text-white"
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerChildren}
      >
        <StatCard
          icon={Users}
          label="Followers"
          value={metrics?.latest?.followers || 0}
          change={metrics?.growth?.followers}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Heart}
          label="Total Likes"
          value={metrics?.latest?.likes || 0}
          change={metrics?.growth?.likes}
          gradient="from-rose-500 to-pink-500"
        />
        <StatCard
          icon={MessageCircle}
          label="Total Comments"
          value={metrics?.latest?.comments || 0}
          change={metrics?.growth?.comments}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Activity}
          label="Engagement Rate"
          value={parseFloat(metrics?.averageEngagementRate || 0)}
          gradient="from-emerald-500 to-teal-500"
          suffix="%"
        />
      </motion.div>

      {/* Shadowban Risk Card */}
      <motion.div
        className="glass-medium rounded-2xl p-6 neu-shadow-md"
        variants={childVariant}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getShadowbanColor(shadowbanRisk)} flex items-center justify-center`}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                  '0 0 40px rgba(168, 85, 247, 0.5)',
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Target className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-white smooth-text">
                Shadowban Risk Assessment
              </h3>
              <p className="text-sm text-slate-400 smooth-text mt-1">
                Current Status: <span className={`font-bold bg-gradient-to-r ${getShadowbanColor(shadowbanRisk)} bg-clip-text text-transparent`}>
                  {getShadowbanStatus(shadowbanRisk)}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white smooth-text">
              {(shadowbanRisk * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-slate-400 smooth-text mt-1">Risk Level</p>
          </div>
        </div>

        {/* Risk Bar */}
        <div className="mt-6">
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getShadowbanColor(shadowbanRisk)}`}
              initial={{ width: 0 }}
              animate={{ width: `${shadowbanRisk * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth Chart */}
        <motion.div
          className="glass-medium rounded-2xl p-6 neu-shadow-md"
          variants={childVariant}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white smooth-text">
                Follower Growth
              </h3>
              <p className="text-sm text-slate-400 smooth-text mt-1">
                Last {timeRange} days trend
              </p>
            </div>
            <div className="glass-light p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="followers" 
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#followersGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Chart */}
        <motion.div
          className="glass-medium rounded-2xl p-6 neu-shadow-md"
          variants={childVariant}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white smooth-text">
                Engagement Metrics
              </h3>
              <p className="text-sm text-slate-400 smooth-text mt-1">
                Likes & Comments over time
              </p>
            </div>
            <div className="glass-light p-2 rounded-lg">
              <Activity className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
              <Bar dataKey="likes" fill="#ec4899" radius={[8, 8, 0, 0]} />
              <Bar dataKey="comments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Achievements / Milestones */}
      <motion.div
        className="glass-medium rounded-2xl p-6 neu-shadow-md"
        variants={childVariant}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white smooth-text">
              Recent Milestones
            </h3>
            <p className="text-sm text-slate-400 smooth-text">
              Track your progress and achievements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: '1K Followers', achieved: metrics?.latest?.followers >= 1000, target: 1000 },
            { label: '10K Likes', achieved: metrics?.latest?.likes >= 10000, target: 10000 },
            { label: '5% Engagement', achieved: metrics?.averageEngagementRate >= 5, target: 5 },
          ].map((milestone, index) => (
            <motion.div
              key={index}
              className={`
                glass-light rounded-xl p-4 border-2 transition-all
                ${milestone.achieved 
                  ? 'border-emerald-500/50 bg-emerald-500/10' 
                  : 'border-slate-700'}
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${milestone.achieved ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {milestone.label}
                </span>
                {milestone.achieved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Zap className="w-5 h-5 text-amber-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
