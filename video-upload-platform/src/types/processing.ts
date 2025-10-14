export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface QualitySetting {
  resolution: '2160p' | '1440p' | '1080p' | '720p' | '480p';
  bitrate: number; // in kbps
}

export interface ProcessingOptions {
  quality: QualitySetting[];
  thumbnail: string; // URL or path to the thumbnail image
}