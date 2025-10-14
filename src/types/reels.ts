// Types for Reels/Shorts feature

export interface ReelVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    followers: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  hashtags: string[];
  music?: {
    title: string;
    artist: string;
    url: string;
  };
  duration: number; // in seconds
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  location?: string;
  filter?: string;
  captions?: string;
  stickers?: ReelSticker[];
  visibility: 'public' | 'followers' | 'private';
  allowComments: boolean;
  allowDuets: boolean;
  crossPosted?: {
    tiktok?: boolean;
    instagram?: boolean;
    youtube?: boolean;
  };
}

export interface ReelSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}

export interface ReelComment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: ReelComment[];
  isVerified?: boolean;
}

export interface ReelAnalytics {
  reelId: string;
  views: number;
  uniqueViews: number;
  watchTime: number; // in seconds
  completionRate: number; // percentage
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement: number; // percentage
  demographics: {
    ageGroups: { [key: string]: number };
    genders: { [key: string]: number };
    locations: { [key: string]: number };
  };
  trafficSources: {
    fyp: number; // For You Page
    hashtags: number;
    profile: number;
    search: number;
    external: number;
  };
  peakViewingHours: { [key: string]: number };
  createdAt: string;
}

export interface ReelCreationOptions {
  filters: ReelFilter[];
  musicTracks: MusicTrack[];
  stickers: string[];
  effects: ReelEffect[];
}

export interface ReelFilter {
  id: string;
  name: string;
  preview: string;
  intensity: number;
  type: 'color' | 'blur' | 'vintage' | 'dramatic';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview: string;
  thumbnail: string;
  genre: string;
  trending: boolean;
}

export interface ReelEffect {
  id: string;
  name: string;
  preview: string;
  type: 'transition' | 'overlay' | 'animation';
}

export interface ReelFeed {
  type: 'fyp' | 'following' | 'trending' | 'discover';
  reels: ReelVideo[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ReelEngagement {
  type: 'like' | 'comment' | 'share' | 'save' | 'follow';
  reelId: string;
  userId: string;
  timestamp: string;
}

export interface ReelNotification {
  id: string;
  type: 'new_reel' | 'like' | 'comment' | 'mention' | 'trending';
  reelId: string;
  fromUserId?: string;
  fromUsername?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface ReelTrend {
  hashtag: string;
  count: number;
  growth: number; // percentage
  category: string;
  location?: string;
}

export interface ReelChallenge {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  prize?: string;
  rules: string[];
  featuredReels: string[]; // reel IDs
}

export interface ReelMonetization {
  reelId: string;
  earnings: {
    adRevenue: number;
    tips: number;
    brandDeals: number;
    total: number;
  };
  adPlacements: number;
  cpm: number; // cost per mille
  currency: string;
  period: {
    start: string;
    end: string;
  };
}

export interface ReelUploadProgress {
  reelId: string;
  stage: 'uploading' | 'processing' | 'encoding' | 'publishing' | 'complete' | 'failed';
  progress: number; // 0-100
  message: string;
  error?: string;
}