import prisma from '../prisma.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('ActivityRepository')

export class ActivityRepository {
  async create(data) {
    try {
      return await prisma.activity.create({
        data: {
          accountId: data.accountId,
          jobId: data.jobId,
          type: data.type,
          message: data.message,
          data: data.data || {},
        },
      })
    } catch (error) {
      logger.error('Failed to create activity', { error: error.message })
      throw error
    }
  }

  async findAll(filters = {}) {
    try {
      const where = {}
      
      if (filters.accountId) {
        where.accountId = filters.accountId
      }
      
      if (filters.jobId) {
        where.jobId = filters.jobId
      }
      
      if (filters.type) {
        where.type = filters.type
      }

      return await prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        include: {
          account: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      })
    } catch (error) {
      logger.error('Failed to fetch activities', { error: error.message })
      throw error
    }
  }

  async markAsRead(id) {
    try {
      return await prisma.activity.update({
        where: { id },
        data: { read: true },
      })
    } catch (error) {
      logger.error('Failed to mark activity as read', { error: error.message, id })
      throw error
    }
  }

  async markAllAsRead() {
    try {
      return await prisma.activity.updateMany({
        where: { read: false },
        data: { read: true },
      })
    } catch (error) {
      logger.error('Failed to mark all activities as read', { error: error.message })
      throw error
    }
  }

  async deleteOld(daysOld = 30) {
    try {
      const date = new Date()
      date.setDate(date.getDate() - daysOld)
      
      return await prisma.activity.deleteMany({
        where: {
          createdAt: {
            lt: date,
          },
        },
      })
    } catch (error) {
      logger.error('Failed to delete old activities', { error: error.message })
      throw error
    }
  }
}

export default new ActivityRepository()

