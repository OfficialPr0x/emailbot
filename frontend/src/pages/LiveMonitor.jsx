import { useEffect, useState } from 'react'
import { Activity, Mail, Instagram, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useStore } from '@/store/useStore'
import { jobsAPI, activitiesAPI } from '@/services/api'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function LiveMonitor() {
  const { activities, activeJobs, setActivities } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

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
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'job_error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'job_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Monitor</h1>
        <p className="text-muted-foreground mt-1">
          Real-time updates from your account creation jobs
        </p>
      </div>

      {/* Active Jobs */}
      <div className="grid gap-4 md:grid-cols-2">
        {activeJobs.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No active jobs</h3>
              <p className="text-sm text-muted-foreground">
                Start creating an account to see live progress here
              </p>
            </CardContent>
          </Card>
        ) : (
          activeJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{job.stage}</CardTitle>
                  <Badge className="animate-pulse">Live</Badge>
                </div>
                <CardDescription>{job.message}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Recent events and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No activity yet</h3>
                <p className="text-sm text-muted-foreground">
                  Activity will appear here as you use the bot
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-tight">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

