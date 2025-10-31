import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import studioAPI from '@/services/studioAPI'
import socketService from '@/services/socket'
import toast from 'react-hot-toast'

const StudioContext = createContext(null)

export const useStudio = () => {
  const context = useContext(StudioContext)
  if (!context) {
    throw new Error('useStudio must be used within StudioProvider')
  }
  return context
}

// Alias for consistency with component imports
export const useStudioContext = useStudio

export const StudioProvider = ({ children }) => {
  const { accountId } = useParams()
  const {
    studioData,
    setStudioData,
    setStudioAccount,
    addContentPost,
    updateContentPost,
    removeContentPost,
    setPersonas,
    addPersona,
    updatePersona,
    removePersona,
  } = useStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load initial studio data
  const loadStudioData = useCallback(async () => {
    if (!accountId) return

    try {
      setLoading(true)
      setError(null)

      const [overview, contentPosts, personas, metrics, proxyStatus, shadowbanCheck] = await Promise.all([
        studioAPI.getOverview(accountId),
        studioAPI.getContentPosts(accountId),
        studioAPI.getPersonas(accountId),
        studioAPI.getMetrics(accountId, 30),
        studioAPI.getProxyStatus(accountId),
        studioAPI.getShadowbanCheck(accountId),
      ])

      setStudioAccount(overview.data.account)
      setStudioData({
        contentPosts: contentPosts.data || [],
        metrics: metrics.data,
        proxyStatus: proxyStatus.data,
        shadowbanRisk: shadowbanCheck.data?.risk || 0,
        isLoading: false,
      })
      setPersonas(personas.data || [])
    } catch (err) {
      console.error('Failed to load studio data:', err)
      setError(err.message)
      toast.error('Failed to load studio data')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  // Setup WebSocket listeners
  useEffect(() => {
    if (!accountId) return

    socketService.connect()

    // Listen for Studio-specific events
    const handleMetricsUpdate = ({ accountId: updatedAccountId, metrics }) => {
      if (updatedAccountId === accountId) {
        setStudioData({ metrics })
        toast.success('Metrics updated')
      }
    }

    const handleContentPublished = ({ accountId: updatedAccountId, post }) => {
      if (updatedAccountId === accountId) {
        updateContentPost(post.id, post)
        toast.success('Content published successfully!')
      }
    }

    const handleShadowbanDetected = ({ accountId: updatedAccountId, risk }) => {
      if (updatedAccountId === accountId) {
        setStudioData({ shadowbanRisk: risk })
        if (risk > 0.7) {
          toast.error('High shadowban risk detected!')
        }
      }
    }

    const handlePersonaActivated = ({ accountId: updatedAccountId, persona }) => {
      if (updatedAccountId === accountId) {
        setPersonas(studioData.personas.map(p => ({
          ...p,
          isActive: p.id === persona.id
        })))
        toast.success(`Persona "${persona.name}" activated`)
      }
    }

    const handleProxyStatus = ({ accountId: updatedAccountId, status }) => {
      if (updatedAccountId === accountId) {
        setStudioData({ proxyStatus: status })
        if (status.status === 'offline') {
          toast.error('Proxy went offline')
        }
      }
    }

    socketService.on('studio:metrics:update', handleMetricsUpdate)
    socketService.on('studio:content:published', handleContentPublished)
    socketService.on('studio:shadowban:detected', handleShadowbanDetected)
    socketService.on('studio:persona:activated', handlePersonaActivated)
    socketService.on('studio:proxy:status', handleProxyStatus)

    return () => {
      socketService.off('studio:metrics:update', handleMetricsUpdate)
      socketService.off('studio:content:published', handleContentPublished)
      socketService.off('studio:shadowban:detected', handleShadowbanDetected)
      socketService.off('studio:persona:activated', handlePersonaActivated)
      socketService.off('studio:proxy:status', handleProxyStatus)
    }
  }, [accountId, studioData.personas])

  // Load data on mount
  useEffect(() => {
    loadStudioData()
  }, [loadStudioData])

  // Proxy status check interval (every 10 seconds)
  useEffect(() => {
    if (!accountId) return

    const checkProxy = async () => {
      try {
        const result = await studioAPI.getProxyStatus(accountId)
        setStudioData({ proxyStatus: result.data })
      } catch (err) {
        console.error('Proxy check failed:', err)
      }
    }

    const interval = setInterval(checkProxy, 10000)
    return () => clearInterval(interval)
  }, [accountId])

  const value = {
    accountId,
    account: studioData.currentAccount,
    loading,
    error,
    refetch: loadStudioData,
  }

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export default StudioProvider

