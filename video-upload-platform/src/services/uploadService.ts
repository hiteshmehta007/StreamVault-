import axios from 'axios';
import { toast } from 'sonner';
import { UploadStatus } from '../types/upload';

const API_URL = 'https://your-api-endpoint.com/upload'; // Replace with your actual API endpoint

export const uploadVideo = async (file: File, metadata: any): Promise<UploadStatus> => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('tags', metadata.tags.join(','));

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.success(`Upload progress: ${percentCompleted}%`);
      },
    });

    if (response.status === 200) {
      toast.success('Video uploaded successfully!');
      return response.data; // Assuming the response contains the upload status
    } else {
      toast.error('Failed to upload video. Please try again.');
      throw new Error('Upload failed');
    }
  } catch (error) {
    toast.error('An error occurred during the upload process.');
    throw error;
  }
};