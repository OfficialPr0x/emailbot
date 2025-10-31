import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { User, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import studioAPI from '@/services/studioAPI'
import toast from 'react-hot-toast'
import PersonaCard from './PersonaCard'
import CreatePersonaModal from './CreatePersonaModal'

const defaultPersonas = [
  {
    name: 'Professional',
    tone: 'Formal, authoritative, and informative',
    keywords: ['business', 'leadership', 'success', 'growth', 'strategy'],
    bio: 'Entrepreneur | Business Leader | Helping others achieve their goals',
    hashtags: '#Business #Leadership #Success #Entrepreneur #Growth',
    description: 'Perfect for business content and professional networking',
  },
  {
    name: 'Casual',
    tone: 'Friendly, relatable, and conversational',
    keywords: ['lifestyle', 'daily', 'vibes', 'authentic', 'real'],
    bio: 'Living my best life ✨ | Sharing the journey | Let\'s connect!',
    hashtags: '#Lifestyle #DailyLife #Authentic #RealTalk #Vibes',
    description: 'Great for everyday content and connecting with audience',
  },
  {
    name: 'Motivational',
    tone: 'Inspiring, empowering, and uplifting',
    keywords: ['motivation', 'inspiration', 'mindset', 'goals', 'transformation'],
    bio: '💪 Your Daily Dose of Motivation | Mindset Coach | Believe & Achieve',
    hashtags: '#Motivation #Inspiration #Mindset #Goals #Success',
    description: 'Ideal for inspirational content and coaching',
  },
]

export default function PersonaModeModule() {
  const { accountId } = useParams()
  const { studioData, setPersonas, addPersona } = useStore()
  const { personas } = studioData

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activating, setActivating] = useState(null)

  const handleActivatePersona = async (personaId) => {
    try {
      setActivating(personaId)
      await studioAPI.activatePersona(accountId, personaId)
      
      // Update local state
      setPersonas(personas.map(p => ({
        ...p,
        isActive: p.id === personaId
      })))
      
      toast.success('Persona activated!')
    } catch (error) {
      console.error('Failed to activate persona:', error)
      toast.error('Failed to activate persona')
    } finally {
      setActivating(null)
    }
  }

  const handleDeletePersona = async (personaId) => {
    if (!confirm('Are you sure you want to delete this persona?')) return

    try {
      await studioAPI.deletePersona(accountId, personaId)
      setPersonas(personas.filter(p => p.id !== personaId))
      toast.success('Persona deleted')
    } catch (error) {
      console.error('Failed to delete persona:', error)
      toast.error('Failed to delete persona')
    }
  }

  const handleCreateDefaultPersonas = async () => {
    try {
      toast.loading('Creating default personas...', { id: 'create-defaults' })
      
      for (const persona of defaultPersonas) {
        await studioAPI.createPersona(accountId, {
          ...persona,
          keywords: JSON.stringify(persona.keywords),
        })
      }

      // Reload personas
      const result = await studioAPI.getPersonas(accountId)
      setPersonas(result.data)
      
      toast.success('Default personas created!', { id: 'create-defaults' })
    } catch (error) {
      console.error('Failed to create default personas:', error)
      toast.error('Failed to create default personas', { id: 'create-defaults' })
    }
  }

  const activePersona = personas.find(p => p.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Persona Mode</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Switch between different content personalities
          </p>
        </div>
        <div className="flex gap-2">
          {personas.length === 0 && (
            <Button
              onClick={handleCreateDefaultPersonas}
              variant="outline"
              className="border-purple-500 text-purple-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Add Defaults
            </Button>
          )}
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Persona
          </Button>
        </div>
      </div>

      {/* Active Persona Banner */}
      {activePersona && (
        <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {activePersona.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {activePersona.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activePersona.tone}
                  </p>
                  {activePersona.bio && (
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                      Bio: "{activePersona.bio}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personas Grid */}
      {personas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              isActivating={activating === persona.id}
              onActivate={() => handleActivatePersona(persona.id)}
              onDelete={() => handleDeletePersona(persona.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Personas Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Personas help you maintain consistent tone and messaging across your content. Create your first persona to get started!
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleCreateDefaultPersonas}
                variant="outline"
                className="border-purple-500 text-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Default Personas
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Persona
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Persona Mode Works</CardTitle>
          <CardDescription>Understanding content personalities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold mb-3">
                1
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Create Personas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Define different content styles with unique tones, keywords, and branding
              </p>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold mb-3">
                2
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Activate a Persona</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between personas to match your current content strategy
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mb-3">
                3
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Adapts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-generated captions will match your active persona's tone and style
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Persona Modal */}
      {showCreateModal && (
        <CreatePersonaModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(persona) => {
            addPersona(persona)
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}

