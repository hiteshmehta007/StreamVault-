import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
// VideoPlayer import removed as it's not used
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  X, 
  MessageCircle,
  List,
  Volume2,
  VolumeX,
  Settings,
  Move,
  Minimize2,
  RotateCcw,
  FastForward
} from 'lucide-react';
import { toast } from 'sonner';
import '../styles/miniplayer.css';
import '../styles/glassmorphism-miniplayer.css';
import '../styles/enhanced-miniplayer.css';
import '../styles/enhanced-miniplayer.css';

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

interface MiniPlayerProps {
  video: Video;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isVisible: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  queuePosition: { current: number; total: number };
  hasNext: boolean;
  hasPrevious: boolean;
  canUseMultiPlayer: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleTheater: () => void;
  onToggleMultiPlayer: () => void;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onShowComments: () => void;
  onShowQueue: () => void;
}

export function MiniPlayer({
  video,
  videoRef,
  isVisible,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  position,
  size,
  queuePosition,
  hasNext,
  hasPrevious,
  canUseMultiPlayer,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMute,
  onPrevious,
  onNext,
  onToggleTheater,
  onToggleMultiPlayer,
  onClose,
  onPositionChange,
  onSizeChange,
  onShowComments,
  onShowQueue
}: MiniPlayerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const miniPlayerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    small: { width: 320, height: 180 },
    medium: { width: 480, height: 270 },
    large: { width: 640, height: 360 }
  };

  const currentSize = sizeConfig[size];

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Enhanced MiniPlayer functionality
  const [isMultiPlayerSupported, setIsMultiPlayerSupported] = useState(false);
  const [isMultiPlayerActive, setIsMultiPlayerActive] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isInPiP, setIsInPiP] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check MiniPlayer support (always available)
    setIsMultiPlayerSupported(true);
    
    // Check Picture-in-Picture support
    if ('pictureInPictureEnabled' in document) {
      setIsPiPSupported(true);
    }
  }, []);

  const handlePiPToggle = async () => {
    const video = videoElementRef.current;
    if (!video || !isPiPSupported) {
      toast.error('Picture-in-Picture not supported');
      return;
    }

    try {
      if (isInPiP) {
        await document.exitPictureInPicture();
        setIsInPiP(false);
        toast.success('Exited Picture-in-Picture');
      } else {
        await video.requestPictureInPicture();
        setIsInPiP(true);
        toast.success('Entered Picture-in-Picture');
      }
    } catch (error) {
      console.error('PiP error:', error);
      toast.error('Failed to toggle Picture-in-Picture');
    }
  };

  const handleMultiPlayerToggle = async () => {
    if (!videoElementRef.current || !isMultiPlayerSupported) {
      toast.error('Multi-player mode not supported');
      return;
    }

    try {
      if (isMultiPlayerActive) {
        // Exit enhanced mode and keep standard mini player
        setIsMultiPlayerActive(false);
        toast.success('Standard mini-player mode');
      } else {
        // Enter enhanced multi-player mode for better multitasking
        setIsMultiPlayerActive(true);
        toast.success('Enhanced multi-player mode activated');
      }
    } catch (error) {
      console.error('Multi-player error:', error);
      toast.error('Failed to toggle multi-player mode');
    }
  };

  useEffect(() => {
    const videoElement = videoElementRef.current;
    if (!videoElement) return;

    const handleEnterPiP = () => {
      setIsInPiP(true);
      toast.success('Entered Picture-in-Picture');
    };

    const handleLeavePiP = () => {
      setIsInPiP(false);
      toast.success('Exited Picture-in-Picture');
    };

    // Add PiP event listeners
    videoElement.addEventListener('enterpictureinpicture', handleEnterPiP);
    videoElement.addEventListener('leavepictureinpicture', handleLeavePiP);
    
    return () => {
      videoElement.removeEventListener('enterpictureinpicture', handleEnterPiP);
      videoElement.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, []);

  // Handle mouse enter/leave for control visibility
  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging && !isResizing && !showVolumeSlider) {
      setShowControls(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          isPlaying ? onPause() : onPlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSeek(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          onMute();
          break;
        case 'f':
          e.preventDefault();
          onToggleTheater();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, isPlaying, currentTime, duration, volume, onPlay, onPause, onSeek, onVolumeChange, onMute, onToggleTheater, onClose]);

  // Drag functionality with touch support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = miniPlayerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = miniPlayerRef.current?.getBoundingClientRect();
      const touch = e.touches[0];
      if (rect && touch) {
        setDragOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        });
      }
      e.preventDefault();
    }
  };

  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    setIsResizing(true);
    setDragOffset({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - currentSize.width, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - currentSize.height, e.clientY - dragOffset.y));
        onPositionChange({ x: newX, y: newY });
      } else if (isResizing) {
        // Simple resize by changing size preset based on mouse movement
        const deltaX = e.clientX - dragOffset.x;
        if (deltaX > 50 && size === 'small') {
          onSizeChange('medium');
          toast.success('Resized to medium');
        } else if (deltaX > 100 && size === 'medium') {
          onSizeChange('large');
          toast.success('Resized to large');
        } else if (deltaX < -50 && size === 'large') {
          onSizeChange('medium');
          toast.success('Resized to medium');
        } else if (deltaX < -100 && size === 'medium') {
          onSizeChange('small');
          toast.success('Resized to small');
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const newX = Math.max(0, Math.min(window.innerWidth - currentSize.width, touch.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - currentSize.height, touch.clientY - dragOffset.y));
        onPositionChange({ x: newX, y: newY });
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isResizing, dragOffset, currentSize, onPositionChange, size, onSizeChange]);

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isVisible) return null;

  return (
    <div
      ref={miniPlayerRef}
      className={`miniplayer-container ${isVisible ? 'visible' : ''} ${isDragging ? 'dragging' : ''} ${isAnimating ? 'entering' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Modern Video Container */}
      <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none">
        <CardContent className="p-0 h-full relative">
          {/* Glassmorphism Video Player */}
          <div className="glassmorphism-thumbnail relative h-full">
            <div className="w-full h-full relative group">
              {/* Glassmorphism Loading Indicator */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center glassmorphism-loading-overlay">
                  <div className="flex flex-col items-center gap-3">
                    <div className="glassmorphism-loading w-10 h-10"></div>
                    <span className="glassmorphism-text text-sm font-medium">Loading video...</span>
                  </div>
                </div>
              )}

              {/* Enhanced Multi-Player Indicator */}
              {isMultiPlayerActive && (
                <div className="absolute top-3 right-3 rounded-full px-3 py-1.5 z-50 glassmorphism-enhanced-indicator">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold">Enhanced</span>
                  </div>
                </div>
              )}
              
              {/* HTML5 Video Element - YouTube Style */}
              <video
                ref={(videoElement) => {
                  videoElementRef.current = videoElement;
                  // Sync with main video when available
                  if (videoElement && videoRef?.current) {
                    // Sync current time
                    videoElement.currentTime = videoRef.current.currentTime;
                    videoElement.volume = videoRef.current.volume;
                    videoElement.muted = videoRef.current.muted;
                    
                    // Sync play state
                    if (isPlaying && videoRef.current.paused) {
                      videoElement.pause();
                    } else if (!isPlaying && !videoRef.current.paused) {
                      videoElement.play().catch(console.warn);
                    }
                  }
                }}
                className="video-stream html5-main-video w-full h-full object-cover glassmorphism-video-element"
                controlsList="nodownload"
                src={videoRef?.current?.src || `/api/placeholder/video/${video.id}`}
                poster={video.thumbnail}
                muted={isMuted}
                tabIndex={-1}
                onPlay={() => {
                  onPlay();
                  // Sync main video
                  if (videoRef?.current) {
                    videoRef.current.play().catch(console.warn);
                  }
                }}
                onPause={() => {
                  onPause();
                  // Sync main video
                  if (videoRef?.current) {
                    videoRef.current.pause();
                  }
                }}
                onTimeUpdate={(e) => {
                  const target = e.target as HTMLVideoElement;
                  onSeek(target.currentTime);
                  // Sync main video time
                  if (videoRef?.current && Math.abs(videoRef.current.currentTime - target.currentTime) > 1) {
                    videoRef.current.currentTime = target.currentTime;
                  }
                }}
                onVolumeChange={(e) => {
                  const target = e.target as HTMLVideoElement;
                  onVolumeChange(target.volume);
                  if (target.muted !== isMuted) {
                    onMute();
                  }
                }}
                onLoadedMetadata={(e) => {
                  const target = e.target as HTMLVideoElement;
                  setIsVideoLoaded(true);
                  // Sync with main video when metadata loads
                  if (videoRef?.current) {
                    target.currentTime = videoRef.current.currentTime;
                    target.volume = videoRef.current.volume;
                    target.muted = videoRef.current.muted;
                  }
                  toast.success('MiniPlayer video loaded');
                }}
                onError={(e) => {
                  console.error('MiniPlayer video error:', e);
                  toast.error('Failed to load video in MiniPlayer');
                }}
                onWaiting={() => {
                  console.log('MiniPlayer video buffering...');
                }}
                onCanPlay={() => {
                  console.log('MiniPlayer video can play');
                }}
                playsInline
                preload="metadata"
              >
                <source src={`/api/placeholder/video/${video.id}.mp4`} type="video/mp4" />
                <source src={`/api/placeholder/video/${video.id}.webm`} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              
              {/* User-Friendly Control Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 hover:from-black/70">
                {/* Glassmorphism Central Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={isPlaying ? onPause : onPlay}
                    className="glassmorphism-play-overlay w-16 h-16 p-0 border-0 text-white"
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? 
                      <Pause className="h-6 w-6" /> : 
                      <Play className="h-6 w-6 ml-0.5" />
                    }
                  </Button>
                </div>
                
                {/* Glassmorphism Interactive Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div 
                    ref={progressBarRef}
                    className="glassmorphism-progress h-2 cursor-pointer hover:h-3 transition-all duration-300 group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = clickX / rect.width;
                      const newTime = percentage * duration;
                      onSeek(newTime);
                      toast.success(`Seeked to ${formatTime(newTime)}`, {
                        style: { background: 'linear-gradient(135deg, #ff8a65, #ffb74d)' }
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const hoverX = e.clientX - rect.left;
                      const percentage = hoverX / rect.width;
                      const hoverTime = percentage * duration;
                      e.currentTarget.title = `Seek to ${formatTime(hoverTime)}`;
                    }}
                  >
                    <div 
                      className="glassmorphism-progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* Hover preview */}
                    <div className="absolute -top-8 left-0 right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="glassmorphism-info-panel text-xs glassmorphism-text px-2 py-1">
                        Click to seek
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphism Drag Handles */}
            <div className={`absolute top-3 right-3 z-40 flex gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-80'}`}>
              {/* Resize Handle */}
              <div 
                className="glassmorphism-resize-handle w-6 h-6 cursor-nw-resize flex items-center justify-center"
                onMouseDown={(e) => handleResizeStart(e, 'corner')}
                title="Drag to resize"
              >
                <div className="w-2 h-2 border-r border-b border-white/60"></div>
              </div>
              
              {/* Drag Handle */}
              <div className="drag-handle glassmorphism-resize-handle w-6 h-6 cursor-move flex items-center justify-center" title="Drag to move">
                <Move className="h-3 w-3 text-white/70" />
              </div>
            </div>

            {/* Glassmorphism Controls Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              {/* Top Info Bar */}
              <div className="absolute top-0 left-0 right-0 p-3">
                <div className="glassmorphism-info-panel">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="glassmorphism-text text-sm font-semibold truncate">{video.title}</h4>
                      <p className="glassmorphism-text secondary text-xs truncate mt-0.5">{video.channel.name}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {/* Size Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
                          const currentIndex = sizes.indexOf(size);
                          const nextSize = sizes[(currentIndex + 1) % sizes.length];
                          onSizeChange(nextSize);
                          toast.success(`Player size: ${nextSize}`, {
                            style: { background: 'linear-gradient(135deg, #ff8a65, #ffb74d)' }
                          });
                        }}
                        className="glassmorphism-control-btn w-8 h-8 p-0"
                        title="Change size"
                      >
                        <Minimize2 className="h-3 w-3" />
                      </Button>

                      {/* Picture-in-Picture Toggle */}
                      {isPiPSupported && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePiPToggle}
                          className={`glassmorphism-control-btn w-8 h-8 p-0 ${isInPiP ? 'primary' : ''}`}
                          title={isInPiP ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
                        >
                          <Minimize2 className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Multi-Player Toggle */}
                      {isMultiPlayerSupported && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMultiPlayerToggle}
                          className={`glassmorphism-control-btn w-8 h-8 p-0 ${isMultiPlayerActive ? 'primary' : ''}`}
                          title={isMultiPlayerActive ? "Exit Enhanced mode" : "Enter Enhanced mode"}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Theater Mode */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleTheater}
                        className="glassmorphism-control-btn w-8 h-8 p-0"
                        title="Return to theater mode"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </Button>

                      {/* Close */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="glassmorphism-control-btn w-8 h-8 p-0"
                        title="Close mini-player"
                        style={{ background: 'linear-gradient(135deg, #ff7043, #f48fb1)' }}
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphism Bottom Controls */}
            <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
              <div className="glassmorphism-info-panel">
                {/* Time and Queue Info */}
                <div className="flex items-center justify-between glassmorphism-text text-xs mb-3">
                  <div className="font-mono glassmorphism-text accent">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  {queuePosition.total > 1 && (
                    <div className="glassmorphism-text secondary">
                      {queuePosition.current} of {queuePosition.total}
                    </div>
                  )}
                </div>
                
                {/* Essential Playback Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Previous Video */}
                    {hasPrevious && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPrevious}
                        className="glassmorphism-control-btn h-8 w-8 p-0"
                        title="Previous video (Shift + P)"
                      >
                        <SkipBack className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isPlaying ? onPause : onPlay}
                      className="glassmorphism-control-btn primary h-9 w-9 p-0"
                      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </Button>

                    {/* Next Video */}
                    {hasNext && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNext}
                        className="glassmorphism-control-btn h-8 w-8 p-0"
                        title="Next video (Shift + N)"
                      >
                        <SkipForward className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Volume Control with Glassmorphism Slider */}
                    <div className="relative flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        className="glassmorphism-control-btn h-7 w-7 p-0"
                        title={isMuted ? "Unmute (M)" : "Mute (M)"}
                      >
                        {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                      
                      {/* Glassmorphism Volume Slider */}
                      {showVolumeSlider && (
                        <div className="absolute bottom-full left-0 mb-2 glassmorphism-volume-slider">
                          <div className="glassmorphism-volume-track w-20">
                            <div 
                              className="glassmorphism-volume-fill"
                              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              const newVolume = parseFloat(e.target.value);
                              onVolumeChange(newVolume);
                              if (newVolume > 0 && isMuted) {
                                onMute();
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Volume control"
                            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Queue Toggle */}
                    {queuePosition.total > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowQueue(!showQueue);
                          onShowQueue();
                        }}
                        className="glassmorphism-control-btn h-7 w-7 p-0"
                        title="Show queue"
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Comments */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onShowComments}
                      className="glassmorphism-control-btn h-7 w-7 p-0"
                      title="Show comments"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphism Drag Indicator with Keyboard Shortcuts */}
            <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 group ${showControls ? 'glassmorphism-opacity-control' : 'glassmorphism-opacity-low'}`}>
              <div className="w-8 h-1 rounded-full glassmorphism-drag-indicator"></div>
              {/* Glassmorphism Keyboard shortcuts tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 glassmorphism-info-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                <div className="text-center glassmorphism-text text-xs">
                  <div className="glassmorphism-text accent font-semibold mb-1">Keyboard Shortcuts</div>
                  <div><strong>Space/K:</strong> Play/Pause</div>
                  <div><strong>←/→:</strong> Seek ±10s</div>
                  <div><strong>↑/↓:</strong> Volume</div>
                  <div><strong>M:</strong> Mute</div>
                  <div><strong>F:</strong> Theater</div>
                  <div><strong>Esc:</strong> Close</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}