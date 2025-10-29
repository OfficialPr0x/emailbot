import { useEffect, useState } from 'react'
import { Users, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import toast from 'react-hot-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Link } from 'react-router-dom'

const mockChartData = [
  { date: 'Mon', accounts: 12 },
  { date: 'Tue', accounts: 19 },
  { date: 'Wed', accounts: 15 },
  { date: 'Thu', accounts: 25 },
  { date: 'Fri', accounts: 22 },
  { date: 'Sat', accounts: 30 },
  { date: 'Sun', accounts: 28 },
]

export default function Dashboard() {
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

  const statCards = [
    {
      title: 'Total Accounts',
      value: stats.total,
      icon: Users,
      trend: '+12%',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active',
      value: stats.active,
      icon: CheckCircle2,
      trend: '+8%',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Creating',
      value: stats.creating,
      icon: Clock,
      trend: 'Live',
      gradient: 'from-orange-500 to-yellow-500',
      pulse: true,
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      trend: '+3%',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your Instagram accounts
          </p>
        </div>
        <Link to="/create">
          <Button className="gradient-instagram shadow-lg">
            Create New Account
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                  <Badge variant="outline" className="mt-2">
                    {stat.trend}
                  </Badge>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.pulse ? 'animate-pulse-slow' : ''}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Account Growth</CardTitle>
            <CardDescription>Weekly account creation trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockChartData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accounts"
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live updates from your accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[250px] overflow-y-auto">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === 'account_created' ? 'bg-green-500' :
                      activity.type === 'job_error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
            <CardDescription>Account creation in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{job.stage}</p>
                    <p className="text-xs text-muted-foreground">{job.message}</p>
                  </div>
                  <Badge variant="info">{job.progress}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/create">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </Link>
            <Link to="/accounts">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View All Accounts
              </Button>
            </Link>
            <Link to="/monitor">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Live Monitor
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

