import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  MicOff, 
  CameraOff, 
  Heart,
  MessageCircle,
  Settings,
  Send,
  Share2,
  Eye,
  ThumbsUp,
  Gift,
  PhoneOff,
  Pause,
  Play,
  Users,
  Clock,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Smile,
  Image,
  DollarSign,
  Star,
  TrendingUp,
  Zap,
  Award,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';

interface ModernLiveStreamingViewProps {
  streamConfig?: any;
  user?: any;
  onEndStream?: () => void;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
    badges?: string[];
  };
  message: string;
  timestamp: Date;
  likes: number;
  type?: 'message' | 'gift' | 'follow' | 'subscription';
  gift?: {
    name: string;
    value: number;
    emoji: string;
  };
}

interface StreamStats {
  viewers: number;
  likes: number;
  followers: number;
  duration: number;
  revenue: number;
}

/**
 * ModernLiveStreamingView - Next-generation live streaming interface
 * 
 * Features:
 * - Modern glassmorphism design with smooth animations
 * - Interactive viewer engagement with real-time reactions
 * - Professional stream controls with visual feedback
 * - Enhanced chat with gifts, follows, and subscriptions
 * - Real-time analytics and monetization tracking
 * - Responsive design optimized for all devices
 * - Accessibility-first approach with keyboard navigation
 */
