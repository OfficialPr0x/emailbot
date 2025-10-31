import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, UserPlus, Mail, FileText, TrendingUp, Trash2, 
  Eye, Sparkles, Download, Target, Zap, CheckCircle2, Clock,
  MessageSquare, ArrowRight, Star, BarChart3
} from 'lucide-react'
import { useStudioContext } from '@/contexts/StudioContext'
import studioAPI from '@/services/studioAPI'
import { fadeInUp, staggerChildren, childVariant } from '@/lib/animations'

const TABS = [
  { id: 'discovery', name: 'Discovery', icon: Search, color: 'from-blue-500 to-cyan-500' },
  { id: 'pipeline', name: 'Pipeline', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  { id: 'performance', name: 'Performance', icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
]

const COLLAB_STATUSES = [
  { id: 'prospect', name: 'Prospects', color: 'from-slate-500 to-slate-600' },
  { id: 'outreach', name: 'Outreach', color: 'from-blue-500 to-cyan-500' },
  { id: 'negotiating', name: 'Negotiating', color: 'from-amber-500 to-orange-500' },
  { id: 'active', name: 'Active', color: 'from-emerald-500 to-teal-500' },
  { id: 'completed', name: 'Completed', color: 'from-purple-500 to-pink-500' },
]

export default function InfluencerEngineModule() {
  const { accountId } = useStudioContext()
  const [activeTab, setActiveTab] = useState('discovery')
  const [isLoading, setIsLoading] = useState(false)
  
  // Discovery State
  const [discoverFilters, setDiscoverFilters] = useState({
    niche: 'lifestyle',
    minFollowers: 10000,
    maxFollowers: 100000,
  })
  const [discoveredInfluencers, setDiscoveredInfluencers] = useState([])
  
  // Saved Data
  const [influencers, setInfluencers] = useState([])
  const [collaborations, setCollaborations] = useState([])

  useEffect(() => {
    loadData()
  }, [accountId])

  const loadData = async () => {
    try {
      const [influencersRes, collabsRes] = await Promise.all([
        studioAPI.getInfluencers(accountId),
        studioAPI.getCollaborations(accountId),
      ])
      setInfluencers(influencersRes.data.data || [])
      setCollaborations(collabsRes.data.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleDiscover = async () => {
    try {
      setIsLoading(true)
      const response = await studioAPI.discoverInfluencers(accountId, discoverFilters)
      setDiscoveredInfluencers(response.data.data || [])
    } catch (error) {
      console.error('Failed to discover influencers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const groupedCollaborations = COLLAB_STATUSES.reduce((acc, status) => {
    acc[status.id] = collaborations.filter(c => c.status === status.id)
    return acc
  }, {})

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(236, 72, 153, 0.3)',
                '0 0 40px rgba(236, 72, 153, 0.5)',
                '0 0 20px rgba(236, 72, 153, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <UserPlus className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text-primary smooth-text">
              Influencer Engine
            </h1>
            <p className="text-sm text-slate-400 smooth-text">
              Discover, manage, and collaborate with influencers
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="glass-medium rounded-xl px-4 py-2"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-slate-400">Saved Influencers</p>
            <p className="text-2xl font-bold text-white">{influencers.length}</p>
          </motion.div>
          <motion.div 
            className="glass-medium rounded-xl px-4 py-2"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-slate-400">Active Collabs</p>
            <p className="text-2xl font-bold text-white">{groupedCollaborations.active?.length || 0}</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-medium rounded-2xl p-1 flex gap-1 neu-shadow-md">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 rounded-xl font-medium transition-all relative
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                  layoutId="activeInfluencerTab"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex items-center justify-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.name}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            {/* Discovery Filters */}
            <div className="glass-medium rounded-2xl p-6 neu-shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white smooth-text">
                    AI-Powered Discovery
                  </h3>
                  <p className="text-sm text-slate-400 smooth-text">
                    Find perfect collaboration matches
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Niche</label>
                  <select
                    value={discoverFilters.niche}
                    onChange={(e) => setDiscoverFilters({ ...discoverFilters, niche: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-light border border-white/10 text-white"
                  >
                    <option value="lifestyle">Lifestyle</option>
                    <option value="fitness">Fitness</option>
                    <option value="fashion">Fashion</option>
                    <option value="business">Business</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Min Followers</label>
                  <input
                    type="number"
                    value={discoverFilters.minFollowers}
                    onChange={(e) => setDiscoverFilters({ ...discoverFilters, minFollowers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-light border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Max Followers</label>
                  <input
                    type="number"
                    value={discoverFilters.maxFollowers}
                    onChange={(e) => setDiscoverFilters({ ...discoverFilters, maxFollowers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-light border border-white/10 text-white"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleDiscover}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Discovering...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>Discover Influencers</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Results */}
            {discoveredInfluencers.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {discoveredInfluencers.map((influencer, index) => (
                  <motion.div
                    key={index}
                    className="glass-medium rounded-2xl p-5 neu-shadow-md hover-lift"
                    variants={childVariant}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-50"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white smooth-text">@{influencer.username}</h4>
                        <p className="text-xs text-slate-400">{influencer.fullName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="glass-light rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-400">Followers</p>
                        <p className="text-sm font-bold text-white">{(influencer.followersCount / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="glass-light rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-400">Engagement</p>
                        <p className="text-sm font-bold text-white">{influencer.engagementRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 rounded-lg glass-light text-sm font-medium text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </motion.button>
                      <motion.button
                        className="flex-1 py-2 rounded-lg font-medium text-white text-sm"
                        style={{
                          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Pipeline
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {/* Kanban Board */}
            <div className="grid grid-cols-5 gap-4">
              {COLLAB_STATUSES.map((status) => (
                <motion.div
                  key={status.id}
                  className="glass-medium rounded-2xl p-4"
                  variants={childVariant}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">{status.name}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${status.color}`}>
                      {groupedCollaborations[status.id]?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {groupedCollaborations[status.id]?.map((collab) => (
                      <motion.div
                        key={collab.id}
                        className="glass-light rounded-lg p-3 cursor-pointer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        drag
                        dragElastic={0.1}
                      >
                        <p className="text-sm font-medium text-white mb-1">Influencer #{collab.influencerId.slice(0, 6)}</p>
                        <p className="text-xs text-slate-400">{collab.type}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-medium rounded-2xl p-8 text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BarChart3 className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2 smooth-text">
              Performance Analytics
            </h3>
            <p className="text-slate-400 text-sm smooth-text">
              Track ROI, engagement lift, and collaboration success metrics
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
