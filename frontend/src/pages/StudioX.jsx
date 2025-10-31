import { motion } from 'framer-motion'
import { StudioProvider } from '@/contexts/StudioContext'
import StudioHeader from '@/components/studio/StudioHeader'
import StudioSidebar from '@/components/studio/StudioSidebar'
import StudioMainPanel from '@/components/studio/StudioMainPanel'
import AmbientBackground from '@/components/studio/shared/AmbientBackground'
import ParticleField from '@/components/studio/shared/ParticleField'
import { useStore } from '@/store/useStore'
import { fadeInScale } from '@/lib/animations'

export default function StudioX() {
  const { studioData } = useStore()
  const { activeModule } = studioData

  return (
    <StudioProvider>
      {/* Particle Field */}
      <ParticleField />

      {/* Ambient Background Effects */}
      <AmbientBackground />

      {/* Main Studio Container */}
      <motion.div 
        className="flex h-screen overflow-hidden relative"
        initial="initial"
        animate="animate"
        variants={fadeInScale}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        }}
      >
        {/* Vignette Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-[100]"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />

        {/* Sidebar - Floating Panel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
          className="z-20"
        >
          <StudioSidebar activeModule={activeModule} />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header - Command Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
          >
            <StudioHeader />
          </motion.div>

          {/* Main Panel - Floating Content */}
          <main className="flex-1 overflow-y-auto relative">
            <div className="p-6 lg:p-8">
              <StudioMainPanel activeModule={activeModule} />
            </div>
          </main>
        </div>
      </motion.div>
    </StudioProvider>
  )
}

