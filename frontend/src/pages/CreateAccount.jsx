import { useState } from 'react'
import { Wand2, Mail, Instagram, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { botAPI } from '@/services/api'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

export default function CreateAccount() {
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const { addAccount, addActivity } = useStore()

  const [formData, setFormData] = useState({
    useAiProfile: true,
    headless: false,
    useProxy: true, // Auto-use proxy rotation (backend handles it)
    uploadImages: false,
  })

  const handleCreate = async () => {
    setCreating(true)
    setProgress(10)
    setCurrentStage('Starting account creation...')

    try {
      // Call real API
      const response = await botAPI.createAccount(formData)
      
      if (response.success) {
        toast.success('Account created successfully!')
        
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
        
        setStep(3)
      } else {
        throw new Error(response.error || 'Account creation failed')
      }
    } catch (error) {
      console.error('Account creation error:', error)
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

      {/* Step 2: Creating */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Creating Your Account</CardTitle>
            <CardDescription>Sit back and relax - this will take 2-3 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-full gradient-instagram animate-pulse" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentStage || 'Preparing...'}</h3>
              <p className="text-lg text-purple-600 dark:text-purple-400 font-medium mb-6">{progress}% complete</p>
              <Progress value={progress} className="w-full max-w-md h-3" />
              
              {!creating && (
                <div className="mt-8 w-full max-w-md">
                  <Button className="w-full gradient-instagram text-lg py-6" size="lg" onClick={handleCreate}>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Creating Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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

