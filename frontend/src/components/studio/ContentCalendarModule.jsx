import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { 
  Calendar as CalendarIcon, Plus, Sparkles, Filter, Image as ImageIcon, 
  Video, BookOpen, Clock, Grid3x3, List, ChevronLeft, ChevronRight,
  Wand2, CheckCircle2, AlertCircle
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import studioAPI from '@/services/studioAPI'
import toast from 'react-hot-toast'
import ScheduleContentModal from './ScheduleContentModal'
import ContentPostCard from './ContentPostCard'
import { fadeInUp, staggerChildren, childVariant } from '@/lib/animations'

const VIEW_MODES = [
  { id: 'calendar', name: 'Calendar', icon: Grid3x3 },
  { id: 'timeline', name: 'Timeline', icon: List },
]

const POST_TYPES = [
  { id: 'all', name: 'All Posts', color: 'from-slate-500 to-slate-600' },
  { id: 'image', name: 'Images', icon: ImageIcon, color: 'from-purple-500 to-pink-500' },
  { id: 'video', name: 'Videos', icon: Video, color: 'from-orange-500 to-red-500' },
  { id: 'carousel', name: 'Carousels', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
]

const STATUS_COLORS = {
  draft: 'from-slate-500 to-slate-600',
  scheduled: 'from-blue-500 to-cyan-500',
  published: 'from-emerald-500 to-teal-500',
  failed: 'from-rose-500 to-red-500',
}

export default function ContentCalendarModule() {
  const { accountId } = useParams()
  const { studioData, addContentPost, removeContentPost } = useStore()
  const { contentPosts } = studioData

  const [viewMode, setViewMode] = useState('timeline')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadContent()
  }, [accountId])

  const loadContent = async () => {
    try {
      await studioAPI.getContentPosts(accountId)
    } catch (error) {
      console.error('Failed to load content:', error)
    }
  }

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true)
      toast.loading('AI is crafting your content strategy...', { id: 'generate-plan' })

      const result = await studioAPI.generateContentPlan(accountId)
      const plan = result.data.plan.slice(0, 3)
      
      toast.success(`Generated ${result.data.plan.length} post ideas!`, { id: 'generate-plan' })
      
      if (plan.length > 0) {
        setEditingPost({
          type: plan[0].type,
          caption: plan[0].caption,
          hashtags: plan[0].hashtags,
        })
        setShowScheduleModal(true)
      }
    } catch (error) {
      console.error('Failed to generate plan:', error)
      toast.error('Failed to generate content plan', { id: 'generate-plan' })
    } finally {
      setGenerating(false)
    }
  }

  const handleCreatePost = () => {
    setEditingPost(null)
    setShowScheduleModal(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setShowScheduleModal(true)
  }

  const handleDeletePost = async (postId) => {
    try {
      await studioAPI.deleteContentPost(accountId, postId)
      removeContentPost(postId)
      toast.success('Post deleted')
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = contentPosts.filter((post) => {
    if (filterType === 'all') return true
    return post.type === filterType
  })

  const groupedByStatus = {
    draft: filteredPosts.filter(p => p.status === 'draft'),
    scheduled: filteredPosts.filter(p => p.status === 'scheduled'),
    published: filteredPosts.filter(p => p.status === 'published'),
    failed: filteredPosts.filter(p => p.status === 'failed'),
  }

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
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.3)',
                '0 0 40px rgba(168, 85, 247, 0.5)',
                '0 0 20px rgba(168, 85, 247, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <CalendarIcon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text-primary smooth-text">
              Content Calendar
            </h1>
            <p className="text-sm text-slate-400 smooth-text">
              Plan, schedule, and manage your content pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Generate Plan Button */}
          <motion.button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="glass-medium px-4 py-3 rounded-xl flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: generating 
                ? 'rgba(168, 85, 247, 0.1)'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            }}
          >
            <Wand2 className={`w-5 h-5 text-purple-400 ${generating ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium text-white smooth-text">
              {generating ? 'Generating...' : 'AI Content Plan'}
            </span>
          </motion.button>

          {/* Create Post Button */}
          <motion.button
            onClick={handleCreatePost}
            className="px-4 py-3 rounded-xl font-semibold text-white flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">New Post</span>
          </motion.button>
        </div>
      </div>

      {/* Filters & View Controls */}
      <div className="flex items-center justify-between">
        {/* Post Type Filter */}
        <div className="glass-medium rounded-xl p-1 flex gap-1">
          {POST_TYPES.map((type) => {
            const Icon = type.icon
            const isActive = filterType === type.id
            
            return (
              <motion.button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all relative flex items-center gap-2
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-lg`}
                    layoutId="activeFilter"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {Icon && <Icon className="w-4 h-4 relative z-10" />}
                <span className="relative z-10">{type.name}</span>
              </motion.button>
            )
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="glass-light rounded-xl p-1 flex gap-1">
          {VIEW_MODES.map((mode) => {
            const Icon = mode.icon
            const isActive = viewMode === mode.id
            
            return (
              <motion.button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all relative flex items-center gap-2
                  ${isActive ? 'text-white' : 'text-slate-400'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 glass-medium rounded-lg"
                    layoutId="activeView"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={staggerChildren}
      >
        {Object.entries(groupedByStatus).map(([status, posts]) => (
          <motion.div
            key={status}
            className="glass-medium rounded-xl p-4 neu-shadow-md"
            variants={childVariant}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 capitalize smooth-text">{status}</p>
                <p className="text-2xl font-bold text-white smooth-text mt-1">
                  {posts.length}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${STATUS_COLORS[status]} flex items-center justify-center`}>
                {status === 'published' && <CheckCircle2 className="w-5 h-5 text-white" />}
                {status === 'scheduled' && <Clock className="w-5 h-5 text-white" />}
                {status === 'draft' && <BookOpen className="w-5 h-5 text-white" />}
                {status === 'failed' && <AlertCircle className="w-5 h-5 text-white" />}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content View */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {Object.entries(groupedByStatus).map(([status, posts]) => {
              if (posts.length === 0) return null
              
              return (
                <motion.div
                  key={status}
                  className="glass-medium rounded-2xl p-6 neu-shadow-md"
                  variants={childVariant}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${STATUS_COLORS[status]}`} />
                    <h3 className="text-lg font-semibold text-white capitalize smooth-text">
                      {status} ({posts.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ContentPostCard
                          post={post}
                          onEdit={() => handleEditPost(post)}
                          onDelete={() => handleDeletePost(post.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-medium rounded-2xl p-12 text-center neu-shadow-lg"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <CalendarIcon className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2 smooth-text">
              Your Content Calendar is Empty
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 smooth-text">
              Start building your content strategy with AI-powered planning or create your first post manually.
            </p>
            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={handleGeneratePlan}
                className="glass-medium px-6 py-3 rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-white">Generate AI Plan</span>
              </motion.button>
              <motion.button
                onClick={handleCreatePost}
                className="px-6 py-3 rounded-xl font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create First Post
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleContentModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false)
            setEditingPost(null)
          }}
          accountId={accountId}
          initialData={editingPost}
        />
      )}
    </motion.div>
  )
}
