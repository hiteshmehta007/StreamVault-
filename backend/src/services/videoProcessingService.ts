import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../server';
import { logger } from '../utils/logger';

interface ProcessVideoOptions {
  videoId: string;
  inputPath: string;
  outputDir: string;
  onProgress?: (progress: number) => void;
}

interface VideoQuality {
  name: string;
  width: number;
  height: number;
  bitrate: string;
  suffix: string;
}

const qualities: VideoQuality[] = [
  { name: '2160p', width: 3840, height: 2160, bitrate: '8000k', suffix: '2160p' },
  { name: '1440p', width: 2560, height: 1440, bitrate: '6000k', suffix: '1440p' },
  { name: '1080p', width: 1920, height: 1080, bitrate: '4000k', suffix: '1080p' },
  { name: '720p', width: 1280, height: 720, bitrate: '2500k', suffix: '720p' },
  { name: '480p', width: 854, height: 480, bitrate: '1000k', suffix: '480p' },
  { name: '360p', width: 640, height: 360, bitrate: '600k', suffix: '360p' }
];

export const processVideo = async (options: ProcessVideoOptions): Promise<void> => {
  const { videoId, inputPath, outputDir, onProgress } = options;

  try {
    logger.info(`Starting video processing for ${videoId}`);

    // Update video status to processing
    await prisma.video.update({
      where: { id: videoId },
      data: { 
        status: 'PROCESSING', 
        processingProgress: 0 
      }
    });

    // Get video metadata
    const metadata = await getVideoMetadata(inputPath);
    
    // Update video with metadata
    await prisma.video.update({
      where: { id: videoId },
      data: {
        duration: Math.round(metadata.duration || 0),
        resolution: `${metadata.width}x${metadata.height}`,
        fps: metadata.fps,
        codec: metadata.codec,
        bitrate: metadata.bitrate,
        aspectRatio: metadata.aspectRatio
      }
    });

    // Generate thumbnail
    const thumbnailPath = path.join(outputDir, `${videoId}_thumbnail.jpg`);
    await generateThumbnail(inputPath, thumbnailPath);

    // Upload thumbnail to cloud storage (if configured)
    let thumbnailUrl = thumbnailPath;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      thumbnailUrl = await uploadToCloudinary(thumbnailPath, 'image');
    }

    // Process video into different qualities
    const qualities = await processVideoQualities(videoId, inputPath, outputDir, onProgress);

    // Update video with results
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'READY',
        processingProgress: 100,
        thumbnail: thumbnailUrl,
        qualityVersions: {
          createMany: {
            data: qualities
          }
        }
      }
    });

    logger.info(`Video processing completed for ${videoId}`);
  } catch (error) {
    logger.error(`Video processing failed for ${videoId}:`, error);
    
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'FAILED',
        processingError: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    throw error;
  }
};

const getVideoMetadata = (inputPath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      resolve({
        duration: metadata.format.duration,
        width: videoStream.width,
        height: videoStream.height,
        fps: eval(videoStream.r_frame_rate || '30/1'), // Parse framerate
        codec: videoStream.codec_name,
        bitrate: parseInt(String(metadata.format.bit_rate || '0')),
        aspectRatio: videoStream.display_aspect_ratio || `${videoStream.width}:${videoStream.height}`
      });
    });
  });
};

const generateThumbnail = (inputPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['10%'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720'
      })
      .on('end', () => resolve())
      .on('error', reject);
  });
};

const processVideoQualities = async (
  videoId: string, 
  inputPath: string, 
  outputDir: string, 
  onProgress?: (progress: number) => void
): Promise<any[]> => {
  const results: any[] = [];
  let completedQualities = 0;

  for (const quality of qualities) {
    try {
      const outputPath = path.join(outputDir, `${videoId}_${quality.suffix}.mp4`);
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .videoBitrate(quality.bitrate)
          .size(`${quality.width}x${quality.height}`)
          .outputOptions([
            '-preset fast',
            '-crf 23',
            '-movflags +faststart' // Optimize for streaming
          ])
          .output(outputPath)
          .on('progress', (progress) => {
            const totalProgress = ((completedQualities + (progress.percent || 0) / 100) / qualities.length) * 100;
            onProgress?.(Math.round(totalProgress));
          })
          .on('end', () => resolve())
          .on('error', reject)
          .run();
      });

      // Get file size
      const stats = await fs.stat(outputPath);
      
      // Upload to cloud storage if configured
      let videoUrl = outputPath;
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        videoUrl = await uploadToCloudinary(outputPath, 'video');
      }

      results.push({
        quality: quality.name,
        url: videoUrl,
        fileSize: stats.size,
        bitrate: parseInt(quality.bitrate.replace('k', '')) * 1000
      });

      completedQualities++;
      
      logger.info(`Processed ${quality.name} quality for video ${videoId}`);
    } catch (error) {
      logger.error(`Failed to process ${quality.name} quality for video ${videoId}:`, error);
      // Continue with other qualities
    }
  }

  return results;
};

const uploadToCloudinary = async (filePath: string, resourceType: 'image' | 'video'): Promise<string> => {
  try {
    const cloudinary = require('cloudinary').v2;
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: 'video-streaming',
      use_filename: true,
      unique_filename: false,
    });

    // Delete local file after upload
    await fs.unlink(filePath);

    return result.secure_url;
  } catch (error) {
    logger.error('Cloudinary upload failed:', error);
    return filePath; // Return local path as fallback
  }
};