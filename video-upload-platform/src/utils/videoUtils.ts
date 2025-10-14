import { VideoMetadata } from '../types/video';

export const generateThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    videoElement.src = URL.createObjectURL(videoFile);
    videoElement.addEventListener('loadeddata', () => {
      if (videoElement.readyState >= 2) {
        videoElement.currentTime = videoElement.duration / 2; // Capture thumbnail at the middle of the video
      }
    });

    videoElement.addEventListener('seeked', () => {
      if (context) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/png');
        resolve(thumbnail);
      }
    });

    videoElement.addEventListener('error', () => {
      reject(new Error('Error generating thumbnail'));
    });
  });
};

export const extractMetadata = (videoFile: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoFile);

    videoElement.addEventListener('loadedmetadata', () => {
      const metadata: VideoMetadata = {
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        type: videoFile.type,
      };
      resolve(metadata);
    });

    videoElement.addEventListener('error', () => {
      reject(new Error('Error extracting metadata'));
    });
  });
};