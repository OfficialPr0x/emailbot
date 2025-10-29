import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Activity, 
  BarChart3, 
  Settings,
  ChevronLeft,
  Instagram,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Accounts', to: '/accounts', icon: Users },
  { name: 'Create Account', to: '/create', icon: Plus },
  { name: 'Live Monitor', to: '/monitor', icon: Activity },
  { name: 'Analytics', to: '/analytics', icon: BarChart3 },
  { name: 'Settings', to: '/settings', icon: Settings },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-instagram">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MyG Bot
              </h1>
              <p className="text-xs text-muted-foreground">Pro Dashboard</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent"
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              sidebarCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                sidebarCollapsed && 'justify-center'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {!sidebarCollapsed && isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3">
            <p className="text-xs font-medium">🚀 Pro Plan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Unlimited account creation
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}

