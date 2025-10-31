import { useState } from 'react'
import { X, Users, Heart, MessageCircle, Mail, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import studioAPI from '@/services/studioAPI'

const AUTOMATION_TYPES = [
  { value: 'follow', label: 'Follow Users', icon: Users, color: 'blue' },
  { value: 'unfollow', label: 'Unfollow Users', icon: UserMinus, color: 'purple' },
  { value: 'like', label: 'Like Posts', icon: Heart, color: 'pink' },
  { value: 'comment', label: 'Comment on Posts', icon: MessageCircle, color: 'green' },
  { value: 'dm', label: 'Send DMs', icon: Mail, color: 'orange' },
]

export default function CreateAutomationModal({ accountId, onClose, onSuccess }) {
  const [step, setStep] = useState(1) // 1: type selection, 2: configuration
  const [selectedType, setSelectedType] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [config, setConfig] = useState({
    dailyLimit: 50,
    targetHashtags: '',
    targetAccounts: '',
    comments: '',
    dmMessage: '',
    delayMin: 30,
    delayMax: 90,
  })

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setStep(2)
  }

  const handleCreate = async () => {
    try {
      setIsLoading(true)

      // Parse and format config based on automation type
      const formattedConfig = {
        dailyLimit: parseInt(config.dailyLimit),
        delayMin: parseInt(config.delayMin),
        delayMax: parseInt(config.delayMax),
      }

      if (config.targetHashtags) {
        formattedConfig.targetHashtags = config.targetHashtags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      }

      if (config.targetAccounts) {
        formattedConfig.targetAccounts = config.targetAccounts
          .split(',')
          .map(acc => acc.trim())
          .filter(Boolean)
      }

      if (selectedType === 'comment' && config.comments) {
        formattedConfig.comments = config.comments
          .split('\n')
          .map(c => c.trim())
          .filter(Boolean)
      }

      if (selectedType === 'dm' && config.dmMessage) {
        formattedConfig.message = config.dmMessage
      }

      await studioAPI.createAutomation(accountId, {
        type: selectedType,
        config: formattedConfig,
      })

      onSuccess()
    } catch (error) {
      console.error('Failed to create automation:', error)
      alert('Failed to create automation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderTypeSelection = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Automation Type
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the type of growth automation you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AUTOMATION_TYPES.map((type) => {
          const Icon = type.icon
          const colorClasses = {
            blue: 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
            purple: 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20',
            pink: 'hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20',
            green: 'hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20',
            orange: 'hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20',
          }

          return (
            <button
              key={type.value}
              onClick={() => handleTypeSelect(type.value)}
              className={`p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all ${colorClasses[type.color]}`}
            >
              <Icon className={`w-8 h-8 text-${type.color}-500 mx-auto mb-2`} />
              <h3 className="font-semibold text-gray-900 dark:text-white">{type.label}</h3>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderConfiguration = () => {
    const typeInfo = AUTOMATION_TYPES.find(t => t.value === selectedType)
    const Icon = typeInfo.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/20 rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${typeInfo.color}-500`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeInfo.label}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your automation settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Daily Limit */}
          <div>
            <Label htmlFor="dailyLimit">Daily Limit</Label>
            <Input
              id="dailyLimit"
              type="number"
              value={config.dailyLimit}
              onChange={(e) => setConfig({ ...config, dailyLimit: e.target.value })}
              placeholder="50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum actions per day (recommended: 20-100 for safety)
            </p>
          </div>

          {/* Target Hashtags */}
          {(selectedType === 'follow' || selectedType === 'like' || selectedType === 'comment') && (
            <div>
              <Label htmlFor="targetHashtags">Target Hashtags</Label>
              <Input
                id="targetHashtags"
                value={config.targetHashtags}
                onChange={(e) => setConfig({ ...config, targetHashtags: e.target.value })}
                placeholder="#fitness, #motivation, #lifestyle"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Comma-separated list of hashtags to target
              </p>
            </div>
          )}

          {/* Target Accounts */}
          {(selectedType === 'follow' || selectedType === 'dm') && (
            <div>
              <Label htmlFor="targetAccounts">Target Accounts</Label>
              <Input
                id="targetAccounts"
                value={config.targetAccounts}
                onChange={(e) => setConfig({ ...config, targetAccounts: e.target.value })}
                placeholder="@account1, @account2"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Comma-separated list of accounts to target their followers
              </p>
            </div>
          )}

          {/* Comments */}
          {selectedType === 'comment' && (
            <div>
              <Label htmlFor="comments">Comment Templates</Label>
              <Textarea
                id="comments"
                value={config.comments}
                onChange={(e) => setConfig({ ...config, comments: e.target.value })}
                placeholder="Amazing content! 🔥&#10;Love this! 💯&#10;Great post! 👏"
                rows={5}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                One comment per line. Bot will randomly choose from these.
              </p>
            </div>
          )}

          {/* DM Message */}
          {selectedType === 'dm' && (
            <div>
              <Label htmlFor="dmMessage">DM Message</Label>
              <Textarea
                id="dmMessage"
                value={config.dmMessage}
                onChange={(e) => setConfig({ ...config, dmMessage: e.target.value })}
                placeholder="Hey! Loved your content. Would love to connect!"
                rows={4}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use {'{name}'} to personalize with their name
              </p>
            </div>
          )}

          {/* Delay Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delayMin">Min Delay (seconds)</Label>
              <Input
                id="delayMin"
                type="number"
                value={config.delayMin}
                onChange={(e) => setConfig({ ...config, delayMin: e.target.value })}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="delayMax">Max Delay (seconds)</Label>
              <Input
                id="delayMax"
                type="number"
                value={config.delayMax}
                onChange={(e) => setConfig({ ...config, delayMax: e.target.value })}
                placeholder="90"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Random delay between actions to appear more human
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isLoading ? 'Creating...' : 'Create Automation'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className={step === 1 ? 'font-semibold text-purple-600' : ''}>
                1. Type
              </span>
              <span>→</span>
              <span className={step === 2 ? 'font-semibold text-purple-600' : ''}>
                2. Configure
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 1 ? renderTypeSelection() : renderConfiguration()}
        </CardContent>
      </Card>
    </div>
  )
}

