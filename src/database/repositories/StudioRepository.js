import prisma from '../prisma.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('StudioRepository');

class StudioRepository {
  // ==================== ContentPost Operations ====================
  
  async createContentPost(data) {
    try {
      return await prisma.contentPost.create({
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to create content post', { error: error.message });
      throw error;
    }
  }

  async findContentPostById(id) {
    try {
      return await prisma.contentPost.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find content post', { error: error.message, id });
      throw error;
    }
  }

  async findContentPostsByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.type) {
        where.type = filters.type;
      }
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.startDate || filters.endDate) {
        where.scheduledFor = {};
        if (filters.startDate) {
          where.scheduledFor.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.scheduledFor.lte = new Date(filters.endDate);
        }
      }

      return await prisma.contentPost.findMany({
        where,
        orderBy: [
          { scheduledFor: 'asc' },
          { createdAt: 'desc' },
        ],
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find content posts', { error: error.message, accountId });
      throw error;
    }
  }

  async updateContentPost(id, data) {
    try {
      return await prisma.contentPost.update({
        where: { id },
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to update content post', { error: error.message, id });
      throw error;
    }
  }

  async deleteContentPost(id) {
    try {
      return await prisma.contentPost.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete content post', { error: error.message, id });
      throw error;
    }
  }

  // ==================== PersonaProfile Operations ====================

  async createPersona(data) {
    try {
      // If setting as active, deactivate other personas for this account
      if (data.isActive) {
        await prisma.personaProfile.updateMany({
          where: { accountId: data.accountId },
          data: { isActive: false },
        });
      }

      return await prisma.personaProfile.create({
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to create persona', { error: error.message });
      throw error;
    }
  }

  async findPersonaById(id) {
    try {
      return await prisma.personaProfile.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find persona', { error: error.message, id });
      throw error;
    }
  }

  async findPersonasByAccount(accountId) {
    try {
      return await prisma.personaProfile.findMany({
        where: { accountId },
        orderBy: [
          { isActive: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find personas', { error: error.message, accountId });
      throw error;
    }
  }

  async getActivePersona(accountId) {
    try {
      return await prisma.personaProfile.findFirst({
        where: { 
          accountId,
          isActive: true,
        },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get active persona', { error: error.message, accountId });
      throw error;
    }
  }

  async updatePersona(id, data) {
    try {
      // If setting as active, deactivate other personas for this account
      if (data.isActive) {
        const persona = await prisma.personaProfile.findUnique({
          where: { id },
          select: { accountId: true },
        });
        
        if (persona) {
          await prisma.personaProfile.updateMany({
            where: { 
              accountId: persona.accountId,
              id: { not: id },
            },
            data: { isActive: false },
          });
        }
      }

      return await prisma.personaProfile.update({
        where: { id },
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to update persona', { error: error.message, id });
      throw error;
    }
  }

  async deletePersona(id) {
    try {
      return await prisma.personaProfile.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete persona', { error: error.message, id });
      throw error;
    }
  }

  // ==================== AccountMetrics Operations ====================

  async recordMetrics(data) {
    try {
      // Upsert: update if exists for this account+date, create if not
      return await prisma.accountMetrics.upsert({
        where: {
          accountId_date: {
            accountId: data.accountId,
            date: data.date,
          },
        },
        update: data,
        create: data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to record metrics', { error: error.message });
      throw error;
    }
  }

  async getMetricsByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
          where.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.date.lte = new Date(filters.endDate);
        }
      }

      return await prisma.accountMetrics.findMany({
        where,
        orderBy: { date: 'desc' },
        take: filters.limit || 30,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get metrics', { error: error.message, accountId });
      throw error;
    }
  }

  async getLatestMetrics(accountId) {
    try {
      return await prisma.accountMetrics.findFirst({
        where: { accountId },
        orderBy: { date: 'desc' },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get latest metrics', { error: error.message, accountId });
      throw error;
    }
  }

  async getMetricsSummary(accountId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await prisma.accountMetrics.findMany({
        where: {
          accountId,
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
      });

      if (metrics.length === 0) {
        return null;
      }

      const latest = metrics[metrics.length - 1];
      const oldest = metrics[0];

      return {
        latest: latest,
        oldest: oldest,
        growth: {
          followers: latest.followers - oldest.followers,
          following: latest.following - oldest.following,
          posts: latest.posts - oldest.posts,
          likes: latest.likes - oldest.likes,
          comments: latest.comments - oldest.comments,
        },
        averageEngagementRate: metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length,
        averageShadowbanRisk: metrics.reduce((sum, m) => sum + m.shadowbanRisk, 0) / metrics.length,
        dataPoints: metrics.length,
      };
    } catch (error) {
      logger.error('Failed to get metrics summary', { error: error.message, accountId });
      throw error;
    }
  }

  // ==================== AutomationTask Operations ====================

  async createAutomationTask(data) {
    try {
      return await prisma.automationTask.create({
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to create automation task', { error: error.message });
      throw error;
    }
  }

  async findAutomationTaskById(id) {
    try {
      return await prisma.automationTask.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find automation task', { error: error.message, id });
      throw error;
    }
  }

  async findAutomationTasksByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.type) {
        where.type = filters.type;
      }
      
      if (filters.status) {
        where.status = filters.status;
      }

      return await prisma.automationTask.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to find automation tasks', { error: error.message, accountId });
      throw error;
    }
  }

  async updateAutomationTask(id, data) {
    try {
      return await prisma.automationTask.update({
        where: { id },
        data,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to update automation task', { error: error.message, id });
      throw error;
    }
  }

  async deleteAutomationTask(id) {
    try {
      return await prisma.automationTask.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete automation task', { error: error.message, id });
      throw error;
    }
  }

  // ==================== Automation Tasks ====================

  async findAutomationTasksByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      
      return await prisma.automationTask.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Failed to find automation tasks', { error: error.message, accountId });
      throw error;
    }
  }

  async createAutomationTask(data) {
    try {
      return await prisma.automationTask.create({
        data,
      });
    } catch (error) {
      logger.error('Failed to create automation task', { error: error.message });
      throw error;
    }
  }

  async updateAutomationTask(id, data) {
    try {
      return await prisma.automationTask.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('Failed to update automation task', { error: error.message, id });
      throw error;
    }
  }

  async deleteAutomationTask(id) {
    try {
      return await prisma.automationTask.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete automation task', { error: error.message, id });
      throw error;
    }
  }

  // ==================== Content Releases (Creator Reactor) ====================

  async findContentReleasesByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.type) {
        where.type = filters.type;
      }
      
      return await prisma.contentRelease.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Failed to find content releases', { error: error.message, accountId });
      throw error;
    }
  }

  async createContentRelease(data) {
    try {
      return await prisma.contentRelease.create({
        data,
      });
    } catch (error) {
      logger.error('Failed to create content release', { error: error.message });
      throw error;
    }
  }

  async deleteContentRelease(id) {
    try {
      return await prisma.contentRelease.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete content release', { error: error.message, id });
      throw error;
    }
  }

  // ==================== Influencers ====================

  async findInfluencersByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.niche) {
        where.niche = filters.niche;
      }
      if (filters.region) {
        where.region = filters.region;
      }
      if (filters.minFollowers) {
        where.followersCount = { gte: parseInt(filters.minFollowers) };
      }
      if (filters.maxFollowers) {
        where.followersCount = { ...where.followersCount, lte: parseInt(filters.maxFollowers) };
      }
      
      return await prisma.influencer.findMany({
        where,
        orderBy: { discoveredAt: 'desc' },
        include: {
          collaborations: true,
        },
      });
    } catch (error) {
      logger.error('Failed to find influencers', { error: error.message, accountId });
      throw error;
    }
  }

  async createInfluencer(data) {
    try {
      return await prisma.influencer.create({
        data,
      });
    } catch (error) {
      logger.error('Failed to create influencer', { error: error.message });
      throw error;
    }
  }

  async updateInfluencer(id, data) {
    try {
      return await prisma.influencer.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('Failed to update influencer', { error: error.message, id });
      throw error;
    }
  }

  async deleteInfluencer(id) {
    try {
      return await prisma.influencer.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete influencer', { error: error.message, id });
      throw error;
    }
  }

  // ==================== Collaborations ====================

  async findCollaborationsByAccount(accountId, filters = {}) {
    try {
      const where = { accountId };
      
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.type) {
        where.type = filters.type;
      }
      
      return await prisma.collaboration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          influencer: true,
        },
      });
    } catch (error) {
      logger.error('Failed to find collaborations', { error: error.message, accountId });
      throw error;
    }
  }

  async createCollaboration(data) {
    try {
      return await prisma.collaboration.create({
        data,
        include: {
          influencer: true,
        },
      });
    } catch (error) {
      logger.error('Failed to create collaboration', { error: error.message });
      throw error;
    }
  }

  async updateCollaboration(id, data) {
    try {
      return await prisma.collaboration.update({
        where: { id },
        data,
        include: {
          influencer: true,
        },
      });
    } catch (error) {
      logger.error('Failed to update collaboration', { error: error.message, id });
      throw error;
    }
  }

  async deleteCollaboration(id) {
    try {
      return await prisma.collaboration.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Failed to delete collaboration', { error: error.message, id });
      throw error;
    }
  }

  // ==================== Composite Operations ====================

  async getStudioOverview(accountId) {
    try {
      const [
        account,
        contentPosts,
        personas,
        latestMetrics,
        automationTasks,
      ] = await Promise.all([
        prisma.account.findUnique({
          where: { id: accountId },
        }),
        prisma.contentPost.count({
          where: { accountId },
        }),
        prisma.personaProfile.findMany({
          where: { accountId },
          orderBy: { isActive: 'desc' },
          take: 5,
        }),
        this.getLatestMetrics(accountId),
        prisma.automationTask.count({
          where: { 
            accountId,
            status: 'active',
          },
        }),
      ]);

      return {
        account,
        stats: {
          totalPosts: contentPosts,
          totalPersonas: personas.length,
          activeAutomations: automationTasks,
        },
        activePersona: personas.find(p => p.isActive) || null,
        latestMetrics: latestMetrics || null,
      };
    } catch (error) {
      logger.error('Failed to get studio overview', { error: error.message, accountId });
      throw error;
    }
  }
}

export default new StudioRepository();

