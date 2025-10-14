import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LiveStreamModal } from './LiveStreamModal';
import { LiveStreamPlayer } from './LiveStreamPlayer';
import { LiveStreamDashboard } from './LiveStreamDashboard';
import { toast } from 'sonner';

interface LiveStreamManagerProps {
  user: any;
  onStreamEnd?: () => void;
}

interface StreamData {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    subscribers: number;
  };
  viewers: number;
  duration: number;
  category: string;
  tags: string[];
  startTime: Date;
  streamKey: string;
  streamUrl: string;
  status: 'setup' | 'live' | 'ended';
}

export function LiveStreamManager({ user, onStreamEnd }: LiveStreamManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null);
  const [viewMode, setViewMode] = useState<'player' | 'dashboard'>('player');

  const handleStartStream = (streamSettings: any) => {
    const streamData: StreamData = {
      id: `stream-${Date.now()}`,
      title: streamSettings.title,
      description: streamSettings.description,
      creator: {
        name: user?.channel?.name || user?.name || 'Unknown Creator',
        avatar: user?.channel?.profileImage || user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
        verified: user?.channel?.verified || false,
        subscribers: user?.channel?.subscribers || 0
      },
      viewers: Math.floor(Math.random() * 50) + 10,
      duration: 0,
      category: streamSettings.category,
      tags: streamSettings.tags || [],
      startTime: new Date(),
      streamKey: `sk_${Math.random().toString(36).substring(2, 15)}`,
      streamUrl: `rtmp://streaming.platform.com/live/${Math.random().toString(36).substring(2, 15)}`,
      status: 'live'
    };

    setCurrentStream(streamData);
    setShowModal(false);
    
    // Show success notification
    toast.success(`🔴 Live stream "${streamData.title}" started successfully!`, {
      description: `${streamData.viewers} viewers are now watching`,
      duration: 5000
    });

    // Save to localStorage for persistence
    localStorage.setItem('currentLiveStream', JSON.stringify(streamData));
  };

  const handleEndStream = () => {
    if (currentStream) {
      const endedStream = { ...currentStream, status: 'ended' as const };
      setCurrentStream(null);
      
      // Remove from localStorage
      localStorage.removeItem('currentLiveStream');
      
      toast.success('Stream ended successfully!', {
        description: `Your stream lasted ${Math.floor(endedStream.duration / 60)} minutes`,
        duration: 5000
      });

      // Call parent callback
      onStreamEnd?.();
    }
  };

  // Load saved stream on component mount
  useEffect(() => {
    const savedStream = localStorage.getItem('currentLiveStream');
    if (savedStream) {
      try {
        const streamData = JSON.parse(savedStream);
        if (streamData.status === 'live') {
          setCurrentStream(streamData);
        }
      } catch (error) {
        console.error('Failed to load saved stream:', error);
        localStorage.removeItem('currentLiveStream');
      }
    }
  }, []);

  const handleGoLive = () => {
    if (!user?.channel) {
      toast.error('Please create a channel first to start streaming');
      return;
    }
    setShowModal(true);
  };

  if (currentStream) {
    return (
      <div className="min-h-screen bg-background">
        {/* Stream Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg border p-1 shadow-lg">
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('player')}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  viewMode === 'player'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Viewer Mode
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Creator Dashboard
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'player' ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LiveStreamPlayer
                streamData={currentStream}
                isCreator={true}
                onEndStream={handleEndStream}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LiveStreamDashboard
                streamData={currentStream}
                onEndStream={handleEndStream}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      {/* Go Live Button */}
      <button
        onClick={handleGoLive}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-11 px-8 py-3 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl min-w-[160px]"
      >
        <div className="h-4 w-4 bg-white rounded-full animate-pulse" />
        Go Live
      </button>

      {/* Live Stream Setup Modal */}
      <LiveStreamModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onStreamStarted={handleStartStream}
      />
    </>
  );
}

// Hook to check if user is currently streaming
export function useIsStreaming(userId?: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamData, setStreamData] = useState<StreamData | null>(null);

  useEffect(() => {
    const savedStream = localStorage.getItem('currentLiveStream');
    if (savedStream) {
      try {
        const data = JSON.parse(savedStream);
        if (data.status === 'live') {
          setIsStreaming(true);
          setStreamData(data);
        }
      } catch (error) {
        console.error('Failed to load stream data:', error);
      }
    }

    // Listen for storage changes (when stream starts/ends in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentLiveStream') {
        if (e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            setIsStreaming(data.status === 'live');
            setStreamData(data.status === 'live' ? data : null);
          } catch (error) {
            console.error('Failed to parse stream data:', error);
          }
        } else {
          setIsStreaming(false);
          setStreamData(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  return { isStreaming, streamData };
}

export default LiveStreamManager;