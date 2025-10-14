import { apiClient, Video, PaginatedResponse, handleApiError } from './apiClient';

export interface VideoFilters {
  page?: number;
  limit?: number;
  category?: string;
  creatorId?: string;
  sort?: 'newest' | 'popular' | 'trending';
  quality?: '360p' | '720p' | '1080p';
}

export interface VideoUploadData {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  language?: string;
  scheduledDate?: string;
  monetization?: boolean;
  ageRestricted?: boolean;
  commentsEnabled?: boolean;
}

export interface VideoAnalytics {
  dailyAnalytics: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
    watchTime: number;
    mobileViews: number;
    desktopViews: number;
  }>;
  summary: {
    totalViews: number;
    totalWatchTime: number;
    totalLikes: number;
    totalComments: number;
    mobileViews: number;
    desktopViews: number;
  };
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

class VideoService {
  // Get videos feed (mobile optimized if specified)
  async getVideosFeed(filters: VideoFilters = {}, mobile: boolean = false): Promise<PaginatedResponse<Video>> {
    try {
      const endpoint = mobile ? '/mobile/feed' : '/videos';
      return await apiClient.get<PaginatedResponse<Video>>(endpoint, {
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '20',
        ...(filters.category && { category: filters.category }),
        ...(filters.creatorId && { creatorId: filters.creatorId }),
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.quality && { quality: filters.quality })
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get single video details
  async getVideo(videoId: string, mobile: boolean = false): Promise<{ video: Video; userInteraction?: any }> {
    try {
      const endpoint = mobile ? `/mobile/video/${videoId}/play` : `/videos/${videoId}`;
      return await apiClient.get(endpoint);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Like or dislike a video
  async likeVideo(videoId: string, type: 'LIKE' | 'DISLIKE'): Promise<{
    message: string;
    likeCount: number;
    dislikeCount: number;
    userLikeType: string;
  }> {
    try {
      return await apiClient.post(`/videos/${videoId}/like`, { type });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload video progress (mobile)
  async updateVideoProgress(videoId: string, progress: {
    watchTime: number;
    duration?: number;
    completed?: boolean;
  }): Promise<{ message: string }> {
    try {
      return await apiClient.post(`/mobile/video/${videoId}/progress`, progress);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload a new video
  async uploadVideo(videoFile: File, metadata: VideoUploadData, onProgress?: (progress: number) => void): Promise<{
    video: {
      id: string;
      title: string;
      status: string;
      processingProgress: number;
      uploadedAt: string;
    };
    message: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.tags) formData.append('tags', metadata.tags.join(','));
      if (metadata.visibility) formData.append('visibility', metadata.visibility);
      if (metadata.language) formData.append('language', metadata.language);
      if (metadata.scheduledDate) formData.append('scheduledDate', metadata.scheduledDate);
      formData.append('monetization', metadata.monetization?.toString() || 'false');
      formData.append('ageRestricted', metadata.ageRestricted?.toString() || 'false');
      formData.append('commentsEnabled', metadata.commentsEnabled?.toString() || 'true');

      return await apiClient.uploadFile('/upload/video', formData, onProgress);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload video thumbnail
  async uploadThumbnail(videoId: string, thumbnailFile: File): Promise<{ thumbnailUrl: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('thumbnail', thumbnailFile);
      formData.append('videoId', videoId);

      return await apiClient.uploadFile('/upload/thumbnail', formData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get upload progress
  async getUploadProgress(videoId: string): Promise<{
    videoId: string;
    status: string;
    uploadProgress: number;
    processingProgress: number;
    estimatedTimeRemaining: string;
  }> {
    try {
      return await apiClient.get(`/upload/progress/${videoId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Cancel video upload
  async cancelUpload(videoId: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete(`/upload/${videoId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's uploaded videos
  async getUserVideos(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Video>> {
    try {
      return await apiClient.get('/videos/user', {
        page: page.toString(),
        limit: limit.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get video analytics (for creators)
  async getVideoAnalytics(videoId: string, days: number = 30): Promise<VideoAnalytics> {
    try {
      return await apiClient.get(`/analytics/video/${videoId}`, {
        days: days.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Search videos
  async searchVideos(query: string, filters: {
    type?: 'video' | 'channel' | 'playlist';
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<Video>> {
    try {
      const endpoint = '/search';
      return await apiClient.get(endpoint, {
        q: query,
        type: filters.type || 'video',
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '20'
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mobile search (optimized)
  async mobileSearch(query: string, filters: {
    type?: 'video' | 'channel' | 'playlist';
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<Video>> {
    try {
      return await apiClient.get('/mobile/search', {
        q: query,
        type: filters.type || 'video',
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '20'
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add to Watch Later
  async addToWatchLater(videoId: string): Promise<{ message: string }> {
    try {
      return await apiClient.post(`/videos/${videoId}/watch-later`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Remove from Watch Later
  async removeFromWatchLater(videoId: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete(`/videos/${videoId}/watch-later`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const videoService = new VideoService();