interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number; // percentage of upload completion
  createdAt: Date;
}

interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  videoId?: string; // ID of the uploaded video if successful
}