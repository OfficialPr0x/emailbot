import { Server } from 'socket.io'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('WebSocket')

export class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })

    this.setupEventHandlers()
    logger.info('WebSocket server initialized')
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected', { id: socket.id })

      socket.on('disconnect', () => {
        logger.info('Client disconnected', { id: socket.id })
      })

      socket.on('error', (error) => {
        logger.error('Socket error', { error: error.message, id: socket.id })
      })
    })
  }

  // Emit account events
  emitAccountCreated(account) {
    this.io.emit('account:created', account)
    logger.debug('Emitted account:created', { accountId: account.id })
  }

  emitAccountUpdated(account) {
    this.io.emit('account:updated', account)
    logger.debug('Emitted account:updated', { accountId: account.id })
  }

  emitAccountDeleted(accountId) {
    this.io.emit('account:deleted', { id: accountId })
    logger.debug('Emitted account:deleted', { accountId })
  }

  // Emit job events
  emitJobCreated(job) {
    this.io.emit('job:created', job)
    logger.debug('Emitted job:created', { jobId: job.id })
  }

  emitJobProgress(job) {
    this.io.emit('job:progress', {
      id: job.id,
      progress: job.progress,
      stage: job.stage,
      message: job.message,
    })
    logger.debug('Emitted job:progress', { jobId: job.id, progress: job.progress })
  }

  emitJobComplete(job) {
    this.io.emit('job:complete', job)
    logger.debug('Emitted job:complete', { jobId: job.id })
  }

  emitJobError(jobId, error) {
    this.io.emit('job:error', { id: jobId, message: error.message || error })
    logger.debug('Emitted job:error', { jobId, error: error.message })
  }

  // Emit activity
  emitActivity(activity) {
    this.io.emit('activity', activity)
    logger.debug('Emitted activity', { activityId: activity.id })
  }

  // Emit stats update
  emitStatsUpdate(stats) {
    this.io.emit('stats:update', stats)
    logger.debug('Emitted stats:update')
  }

  // Get connected clients count
  getClientsCount() {
    return this.io.engine.clientsCount
  }
}

export default WebSocketServer

