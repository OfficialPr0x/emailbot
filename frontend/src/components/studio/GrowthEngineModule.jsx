import { useState, useEffect } from 'react'
import { Zap, Users, Heart, MessageCircle, Mail, Play, Pause, Trash2, Plus, Settings, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import studioAPI from '@/services/studioAPI'
import { useStudioContext } from '@/contexts/StudioContext'
import CreateAutomationModal from './CreateAutomationModal'

export default function GrowthEngineModule() {
  const { accountId } = useStudioContext()
  const [automations, setAutomations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, active, paused

  useEffect(() => {
    loadAutomations()
  }, [accountId, filter])

  const loadAutomations = async () => {
    try {
      setIsLoading(true)
      const filters = filter !== 'all' ? { status: filter } : {}
      const response = await studioAPI.getAutomations(accountId, filters)
      setAutomations(response.data.data || [])
    } catch (error) {
      console.error('Failed to load automations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await studioAPI.updateAutomation(accountId, taskId, { status: newStatus })
      loadAutomations()
    } catch (error) {
      console.error('Failed to toggle automation:', error)
    }
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this automation?')) return
    
    try {
      await studioAPI.deleteAutomation(accountId, taskId)
      loadAutomations()
    } catch (error) {
      console.error('Failed to delete automation:', error)
    }
  }

  const handleExecute = async (taskId) => {
    try {
      await studioAPI.executeAutomation(accountId, taskId)
      loadAutomations()
      alert('Automation executed successfully! Note: Real Instagram integration required for live execution.')
    } catch (error) {
      console.error('Failed to execute automation:', error)
    }
  }

  const getAutomationIcon = (type) => {
    switch (type) {
      case 'follow':
      case 'unfollow':
        return Users
      case 'like':
        return Heart
      case 'comment':
        return MessageCircle
      case 'dm':
        return Mail
      default:
        return Zap
    }
  }

  const getAutomationColor = (type) => {
    switch (type) {
      case 'follow':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'unfollow':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
      case 'like':
        return 'text-pink-500 bg-pink-50 dark:bg-pink-900/20'
      case 'comment':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      case 'dm':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const activeCount = automations.filter(a => a.status === 'active').length
  const pausedCount = automations.filter(a => a.status === 'paused').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-500" />
            Growth Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automated engagement and growth strategies
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Automations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{automations.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paused</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pausedCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Pause className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All ({automations.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'active'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('paused')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'paused'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Paused ({pausedCount})
        </button>
      </div>

      {/* Automations List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : automations.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  No automations yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your first automation to start growing your account
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Automation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((automation) => {
            const Icon = getAutomationIcon(automation.type)
            const config = typeof automation.config === 'string' 
              ? JSON.parse(automation.config) 
              : automation.config

            return (
              <Card key={automation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAutomationColor(automation.type)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                          {automation.type} Automation
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={automation.status === 'active' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}>
                            {automation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Config Summary */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {config.dailyLimit && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Daily limit: {config.dailyLimit}</span>
                      </div>
                    )}
                    {config.targetHashtags && (
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Targets: {config.targetHashtags.join(', ')}</span>
                      </div>
                    )}
                    {automation.lastRun && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Last run: {new Date(automation.lastRun).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(automation.id, automation.status)}
                      className="flex-1"
                    >
                      {automation.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecute(automation.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(automation.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Safety Notice */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Safety First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To avoid Instagram restrictions, keep daily limits conservative (20-50 actions/day for new accounts, 
                100-200 for established accounts). Space actions throughout the day and avoid sudden spikes in activity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAutomationModal
          accountId={accountId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            loadAutomations()
          }}
        />
      )}
    </div>
  )
}
