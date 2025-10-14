import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Settings,
  Users,
  Wifi,
  WifiOff,
  Signal,
  Activity,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  Radio,
  Eye,
  Zap,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface LiveStreamPreviewProps {
  isVisible: boolean;
  onClose: () => void;
  streamData?: any;
}

export function LiveStreamPreview({ isVisible, onClose, streamData: _ }: LiveStreamPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [streamHealth, setStreamHealth] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(89);
  const [messages, setMessages] = useState(312);
  const [isRecording, setIsRecording] = useState(true);
  const [bitrate, setBitrate] = useState(4500);
  const [fps, setFps] = useState(60);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();

  // Get responsive dimensions that never exceed viewport
  const getResponsiveDimensions = () => {
    const maxWidth = Math.min(window.innerWidth * 0.85, 600);
    const maxHeight = Math.min(window.innerHeight * 0.8, 700);
    return { width: maxWidth, height: maxHeight };
  };

  // Responsive positioning based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (isExpanded) {
        const { width, height } = getResponsiveDimensions();
        const centerX = Math.max(10, (window.innerWidth - width) / 2);
        const centerY = Math.max(10, (window.innerHeight - height) / 2);
        setPosition({ x: centerX, y: centerY });
      } else {
        // Keep compact version within bounds
        const maxX = window.innerWidth - 340;
        const maxY = window.innerHeight - 260;
        setPosition(prev => ({
          x: Math.min(prev.x, Math.max(10, maxX)),
          y: Math.min(prev.y, Math.max(10, maxY))
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  // Enhanced real-time updates with more realistic data
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
      setLikes(prev => prev + (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0));
      setMessages(prev => prev + Math.floor(Math.random() * 5) + 1);
      setBitrate(prev => Math.max(1000, Math.min(8000, prev + Math.floor(Math.random() * 200) - 100)));
      setFps(prev => Math.max(24, Math.min(60, prev + Math.floor(Math.random() * 4) - 2)));
      
      // Dynamic stream health based on bitrate and other factors
      if (bitrate > 4000 && fps >= 55) setStreamHealth('excellent');
      else if (bitrate > 2500 && fps >= 45) setStreamHealth('good');
      else if (bitrate > 1500 && fps >= 30) setStreamHealth('fair');
      else setStreamHealth('poor');
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, bitrate, fps]);

  // Request camera access for preview
  useEffect(() => {
    if (isVisible && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.warn('Camera access denied for preview:', err));
    }
  }, [isVisible]);

  // Enhanced drag functionality with responsive bounds
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    
    setIsDragging(true);
    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isExpanded) return;

    const newX = Math.max(10, Math.min(window.innerWidth - 340, e.clientX - dragOffset.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 260, e.clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleExpand = () => {
    if (!isExpanded) {
      const { width, height } = getResponsiveDimensions();
      const centerX = Math.max(10, (window.innerWidth - width) / 2);
      const centerY = Math.max(10, (window.innerHeight - height) / 2);
      setPosition({ x: centerX, y: centerY });
    }
    setIsExpanded(!isExpanded);
  };

  const getHealthColor = () => {
    switch (streamHealth) {
      case 'excellent': return 'from-emerald-500 to-green-400';
      case 'good': return 'from-blue-500 to-cyan-400';
      case 'fair': return 'from-yellow-500 to-orange-400';
      case 'poor': return 'from-red-500 to-pink-400';
    }
  };

  const getHealthIcon = () => {
    switch (streamHealth) {
      case 'excellent': return <Signal className="w-3 h-3" />;
      case 'good': return <Wifi className="w-3 h-3" />;
      case 'fair': return <Activity className="w-3 h-3" />;
      case 'poor': return <WifiOff className="w-3 h-3" />;
    }
  };

  const { width: responsiveWidth, height: responsiveHeight } = getResponsiveDimensions();

  const expandAnimation = {
    scale: isExpanded ? 1 : 1,
    width: isExpanded ? responsiveWidth : 320,
    height: isExpanded ? responsiveHeight : 240,
    x: position.x,
    y: position.y,
    borderRadius: isExpanded ? 20 : 16,
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={previewRef}
        initial={{ 
          scale: 0, 
          opacity: 0, 
          rotate: -15, 
          y: 100,
          filter: 'blur(10px)'
        }}
        animate={{ 
          opacity: 1,
          rotate: 0,
          filter: 'blur(0px)',
          ...expandAnimation
        }}
        exit={{ 
          scale: 0.8, 
          opacity: 0, 
          rotate: 15, 
          y: -50,
          filter: 'blur(5px)',
          transition: { duration: 0.3, ease: "easeIn" }
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          mass: 0.8,
        }}
        className={`
          fixed z-[100] bg-gradient-to-br from-white/95 via-white/90 to-white/95 
          dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95
          backdrop-blur-xl border border-white/20 dark:border-gray-700/30
          shadow-2xl flex flex-col
          ${!isExpanded ? 'cursor-move overflow-hidden' : 'overflow-y-auto overflow-x-hidden custom-scrollbar'}
          ${isDragging ? 'cursor-grabbing shadow-3xl' : ''}
        `}
        style={{ 
          left: position.x, 
          top: position.y,
          maxWidth: isExpanded ? '85vw' : '320px',
          maxHeight: isExpanded ? '80vh' : '240px',
          width: isExpanded ? Math.min(responsiveWidth, window.innerWidth * 0.85) : '320px',
          height: isExpanded ? Math.min(responsiveHeight, window.innerHeight * 0.8) : '240px',
          minHeight: isExpanded ? '400px' : '240px'
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          scale: isExpanded ? 1 : 1.01,
          boxShadow: isExpanded 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            : "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)",
        }}
        whileTap={{ 
          scale: isExpanded ? 1 : 0.98,
          transition: { duration: 0.1 }
        }}
      >
        {/* Ambient Background Glow */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Main Content Container with Scrolling */}
        <div className={`${isExpanded ? 'h-full overflow-y-auto overflow-x-hidden' : 'h-full'} flex flex-col relative z-10`}>
        {/* Modern Drag Handle */}
        {!isExpanded && (
          <motion.div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
              animate={{ 
                scaleX: [1, 1.5, 1],
                opacity: isDragging ? 1 : [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="w-2 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
              animate={{ 
                scaleX: [1, 1.5, 1],
                opacity: isDragging ? 1 : [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </motion.div>
        )}

        {/* Premium Header */}
        <motion.div 
          className={`relative bg-gradient-to-r ${getHealthColor()} text-white p-3`}
          layoutId="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        >
          {/* Header Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-white/10" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  boxShadow: [
                    "0 0 0 0px rgba(255, 255, 255, 0.8)",
                    "0 0 0 8px rgba(255, 255, 255, 0)",
                    "0 0 0 0px rgba(255, 255, 255, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                <Radio className="absolute inset-0 w-3 h-3 text-white/50" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">LIVE STREAM</span>
                <span className="text-xs opacity-90">Premium Preview</span>
              </div>
              
              {!isExpanded && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
                >
                  <Badge className={`bg-gradient-to-r ${getHealthColor()} border-0 text-white text-xs px-3 py-1 shadow-lg`}>
                    {getHealthIcon()}
                    <span className="ml-1 font-semibold">{streamHealth}</span>
                    <Sparkles className="w-3 h-3 ml-1" />
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isExpanded && (
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.9, rotate: -5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand();
                    controls.start({ scale: 1.05 }).then(() => controls.start({ scale: 1 }));
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              )}
              
              {isExpanded && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand();
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <Minimize2 className="w-4 h-4" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Video Preview */}
        <motion.div 
          className={`relative bg-black flex items-center justify-center ${
            isExpanded ? 'h-[40vh] min-h-[280px] max-h-[400px]' : 'flex-1'
          }`}
          layoutId="video"
        >
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Video Overlay Controls */}
          <motion.div 
            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              backdropFilter: "blur(2px)",
              transition: { duration: 0.2 }
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.1 }
            }}
          >
            <motion.div 
              className="flex items-center space-x-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              whileHover="visible"
            >
              <motion.button
                variants={{
                  hidden: { scale: 0, rotate: -180 },
                  visible: { 
                    scale: 1, 
                    rotate: 0,
                    transition: { type: "spring", stiffness: 500, damping: 30 }
                  }
                }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 10,
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.8,
                  rotate: -10,
                  transition: { duration: 0.1 }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                  toast.success(isMuted ? '🔊 Preview unmuted' : '🔇 Preview muted');
                }}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Stream settings opened!');
                }}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRecording(!isRecording);
                  toast.success(isRecording ? '⏸️ Recording paused' : '▶️ Recording resumed');
                }}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Live Stats Overlay */}
          <motion.div 
            className="absolute top-3 right-3 space-y-2"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              y: [0, -3, 0]
            }}
            transition={{ 
              delay: 0.4,
              duration: 0.6,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div 
              className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center space-x-1"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(0,0,0,0.9)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                transition: { duration: 0.2 }
              }}
              animate={{
                scale: viewers > 50 ? [1, 1.05, 1] : 1,
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              <Eye className="w-3 h-3" />
              <span>{viewers}</span>
            </motion.div>
            
            {isExpanded && (
              <>
                <motion.div 
                  className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center space-x-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>{likes}</span>
                </motion.div>
                
                <motion.div 
                  className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center space-x-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <MessageCircle className="w-3 h-3 text-blue-400" />
                  <span>{messages}</span>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Recording Indicator */}
          {isRecording && (
            <motion.div 
              className="absolute top-3 left-3 bg-red-500 rounded-full px-2 py-1 text-white text-xs flex items-center space-x-1"
              animate={{ 
                opacity: [1, 0.7, 1],
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0px rgba(239, 68, 68, 0.7)",
                  "0 0 0 8px rgba(239, 68, 68, 0)",
                  "0 0 0 0px rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ 
                scale: 1, 
                rotate: 0,
                transition: { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30,
                  delay: 0.3
                }
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>REC</span>
            </motion.div>
          )}
        </motion.div>

        {/* Expanded Stats Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200/20 dark:border-gray-700/30 p-3 sm:p-4 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm flex-shrink-0 min-h-0"
            >
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-full"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="text-center"
                  variants={{
                    hidden: { y: 30, opacity: 0, scale: 0.8 },
                    visible: { 
                      y: 0, 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25 
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Viewers</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-red-500">{likes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>Likes</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{messages}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>Messages</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-2xl font-bold ${getHealthColor().split(' ')[0]}`}>
                    {streamHealth}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
                    {getHealthIcon()}
                    <span>Quality</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast.info('Stream settings opened!')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast.info('Stream optimized!')}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Optimize</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast.info('Analytics opened!')}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions (Collapsed View) */}
        {!isExpanded && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-3 right-3 flex justify-center space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toast.info('Quality check completed!');
              }}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <Activity className="w-3 h-3" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toast.info('Stream refreshed!');
              }}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </motion.button>
          </motion.div>
        )}
        
        </div> {/* Close main content container */}
      </motion.div>
    </AnimatePresence>
  );
}