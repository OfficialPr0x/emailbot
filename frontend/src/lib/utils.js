import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date) {
  const now = new Date()
  const then = new Date(date)
  const diff = now - then
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatDate(date)
}

export function generateGradient(index) {
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
  ]
  return gradients[index % gradients.length]
}

export function getStatusColor(status) {
  const colors = {
    active: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    creating: 'bg-blue-500',
    verifying: 'bg-purple-500',
  }
  return colors[status] || 'bg-gray-500'
}

export function truncate(str, length = 20) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

