import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BarChart3, TrendingUp, Users, Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { analyticsAPI } from '@/services/api'
import toast from 'react-hot-toast'

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
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
    toast.success('Analytics refreshed!')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p>Loading real-time analytics...</p>
      </div>
    </div>
  }

  if (!analytics) {
    return <div className="flex items-center justify-center h-96">No data available</div>
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights from your database
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalCreated}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.thisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.failed} failed accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Working Proxies</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proxyStats?.working || 0}</div>
            <p className="text-xs text-muted-foreground">
              {proxyStats?.failing || 0} failing, {proxyStats?.untested || 0} untested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Accounts created</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>Account creation over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accounts" fill="#8b5cf6" name="Created" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data yet - create some accounts to see stats!
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status Distribution</CardTitle>
            <CardDescription>Current status of all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-4">
                  {statusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No accounts yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Proxy Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Proxy Statistics</CardTitle>
          <CardDescription>Real-time proxy health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Wifi className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{proxyStats?.working || 0}</p>
                <p className="text-sm text-muted-foreground">Working Proxies</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <WifiOff className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{proxyStats?.failing || 0}</p>
                <p className="text-sm text-muted-foreground">Failing Proxies</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Activity className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{proxyStats?.untested || 0}</p>
                <p className="text-sm text-muted-foreground">Untested Proxies</p>
              </div>
            </div>
          </div>
          
          {proxyStats?.workingProxies && proxyStats.workingProxies.length > 0 ? (
            <div>
              <h4 className="font-semibold mb-3">Top Performing Proxies</h4>
              <div className="space-y-2">
                {proxyStats.workingProxies.slice(0, 5).map((proxy, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-mono">{proxy.proxy}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {proxy.successRate} success
                      </span>
                      <Badge variant="success">{proxy.uses} uses</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No proxy statistics yet - proxies will be tracked as you create accounts
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
