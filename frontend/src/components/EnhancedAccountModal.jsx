import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Mail, 
  Instagram, 
  Calendar, 
  Globe, 
  Activity,
  FileText,
  Shield,
  User,
  Copy,
  CheckCircle,
  TrendingUp,
  Eye,
  Sparkles,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
  active: { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  pending: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30' },
  failed: { bg: 'from-red-500 to-pink-500', text: 'text-red-400', border: 'border-red-500/30' },
  suspended: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-400', border: 'border-gray-500/30' },
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
  { id: 'content', label: 'Content Plan', icon: FileText },
  { id: 'proxy', label: 'Proxy Info', icon: Shield },
  { id: 'persona', label: 'AI Persona', icon: User },
]

export default function EnhancedAccountModal({ account, onClose, activities = [], contentPosts = [], personas = [] }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState({ email: false, password: false })
  const navigate = useNavigate()

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [field]: true })
    toast.success(`${field} copied!`, {
      style: {
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
      },
    })
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000)
  }

  const statusConfig = STATUS_COLORS[account.status] || STATUS_COLORS.pending

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl glass-medium"
        style={{
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className={`relative p-8 bg-gradient-to-r ${statusConfig.bg} overflow-hidden`}>
          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {account.username?.charAt(0).toUpperCase() || account.email?.charAt(0).toUpperCase() || 'A'}
              </motion.div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {account.username ? `@${account.username}` : account.fullName || 'Account Details'}
                </h2>
                <p className="text-white/80 mb-3">{account.email}</p>
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full ${statusConfig.text.replace('text-', 'bg-')} animate-pulse`} />
                  <span className="text-white font-semibold text-sm uppercase tracking-wide">
                    {account.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 px-8 pt-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  className={`
                    relative px-6 py-3 rounded-t-xl font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-all
                    ${isActive 
                      ? 'text-white bg-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  
                  {isActive && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${statusConfig.bg}`}
                      layoutId="activeTab"
                      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[50vh] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewTab account={account} onCopy={handleCopy} copied={copied} />}
              {activeTab === 'activity' && <ActivityTab activities={activities} accountId={account.id} />}
              {activeTab === 'content' && <ContentTab contentPosts={contentPosts} account={account} />}
              {activeTab === 'proxy' && <ProxyTab account={account} />}
              {activeTab === 'persona' && <PersonaTab personas={personas} account={account} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            Created {formatRelativeTime(account.createdAt)}
          </div>
          
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2"
            onClick={() => navigate(`/studio/${account.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" />
            Open in Studio X
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Overview Tab Component
function OverviewTab({ account, onCopy, copied }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Followers" value={account.followers || 0} color="text-purple-400" />
        <StatCard icon={Instagram} label="Following" value={account.following || 0} color="text-pink-400" />
        <StatCard icon={FileText} label="Posts" value={account.posts || 0} color="text-blue-400" />
      </div>

      {/* Account Details */}
      <div className="space-y-4">
        <DetailRow icon={Mail} label="Email" value={account.email}>
          <CopyButton onClick={() => onCopy(account.email, 'email')} copied={copied.email} />
        </DetailRow>
        
        <DetailRow icon={Shield} label="Password" value="••••••••••••">
          <CopyButton onClick={() => onCopy(account.password, 'password')} copied={copied.password} />
        </DetailRow>

        {account.fullName && (
          <DetailRow icon={User} label="Full Name" value={account.fullName} />
        )}

        {account.location && (
          <DetailRow icon={MapPin} label="Location" value={account.location} />
        )}

        {account.bio && (
          <DetailRow icon={FileText} label="Bio" value={account.bio} fullWidth />
        )}
      </div>

      {/* Verification Status */}
      {account.verified && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Verified Account</span>
        </div>
      )}
    </div>
  )
}

// Activity Tab Component
function ActivityTab({ activities, accountId }) {
  const accountActivities = activities.filter(a => a.accountId === accountId).slice(0, 20)

  if (accountActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No activity logs available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {accountActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          className="flex items-start gap-4 p-4 glass-light rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
          <div className="flex-1">
            <p className="text-white text-sm">{activity.message}</p>
            <p className="text-slate-500 text-xs mt-1">{formatRelativeTime(activity.createdAt)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Content Tab Component
function ContentTab({ contentPosts, account }) {
  const accountPosts = contentPosts.filter(p => p.accountId === account.id)

  if (accountPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 mb-4">No content posts yet</p>
        <p className="text-slate-500 text-sm">Use Studio X to create and schedule content</p>
      </div>
    )
  }

  const statusCounts = {
    draft: accountPosts.filter(p => p.status === 'draft').length,
    scheduled: accountPosts.filter(p => p.status === 'scheduled').length,
    published: accountPosts.filter(p => p.status === 'published').length,
  }

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{statusCounts.draft}</div>
          <div className="text-sm text-slate-500 mt-1">Drafts</div>
        </div>
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{statusCounts.scheduled}</div>
          <div className="text-sm text-slate-500 mt-1">Scheduled</div>
        </div>
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{statusCounts.published}</div>
          <div className="text-sm text-slate-500 mt-1">Published</div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-3">
        {accountPosts.slice(0, 5).map((post) => (
          <div key={post.id} className="glass-light rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                post.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {post.status}
              </span>
              <span className="text-xs text-slate-500">{post.type}</span>
            </div>
            <p className="text-white text-sm line-clamp-2">{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Proxy Tab Component
function ProxyTab({ account }) {
  if (!account.proxyUrl) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No proxy configured</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailRow icon={Globe} label="Proxy URL" value={account.proxyUrl} />
      
      {account.lastActive && (
        <DetailRow icon={Clock} label="Last Active" value={formatRelativeTime(account.lastActive)} />
      )}

      <div className="glass-light rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          Proxy Status
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Connection</span>
            <span className="text-emerald-400">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Location</span>
            <span className="text-white">{account.location || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Persona Tab Component
function PersonaTab({ personas, account }) {
  const accountPersonas = personas.filter(p => p.accountId === account.id)
  const activePersona = accountPersonas.find(p => p.isActive)

  if (accountPersonas.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 mb-4">No AI personas configured</p>
        <p className="text-slate-500 text-sm">Create personas in Studio X to automate content</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {accountPersonas.map((persona) => (
        <div key={persona.id} className={`glass-light rounded-xl p-6 ${persona.isActive ? 'border border-purple-500/30' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2">
                {persona.name}
                {persona.isActive && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Active</span>
                )}
              </h4>
              <p className="text-slate-400 text-sm mt-1">{persona.tone}</p>
            </div>
          </div>
          
          {persona.bio && (
            <p className="text-slate-300 text-sm mb-3">{persona.bio}</p>
          )}
          
          {persona.hashtags && (
            <div className="flex flex-wrap gap-2">
              {persona.hashtags.split(',').map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Helper Components
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-light rounded-xl p-4 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, children, fullWidth }) {
  return (
    <div className={`glass-light rounded-xl p-4 ${fullWidth ? '' : 'flex items-center justify-between'}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-slate-500" />
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className={`flex items-center gap-3 ${fullWidth ? 'mt-2' : ''}`}>
        <span className="text-white">{value}</span>
        {children}
      </div>
    </div>
  )
}

function CopyButton({ onClick, copied }) {
  return (
    <motion.button
      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy
        </>
      )}
    </motion.button>
  )
}

