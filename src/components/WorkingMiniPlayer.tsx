import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  MessageCircle,
  List,
  Volume2,
  VolumeX,
  Move,
  RotateCcw,
  FastForward
} from 'lucide-react';
import '../styles/miniplayer.css';
import '../styles/glassmorphism-miniplayer.css';
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

// Helper function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function EnhancedMiniPlayer({
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
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMute,
  onToggleTheater,
  onClose,
  onPositionChange,
  onSizeChange,
  onShowComments,
  onShowQueue
}: MiniPlayerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const containerRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    small: { width: 320, height: 180 },
    medium: { width: 400, height: 225 },
    large: { width: 480, height: 270 }
  };

  // Animation effects
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Update position when prop changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Update size when prop changes
  useEffect(() => {
    setCurrentSize(size);
  }, [size]);

  // Skip functions
  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    onSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    onSeek(newTime);
  };

  // Smooth drag functionality with improved UX
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // Enhanced cursor and selection management
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.pointerEvents = 'none';
    
    // Re-enable pointer events for the miniplayer
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = 'auto';
    }
  }, []);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentSizeConfig = sizeConfig[currentSize as keyof typeof sizeConfig];
    
    // Smooth boundary calculations with padding
    const padding = 10;
    const snapThreshold = 50;
    const maxX = window.innerWidth - currentSizeConfig.width - padding;
    const maxY = window.innerHeight - currentSizeConfig.height - padding;
    
    let newX = Math.max(padding, Math.min(maxX, e.clientX - dragOffset.x));
    let newY = Math.max(padding, Math.min(maxY, e.clientY - dragOffset.y));
    
    // Visual snap preview - add subtle magnetism
    const isNearLeftEdge = newX < snapThreshold;
    const isNearRightEdge = newX > window.innerWidth - currentSizeConfig.width - snapThreshold;
    const isNearTopEdge = newY < snapThreshold;
    const isNearBottomEdge = newY > window.innerHeight - currentSizeConfig.height - snapThreshold;
    
    // Add visual feedback for snap zones
    if (containerRef.current) {
      const snapClass = isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge ? 'near-snap' : '';
      containerRef.current.className = containerRef.current.className.replace(' near-snap', '') + (snapClass ? ' ' + snapClass : '');
    }
    
    const newPosition = { x: newX, y: newY };
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setCurrentPosition(newPosition);
      onPositionChange(newPosition);
    });
  }, [isDragging, dragOffset, currentSize, onPositionChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    // Complete cleanup of body styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.pointerEvents = '';
    
    // Magnetic snap to edges for better UX
    const currentSizeConfig = sizeConfig[currentSize as keyof typeof sizeConfig];
    const snapThreshold = 50;
    let finalPosition = { ...currentPosition };
    
    // Snap to edges if close enough
    if (currentPosition.x < snapThreshold) {
      finalPosition.x = 10;
    } else if (currentPosition.x > window.innerWidth - currentSizeConfig.width - snapThreshold) {
      finalPosition.x = window.innerWidth - currentSizeConfig.width - 10;
    }
    
    if (currentPosition.y < snapThreshold) {
      finalPosition.y = 10;
    } else if (currentPosition.y > window.innerHeight - currentSizeConfig.height - snapThreshold) {
      finalPosition.y = window.innerHeight - currentSizeConfig.height - 10;
    }
    
    // Apply final position with smooth animation
    if (finalPosition.x !== currentPosition.x || finalPosition.y !== currentPosition.y) {
      setCurrentPosition(finalPosition);
      onPositionChange(finalPosition);
    }
    
    // Add subtle bounce animation on drop
    if (containerRef.current) {
      containerRef.current.style.transform = 'scale(0.98)';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = '';
        }
      }, 150);
    }
  }, [currentPosition, currentSize, onPositionChange]);

  // Resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.cursor = 'se-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(280, Math.min(600, e.clientX - rect.left));
    
    // Determine closest size based on dimensions
    let newSize: 'small' | 'medium' | 'large' = 'medium';
    if (newWidth <= 350) newSize = 'small';
    else if (newWidth >= 450) newSize = 'large';
    
    if (newSize !== currentSize) {
      setCurrentSize(newSize);
      onSizeChange(newSize);
    }
  }, [isResizing, currentSize, onSizeChange]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Size toggle function
  const toggleSize = () => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(currentSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setCurrentSize(nextSize);
    onSizeChange(nextSize);
  };

  // Mouse event listeners for drag with momentum tracking
  useEffect(() => {
    if (isDragging) {
      // Smooth drag movement
      const smoothDragMove = (e: MouseEvent) => {
        handleDragMove(e);
      };
      
      document.addEventListener('mousemove', smoothDragMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('mouseleave', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', smoothDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('mouseleave', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove, { passive: false });
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('mouseleave', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('mouseleave', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Keyboard shortcuts for MiniPlayer controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      // Only handle keys when MiniPlayer is focused or no input is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA' || 
                           (activeElement as HTMLElement)?.contentEditable === 'true';
      
      if (isInputFocused) return;

      switch (e.key.toLowerCase()) {
        case 's':
          if (e.ctrlKey || e.metaKey) return; // Don't interfere with save
          e.preventDefault();
          toggleSize();
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) return; // Don't interfere with refresh
          e.preventDefault();
          // Reset position to bottom-right
          const resetPosition = {
            x: window.innerWidth - sizeConfig[currentSize].width - 20,
            y: window.innerHeight - sizeConfig[currentSize].height - 20
          };
          setCurrentPosition(resetPosition);
          onPositionChange(resetPosition);
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, currentSize, toggleSize, onPositionChange]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={`miniplayer-container miniplayer-${currentSize} ${isVisible ? 'visible' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${isAnimating ? 'entering' : ''}`}
      style={{
        position: 'fixed',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${sizeConfig[currentSize].width}px`,
        height: `${sizeConfig[currentSize].height}px`,
        zIndex: 9999,
        transform: isDragging ? 'scale(1.02) rotate(0.5deg)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: isDragging ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' : 'none'
      } as React.CSSProperties}
    >
      {/* Drag Handle */}
      <div 
        className="miniplayer-drag-handle" 
        onMouseDown={handleDragStart}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
            cancelable: true
          });
          handleDragStart(mouseEvent as any);
        }}
        title="Drag to move • S: Change size • R: Reset position"
      >
        <Move />
      </div>

      {/* Size Toggle Button */}
      <div className="miniplayer-size-toggle" onClick={toggleSize} title={`Size: ${currentSize}`}>
        <div className="size-indicator">
          <div className={`size-dot ${currentSize === 'small' ? 'active' : ''}`}></div>
          <div className={`size-dot ${currentSize === 'medium' ? 'active' : ''}`}></div>
          <div className={`size-dot ${currentSize === 'large' ? 'active' : ''}`}></div>
        </div>
      </div>

      {/* Close Button */}
      <div className="miniplayer-close" onClick={onClose}>
        <X />
      </div>

      {/* Resize Handle */}
      <div 
        className="miniplayer-resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      >
        <div className="resize-grip"></div>
      </div>

      {/* Video Display Area */}
      <div className="miniplayer-video-container">
        {videoRef?.current?.src ? (
          <video
            ref={videoRef}
            className="miniplayer-video"
            controls={false}
            muted={isMuted}
            onTimeUpdate={(e) => {
              const target = e.target as HTMLVideoElement;
              onSeek(target.currentTime);
            }}
            onVolumeChange={(e) => {
              const target = e.target as HTMLVideoElement;
              onVolumeChange(target.volume);
            }}
          />
        ) : (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="miniplayer-thumbnail"
          />
        )}

        {/* Play Overlay */}
        {!isPlaying && (
          <div className="miniplayer-play-overlay" onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? <Pause /> : <Play />}
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="miniplayer-controls">
        {/* Video Info */}
        <div className="miniplayer-info">
          <div className="miniplayer-title">{video.title}</div>
          <div className="miniplayer-channel">{video.channel.name}</div>
        </div>

        {/* Progress Bar */}
        <div 
          className="miniplayer-progress-container"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * duration);
          }}
        >
          <div 
            className="miniplayer-progress-bar"
            style={{'--progress': `${duration > 0 ? (currentTime / duration) * 100 : 0}%`} as React.CSSProperties}
          />
        </div>

        {/* Control Buttons */}
        <div className="miniplayer-buttons">
          {/* Left Controls */}
          <div className="miniplayer-buttons-left">
            <button 
              className="miniplayer-btn miniplayer-btn-primary" 
              onClick={isPlaying ? onPause : onPlay}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            
            <button 
              className="miniplayer-btn" 
              onClick={handleSkipBackward}
              title="Skip backward 10s"
              aria-label="Skip backward 10 seconds"
            >
              <RotateCcw />
            </button>

            <button 
              className="miniplayer-btn" 
              onClick={handleSkipForward}
              title="Skip forward 10s"
              aria-label="Skip forward 10 seconds"
            >
              <FastForward />
            </button>

            <div className="miniplayer-time">
              {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
            </div>
          </div>

          {/* Right Controls */}
          <div className="miniplayer-buttons-right">
            {/* Volume Control */}
            <div className="miniplayer-volume-container">
              <button 
                className="miniplayer-btn" 
                onClick={onMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
              </button>
              
              <div 
                className="miniplayer-volume-slider"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  onVolumeChange(Math.max(0, Math.min(1, percent)));
                }}
              >
                <div 
                  className="miniplayer-volume-fill"
                  style={{'--volume': `${volume * 100}%`} as React.CSSProperties}
                />
              </div>
            </div>

            <button 
              className="miniplayer-btn" 
              onClick={onToggleTheater}
              title="Theater mode"
              aria-label="Switch to theater mode"
            >
              <Maximize2 />
            </button>

            <button 
              className="miniplayer-btn" 
              onClick={onShowComments}
              title="Comments"
              aria-label="Show comments"
            >
              <MessageCircle />
            </button>

            <button 
              className="miniplayer-btn" 
              onClick={onShowQueue}
              title="Queue"
              aria-label="Show queue"
            >
              <List />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the enhanced version as the default MiniPlayer
export default EnhancedMiniPlayer;