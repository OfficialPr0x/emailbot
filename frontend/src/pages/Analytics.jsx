import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { analyticsAPI } from '@/services/api'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

//Animated counter hook
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

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [proxyStats, setProxyStats] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [overviewRes, proxiesRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getProxies(),
      ])
      
      setAnalytics(overviewRes.data)
      setProxyStats(proxiesRes.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      toast.error('Failed to load analytics', {
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
    toast.success('Analytics refreshed!', {
      style: {
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
      },
    })
  }

  // IMPORTANT: Pre-compute animated values at TOP LEVEL (before any returns)
  // Use safe defaults to avoid conditional hook calls
  const totalAccountsAnimated = useAnimatedCounter(analytics?.overview?.totalCreated || 0, 1500)
  const successRateAnimated = useAnimatedCounter(analytics?.overview?.successRate || 0, 1500)
  const workingProxiesAnimated = useAnimatedCounter(proxyStats?.working || 0, 1500)
  const thisWeekAnimated = useAnimatedCounter(analytics?.overview?.thisWeek || 0, 1500)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading real-time analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="glass-medium rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
          <p className="text-slate-400">Create some accounts to see analytics</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const weeklyData = Object.entries(analytics.weeklyPerformance || {}).map(([day, data]) => ({
    day,
    accounts: data.created,
    failed: data.failed,
  }))

  const statusData = [
    { name: 'Active', value: analytics.accountStatus.active, color: '#10b981' },
    { name: 'Pending', value: analytics.accountStatus.pending, color: '#f59e0b' },
    { name: 'Failed', value: analytics.accountStatus.failed, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const statCards = [
    {
      title: 'Total Accounts',
      value: analytics.overview.totalCreated,
      animatedValue: totalAccountsAnimated,
      subtitle: `${analytics.overview.thisWeek} this week`,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Success Rate',
      value: analytics.overview.successRate,
      animatedValue: successRateAnimated,
      subtitle: `${analytics.overview.failed} failed accounts`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      isPercentage: true,
    },
    {
      title: 'Working Proxies',
      value: proxyStats?.working || 0,
      animatedValue: workingProxiesAnimated,
      subtitle: `${proxyStats?.failing || 0} failing, ${proxyStats?.untested || 0} untested`,
      icon: Wifi,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'This Week',
      value: analytics.overview.thisWeek,
      animatedValue: thisWeekAnimated,
      subtitle: 'Accounts created',
      icon: BarChart3,
      gradient: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-5xl font-bold gradient-text-primary smooth-text mb-2">
            Analytics
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time insights from your database
          </p>
        </div>
        <motion.button
          className="px-6 py-3 rounded-xl glass-light text-white font-semibold flex items-center gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.title}
              className="glass-medium rounded-2xl p-6 relative overflow-hidden group"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* Background Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  {stat.isPercentage ? `${stat.animatedValue}%` : stat.animatedValue}
                </h2>

                <p className="text-sm text-slate-400">{stat.subtitle}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Performance */}
        <motion.div
          className="glass-medium rounded-2xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Weekly Performance</h3>
            <p className="text-sm text-slate-400">Account creation over the last 7 days</p>
          </div>

          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAccounts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
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
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorAccounts)"
                  name="Created"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#colorFailed)"
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No data yet - create some accounts to see stats!</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Account Status Distribution */}
        <motion.div
          className="glass-medium rounded-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Account Status Distribution</h3>
            <p className="text-sm text-slate-400">Current status of all accounts</p>
          </div>

          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 flex justify-center gap-6">
                {statusData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }} 
                    />
                    <span className="text-sm text-slate-300">
                      {entry.name}: <span className="font-bold text-white">{entry.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No accounts yet</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Proxy Statistics */}
      <motion.div
        className="glass-medium rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-1">Proxy Statistics</h3>
          <p className="text-sm text-slate-400">Real-time proxy health and performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {[
            { 
              label: 'Working Proxies', 
              value: proxyStats?.working || 0, 
              icon: Wifi, 
              gradient: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-500/20'
            },
            { 
              label: 'Failing Proxies', 
              value: proxyStats?.failing || 0, 
              icon: WifiOff, 
              gradient: 'from-red-500 to-pink-500',
              bg: 'bg-red-500/20'
            },
            { 
              label: 'Untested Proxies', 
              value: proxyStats?.untested || 0, 
              icon: Activity, 
              gradient: 'from-slate-500 to-slate-600',
              bg: 'bg-slate-500/20'
            },
          ].map((stat) => {
            const Icon = stat.icon
            
            return (
              <div key={stat.label} className={`glass-light rounded-xl p-5 flex items-center gap-4`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
        
        {proxyStats?.workingProxies && proxyStats.workingProxies.length > 0 ? (
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Top Performing Proxies</h4>
            <div className="space-y-3">
              {proxyStats.workingProxies.slice(0, 5).map((proxy, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center justify-between p-4 glass-light rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <span className="text-sm font-mono text-slate-300">{proxy.proxy}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-semibold">
                      {proxy.successRate} success
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                      {proxy.uses} uses
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Wifi className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No proxy statistics yet - proxies will be tracked as you create accounts</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
