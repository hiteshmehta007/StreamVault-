import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface SocketWithAuth extends SocketIOServer {
  userId?: string;
  username?: string;
}

export const initializeSocket = (io: SocketIOServer) => {
  // Authentication middleware for Socket.IO
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(); // Allow anonymous connections
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(); // Allow connection but without authentication
    }
  });

  io.on('connection', (socket: any) => {
    logger.info(`Socket connected: ${socket.id}`, {
      userId: socket.userId || 'anonymous',
      username: socket.username || 'anonymous'
    });

    // Join user-specific room if authenticated
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      socket.join('authenticated');
    } else {
      socket.join('anonymous');
    }

    // Handle video watching
    socket.on('watch-video', (data: { videoId: string }) => {
      socket.join(`video:${data.videoId}`);
      socket.to(`video:${data.videoId}`).emit('viewer-joined', {
        socketId: socket.id,
        userId: socket.userId
      });
    });

    // Handle leaving video
    socket.on('leave-video', (data: { videoId: string }) => {
      socket.leave(`video:${data.videoId}`);
      socket.to(`video:${data.videoId}`).emit('viewer-left', {
        socketId: socket.id,
        userId: socket.userId
      });
    });

    // Handle live streaming
    socket.on('join-live-stream', (data: { streamId: string }) => {
      socket.join(`stream:${data.streamId}`);
      
      // Notify others about new viewer
      socket.to(`stream:${data.streamId}`).emit('viewer-joined-stream', {
        viewerCount: io.sockets.adapter.rooms.get(`stream:${data.streamId}`)?.size || 1
      });
    });

    socket.on('leave-live-stream', (data: { streamId: string }) => {
      socket.leave(`stream:${data.streamId}`);
      
      // Notify others about viewer leaving
      socket.to(`stream:${data.streamId}`).emit('viewer-left-stream', {
        viewerCount: io.sockets.adapter.rooms.get(`stream:${data.streamId}`)?.size || 0
      });
    });

    // Handle real-time comments
    socket.on('new-comment', (data: { videoId: string; comment: any }) => {
      socket.to(`video:${data.videoId}`).emit('comment-added', data.comment);
    });

    // Handle typing indicators
    socket.on('typing-comment', (data: { videoId: string; isTyping: boolean }) => {
      socket.to(`video:${data.videoId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`, {
        userId: socket.userId || 'anonymous'
      });
    });

    // Error handling
    socket.on('error', (error: any) => {
      logger.error('Socket error:', error);
    });
  });

  return io;
};