import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Palette, User, Link as LinkIcon, Image as ImageIcon, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import toast from 'react-hot-toast'

export default function BrandAssetsModule() {
  const { accountId } = useParams()
  const { studioData } = useStore()
  const { currentAccount } = studioData

  const [formData, setFormData] = useState({
    username: currentAccount?.username || '',
    fullName: currentAccount?.fullName || '',
    bio: currentAccount?.bio || '',
    location: currentAccount?.location || '',
    website: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      
      await accountsAPI.update(accountId, {
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        location: formData.location,
      })

      toast.success('Brand assets updated successfully!')
    } catch (error) {
      console.error('Failed to update brand assets:', error)
      toast.error('Failed to update brand assets')
    } finally {
      setSaving(false)
    }
  }

  const bioLength = formData.bio?.length || 0
  const maxBioLength = 150

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brand Assets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile appearance and branding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              Profile Picture
            </CardTitle>
            <CardDescription>Upload or update your profile image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold">
                {currentAccount?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <Button variant="outline" disabled>
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Coming soon: Upload custom profile pictures
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              Brand Colors
            </CardTitle>
            <CardDescription>Define your brand color palette</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'].map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{color}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" disabled>
                <Palette className="w-4 h-4 mr-2" />
                Customize Colors
              </Button>
              <p className="text-xs text-gray-500">
                Coming soon: Custom color palette picker
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="your_username"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your Full Name"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={4}
              maxLength={maxBioLength}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                {bioLength} / {maxBioLength} characters
              </p>
              {bioLength > maxBioLength * 0.9 && (
                <p className="text-xs text-orange-500">
                  Almost at limit!
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Website / Link in Bio
            </label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Coming soon: Link in bio management
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Story Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            Story Highlights
          </CardTitle>
          <CardDescription>Manage your story highlight covers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['Highlights', 'Travel', 'Food', 'Work', 'Life'].map((name, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-200 dark:border-purple-800">
                  {name.charAt(0)}
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{name}</span>
              </div>
            ))}
            <button className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors flex-shrink-0" disabled>
              <ImageIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Coming soon: Custom highlight cover uploads
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

