import { useState, useEffect } from 'react';

export function useUploadProgress(uploading: boolean, totalBytes: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            return Math.min(prev + Math.random() * 10, 100); // Simulate progress
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [uploading]);

  return { progress, isComplete: progress === 100 };
}