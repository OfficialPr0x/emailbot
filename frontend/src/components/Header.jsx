import { useState } from 'react'
import { Bell, Moon, Sun, User } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

export default function Header() {
  const { theme, toggleTheme, activities } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Count recent activities (last 5 minutes)
  const recentActivities = activities.filter(activity => {
    const activityTime = new Date(activity.timestamp)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return activityTime > fiveMinutesAgo
  })
  const unreadCount = recentActivities.length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">Welcome back! 👋</h2>
          <p className="text-sm text-muted-foreground">
            Manage your Instagram accounts like a pro
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs" variant="destructive">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="divide-y">
                  {activities.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No recent activity
                    </div>
                  ) : (
                    activities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-accent/50 transition-colors">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* User Menu */}
        <Button variant="ghost" size="icon" className="ml-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-instagram">
            <User className="h-4 w-4 text-white" />
          </div>
        </Button>
      </div>
    </header>
  )
}

