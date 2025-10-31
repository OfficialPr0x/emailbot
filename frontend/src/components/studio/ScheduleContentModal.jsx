import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { X, Sparkles, Calendar, Image as ImageIcon, Video, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useStore } from '@/store/useStore'
import studioAPI from '@/services/studioAPI'
import toast from 'react-hot-toast'

export default function ScheduleContentModal({ post, onClose, onSave }) {
  const { accountId } = useParams()
  const { addContentPost, updateContentPost } = useStore()

  const [formData, setFormData] = useState({
    type: 'post',
    caption: '',
    hashtags: '',
    scheduledFor: '',
    status: 'draft',
  })
  const [generating, setGenerating] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (post) {
      setFormData({
        type: post.type || 'post',
        caption: post.caption || '',
        hashtags: post.hashtags || '',
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : '',
        status: post.status || 'draft',
      })
    }
  }, [post])

  const handleGenerateCaption = async () => {
    try {
      setGenerating(true)
      toast.loading('Generating AI caption...', { id: 'generate-caption' })

      const result = await studioAPI.generateCaption(accountId, {
        postType: formData.type,
        persona: 'professional',
      })

      setFormData({
        ...formData,
        caption: result.data.caption,
      })

      toast.success('Caption generated!', { id: 'generate-caption' })
    } catch (error) {
      console.error('Failed to generate caption:', error)
      toast.error('Failed to generate caption', { id: 'generate-caption' })
    } finally {
      setGenerating(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.caption.trim()) {
      newErrors.caption = 'Caption is required'
    }

    if (formData.scheduledFor) {
      const scheduledDate = new Date(formData.scheduledFor)
      if (scheduledDate < new Date()) {
        newErrors.scheduledFor = 'Cannot schedule content in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const postData = {
        ...formData,
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor).toISOString() : null,
        status: formData.scheduledFor ? 'scheduled' : 'draft',
      }

      if (post?.id) {
        // Update existing post
        const result = await studioAPI.updateContentPost(accountId, post.id, postData)
        updateContentPost(post.id, result.data)
        toast.success('Post updated successfully')
      } else {
        // Create new post
        const result = await studioAPI.createContentPost(accountId, postData)
        addContentPost(result.data)
        toast.success('Post created successfully')
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save post:', error)
      if (error.message.includes('past')) {
        setErrors({ scheduledFor: error.message })
      } else {
        toast.error('Failed to save post')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {post ? 'Edit Post' : 'Schedule New Content'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'post', label: 'Post', icon: ImageIcon },
                { value: 'reel', label: 'Reel', icon: Video },
                { value: 'story', label: 'Story', icon: BookOpen },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: value })}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.type === value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${formData.type === value ? 'text-purple-500' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${formData.type === value ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Caption
              </label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateCaption}
                disabled={generating}
                className="border-purple-500 text-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </div>
            <Textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Write your caption here..."
              rows={6}
              className={errors.caption ? 'border-red-500' : ''}
            />
            {errors.caption && (
              <p className="text-sm text-red-500 mt-1">{errors.caption}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.caption.length} / 2200 characters
            </p>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hashtags
            </label>
            <Input
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="#growth #motivation #success"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate hashtags with spaces
            </p>
          </div>

          {/* Schedule Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Date & Time (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className={`pl-10 ${errors.scheduledFor ? 'border-red-500' : ''}`}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            {errors.scheduledFor && (
              <p className="text-sm text-red-500 mt-1">{errors.scheduledFor}</p>
            )}
            {!formData.scheduledFor && (
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to save as draft
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {post ? 'Update Post' : formData.scheduledFor ? 'Schedule Post' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

