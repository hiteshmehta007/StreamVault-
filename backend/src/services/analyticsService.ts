import { prisma } from '../server';
import { logger } from '../utils/logger';

interface TrackVideoViewOptions {
  videoId: string;
  userId?: string;
  watchTime: number;
  source: 'direct' | 'search' | 'suggested' | 'external';
  device: 'mobile' | 'desktop' | 'tablet';
}

export const trackVideoView = async (options: TrackVideoViewOptions): Promise<void> => {
  const { videoId, userId, watchTime, source, device } = options;

  try {
    // Update video view count
    await prisma.video.update({
      where: { id: videoId },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // Update creator's total views
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { creatorId: true }
    });

    if (video) {
      await prisma.user.update({
        where: { id: video.creatorId },
        data: {
          totalViews: { increment: 1 }
        }
      });
    }

    // Get or create today's analytics record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.videoAnalytics.upsert({
      where: {
        videoId_date: {
          videoId,
          date: today
        }
      },
      create: {
        videoId,
        date: today,
        views: 1,
        watchTime: Math.round(watchTime),
        directViews: source === 'direct' ? 1 : 0,
        searchViews: source === 'search' ? 1 : 0,
        suggestedViews: source === 'suggested' ? 1 : 0,
        externalViews: source === 'external' ? 1 : 0,
        mobileViews: device === 'mobile' ? 1 : 0,
        desktopViews: device === 'desktop' ? 1 : 0,
        tabletViews: device === 'tablet' ? 1 : 0
      },
      update: {
        views: { increment: 1 },
        watchTime: { increment: Math.round(watchTime) },
        directViews: source === 'direct' ? { increment: 1 } : undefined,
        searchViews: source === 'search' ? { increment: 1 } : undefined,
        suggestedViews: source === 'suggested' ? { increment: 1 } : undefined,
        externalViews: source === 'external' ? { increment: 1 } : undefined,
        mobileViews: device === 'mobile' ? { increment: 1 } : undefined,
        desktopViews: device === 'desktop' ? { increment: 1 } : undefined,
        tabletViews: device === 'tablet' ? { increment: 1 } : undefined
      }
    });

    // Track user analytics if authenticated
    if (userId && video) {
      await prisma.userAnalytics.upsert({
        where: {
          userId_date: {
            userId: video.creatorId,
            date: today
          }
        },
        create: {
          userId: video.creatorId,
          date: today,
          videoViews: 1,
          watchTime: Math.round(watchTime)
        },
        update: {
          videoViews: { increment: 1 },
          watchTime: { increment: Math.round(watchTime) }
        }
      });
    }

    logger.debug(`Tracked view for video ${videoId}`, {
      userId,
      source,
      device,
      watchTime
    });
  } catch (error) {
    logger.error('Failed to track video view:', error);
    // Don't throw - analytics failures shouldn't break the main flow
  }
};

export const getVideoAnalytics = async (videoId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await prisma.videoAnalytics.findMany({
      where: {
        videoId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const summary = analytics.reduce((acc, day) => ({
      totalViews: acc.totalViews + day.views,
      totalWatchTime: acc.totalWatchTime + day.watchTime,
      totalLikes: acc.totalLikes + day.likes,
      totalComments: acc.totalComments + day.comments,
      totalShares: acc.totalShares + day.shares,
      directViews: acc.directViews + day.directViews,
      searchViews: acc.searchViews + day.searchViews,
      suggestedViews: acc.suggestedViews + day.suggestedViews,
      externalViews: acc.externalViews + day.externalViews,
      mobileViews: acc.mobileViews + day.mobileViews,
      desktopViews: acc.desktopViews + day.desktopViews,
      tabletViews: acc.tabletViews + day.tabletViews
    }), {
      totalViews: 0,
      totalWatchTime: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      directViews: 0,
      searchViews: 0,
      suggestedViews: 0,
      externalViews: 0,
      mobileViews: 0,
      desktopViews: 0,
      tabletViews: 0
    });

    return {
      dailyAnalytics: analytics,
      summary,
      period: {
        startDate,
        endDate: new Date(),
        days
      }
    };
  } catch (error) {
    logger.error('Failed to get video analytics:', error);
    throw error;
  }
};

export const getUserAnalytics = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await prisma.userAnalytics.findMany({
      where: {
        userId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const summary = analytics.reduce((acc, day) => ({
      totalProfileViews: acc.totalProfileViews + day.profileViews,
      totalVideoViews: acc.totalVideoViews + day.videoViews,
      totalSubscribers: acc.totalSubscribers + day.subscribers,
      totalWatchTime: acc.totalWatchTime + day.watchTime,
      totalRevenue: acc.totalRevenue + day.revenue
    }), {
      totalProfileViews: 0,
      totalVideoViews: 0,
      totalSubscribers: 0,
      totalWatchTime: 0,
      totalRevenue: 0
    });

    return {
      dailyAnalytics: analytics,
      summary,
      period: {
        startDate,
        endDate: new Date(),
        days
      }
    };
  } catch (error) {
    logger.error('Failed to get user analytics:', error);
    throw error;
  }
};