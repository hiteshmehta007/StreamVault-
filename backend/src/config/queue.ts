import Queue from 'bull';
import { getRedis } from './redis';
import { logger } from '../utils/logger';

let videoProcessingQueue: Queue.Queue;
let emailQueue: Queue.Queue;
let analyticsQueue: Queue.Queue;

export const initializeQueue = async () => {
  try {
    const redis = getRedis();
    
    // Video processing queue
    videoProcessingQueue = new Queue('video processing', {
      redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost',
      },
    });

    // Email queue
    emailQueue = new Queue('email', {
      redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost',
      },
    });

    // Analytics queue
    analyticsQueue = new Queue('analytics', {
      redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost',
      },
    });

    // Video processing jobs
    videoProcessingQueue.process('transcode', async (job) => {
      const { videoId, inputPath, outputDir } = job.data;
      
      logger.info(`Starting video processing for ${videoId}`);
      
      try {
        // Import the video processing service
        const { processVideo } = await import('../services/videoProcessingService');
        
        await processVideo({
          videoId,
          inputPath,
          outputDir,
          onProgress: (progress: number) => {
            job.progress(progress);
          }
        });

        logger.info(`Video processing completed for ${videoId}`);
        return { success: true, videoId };
      } catch (error) {
        logger.error(`Video processing failed for ${videoId}:`, error);
        throw error;
      }
    });

    // Email jobs
    emailQueue.process('send-email', async (job) => {
      const { to, subject, html, template, data } = job.data;
      
      try {
        const { sendEmail } = await import('../services/emailService');
        
        await sendEmail({
          to,
          subject,
          html,
          template,
          data
        });

        logger.info(`Email sent successfully to ${to}`);
        return { success: true, to };
      } catch (error) {
        logger.error(`Failed to send email to ${to}:`, error);
        throw error;
      }
    });

    // Analytics jobs
    analyticsQueue.process('track-view', async (job) => {
      const { videoId, userId, watchTime, source, device } = job.data;
      
      try {
        const { trackVideoView } = await import('../services/analyticsService');
        
        await trackVideoView({
          videoId,
          userId,
          watchTime,
          source,
          device
        });

        return { success: true, videoId };
      } catch (error) {
        logger.error('Failed to track video view:', error);
        throw error;
      }
    });

    logger.info('Job queues initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize job queues:', error);
    throw error;
  }
};

export const getVideoProcessingQueue = () => {
  if (!videoProcessingQueue) {
    throw new Error('Video processing queue not initialized');
  }
  return videoProcessingQueue;
};

export const getEmailQueue = () => {
  if (!emailQueue) {
    throw new Error('Email queue not initialized');
  }
  return emailQueue;
};

export const getAnalyticsQueue = () => {
  if (!analyticsQueue) {
    throw new Error('Analytics queue not initialized');
  }
  return analyticsQueue;
};