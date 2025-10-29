import prisma from '../prisma.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('AccountRepository')

export class AccountRepository {
  async create(data) {
    try {
      return await prisma.account.create({
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
          fullName: data.fullName,
          birthDate: data.birthDate,
          gender: data.gender,
          bio: data.bio,
          location: data.location,
          occupation: data.occupation,
          profile: data.profile || {},
          proxyUrl: data.proxyUrl,
          status: data.status || 'pending',
        },
      })
    } catch (error) {
      logger.error('Failed to create account', { error: error.message })
      throw error
    }
  }

  async findAll(filters = {}) {
    try {
      const where = {}
      
      if (filters.status) {
        where.status = filters.status
      }
      
      if (filters.search) {
        where.OR = [
          { email: { contains: filters.search } },
          { username: { contains: filters.search } },
        ]
      }

      return await prisma.account.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      })
    } catch (error) {
      logger.error('Failed to fetch accounts', { error: error.message })
      throw error
    }
  }

  async findOne(id) {
    try {
      return await prisma.account.findUnique({
        where: { id },
        include: {
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })
    } catch (error) {
      logger.error('Failed to fetch account', { error: error.message, id })
      throw error
    }
  }

  async update(id, data) {
    try {
      return await prisma.account.update({
        where: { id },
        data,
      })
    } catch (error) {
      logger.error('Failed to update account', { error: error.message, id })
      throw error
    }
  }

  async delete(id) {
    try {
      return await prisma.account.delete({
        where: { id },
      })
    } catch (error) {
      logger.error('Failed to delete account', { error: error.message, id })
      throw error
    }
  }

  async getStats() {
    try {
      const total = await prisma.account.count()
      const active = await prisma.account.count({ where: { status: 'active' } })
      const creating = await prisma.account.count({ where: { status: 'pending' } })
      const failed = await prisma.account.count({ where: { status: 'failed' } })
      
      const successRate = total > 0 ? ((active / total) * 100).toFixed(1) : 0

      return {
        total,
        active,
        creating,
        failed,
        successRate: parseFloat(successRate),
      }
    } catch (error) {
      logger.error('Failed to get stats', { error: error.message })
      throw error
    }
  }

  async updateLastActive(id) {
    try {
      return await this.update(id, { lastActive: new Date() })
    } catch (error) {
      logger.error('Failed to update last active', { error: error.message, id })
      throw error
    }
  }
}

export default new AccountRepository()

