import { PrismaClient } from '@prisma/client'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('Database')

const prisma = new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
})

// Event listeners for logging
prisma.$on('error', (e) => {
  logger.error('Prisma error', { error: e.message })
})

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning', { message: e.message })
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma

