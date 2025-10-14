import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2, 
  VolumeX,
  Signal,
  Users,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface LiveStreamPreviewProps {
  isVisible: boolean;
  onClose: () => void;
  streamData?: any;
}

export function LiveStreamPreview({ isVisible, onClose, streamData }: LiveStreamPreviewProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock stream data
  const mockStreamData = {
    viewers: Math.floor(Math.random() * 150) + 25,
    quality: 'HD 1080p',
    bitrate: '3.2 Mbps',
    fps: 30,
    duration: '12:34',
    messages: Math.floor(Math.random() * 50) + 10,
    ...streamData
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const newX = Math.max(0, Math.min(window.innerWidth - containerRef.current.offsetWidth, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - containerRef.current.offsetHeight, e.clientY - dragOffset.y));
        
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  // Simulate video stream
  useEffect(() => {
    if (videoRef.current && isVisible) {
      // In a real implementation, this would be the actual stream
      videoRef.current.src = '/api/placeholder/video/stream';
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`
          fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden
          ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
          ${isExpanded ? 'w-96 h-80' : isMinimized ? 'w-60 h-12' : 'w-80 h-60'}
        `}
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Header */}
        <div 
          className={`
            flex items-center justify-between p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white cursor-grab active:cursor-grabbing
            ${isMinimized ? 'rounded-lg' : 'rounded-t-lg'}
          `}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Preview</span>
            {!isMinimized && (
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {mockStreamData.viewers} viewers
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-6 h-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="relative">
            {/* Video Preview */}
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                autoPlay
                playsInline
              />
              
              {/* Video overlay placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Eye className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Live Stream Preview</p>
                  <p className="text-xs opacity-75">What your viewers see</p>
                </div>
              </div>

              {/* Stream Quality Indicator */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/50 text-white text-xs">
                  <Signal className="w-3 h-3 mr-1" />
                  {mockStreamData.quality}
                </Badge>
              </div>

              {/* Volume Control */}
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 p-0 bg-black/50 text-white hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Expand/Contract Button */}
              <div className="absolute bottom-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 p-0 bg-black/50 text-white hover:bg-black/70"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Controls Overlay */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-2 left-2 right-2"
                  >
                    <div className="bg-black/70 rounded-lg p-2 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{mockStreamData.viewers}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{mockStreamData.messages}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>{mockStreamData.bitrate}</div>
                          <div>{mockStreamData.fps} FPS</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            {isExpanded && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">Good</div>
                    <div className="text-xs text-gray-500">Stream Health</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{mockStreamData.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-500">Dropped Frames</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drag handle */}
        <div className="absolute top-0 left-0 w-full h-8 cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} />
      </motion.div>
    </AnimatePresence>
  );
}