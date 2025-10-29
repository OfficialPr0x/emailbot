import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return

    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('⚠️ Socket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (!this.socket) this.connect()
    
    this.socket.on(event, callback)
    
    // Store callback for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (!this.socket) return
    
    this.socket.off(event, callback)
    
    // Remove from listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (!this.socket) this.connect()
    this.socket.emit(event, data)
  }

  // Specific event helpers
  onAccountCreated(callback) {
    this.on('account:created', callback)
  }

  onAccountUpdated(callback) {
    this.on('account:updated', callback)
  }

  onJobProgress(callback) {
    this.on('job:progress', callback)
  }

  onJobComplete(callback) {
    this.on('job:complete', callback)
  }

  onJobError(callback) {
    this.on('job:error', callback)
  }

  onActivity(callback) {
    this.on('activity', callback)
  }
}

export default new SocketService()

