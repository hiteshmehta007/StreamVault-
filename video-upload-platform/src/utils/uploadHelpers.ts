import { toast } from 'sonner';

export const handleUploadError = (error: any) => {
  console.error('Upload Error:', error);
  toast.error('An error occurred during the upload. Please try again.');
};

export const parseUploadResponse = (response: any) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to upload video');
  }
};

export const validateUploadResponse = (data: any) => {
  if (!data || !data.videoId) {
    throw new Error('Invalid response data');
  }
  return data.videoId;
};