import express from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();

// App version check
router.get('/version', (req, res) => {
  res.json({
    minVersion: '1.0.0',
    latestVersion: '1.2.0',
    updateRequired: false,
    updateUrl: {
      ios: process.env.APP_STORE_URL || '',
      android: process.env.PLAY_STORE_URL || ''
    },
    features: {
      liveStreaming: true,
      offlineDownload: true,
      pushNotifications: true,
      backgroundPlay: true
    },
    apiVersion: '1.0'
  });
});

// Mobile-optimized feed
const feedSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 50)),
  category: z.string().optional(),
  quality: z.enum(['360p', '720p', '1080p']).optional().default('720p')
});

router.get('/feed', optionalAuthMiddleware, validateRequest(feedSchema, 'query'), async (req: any, res: any) => {
  try {
    const { page, limit, category, quality } = req.query as any;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'READY',
      visibility: 'PUBLIC'
    };

    if (category) {
      where.category = category;
    }

    const videos = await prisma.video.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        duration: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true
          }
        },
        qualityVersions: {
          where: { quality },
          select: {
            url: true,
            quality: true,
            fileSize: true
          }
        }
      }
    });

    // Add user-specific data if authenticated
    if (req.userId) {
      const userInteractions = await Promise.all(
        videos.map(async (video) => {
          const [like, watchLater, subscription] = await Promise.all([
            prisma.like.findFirst({
              where: { userId: req.userId!, videoId: video.id },
              select: { type: true }
            }),
            prisma.watchLater.findFirst({
              where: { userId: req.userId!, videoId: video.id }
            }),
            prisma.subscription.findFirst({
              where: { 
                subscriberId: req.userId!, 
                channelId: video.creator.id 
              }
            })
          ]);

          return {
            videoId: video.id,
            isLiked: like?.type === 'LIKE',
            isDisliked: like?.type === 'DISLIKE',
            isInWatchLater: !!watchLater,
            isSubscribed: !!subscription
          };
        })
      );

      const videosWithInteractions = videos.map((video, index) => ({
        ...video,
        userInteraction: userInteractions[index]
      }));

      return res.json({
        videos: videosWithInteractions,
        pagination: {
          page,
          limit,
          hasMore: videos.length === limit
        }
      });
    }

    res.json({
      videos,
      pagination: {
        page,
        limit,
        hasMore: videos.length === limit
      }
    });
  } catch (error) {
    logger.error('Mobile feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mobile video playback endpoint
router.get('/video/:videoId/play', optionalAuthMiddleware, async (req: any, res: any) => {
  try {
    const { videoId } = req.params;
    const { quality = '720p' } = req.query;

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        status: 'READY',
        OR: [
          { visibility: 'PUBLIC' },
          { visibility: 'UNLISTED' },
          req.userId ? { creatorId: req.userId } : {}
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
            subscriberCount: true
          }
        },
        qualityVersions: {
          orderBy: {
            quality: 'desc'
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Get preferred quality or fallback
    let videoUrl = video.videoUrl; // Original as fallback
    const requestedQuality = video.qualityVersions.find(v => v.quality === quality);
    if (requestedQuality) {
      videoUrl = requestedQuality.url;
    } else if (video.qualityVersions.length > 0) {
      videoUrl = video.qualityVersions[0].url; // Best available quality
    }

    // Get user interactions if authenticated
    let userInteraction: any = null;
    if (req.userId) {
      const [like, watchLater, subscription, watchHistory] = await Promise.all([
        prisma.like.findFirst({
          where: { userId: req.userId, videoId },
          select: { type: true }
        }),
        prisma.watchLater.findFirst({
          where: { userId: req.userId, videoId }
        }),
        prisma.subscription.findFirst({
          where: { 
            subscriberId: req.userId, 
            channelId: video.creatorId 
          }
        }),
        prisma.watchHistory.findFirst({
          where: { userId: req.userId, videoId },
          select: { watchTime: true }
        })
      ]);

      userInteraction = {
        isLiked: like?.type === 'LIKE',
        isDisliked: like?.type === 'DISLIKE',
        isInWatchLater: !!watchLater,
        isSubscribed: !!subscription,
        resumeTime: watchHistory?.watchTime || 0
      };
    }

    res.json({
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        videoUrl,
        duration: video.duration,
        viewCount: video.viewCount,
        likeCount: video.likeCount,
        dislikeCount: video.dislikeCount,
        commentCount: video.commentCount,
        createdAt: video.createdAt,
        creator: video.creator,
        qualityVersions: video.qualityVersions.map(v => ({
          quality: v.quality,
          url: v.url,
          fileSize: v.fileSize
        }))
      },
      userInteraction
    });
  } catch (error) {
    logger.error('Mobile video play error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update watch progress
const progressSchema = z.object({
  watchTime: z.number().min(0),
  duration: z.number().min(0).optional(),
  completed: z.boolean().optional()
});

router.post('/video/:videoId/progress', authMiddleware, validateRequest(progressSchema), async (req: any, res: any) => {
  try {
    const { videoId } = req.params;
    const { watchTime, duration, completed = false } = req.body;

    await prisma.watchHistory.upsert({
      where: {
        userId_videoId: {
          userId: req.userId!,
          videoId
        }
      },
      create: {
        userId: req.userId!,
        videoId,
        watchTime,
        completed
      },
      update: {
        watchTime,
        completed,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mobile search with suggestions
const searchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['video', 'channel', 'playlist']).optional().default('video'),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 50))
});

router.get('/search', validateRequest(searchSchema, 'query'), async (req: any, res: any) => {
  try {
    const { q: query, type, page, limit } = req.query as any;
    const skip = (page - 1) * limit;

    let results: any[] = [];

    if (type === 'video') {
      results = await prisma.video.findMany({
        where: {
          status: 'READY',
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        },
        skip,
        take: limit,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          viewCount: true,
          createdAt: true,
          creator: {
            select: {
              displayName: true,
              username: true,
              avatar: true,
              isVerified: true
            }
          }
        }
      });
    }

    res.json({
      results,
      query,
      type,
      pagination: {
        page,
        limit,
        hasMore: results.length === limit
      }
    });
  } catch (error) {
    logger.error('Mobile search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;