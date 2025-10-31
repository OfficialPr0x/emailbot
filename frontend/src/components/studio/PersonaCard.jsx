import { Check, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function PersonaCard({ persona, isActivating, onActivate, onDelete }) {
  const keywords = typeof persona.keywords === 'string' 
    ? JSON.parse(persona.keywords) 
    : persona.keywords

  return (
    <Card className={`hover:shadow-lg transition-all ${persona.isActive ? 'border-2 border-purple-500' : ''}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {persona.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{persona.name}</h3>
              {persona.isActive && (
                <Badge className="bg-green-500 text-white border-0 text-xs mt-1">
                  Active
                </Badge>
              )}
            </div>
          </div>
          {!persona.isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tone */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {persona.tone}
        </p>

        {/* Bio Preview */}
        {persona.bio && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3">
            <p className="text-xs text-gray-700 dark:text-gray-300 italic">
              "{persona.bio}"
            </p>
          </div>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-4">
          {keywords?.slice(0, 3).map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
            >
              {keyword}
            </span>
          ))}
          {keywords?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded">
              +{keywords.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        {!persona.isActive && (
          <Button
            onClick={onActivate}
            disabled={isActivating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            size="sm"
          >
            <Check className="w-4 h-4 mr-2" />
            {isActivating ? 'Activating...' : 'Activate Persona'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

