import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { processVideo } from '../services/videoProcessingService';

interface VideoRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'unlisted' | 'private';
  language: string;
  monetization: boolean;
  ageRestricted: boolean;
  commentsEnabled: boolean;
  scheduledDate?: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  processingProgress: number;
  uploadedBy: string;
}

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads/videos');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error instanceof Error ? error : new Error('Failed to create upload directory'), uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure multer for thumbnail uploads
const thumbnailStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads/thumbnails');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error instanceof Error ? error : new Error('Failed to create thumbnail directory'), uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `thumbnail-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Invalid file type. Only video files are allowed.') as any;
      cb(error, false);
    }
  }
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for thumbnails
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Invalid file type. Only image files are allowed for thumbnails.') as any;
      cb(error, false);
    }
  }
});

// Video metadata validation schema
const videoMetadataSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
  language: z.string().default('en'),
  monetization: z.boolean().default(false),
  ageRestricted: z.boolean().default(false),
  commentsEnabled: z.boolean().default(true),
  scheduledDate: z.string().optional()
});

// Upload video endpoint
router.post('/video', authMiddleware, upload.single('video'), async (req: AuthRequest, res): Promise<any> => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Validate metadata
    const metadata = videoMetadataSchema.parse(req.body);
    
    // Process tags
    const tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [];

    // Create video record (in real app, save to database)
    const videoRecord: VideoRecord = {
      id: `video_${Date.now()}`,
      title: metadata.title,
      description: metadata.description || '',
      category: metadata.category || 'other',
      tags,
      visibility: metadata.visibility,
      language: metadata.language,
      monetization: metadata.monetization,
      ageRestricted: metadata.ageRestricted,
      commentsEnabled: metadata.commentsEnabled,
      scheduledDate: metadata.scheduledDate,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      processingProgress: 0,
      uploadedBy: req.userId || 'anonymous'
    };

    // Ensure processed directory exists
    const processedDir = path.join(process.cwd(), 'uploads/processed');
    await fs.mkdir(processedDir, { recursive: true });

    // Start video processing in background
    processVideo({
      videoId: videoRecord.id,
      inputPath: req.file.path,
      outputDir: processedDir,
      onProgress: (progress) => {
        console.log(`Processing ${videoRecord.id}: ${progress}%`);
        // In real app, update progress in database
      }
    }).catch(error => {
      console.error('Video processing failed:', error);
      // In real app, update video status to 'failed' in database
    });

    // Return immediate response
    res.status(201).json({
      video: {
        id: videoRecord.id,
        title: videoRecord.title,
        status: videoRecord.status,
        processingProgress: videoRecord.processingProgress,
        uploadedAt: videoRecord.uploadedAt
      },
      message: 'Video uploaded successfully and is being processed'
    });

  } catch (error) {
    console.error('Video upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded file:', cleanupError);
      }
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid metadata', 
        details: error.errors 
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload thumbnail endpoint
router.post('/thumbnail', authMiddleware, upload.single('thumbnail'), async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No thumbnail file provided' });
    }

    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // In real app, update video record with thumbnail path
    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;

    res.json({
      thumbnailUrl,
      message: 'Thumbnail uploaded successfully'
    });

  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upload progress
router.get('/progress/:videoId', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { videoId } = req.params;
    
    // In real app, fetch from database
    const mockProgress = {
      videoId,
      status: 'processing',
      uploadProgress: 100,
      processingProgress: Math.floor(Math.random() * 100),
      estimatedTimeRemaining: '2 minutes'
    };

    res.json(mockProgress);

  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel upload
router.delete('/:videoId', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { videoId } = req.params;
    
    // In real app, cancel processing and delete files
    res.json({ message: 'Upload cancelled successfully' });

  } catch (error) {
    console.error('Upload cancellation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;