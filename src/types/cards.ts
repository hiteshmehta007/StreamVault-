export interface VideoCard {
  id: string;
  type: 'video' | 'playlist' | 'channel' | 'url';
  title: string;
  description?: string;
  thumbnail?: string;
  startTime: number; // in seconds
  endTime?: number; // optional end time
  targetId?: string; // video/playlist/channel ID
  targetUrl?: string; // external URL
  position: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardFormData {
  type: 'video' | 'playlist' | 'channel' | 'url';
  title: string;
  description?: string;
  thumbnail?: string;
  startTime: number;
  endTime?: number;
  targetId?: string;
  targetUrl?: string;
  position: {
    x: number;
    y: number;
  };
}

export interface VideoWithCards {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: {
    name: string;
    avatar?: string;
    subscribers?: string;
  };
  quality: string[];
  description?: string;
  likes?: string;
  dislikes?: string;
  cards?: VideoCard[];
  isCreator?: boolean; // to determine if current user can add cards
}