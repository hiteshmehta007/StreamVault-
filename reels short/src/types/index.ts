export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isLive?: boolean;
    viewerCount?: number;
  };
  caption: string;
  hashtags: string[];
  category: string; // Game/stream category
  streamId?: string; // Link to original stream/VOD
  clipTimestamp?: string; // Timestamp in original stream
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  isFollowing: boolean;
  createdAt: string;
  duration: number; // in seconds
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  createdAt: string;
}
