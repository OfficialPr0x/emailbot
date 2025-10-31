import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import studioAPI from '@/services/studioAPI'
import toast from 'react-hot-toast'

export default function CreatePersonaModal({ onClose, onCreated }) {
  const { accountId } = useParams()
  
  const [formData, setFormData] = useState({
    name: '',
    tone: '',
    keywords: '',
    bio: '',
    hashtags: '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Persona name is required'
    }

    if (!formData.tone.trim()) {
      newErrors.tone = 'Tone description is required'
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'At least one keyword is required'
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
      setSaving(true)

      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(Boolean)

      const result = await studioAPI.createPersona(accountId, {
        name: formData.name,
        tone: formData.tone,
        keywords: JSON.stringify(keywordsArray),
        bio: formData.bio,
        hashtags: formData.hashtags,
        isActive: false,
      })

      toast.success('Persona created successfully!')
      onCreated(result.data)
    } catch (error) {
      console.error('Failed to create persona:', error)
      toast.error('Failed to create persona')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Persona</h2>
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
          {/* Persona Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Persona Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Professional, Casual, Motivational"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tone Description *
            </label>
            <Input
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              placeholder="e.g., Friendly, relatable, and conversational"
              className={errors.tone ? 'border-red-500' : ''}
            />
            {errors.tone && (
              <p className="text-sm text-red-500 mt-1">{errors.tone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Describe the writing style and tone for this persona
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords *
            </label>
            <Input
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="lifestyle, daily, vibes, authentic"
              className={errors.keywords ? 'border-red-500' : ''}
            />
            {errors.keywords && (
              <p className="text-sm text-red-500 mt-1">{errors.keywords}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated keywords that define this persona
            </p>
          </div>

          {/* Bio Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio Template (Optional)
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Living my best life ✨ | Sharing the journey | Let's connect!"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              A suggested bio format for this persona
            </p>
          </div>

          {/* Hashtag Set */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hashtag Set (Optional)
            </label>
            <Input
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="#Lifestyle #DailyLife #Authentic #RealTalk"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default hashtags for this persona's content
            </p>
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
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {saving ? 'Creating...' : 'Create Persona'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

