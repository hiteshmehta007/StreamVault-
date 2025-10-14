export interface Video {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  uploadDate: Date;
  views: number;
  thumbnail: string;
  quality: string[];
  channel: {
    name: string;
    avatar?: string;
  };
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  quality: string;
}