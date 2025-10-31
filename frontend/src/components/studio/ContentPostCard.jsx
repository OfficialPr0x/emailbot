import { Calendar, Edit, Trash2, Image as ImageIcon, Video, BookOpen, Heart, MessageCircle, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ContentPostCard({ post, onEdit, onDelete }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'reel':
        return <Video className="w-4 h-4" />
      case 'story':
        return <BookOpen className="w-4 h-4" />
      default:
        return <ImageIcon className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400'
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const truncateCaption = (caption, maxLength = 100) => {
    if (!caption) return ''
    if (caption.length <= maxLength) return caption
    return caption.substring(0, maxLength) + '...'
  }

  return (
    <Card className="hover:shadow-lg transition-all group">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
              {getTypeIcon(post.type)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{post.type}</p>
              <Badge variant="outline" className={`text-xs ${getStatusColor(post.status)}`}>
                {post.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(post)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(post.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Caption Preview */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {truncateCaption(post.caption)}
        </p>

        {/* Hashtags */}
        {post.hashtags && (
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-3 truncate">
            {post.hashtags}
          </p>
        )}

        {/* Schedule Info */}
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(post.scheduledFor)}</span>
        </div>

        {/* Performance Metrics (if published) */}
        {post.status === 'published' && post.performance && (
          <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Heart className="w-3 h-3 text-red-500" />
              <span>{post.performance.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-3 h-3 text-blue-500" />
              <span>{post.performance.comments || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Eye className="w-3 h-3 text-purple-500" />
              <span>{post.performance.reach || 0}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

