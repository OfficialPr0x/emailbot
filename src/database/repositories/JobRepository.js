import prisma from '../prisma.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('JobRepository')

export class JobRepository {
  async create(data) {
    try {
      return await prisma.job.create({
        data: {
          accountId: data.accountId,
          type: data.type,
          status: 'pending',
          config: data.config || {},
        },
      })
    } catch (error) {
      logger.error('Failed to create job', { error: error.message })
      throw error
    }
  }

  async findAll(filters = {}) {
    try {
      const where = {}
      
      if (filters.status) {
        where.status = filters.status
      }
      
      if (filters.accountId) {
        where.accountId = filters.accountId
      }

      return await prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
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
      logger.error('Failed to fetch jobs', { error: error.message })
      throw error
    }
  }

  async findOne(id) {
    try {
      return await prisma.job.findUnique({
        where: { id },
        include: {
          account: true,
          activities: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    } catch (error) {
      logger.error('Failed to fetch job', { error: error.message, id })
      throw error
    }
  }

  async update(id, data) {
    try {
      return await prisma.job.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      logger.error('Failed to update job', { error: error.message, id })
      throw error
    }
  }

  async updateProgress(id, progress, stage, message) {
    try {
      return await this.update(id, {
        progress,
        stage,
        message,
      })
    } catch (error) {
      logger.error('Failed to update job progress', { error: error.message, id })
      throw error
    }
  }

  async complete(id, accountId) {
    try {
      return await this.update(id, {
        status: 'completed',
        progress: 100,
        accountId,
        completedAt: new Date(),
      })
    } catch (error) {
      logger.error('Failed to complete job', { error: error.message, id })
      throw error
    }
  }

  async fail(id, error) {
    try {
      return await this.update(id, {
        status: 'failed',
        error: error.message || error,
        completedAt: new Date(),
      })
    } catch (error) {
      logger.error('Failed to mark job as failed', { error: error.message, id })
      throw error
    }
  }

  async getActiveJobs() {
    try {
      return await prisma.job.findMany({
        where: {
          status: { in: ['pending', 'running'] },
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      logger.error('Failed to get active jobs', { error: error.message })
      throw error
    }
  }
}

export default new JobRepository()

