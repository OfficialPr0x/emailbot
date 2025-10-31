import prisma from '../database/prisma.js';
import { createLogger } from './logger.js';

const logger = createLogger('SeedStudioData');

/**
 * Seed sample Studio X data for testing and demo purposes
 */
export async function seedStudioDataForAccount(accountId) {
  try {
    logger.info('Seeding Studio X data', { accountId });

    // 1. Seed AccountMetrics (30 days of data)
    const metricsData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Simulate growth with some variance
      const baseFollowers = 100 + (29 - i) * 15;
      const variance = Math.floor(Math.random() * 20) - 10;
      const followers = baseFollowers + variance;
      
      const posts = Math.floor((29 - i) / 3);
      const likes = posts * (50 + Math.floor(Math.random() * 100));
      const comments = posts * (5 + Math.floor(Math.random() * 20));
      const reach = likes * (2 + Math.random());
      const impressions = reach * (1.5 + Math.random());
      const engagementRate = ((likes + comments) / Math.max(followers, 1)) * 100;
      const shadowbanRisk = Math.random() * 0.3; // Keep it low for good accounts

      metricsData.push({
        accountId,
        date,
        followers,
        following: 150 + Math.floor(Math.random() * 50),
        posts,
        likes,
        comments,
        reach: Math.floor(reach),
        impressions: Math.floor(impressions),
        shadowbanRisk,
        engagementRate,
      });
    }

    // Bulk insert metrics
    for (const metrics of metricsData) {
      await prisma.accountMetrics.upsert({
        where: {
          accountId_date: {
            accountId: metrics.accountId,
            date: metrics.date,
          },
        },
        update: metrics,
        create: metrics,
      });
    }

    logger.info('Seeded 30 days of metrics data', { accountId });

    // 2. Seed Sample Content Posts
    const samplePosts = [
      {
        type: 'post',
        caption: 'Starting my journey! 🚀 Excited to share my story with you all. #NewBeginnings #Motivation',
        hashtags: '#NewBeginnings #Motivation #Growth #Inspiration',
        status: 'published',
        scheduledFor: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        performance: JSON.stringify({ likes: 125, comments: 18, shares: 5, reach: 450 }),
      },
      {
        type: 'reel',
        caption: 'Quick tip for staying productive! 💪 Save this for later. #ProductivityHacks #LifeHacks',
        hashtags: '#ProductivityHacks #LifeHacks #Tips #Motivation',
        status: 'published',
        scheduledFor: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        performance: JSON.stringify({ likes: 342, comments: 45, shares: 23, reach: 1250 }),
      },
      {
        type: 'post',
        caption: 'Behind the scenes of my morning routine ☀️ How do you start your day?',
        hashtags: '#MorningRoutine #Lifestyle #Wellness #SelfCare',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        type: 'story',
        caption: 'Q&A Time! Ask me anything 👇',
        hashtags: '#QA #AskMeAnything #Community',
        status: 'draft',
      },
      {
        type: 'reel',
        caption: 'Weekend vibes! 🌴 What are your plans? #WeekendVibes #Relaxation',
        hashtags: '#WeekendVibes #Relaxation #Weekend #Fun',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const post of samplePosts) {
      await prisma.contentPost.create({
        data: {
          accountId,
          ...post,
        },
      });
    }

    logger.info('Seeded sample content posts', { accountId, count: samplePosts.length });

    // 3. Seed Default Personas
    const defaultPersonas = [
      {
        name: 'Professional',
        tone: 'Formal, authoritative, and informative',
        keywords: JSON.stringify(['business', 'leadership', 'success', 'growth', 'strategy']),
        bio: 'Entrepreneur | Business Leader | Helping others achieve their goals',
        hashtags: '#Business #Leadership #Success #Entrepreneur #Growth',
        isActive: true,
      },
      {
        name: 'Casual',
        tone: 'Friendly, relatable, and conversational',
        keywords: JSON.stringify(['lifestyle', 'daily', 'vibes', 'authentic', 'real']),
        bio: 'Living my best life ✨ | Sharing the journey | Let\'s connect!',
        hashtags: '#Lifestyle #DailyLife #Authentic #RealTalk #Vibes',
        isActive: false,
      },
      {
        name: 'Motivational',
        tone: 'Inspiring, empowering, and uplifting',
        keywords: JSON.stringify(['motivation', 'inspiration', 'mindset', 'goals', 'transformation']),
        bio: '💪 Your Daily Dose of Motivation | Mindset Coach | Believe & Achieve',
        hashtags: '#Motivation #Inspiration #Mindset #Goals #Success',
        isActive: false,
      },
    ];

    for (const persona of defaultPersonas) {
      await prisma.personaProfile.create({
        data: {
          accountId,
          ...persona,
        },
      });
    }

    logger.info('Seeded default personas', { accountId, count: defaultPersonas.length });

    return {
      success: true,
      metrics: metricsData.length,
      posts: samplePosts.length,
      personas: defaultPersonas.length,
    };
  } catch (error) {
    logger.error('Failed to seed Studio X data', { error: error.message, accountId });
    throw error;
  }
}

/**
 * Seed data for all accounts
 */
export async function seedAllAccountsStudioData() {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        status: 'active',
      },
    });

    logger.info('Seeding Studio X data for all accounts', { count: accounts.length });

    const results = [];
    for (const account of accounts) {
      try {
        const result = await seedStudioDataForAccount(account.id);
        results.push({ accountId: account.id, ...result });
      } catch (error) {
        logger.error('Failed to seed account', { accountId: account.id, error: error.message });
        results.push({ accountId: account.id, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    logger.error('Failed to seed Studio X data for all accounts', { error: error.message });
    throw error;
  }
}

export default { seedStudioDataForAccount, seedAllAccountsStudioData };

