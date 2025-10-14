import { Storage } from 'aws-amplify'; // Example for AWS Amplify, adjust based on your storage solution
import { toast } from 'sonner';

export const uploadVideoToStorage = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const result = await Storage.put(fileName, file, {
      contentType: file.type,
    });
    toast.success('Video uploaded successfully');
    return result.key; // Return the key or URL of the uploaded video
  } catch (error) {
    toast.error('Error uploading video');
    throw error;
  }
};

export const deleteVideoFromStorage = async (key: string): Promise<void> => {
  try {
    await Storage.remove(key);
    toast.success('Video deleted successfully');
  } catch (error) {
    toast.error('Error deleting video');
    throw error;
  }
};

export const getVideoUrl = async (key: string): Promise<string> => {
  try {
    const url = await Storage.get(key);
    return url; // Return the URL of the video
  } catch (error) {
    toast.error('Error retrieving video URL');
    throw error;
  }
};