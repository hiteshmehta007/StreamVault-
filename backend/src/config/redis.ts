import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis;

export const initializeRedis = async (): Promise<Redis> => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      family: 4, // Use IPv4
    });

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redis.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    await redis.connect();
    
    return redis;
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
};

export const getRedis = (): Redis => {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redis;
};

// Cache utilities
export const cache = {
  get: async (key: string) => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  set: async (key: string, value: any, expireInSeconds?: number) => {
    try {
      const serialized = JSON.stringify(value);
      if (expireInSeconds) {
        await redis.setex(key, expireInSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  },

  del: async (key: string) => {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  },

  exists: async (key: string) => {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }
};