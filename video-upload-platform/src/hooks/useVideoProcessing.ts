import { useState, useEffect } from 'react';
import videoProcessingService from '../services/videoProcessingService';
import { ProcessingStatus } from '../types/processing';

export function useVideoProcessing(videoId: string) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'processing' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const processVideo = async () => {
      setStatus('processing');
      try {
        // Using encodeVideo as a placeholder for video processing
        const result = await videoProcessingService.encodeVideo(
          { 
            id: videoId, 
            title: '', 
            description: '', 
            tags: [], 
            duration: '00:00', 
            uploadDate: new Date(), 
            views: 0, 
            thumbnail: '', 
            quality: ['1080p'], 
            channel: { name: '' } 
          }, 
          '1080p'
        );
        setStatus('completed');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setStatus('error');
      }
    };

    processVideo();

    return () => {
      setStatus('idle');
      setError(null);
    };
  }, [videoId]);

  return { status, error };
}