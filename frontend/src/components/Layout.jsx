import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useStore } from '@/store/useStore'
import { useEffect } from 'react'
import socketService from '@/services/socket'
import toast from 'react-hot-toast'

export default function Layout() {
  const { sidebarCollapsed, addActivity, updateAccount, addJob, updateJob } = useStore()

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect()

    // Listen for events
    socketService.onAccountCreated((account) => {
      toast.success(`Account created: ${account.email}`)
      addActivity({
        id: Date.now(),
        type: 'account_created',
        message: `New account created: ${account.email}`,
        timestamp: new Date().toISOString(),
      })
    })

    socketService.onJobProgress((data) => {
      updateJob(data.id, data)
      addActivity({
        id: Date.now(),
        type: 'job_progress',
        message: data.message,
        timestamp: new Date().toISOString(),
      })
    })

    socketService.onJobComplete((data) => {
      toast.success('Account creation completed!')
      addActivity({
        id: Date.now(),
        type: 'job_complete',
        message: `Job completed: ${data.message}`,
        timestamp: new Date().toISOString(),
      })
    })

    socketService.onJobError((error) => {
      toast.error(`Error: ${error.message}`)
      addActivity({
        id: Date.now(),
        type: 'job_error',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    })

    return () => {
      socketService.disconnect()
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={cn(
        'flex flex-1 flex-col overflow-hidden transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

