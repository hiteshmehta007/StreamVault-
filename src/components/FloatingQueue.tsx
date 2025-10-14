import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from './QueueProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Trash2, 
  Clock,
  Minimize2,
  Maximize2,
  List,
  PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface FloatingQueueProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (video: any) => void;
  currentVideoId?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export function FloatingQueue({ 
  isOpen, 
  onClose, 
  onVideoSelect, 
  currentVideoId,
  isPlaying = false,
  onPlayPause 
}: FloatingQueueProps) {
  const { 
    videoQueue, 
    currentQueueIndex, 
    removeFromQueue, 
    clearQueue, 
    shuffleQueue, 
    playFromQueue,
    playNext,
    playPrevious 
  } = useQueue();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 20 });

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  const handlePlayVideo = (video: any, index: number) => {
    playFromQueue(index);
    onVideoSelect(video);
    toast.success(`Now playing: ${video.title}`);
  };

  const handleNextVideo = () => {
    const nextVideo = playNext();
    if (nextVideo) {
      onVideoSelect(nextVideo);
      toast.success(`Playing next: ${nextVideo.title}`);
    } else {
      toast.info('No more videos in queue');
    }
  };

  const handlePreviousVideo = () => {
    const prevVideo = playPrevious();
    if (prevVideo) {
      onVideoSelect(prevVideo);
      toast.success(`Playing previous: ${prevVideo.title}`);
    } else {
      toast.info('No previous videos in queue');
    }
  };

  const formatTotalDuration = () => {
    // Simple duration calculation (assuming duration format is "MM:SS")
    const totalMinutes = videoQueue.reduce((total, video) => {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: position.x, y: position.y }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="fixed z-50 select-none"
          style={{ 
            left: position.x, 
            top: position.y,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          <Card className={`w-80 bg-background/95 backdrop-blur border shadow-2xl ${isMinimized ? 'h-16' : 'h-96'} transition-all duration-300`}>
            {/* Header */}
            <CardHeader 
              className="pb-2 cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <CardTitle className="text-sm">Queue</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {videoQueue.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onClose}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-4 pt-0">
                {/* Queue Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={handlePreviousVideo}
                      disabled={currentQueueIndex === 0}
                    >
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={onPlayPause}
                    >
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={handleNextVideo}
                      disabled={currentQueueIndex === videoQueue.length - 1}
                    >
                      <SkipForward className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={shuffleQueue}
                      disabled={videoQueue.length < 2}
                    >
                      <Shuffle className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={clearQueue}
                      disabled={videoQueue.length === 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Queue Info */}
                {videoQueue.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{videoQueue.length} videos</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTotalDuration()}</span>
                    </div>
                  </div>
                )}

                <Separator className="mb-3" />

                {/* Queue List */}
                <ScrollArea className="h-64">
                  {videoQueue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <PlayCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Queue is empty</p>
                      <p className="text-xs text-muted-foreground">Add videos to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {videoQueue.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors group ${
                            index === currentQueueIndex 
                              ? 'bg-primary/10 border border-primary/20' 
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => handlePlayVideo(video, index)}
                        >
                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-12 h-8 object-cover rounded"
                            />
                            <div className="absolute bottom-0 right-0 bg-black/80 text-white px-1 text-xs rounded-tl">
                              {video.duration}
                            </div>
                            {index === currentQueueIndex && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded">
                                {isPlaying ? (
                                  <Pause className="h-3 w-3 text-primary" />
                                ) : (
                                  <Play className="h-3 w-3 text-primary" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium line-clamp-1">{video.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{video.channel.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{video.views} views</span>
                              {index === currentQueueIndex && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Now Playing
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(video.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}