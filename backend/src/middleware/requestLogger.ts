import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - start;
    
    // Log request details
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      platform: req.headers['x-platform'] || 'unknown',
      userId: (req as any).userId || 'anonymous'
    });

    return originalJson.call(this, body);
  };

  next();
};