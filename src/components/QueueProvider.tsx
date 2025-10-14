import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: {
    name: string;
    avatar?: string;
    subscribers?: string;
  };
  quality: string[];
  description?: string;
  likes?: string;
  dislikes?: string;
}

interface QueueContextType {
  videoQueue: Video[];
  currentQueueIndex: number;
  addToQueue: (video: Video) => void;
  removeFromQueue: (videoId: string) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  playFromQueue: (index: number) => void;
  playNext: () => Video | null;
  playPrevious: () => Video | null;
  setCurrentIndex: (index: number) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [videoQueue, setVideoQueue] = useState<Video[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  const addToQueue = (video: Video) => {
    const isAlreadyInQueue = videoQueue.some(queuedVideo => queuedVideo.id === video.id);
    if (!isAlreadyInQueue) {
      setVideoQueue(prev => [...prev, video]);
      toast.success(`"${video.title}" added to queue`);
    } else {
      toast.error('Video is already in queue');
    }
  };

  const removeFromQueue = (videoId: string) => {
    setVideoQueue(prev => {
      const newQueue = prev.filter(v => v.id !== videoId);
      // Adjust current index if needed
      const removedIndex = prev.findIndex(v => v.id === videoId);
      if (removedIndex !== -1 && removedIndex <= currentQueueIndex && currentQueueIndex > 0) {
        setCurrentQueueIndex(currentQueueIndex - 1);
      }
      return newQueue;
    });
    toast.success('Video removed from queue');
  };

  const clearQueue = () => {
    setVideoQueue([]);
    setCurrentQueueIndex(0);
    toast.success('Queue cleared');
  };

  const shuffleQueue = () => {
    const shuffled = [...videoQueue].sort(() => Math.random() - 0.5);
    setVideoQueue(shuffled);
    setCurrentQueueIndex(0);
    toast.success('Queue shuffled');
  };

  const playFromQueue = (index: number) => {
    if (index >= 0 && index < videoQueue.length) {
      setCurrentQueueIndex(index);
    }
  };

  const playNext = (): Video | null => {
    if (currentQueueIndex < videoQueue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIndex);
      return videoQueue[nextIndex];
    }
    return null;
  };

  const playPrevious = (): Video | null => {
    if (currentQueueIndex > 0) {
      const prevIndex = currentQueueIndex - 1;
      setCurrentQueueIndex(prevIndex);
      return videoQueue[prevIndex];
    }
    return null;
  };

  const setCurrentIndex = (index: number) => {
    if (index >= 0 && index < videoQueue.length) {
      setCurrentQueueIndex(index);
    }
  };

  return (
    <QueueContext.Provider value={{
      videoQueue,
      currentQueueIndex,
      addToQueue,
      removeFromQueue,
      clearQueue,
      shuffleQueue,
      playFromQueue,
      playNext,
      playPrevious,
      setCurrentIndex
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}