import { apiClient, User, handleApiError } from './apiClient';

export interface UserAnalytics {
  summary: {
    totalVideoViews: number;
    totalSubscribers: number;
    totalWatchTime: number;
    totalRevenue: number;
  };
  recentPerformance: {
    last7Days: {
      views: number;
      subscribers: number;
      watchTime: number;
    };
    last30Days: {
      views: number;
      subscribers: number;
      watchTime: number;
    };
  };
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    performance: string;
  }>;
}

export interface Comment {
  id: string;
  content: string;
  likeCount: number;
  isEdited: boolean;
  isPinned: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
  };
  replies: Comment[];
}

export interface Notification {
  id: string;
  type: 'NEW_VIDEO' | 'NEW_SUBSCRIBER' | 'NEW_COMMENT' | 'NEW_LIKE' | 'LIVE_STREAM' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

class UserService {
  // Get user profile
  async getUserProfile(userId: string): Promise<{ user: User }> {
    try {
      return await apiClient.get(`/users/${userId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Subscribe/Unsubscribe to user
  async toggleSubscription(userId: string, action: 'SUBSCRIBE' | 'UNSUBSCRIBE'): Promise<{
    message: string;
    isSubscribed: boolean;
    subscriberCount: number;
  }> {
    try {
      return await apiClient.post(`/users/${userId}/subscribe`, { action });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user analytics (for current user/creator)
  async getUserAnalytics(days: number = 30): Promise<UserAnalytics> {
    try {
      return await apiClient.get('/analytics/user', {
        days: days.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's watch history
  async getWatchHistory(page: number = 1, limit: number = 20): Promise<{
    videos: Array<{
      id: string;
      title: string;
      thumbnail?: string;
      creator: User;
      watchedAt: string;
      watchTime: number;
      completed: boolean;
    }>;
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      return await apiClient.get('/users/watch-history', {
        page: page.toString(),
        limit: limit.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's watch later list
  async getWatchLater(page: number = 1, limit: number = 20): Promise<{
    videos: Array<{
      id: string;
      title: string;
      thumbnail?: string;
      creator: User;
      addedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      return await apiClient.get('/users/watch-later', {
        page: page.toString(),
        limit: limit.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's liked videos
  async getLikedVideos(page: number = 1, limit: number = 20): Promise<{
    videos: Array<{
      id: string;
      title: string;
      thumbnail?: string;
      creator: User;
      likedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      return await apiClient.get('/users/liked-videos', {
        page: page.toString(),
        limit: limit.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's subscriptions
  async getSubscriptions(page: number = 1, limit: number = 20): Promise<{
    subscriptions: Array<{
      id: string;
      channel: User;
      subscribedAt: string;
      notifications: boolean;
    }>;
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      return await apiClient.get('/users/subscriptions', {
        page: page.toString(),
        limit: limit.toString()
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile
  async updateProfile(profileData: {
    displayName?: string;
    bio?: string;
    website?: string;
    location?: string;
  }): Promise<{ user: User; message: string }> {
    try {
      return await apiClient.put('/users/profile', profileData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload avatar
  async uploadAvatar(avatarFile: File): Promise<{ user: User; message: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      return await apiClient.uploadFile('/users/avatar', formData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Comments Service
class CommentService {
  // Get comments for a video
  async getVideoComments(videoId: string, page: number = 1, limit: number = 20, sort: 'newest' | 'oldest' | 'popular' = 'newest'): Promise<{
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      return await apiClient.get(`/videos/${videoId}/comments`, {
        page: page.toString(),
        limit: limit.toString(),
        sort
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add comment to video
  async addComment(videoId: string, content: string, parentId?: string): Promise<{ comment: Comment }> {
    try {
      return await apiClient.post(`/videos/${videoId}/comments`, {
        content,
        parentId
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Edit comment
  async editComment(commentId: string, content: string): Promise<{ comment: Comment }> {
    try {
      return await apiClient.put(`/comments/${commentId}`, { content });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete comment
  async deleteComment(commentId: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete(`/comments/${commentId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Like/Unlike comment
  async toggleCommentLike(commentId: string, type: 'LIKE' | 'DISLIKE'): Promise<{
    message: string;
    likeCount: number;
    userLikeType: string;
  }> {
    try {
      return await apiClient.post(`/comments/${commentId}/like`, { type });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Notification Service
class NotificationService {
  // Get user notifications
  async getNotifications(page: number = 1, unread?: boolean): Promise<{
    notifications: Notification[];
    unreadCount: number;
  }> {
    try {
      const params: Record<string, string> = {
        page: page.toString()
      };
      if (unread !== undefined) {
        params.unread = unread.toString();
      }
      return await apiClient.get('/notifications', params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mark notifications as read
  async markAsRead(notificationIds: string[]): Promise<{ message: string }> {
    try {
      return await apiClient.post('/notifications/mark-read', { notificationIds });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ message: string }> {
    try {
      return await apiClient.post('/notifications/mark-all-read');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const userService = new UserService();
export const commentService = new CommentService();
export const notificationService = new NotificationService();