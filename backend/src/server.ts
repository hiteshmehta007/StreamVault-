import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

import { PrismaClient } from '@prisma/client';
import { initializeRedis } from './config/redis';
import { initializeQueue } from './config/queue';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { initializeSocket } from './config/socket';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import channelRoutes from './routes/channels';
import videoRoutes from './routes/videos';
import uploadRoutes from './routes/upload';
import playlistRoutes from './routes/playlists';
import commentRoutes from './routes/comments';
import analyticsRoutes from './routes/analytics';
import liveStreamRoutes from './routes/liveStreams';
import notificationRoutes from './routes/notifications';
import mobileRoutes from './routes/mobile';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.WEB_URL!, process.env.MOBILE_SCHEME!]
      : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }
});

// Database
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.WEB_URL!, process.env.MOBILE_SCHEME!]
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Upload rate limiting (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: 'Too many upload attempts, please try again later.'
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/live', liveStreamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mobile', mobileRoutes);

// Initialize Socket.IO
initializeSocket(io);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize Redis
    await initializeRedis();
    logger.info('Redis connected successfully');
    
    // Initialize job queue
    await initializeQueue();
    logger.info('Job queue initialized');
    
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Mobile support enabled`);
      logger.info(`🌐 Web support enabled`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export { io };