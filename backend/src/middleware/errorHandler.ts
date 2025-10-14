import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Prisma specific errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists',
      field: error.meta?.target?.[0] || 'unknown'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource not found'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details || error.message
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Multer errors (file upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      maxSize: '2GB'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected file field',
      expected: 'video'
    });
  }

  // Default error
  const statusCode = error.status || error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : error.message;

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};