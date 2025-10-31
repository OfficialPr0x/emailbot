import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wand2, 
  Mail, 
  Instagram, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Activity,
  Sparkles,
  Zap,
  Shield,
  Play,
  Home,
} from 'lucide-react'
import NeuLoader from '@/components/NeuLoader'
import { botAPI } from '@/services/api'
import { useStore } from '@/store/useStore'
import { useNavigate } from 'react-router-dom'
import socketService from '@/services/socket'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function CreateAccount() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [logs, setLogs] = useState([])
  const [stages, setStages] = useState([
    { id: 'profile_generation', name: 'Generate Profile', status: 'pending', progress: 0 },
    { id: 'gmail_creation', name: 'Create Gmail', status: 'pending', progress: 0 },
    { id: 'gmail_created', name: 'Gmail Verification', status: 'pending', progress: 0 },
    { id: 'instagram_creation', name: 'Create Instagram', status: 'pending', progress: 0 },
    { id: 'instagram_profile', name: 'Setup Profile', status: 'pending', progress: 0 },
    { id: 'completed', name: 'Complete', status: 'pending', progress: 0 },
  ])
  const [currentJobId, setCurrentJobId] = useState(null)
  const { addAccount, addActivity } = useStore()
  const logsEndRef = useRef(null)

  const [formData, setFormData] = useState({
    useAiProfile: true,
    headless: false,
    useProxy: true, // Auto-use proxy rotation (backend handles it)
    uploadImages: false,
  })

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Setup WebSocket listeners
  useEffect(() => {
    socketService.connect()

    const handleJobProgress = (data) => {
      console.log('Job progress:', data)
      
      if (data.progress !== undefined) {
        setProgress(data.progress)
      }
      
      if (data.stage) {
        setCurrentStage(data.message || data.stage)
        
        // Update stages
        setStages(prev => prev.map(stage => {
          if (stage.id === data.stage) {
            return { ...stage, status: 'in_progress', progress: data.progress }
          }
          // Mark previous stages as complete
          const stageIndex = prev.findIndex(s => s.id === data.stage)
          const currentIndex = prev.findIndex(s => s.id === stage.id)
          if (currentIndex < stageIndex) {
            return { ...stage, status: 'complete', progress: 100 }
          }
          return stage
        }))
      }
      
      if (data.message) {
        addLog('info', data.message, data.stage)
      }
      
      setCurrentJobId(data.id)
    }

    const handleJobComplete = (data) => {
      console.log('Job complete:', data)
      addLog('success', 'Account creation completed successfully!', 'completed')
      setProgress(100)
      setStages(prev => prev.map(stage => ({ ...stage, status: 'complete', progress: 100 })))
    }

    const handleJobError = (data) => {
      console.log('Job error:', data)
      addLog('error', data.message || 'An error occurred', 'error')
      toast.error(data.message || 'Account creation failed')
      setCreating(false)
    }

    const handleActivity = (data) => {
      console.log('Activity:', data)
      if (data.message) {
        addLog('info', data.message, data.type)
      }
    }

    socketService.onJobProgress(handleJobProgress)
    socketService.onJobComplete(handleJobComplete)
    socketService.onJobError(handleJobError)
    socketService.onActivity(handleActivity)

    return () => {
      socketService.off('job:progress', handleJobProgress)
      socketService.off('job:complete', handleJobComplete)
      socketService.off('job:error', handleJobError)
      socketService.off('activity', handleActivity)
    }
  }, [])

  const addLog = (type, message, stage = '') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { type, message, stage, timestamp, id: Date.now() }])
  }

  const getStageIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    setProgress(5)
    setCurrentStage('Starting account creation...')
    setLogs([]) // Clear previous logs
    addLog('info', 'Initializing account creation process...')
    addLog('info', 'Connecting to automation server...')

    try {
      // Call real API
      addLog('info', 'Sending request to backend...')
      const response = await botAPI.createAccount(formData)
      
      if (response.success) {
        addLog('success', 'Backend accepted request, starting workflow...')
        
        // Add to local state
        if (response.data.accountId) {
          addAccount({
            id: response.data.accountId,
            email: response.data.gmailAccount.email,
            username: response.data.instagramAccount.username,
            fullName: response.data.profile.fullName,
            status: 'active',
            createdAt: response.data.createdAt,
          })
        }
        
        // Don't immediately go to step 3 - wait for job completion
        setTimeout(() => {
          setStep(3)
        }, 2000)
      } else {
        throw new Error(response.error || 'Account creation failed')
      }
    } catch (error) {
      console.error('Account creation error:', error)
      addLog('error', error.message || 'Failed to create account')
      toast.error(error.message || 'Failed to create account')
      setCreating(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold gradient-text-command smooth-text mb-3 tracking-wider font-mono">
          DEPLOY NEW ASSET
        </h1>
        <p className="text-slate-400 text-lg">
          Initialize automated Instagram asset with AI-powered profile generation
        </p>
      </motion.div>

      {/* Progress Stepper */}
      <motion.div 
        className="glass-medium rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Configure' },
            { num: 2, label: 'Create' },
            { num: 3, label: 'Complete' }
          ].map((s, index) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={cn(
                    'relative flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-lg',
                    s.num < step && 'bg-gradient-to-br from-emerald-500 to-teal-500',
                    s.num === step && 'bg-gradient-to-br from-purple-500 to-pink-500',
                    s.num > step && 'glass-light'
                  )}
                  whileHover={{ scale: 1.05 }}
                  animate={s.num === step ? {
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.5)',
                      '0 0 30px rgba(168, 85, 247, 0.8)',
                      '0 0 20px rgba(168, 85, 247, 0.5)',
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white">
                    {s.num < step ? <CheckCircle2 className="h-7 w-7" /> : s.num}
                  </span>
                </motion.div>
                <span className={cn(
                  'mt-3 text-sm font-semibold',
                  s.num <= step ? 'text-white' : 'text-slate-500'
                )}>
                  {s.label}
                </span>
              </div>
              
              {index < 2 && (
                <div className="flex-1 h-1 mx-4 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: s.num < step ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step 1: Configuration */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-medium rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Create</h2>
              <p className="text-slate-400">Everything is configured automatically for maximum success</p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 mb-8">
              {[
                {
                  icon: Shield,
                  title: 'Auto Proxy Rotation',
                  description: '100 premium proxies ready',
                  gradient: 'from-emerald-500 to-teal-500',
                },
                {
                  icon: Sparkles,
                  title: 'AI Profile Generation',
                  description: 'Realistic profiles with advanced AI',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Zap,
                  title: 'Smart Automation',
                  description: 'Stealth mode & human-like behavior',
                  gradient: 'from-blue-500 to-cyan-500',
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                
                return (
                  <motion.div
                    key={feature.title}
                    className="glass-light rounded-xl p-5 flex items-center gap-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                )
              })}
            </div>

            {/* Create Button */}
            <motion.button
              className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
              onClick={() => setStep(2)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 10px 40px rgba(168, 85, 247, 0.3)',
                  '0 10px 50px rgba(168, 85, 247, 0.5)',
                  '0 10px 40px rgba(168, 85, 247, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-6 h-6" />
              Create Instagram Account
            </motion.button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Click to start - everything is automated for you
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Creating with Real-time Logs */}
      <AnimatePresence mode="wait">
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Progress Overview Card */}
            <div className="glass-medium rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: creating ? 360 : 0 }}
                  transition={{ duration: 2, repeat: creating ? Infinity : 0, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8 text-purple-400" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">Creating Your Account</h2>
                  <p className="text-slate-400 mt-1">Watch the magic happen in real-time</p>
                </div>
              </div>

              {/* Current Stage */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <span className="text-lg font-medium text-white">{currentStage || 'Preparing...'}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  {progress}%
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%]"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${progress}%`,
                    backgroundPosition: ['0% 0%', '100% 0%'],
                  }}
                  transition={{
                    width: { duration: 0.5 },
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                  }}
                />
              </div>

              {/* Start Button (if not creating yet) */}
              {!creating && (
                <motion.button
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-3 mt-6 shadow-lg"
                  onClick={handleCreate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-6 h-6" />
                  Start Creating Now
                </motion.button>
              )}
            </div>

          {/* Stages Tracker */}
          <motion.div
            className="glass-medium rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-400" />
              Workflow Stages
            </h3>
            <div>
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {getStageIcon(stage.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            stage.status === 'complete' ? 'text-green-600 dark:text-green-400' :
                            stage.status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>
                            {stage.name}
                          </span>
                          {stage.status === 'in_progress' && (
                            <span className="text-sm text-gray-500">{stage.progress}%</span>
                          )}
                          {stage.status === 'complete' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {stage.status === 'in_progress' && (
                          <div className="h-1 mt-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              initial={{ width: '0%' }}
                              animate={{ width: `${stage.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Live Action Logs */}
          <motion.div
            className="glass-medium rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                  <Terminal className="h-5 w-5 text-purple-400" />
                  Live Action Log
                </h3>
                <p className="text-sm text-slate-400">Real-time updates from the automation process</p>
              </div>
              {creating && (
                <div className="px-3 py-1 rounded-lg glass-light flex items-center gap-2">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-emerald-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-xs font-semibold text-emerald-400">Live</span>
                </div>
              )}
            </div>
            <div>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 h-96 overflow-y-auto terminal-log">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Terminal className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse-glow" />
                      <p>Waiting for process to start...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-2 p-2 rounded animate-fade-in-up ${
                          log.type === 'success' ? 'bg-green-900/20 border-l-2 border-green-500' :
                          log.type === 'error' ? 'bg-red-900/20 border-l-2 border-red-500' :
                          log.type === 'warning' ? 'bg-yellow-900/20 border-l-2 border-yellow-500' :
                          'bg-blue-900/10 border-l-2 border-blue-500'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getLogIcon(log.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-400 text-xs font-mono">{log.timestamp}</span>
                            {log.stage && (
                              <span className="px-2 py-0.5 rounded glass-light text-xs font-mono text-slate-300 border border-white/10">
                                {log.stage}
                              </span>
                            )}
                          </div>
                          <p className={`${
                            log.type === 'success' ? 'text-green-300' :
                            log.type === 'error' ? 'text-red-300' :
                            log.type === 'warning' ? 'text-yellow-300' :
                            'text-gray-300'
                          }`}>
                            {log.message}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Success */}
      <AnimatePresence mode="wait">
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-medium rounded-2xl p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              {/* Success Icon */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 40px rgba(16, 185, 129, 0.5)',
                      '0 0 60px rgba(16, 185, 129, 0.8)',
                      '0 0 40px rgba(16, 185, 129, 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>

                {/* Confetti Effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: `hsl(${i * 30}, 70%, 60%)`,
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * 30) * 60],
                        y: [0, Math.sin(i * 30) * 60],
                        opacity: [1, 0],
                      }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.h2
                className="text-4xl font-bold gradient-text-success mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Account Created Successfully!
              </motion.h2>

              <motion.p
                className="text-lg text-slate-400 mb-10 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your new Instagram account is ready to use. Check the Accounts page to see it!
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="px-8 py-4 rounded-xl glass-light text-white font-semibold"
                  onClick={() => {
                    setStep(1)
                    setProgress(0)
                    setCurrentStage('')
                    setCreating(false)
                    setLogs([])
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Another
                </motion.button>

                <motion.button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg"
                  onClick={() => navigate('/accounts')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5 inline mr-2" />
                  View All Accounts
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

