import { X, Mail, Instagram, Calendar, Globe, TrendingUp, Activity, Check, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

export default function AccountDetailModal({ account, onClose }) {
  if (!account) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500',
      creating: 'bg-blue-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                {account.instagram?.username?.charAt(0).toUpperCase() || account.gmail?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{account.instagram?.username || 'Account Details'}</h2>
                <p className="text-white/80">{account.gmail?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <Badge className={`${getStatusColor(account.status)} text-white px-3 py-1`}>
              {getStatusText(account.status)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {account.instagram?.followers || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Activity className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {account.instagram?.posts || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {account.verified ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
            </div>
          </div>

          {/* Gmail Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Mail className="w-5 h-5 text-purple-500" />
              Gmail Account
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">{account.gmail?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Password:</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {'•'.repeat(account.gmail?.password?.length || 8)}
                </span>
              </div>
            </div>
          </div>

          {/* Instagram Information */}
          {account.instagram && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram Account
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Username:</span>
                  <span className="font-medium text-gray-900 dark:text-white">@{account.instagram.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{account.instagram.fullName}</span>
                </div>
                {account.instagram.bio && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Bio:</span>
                    <p className="mt-1 text-gray-900 dark:text-white">{account.instagram.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="w-5 h-5 text-blue-500" />
              Account Info
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(account.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(account.updatedAt)}
                </span>
              </div>
              {account.proxy && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Proxy:</span>
                  <span className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {account.proxy.split(':')[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(account.gmail?.email || '')
                alert('Email copied to clipboard!')
              }}
            >
              Copy Email
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(account.gmail?.password || '')
                alert('Password copied to clipboard!')
              }}
            >
              Copy Password
            </Button>
          </div>

          {/* Warning */}
          {account.status === 'failed' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200">Account Creation Failed</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {account.error || 'An error occurred during account creation.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