export function ModernLiveStreamingView({ streamConfig, user, onEndStream }: ModernLiveStreamingViewProps) {
  // State management
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: Math.floor(Math.random() * 500) + 50,
    likes: Math.floor(Math.random() * 200) + 25,
    followers: Math.floor(Math.random() * 50) + 5,
    duration: 0,
    revenue: Math.floor(Math.random() * 100) + 10
  });

  const [isStreaming, setIsStreaming] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(streamConfig?.camera ?? true);
  const [isMicOn, setIsMicOn] = useState(streamConfig?.microphone ?? true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const streamAttachedRef = useRef(false); // Track if stream is already attached

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { 
        name: 'Emma Wilson', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        verified: true,
        badges: ['subscriber', 'moderator']
      },
      message: 'Amazing stream! The quality is incredible! 🔥✨',
      timestamp: new Date(Date.now() - 120000),
      likes: 24,
      type: 'message'
    },
    {
      id: '2',
      user: { 
        name: 'TechGuru_2024', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techguru',
        badges: ['vip']
      },
      message: 'Just followed! Keep up the great work! 🎯',
      timestamp: new Date(Date.now() - 180000),
      likes: 15,
      type: 'follow'
    },
    {
      id: '3',
      user: { 
        name: 'StreamFan_Alex', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        badges: ['supporter']
      },
      message: 'Sending love from California! 💖',
      timestamp: new Date(Date.now() - 240000),
      likes: 31,
      type: 'message'
    },
    {
      id: '4',
      user: { 
        name: 'GiftGiver_Pro', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giftgiver',
        verified: true
      },
      message: 'Here\'s a gift for you! 🎁',
      timestamp: new Date(Date.now() - 300000),
      likes: 42,
      type: 'gift',
      gift: {
        name: 'Golden Star',
        value: 50,
        emoji: '⭐'
      }
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState<{emoji: string, count: number, id: string}[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Error handling
  if (!streamConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Stream Configuration Missing</h2>
          <p className="text-gray-300">Unable to load stream configuration.</p>
        </motion.div>
      </div>
    );
  }

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        console.log('🎬 Starting media initialization...');
        console.log('📋 Stream config:', streamConfig);
        
        setIsInitializing(true);

        let stream: MediaStream;
        
        if (streamConfig?.mediaStream) {
          console.log('✅ Using existing media stream from Go Live modal');
          stream = streamConfig.mediaStream;
          
          const tracks = stream.getTracks();
          console.log('📊 Stream tracks:', tracks.map(t => ({
            kind: t.kind,
            label: t.label,
            enabled: t.enabled,
            readyState: t.readyState
          })));
          
          // Verify tracks are active
          const videoTrack = stream.getVideoTracks()[0];
          const audioTrack = stream.getAudioTracks()[0];
          
          if (!videoTrack || videoTrack.readyState !== 'live') {
            console.warn('⚠️ Video track is not live, requesting new stream');
            throw new Error('Video track not available');
          }
          
          console.log('✅ Video track status:', {
            enabled: videoTrack.enabled,
            muted: videoTrack.muted,
            readyState: videoTrack.readyState,
            settings: videoTrack.getSettings()
          });
          
          setMediaStream(stream);
          setIsCameraOn(videoTrack.enabled);
          setIsMicOn(audioTrack?.enabled ?? false);
        } else {
          console.log('🎥 Requesting new camera and microphone access...');
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920, min: 640 },
              height: { ideal: 1080, min: 480 },
              frameRate: { ideal: 30, min: 15 },
              facingMode: 'user'
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          
          console.log('✅ New media stream obtained');
          console.log('📊 Stream details:', {
            id: stream.id,
            active: stream.active,
            videoTracks: stream.getVideoTracks().length,
            audioTracks: stream.getAudioTracks().length
          });
          
          setMediaStream(stream);
          setIsCameraOn(true);
          setIsMicOn(true);
        }
        
        // Store stream first, then wait for video element to be ready
        console.log('✅ Media stream ready, waiting for video element...');
        toast.success('🎥 Live stream started!');

      } catch (error: any) {
        console.error('❌ Error accessing media devices:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        setIsInitializing(false);
        
        let errorMessage = 'Camera access failed. Please check permissions.';
        
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use. Please close other applications using the camera.';
        }
        
        toast.error(errorMessage);
      }
    };

    initializeMedia();

    return () => {
      streamAttachedRef.current = false; // Reset flag on cleanup
      if (mediaStream && !streamConfig?.mediaStream) {
        console.log('🧹 Cleaning up media stream...');
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log('🛑 Stopped track:', track.kind);
        });
      }
    };
  }, [streamConfig?.mediaStream]);

  // Function to attach stream to video element (memoized to prevent recreating on every render)
  const attachStreamToVideo = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!mediaStream || !videoElement || streamAttachedRef.current) {
      if (streamAttachedRef.current) {
        console.log('⏭️ Stream already attached, skipping...');
      }
      return;
    }

    try {
      console.log('🎥 Attaching stream to video element...');
      console.log('📊 Video element status:', {
        tagName: videoElement.tagName,
        readyState: videoElement.readyState
      });
      
      streamAttachedRef.current = true; // Mark as attached before async operations
      
      // Clear any existing stream
      videoElement.srcObject = null;
      
      // Wait a tick before assigning new stream
      await new Promise(resolve => setTimeout(resolve, 50));
      
      videoElement.srcObject = mediaStream;
      console.log('✅ Stream assigned to video element');
      
      videoElement.onloadedmetadata = () => {
        console.log('✅ Video metadata loaded');
        console.log('📺 Video element properties:', {
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight,
          readyState: videoElement.readyState,
          paused: videoElement.paused
        });
      };
      
      videoElement.onplaying = () => {
        console.log('✅ Video is now playing');
        setIsInitializing(false);
      };
      
      videoElement.onerror = (e) => {
        console.error('❌ Video element error:', e);
        streamAttachedRef.current = false; // Reset on error
        setIsInitializing(false);
      };
      
      try {
        console.log('▶️ Attempting to play video...');
        await videoElement.play();
        console.log('✅ Video playback started successfully');
        setIsInitializing(false);
      } catch (playError: any) {
        // Ignore AbortError as it's expected when React re-renders
        if (playError.name === 'AbortError') {
          console.log('ℹ️ Play interrupted (expected during React render), video will play automatically');
          return;
        }
        
        console.error('❌ Error starting video playback:', playError);
        streamAttachedRef.current = false; // Reset on error
        setIsInitializing(false);
        toast.error('Failed to start video playback. Please check camera permissions.');
      }
    } catch (error) {
      console.error('❌ Error attaching stream to video:', error);
      streamAttachedRef.current = false; // Reset on error
      setIsInitializing(false);
    }
  }, [mediaStream]);

  // Callback ref to handle video element mounting (memoized with useCallback)
  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && mediaStream && !streamAttachedRef.current) {
      console.log('📹 Video element mounted, attaching stream...');
      attachStreamToVideo(element);
    }
  }, [mediaStream, attachStreamToVideo]);

  // Stream duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamStats(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats(prev => ({
        ...prev,
        viewers: Math.max(1, prev.viewers + Math.floor(Math.random() * 6) - 2)
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (showControls) {
      hideControls();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  // Auto-scroll comments (Instagram-like behavior)
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [comments]);

  // Simulate incoming comments and interactions
  useEffect(() => {
    const commentInterval = setInterval(() => {
      const randomMessages = [
        { text: 'This is so cool! 😎', type: 'message' as const },
        { text: 'Love your content! 💖', type: 'message' as const },
        { text: 'Just subscribed! 🎉', type: 'message' as const },
        { text: 'Keep it up! 💪', type: 'message' as const },
        { text: 'Amazing quality! 🔥', type: 'message' as const }
      ];

      const randomUsers = [
        'StreamLover2024', 'TechEnthusiast', 'ContentFan_99', 'ViewerPro', 
        'StreamWatcher', 'DigitalNomad', 'CreativeViewer'
      ];

      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];

      const newComment: Comment = {
        id: Date.now().toString(),
        user: {
          name: randomUser,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomUser}`,
          badges: Math.random() > 0.7 ? ['supporter'] : []
        },
        message: randomMessage.text,
        timestamp: new Date(),
        likes: Math.floor(Math.random() * 10),
        type: randomMessage.type
      };

      setComments(prev => {
        const newComments = [...prev, newComment];
        // Keep only last 50 comments for performance (Instagram-like behavior)
        return newComments.slice(-50);
      });
    }, 8000);

    return () => clearInterval(commentInterval);
  }, []);

  // Helper functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: user?.displayName || user?.name || 'You',
        avatar: user?.photoURL || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        verified: user?.verified,
        badges: user?.badges || ['streamer']
      },
      message: newComment,
      timestamp: new Date(),
      likes: 0,
      type: 'message'
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    // Simulate engagement boost
    setStreamStats(prev => ({ ...prev, likes: prev.likes + 1 }));
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        toast.info(videoTrack.enabled ? '📹 Camera turned on' : '📹 Camera turned off');
      }
    }
  };

  const toggleMicrophone = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        toast.info(audioTrack.enabled ? '🎤 Microphone unmuted' : '🎤 Microphone muted');
      }
    }
  };

  const handleEndStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsStreaming(false);
    toast.success('🎬 Live stream ended successfully!');
    onEndStream?.();
  };

  const addReaction = (emoji: string) => {
    const reactionId = Date.now().toString();
    setReactions(prev => [...prev, { emoji, count: 1, id: reactionId }]);
    
    // Remove reaction after 3 seconds
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Stream Info */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-4 h-4 bg-red-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-red-400 font-bold text-lg">LIVE</span>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(streamStats.duration)}
                  </Badge>
                </div>

                <div className="text-white">
                  <h1 className="text-xl font-bold">{streamConfig?.title || 'Live Stream'}</h1>
                  <p className="text-sm text-gray-300">{user?.displayName || user?.name || 'Streamer'}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    <Eye className="w-4 h-4 mr-1" />
                    {formatNumber(streamStats.viewers)}
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-400/30">
                    <Heart className="w-4 h-4 mr-1" />
                    {formatNumber(streamStats.likes)}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                    <Users className="w-4 h-4 mr-1" />
                    {formatNumber(streamStats.followers)}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${streamStats.revenue}
                  </Badge>
                </div>

                <Button
                  onClick={handleEndStream}
                  variant="destructive"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Area */}
          <div className="flex-1 relative">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full bg-black/30 backdrop-blur-sm rounded-none relative overflow-hidden"
              onMouseMove={() => setShowControls(true)}
            >
              {/* Video Stream - Always render video element so ref is available */}
              <div className="relative w-full h-full">
                <video
                  ref={handleVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={true}
                  playsInline
                  style={{ 
                    transform: 'scaleX(-1)',
                    backgroundColor: '#000'
                  }}
                />
                
                {/* Overlays based on state */}
                {isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"
                      />
                      <p className="text-xl font-semibold text-white">Connecting Camera...</p>
                      <p className="text-gray-400">Please allow camera and microphone access</p>
                    </motion.div>
                  </div>
                )}
                
                {!isInitializing && !isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CameraOff className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-2xl font-semibold text-white mb-2">Camera is Off</p>
                      <p className="text-gray-400">Turn on your camera to start streaming</p>
                    </div>
                  </div>
                )}
                
                {!isInitializing && !mediaStream && isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-center p-8">
                      <Camera className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-white text-xl font-semibold mb-2">Camera Not Available</p>
                      <p className="text-gray-400 mb-4">Unable to access your camera</p>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Reactions */}
              <AnimatePresence>
                {reactions.map((reaction) => (
                  <motion.div
                    key={reaction.id}
                    initial={{ opacity: 0, y: 50, x: Math.random() * 200 }}
                    animate={{ opacity: 1, y: -200, x: Math.random() * 200 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute bottom-20 left-10 text-4xl pointer-events-none z-20"
                  >
                    {reaction.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Stream Controls Overlay */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Controls */}
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={toggleCamera}
                          variant="ghost"
                          size="lg"
                          className={`rounded-full w-14 h-14 ${
                            isCameraOn 
                              ? 'bg-white/20 hover:bg-white/30 text-white' 
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                          } backdrop-blur-md border border-white/20`}
                        >
                          {isCameraOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
                        </Button>

                        <Button
                          onClick={toggleMicrophone}
                          variant="ghost"
                          size="lg"
                          className={`rounded-full w-14 h-14 ${
                            isMicOn 
                              ? 'bg-white/20 hover:bg-white/30 text-white' 
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                          } backdrop-blur-md border border-white/20`}
                        >
                          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </Button>

                        <Button
                          onClick={() => setIsMuted(!isMuted)}
                          variant="ghost"
                          size="lg"
                          className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
                        >
                          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </Button>
                      </div>

                      {/* Center Info */}
                      <div className="text-center">
                        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
                          <p className="text-white font-semibold text-lg">{streamConfig?.title || 'Live Stream'}</p>
                          <p className="text-gray-300 text-sm">{streamConfig?.category || 'Just Chatting'}</p>
                        </div>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          variant="ghost"
                          size="lg"
                          className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
                        >
                          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="lg"
                          className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
                        >
                          <Settings className="w-6 h-6" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="lg"
                          className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
                        >
                          <Share2 className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pause Overlay */}
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
                    >
                      <Pause className="w-12 h-12 text-white" />
                    </motion.div>
                    <p className="text-2xl font-bold text-white mb-2">Stream Paused</p>
                    <p className="text-gray-300">Click to resume streaming</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Chat Area */}
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-96 bg-black/20 backdrop-blur-md border-l border-white/10 flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                  Live Chat
                </h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                  {comments.length} messages
                </Badge>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 instagram-chat-container live-chat-scrollbar smooth-scroll px-4 py-2 space-y-3">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className={`chat-message-enter p-3 rounded-xl transition-all duration-300 hover:bg-white/5 ${
                        comment.type === 'gift' ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30' :
                        comment.type === 'follow' ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30' :
                        'bg-white/5 border border-white/10'
                      }`}
                    >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8 ring-2 ring-white/20">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            {comment.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {comment.user.verified && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-white text-sm truncate">
                            {comment.user.name}
                          </span>
                          
                          {comment.user.badges?.map((badge) => (
                            <Badge 
                              key={badge} 
                              variant="secondary" 
                              className={`text-xs px-1.5 py-0.5 ${
                                badge === 'moderator' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                                badge === 'subscriber' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                                badge === 'vip' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                                badge === 'streamer' ? 'bg-red-500/20 text-red-300 border-red-400/30' :
                                'bg-gray-500/20 text-gray-300 border-gray-400/30'
                              }`}
                            >
                              {badge === 'moderator' && <Shield className="w-2 h-2 mr-1" />}
                              {badge === 'subscriber' && <Star className="w-2 h-2 mr-1" />}
                              {badge === 'vip' && <Award className="w-2 h-2 mr-1" />}
                              {badge === 'streamer' && <Zap className="w-2 h-2 mr-1" />}
                              {badge}
                            </Badge>
                          ))}

                          <span className="text-xs text-gray-400">
                            {comment.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>

                        {comment.type === 'gift' && comment.gift && (
                          <div className="mb-2 p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{comment.gift.emoji}</span>
                              <div>
                                <p className="text-yellow-300 font-semibold text-sm">{comment.gift.name}</p>
                                <p className="text-yellow-400 text-xs">${comment.gift.value}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-gray-200 text-sm break-words leading-relaxed">
                          {comment.message}
                        </p>

                        {comment.likes > 0 && (
                          <div className="flex items-center mt-2 space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                            >
                              <Heart className="w-3 h-3 mr-1 text-pink-400" />
                              {comment.likes}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
                <div ref={commentsEndRef} />
              </div>
            </div>

            {/* Quick Reactions */}
            <div className="flex-shrink-0 p-3 border-t border-white/10">
              <div className="flex items-center justify-center space-x-2 mb-3">
                {['❤️', '😂', '👏', '🔥', '😍', '🎉'].map((emoji) => (
                  <Button
                    key={emoji}
                    onClick={() => addReaction(emoji)}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full"
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Send a message..."
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl pr-20"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                    maxLength={200}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Gift className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{newComment.length}/200</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live engagement</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
