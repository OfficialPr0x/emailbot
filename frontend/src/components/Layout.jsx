import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import AmbientBackground from './studio/shared/AmbientBackground'
import ParticleField from './studio/shared/ParticleField'
import { useStore } from '@/store/useStore'
import { useEffect } from 'react'
import socketService from '@/services/socket'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { pageFade } from '@/lib/animations'

export default function Layout() {
  const { sidebarCollapsed, addActivity, updateAccount, addJob, updateJob } = useStore()
  const location = useLocation()

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect()

    // Listen for events
    socketService.onAccountCreated((account) => {
      toast.success(`✓ ASSET DEPLOYED: ${account.email}`, {
        style: {
          background: 'rgba(0, 255, 148, 0.1)',
          color: '#00ff94',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 255, 148, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
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
      toast.success('✓ OPERATION COMPLETE', {
        style: {
          background: 'rgba(0, 255, 148, 0.1)',
          color: '#00ff94',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 255, 148, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
      addActivity({
        id: Date.now(),
        type: 'job_complete',
        message: `Job completed: ${data.message}`,
        timestamp: new Date().toISOString(),
      })
    })

    socketService.onJobError((error) => {
      toast.error(`✗ CRITICAL: ${error.message}`, {
        style: {
          background: 'rgba(255, 51, 102, 0.1)',
          color: '#ff3366',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 51, 102, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
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
    <>
      {/* Particle Field Background */}
      <ParticleField />

      {/* Ambient Background Effects */}
      <AmbientBackground />

      {/* Main Container */}
      <div 
        className="flex h-screen overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 50%, #1a1f2e 100%)',
        }}
      >
        {/* Vignette Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-[100]"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
          }}
        />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 relative z-10',
          sidebarCollapsed ? 'ml-16' : 'ml-72'
        )}>
          {/* Header */}
          <Header />

          {/* Main Content with Page Transitions */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageFade}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  )
}

