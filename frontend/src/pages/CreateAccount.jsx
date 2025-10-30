import { useState, useEffect, useRef } from 'react'
import { Wand2, Mail, Instagram, CheckCircle2, Loader2, Terminal, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import NeuLoader from '@/components/NeuLoader'
import { botAPI } from '@/services/api'
import { useStore } from '@/store/useStore'
import socketService from '@/services/socket'
import toast from 'react-hot-toast'

export default function CreateAccount() {
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Account</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new Instagram account with AI-powered profiles
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
              s < step ? 'bg-green-500 text-white' :
              s === step ? 'bg-primary text-white' :
              'bg-muted text-muted-foreground'
            }`}>
              {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 w-12 ${s < step ? 'bg-green-500' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Simple Start */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Create Account</CardTitle>
            <CardDescription>Everything is configured automatically for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-configured features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Auto Proxy Rotation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100 premium proxies ready</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">AI Profile Generation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Realistic profiles with AI</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Smart Automation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stealth mode & human-like behavior</p>
                </div>
              </div>
            </div>

            {/* Big create button */}
            <Button 
              className="w-full gradient-instagram text-lg py-6" 
              size="lg" 
              onClick={() => setStep(2)}
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Instagram Account
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Click to start - everything is automated for you
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Creating with Real-time Logs */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <NeuLoader size="sm" />
                Creating Your Account
              </CardTitle>
              <CardDescription>Watch the magic happen in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Stage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                  <span className="text-lg font-medium">{currentStage || 'Preparing...'}</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {progress}%
                </Badge>
              </div>
              
              {/* Progress Bar */}
              <Progress value={progress} className="h-3" />

              {/* Start Button (if not creating yet) */}
              {!creating && (
                <Button className="w-full gradient-instagram text-lg py-6 mt-4" size="lg" onClick={handleCreate}>
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Creating Now
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Stages Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Workflow Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                          <Progress value={stage.progress} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Action Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Live Action Log
                  </CardTitle>
                  <CardDescription>Real-time updates from the automation process</CardDescription>
                </div>
                {creating && (
                  <Badge variant="outline" className="flex items-center gap-2 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
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
                              <Badge variant="outline" className="text-xs font-mono">
                                {log.stage}
                              </Badge>
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Account Created Successfully!
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Your new Instagram account is ready to use. Check the Accounts page to see it!
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setStep(1)
                    setProgress(0)
                    setCurrentStage('')
                  }}
                  className="px-8"
                >
                  Create Another Account
                </Button>
                <Button 
                  className="gradient-instagram px-8" 
                  size="lg"
                  onClick={() => window.location.href = '/accounts'}
                >
                  View All Accounts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

