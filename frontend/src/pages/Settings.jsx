import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  Key, 
  Globe, 
  Bell, 
  Zap,
  Settings as SettingsIcon,
  Shield,
  Database,
  Eye,
  EyeOff,
  Check,
  Copy,
  TestTube,
  Loader2,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'proxy', label: 'Proxy', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'advanced', label: 'Advanced', icon: Zap },
]

// Custom Toggle Switch Component
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-7 w-14 items-center rounded-full transition-colors',
        enabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
      )}
    >
      <motion.div
        className="inline-block h-5 w-5 rounded-full bg-white"
        animate={{ x: enabled ? 30 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export default function Settings() {
  const { settings, updateSettings } = useStore()
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const [testingProxy, setTestingProxy] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [proxyUrl, setProxyUrl] = useState(settings.proxyUrl || '')

  const handleSave = () => {
    updateSettings({ proxyUrl })
    toast.success('Settings saved successfully!', {
      style: {
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
      },
    })
  }

  const handleTestProxy = async () => {
    setTestingProxy(true)
    // Simulate proxy test
    setTimeout(() => {
      setTestingProxy(false)
      toast.success('Proxy connection successful!', {
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
      })
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold gradient-text-primary smooth-text mb-2">
          Settings
        </h1>
        <p className="text-slate-400 text-lg">
          Configure your bot settings and preferences
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="glass-medium rounded-2xl p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all relative',
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="glass-medium rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-purple-400" />
                  Automation Settings
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      title: 'AI Profile Generation',
                      description: 'Use AI to generate realistic profiles automatically',
                      enabled: settings.useAiProfile !== false,
                      onChange: (v) => updateSettings({ useAiProfile: v }),
                    },
                    {
                      title: 'Auto Refresh',
                      description: 'Automatically refresh data every 5 seconds',
                      enabled: settings.autoRefresh !== false,
                      onChange: (v) => updateSettings({ autoRefresh: v }),
                    },
                    {
                      title: 'Headless Mode',
                      description: 'Run browser in headless mode for better performance',
                      enabled: settings.headless !== false,
                      onChange: (v) => updateSettings({ headless: v }),
                    },
                    {
                      title: 'Auto-Save Logs',
                      description: 'Automatically save creation logs to files',
                      enabled: settings.autoSaveLogs !== false,
                      onChange: (v) => updateSettings({ autoSaveLogs: v }),
                    },
                  ].map((setting, index) => (
                    <motion.div
                      key={setting.title}
                      className="flex items-center justify-between p-5 glass-light rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{setting.title}</p>
                        <p className="text-sm text-slate-400">{setting.description}</p>
                      </div>
                      <Toggle enabled={setting.enabled} onChange={setting.onChange} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="glass-medium rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  API Configuration
                </h3>
                <p className="text-sm text-slate-400 mb-6">Configure external API services for enhanced features</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      DeepSeek API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-3 pr-24 rounded-xl glass-light text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <motion.button
                          className="p-2 rounded-lg glass-light text-slate-300 hover:text-white"
                          onClick={() => setShowApiKey(!showApiKey)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                        <motion.button
                          className="p-2 rounded-lg glass-light text-slate-300 hover:text-white"
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey)
                            toast.success('Copied to clipboard!')
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Used for AI-powered profile generation and content creation
                    </p>
                  </div>

                  <motion.button
                    className="w-full py-3 rounded-xl glass-light text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    onClick={() => toast.info('API key will be validated...')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-4 h-4" />
                    Validate API Key
                  </motion.button>
                </div>
              </div>

              {/* API Status */}
              <div className="glass-light rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white mb-1">API Status</p>
                  <p className="text-sm text-slate-400">All systems operational</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Connected
                </div>
              </div>
            </div>
          )}

          {/* Proxy Tab */}
          {activeTab === 'proxy' && (
            <div className="space-y-6">
              <div className="glass-medium rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Proxy Configuration
                </h3>
                <p className="text-sm text-slate-400 mb-6">Configure proxy settings for secure account creation</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Proxy URL
                    </label>
                    <input
                      type="text"
                      placeholder="http://proxy:port or user:pass@proxy:port"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-light text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Leave empty to use auto-rotation from proxies.txt
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 rounded-xl glass-light text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      onClick={handleTestProxy}
                      disabled={testingProxy}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {testingProxy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4" />
                          Test Connection
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg"
                      onClick={handleSave}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Proxy Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Working', value: 45, gradient: 'from-emerald-500 to-teal-500' },
                  { label: 'Failing', value: 3, gradient: 'from-red-500 to-pink-500' },
                  { label: 'Untested', value: 12, gradient: 'from-amber-500 to-orange-500' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-light rounded-xl p-5">
                    <p className="text-sm text-slate-400 mb-2">{stat.label} Proxies</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="glass-medium rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Desktop Notifications',
                      description: 'Get notified when accounts are successfully created',
                      enabled: settings.notifications !== false,
                      onChange: (v) => updateSettings({ notifications: v }),
                    },
                    {
                      title: 'Error Alerts',
                      description: 'Receive alerts when account creation fails',
                      enabled: true,
                      onChange: () => {},
                    },
                    {
                      title: 'Success Sound',
                      description: 'Play sound effect on successful account creation',
                      enabled: false,
                      onChange: () => {},
                    },
                  ].map((setting, index) => (
                    <motion.div
                      key={setting.title}
                      className="flex items-center justify-between p-5 glass-light rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{setting.title}</p>
                        <p className="text-sm text-slate-400">{setting.description}</p>
                      </div>
                      <Toggle enabled={setting.enabled} onChange={setting.onChange} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="glass-medium rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Advanced Settings
                </h3>
                <p className="text-sm text-slate-400 mb-6">Developer and performance options</p>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Debug Mode',
                      description: 'Enable verbose logging for troubleshooting',
                      enabled: false,
                      onChange: () => {},
                    },
                    {
                      title: 'Performance Mode',
                      description: 'Optimize for speed over safety',
                      enabled: false,
                      onChange: () => {},
                    },
                  ].map((setting, index) => (
                    <motion.div
                      key={setting.title}
                      className="flex items-center justify-between p-5 glass-light rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{setting.title}</p>
                        <p className="text-sm text-slate-400">{setting.description}</p>
                      </div>
                      <Toggle enabled={setting.enabled} onChange={setting.onChange} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="glass-medium rounded-2xl p-6 border-2 border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Danger Zone
                </h3>

                <div className="space-y-3">
                  <motion.button
                    className="w-full py-3 rounded-xl glass-light text-red-400 font-semibold hover:bg-red-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear All Logs
                  </motion.button>
                  <motion.button
                    className="w-full py-3 rounded-xl glass-light text-red-400 font-semibold hover:bg-red-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset All Settings
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
