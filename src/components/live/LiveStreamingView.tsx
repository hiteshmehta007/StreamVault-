import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Play
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';

interface LiveStreamingViewProps {
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
  };
  message: string;
  timestamp: Date;
  likes: number;
}

/**
 * LiveStreamingView - Split-screen live streaming interface
 * 
 * Features:
 * - Top side: Live video stream with camera/mic controls
 * - Bottom side: Real-time chat comments
 * - Horizontal division layout for better viewing experience
 * - Stream controls: pause, camera toggle, mic toggle, end stream
 * - Live viewer count, likes, and engagement metrics
 * - Auto-scrolling chat with emoji support
 */
export function LiveStreamingView({ streamConfig, user, onEndStream }: LiveStreamingViewProps) {
  // Add error handling and null checks
  if (!streamConfig) {
    console.warn('LiveStreamingView: No stream configuration provided');
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Stream Configuration Missing</h2>
          <p className="text-gray-400">Unable to load stream configuration.</p>
        </div>
      </div>
    );
  }
  
  // Debug logging
  console.log('🎬 LiveStreamingView initialized with config:', streamConfig);
  console.log('📹 Media stream available:', !!streamConfig?.mediaStream);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 100) + 15);
  const [likeCount] = useState(Math.floor(Math.random() * 50) + 8);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'Sarah M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      message: 'Great stream! 🔥',
      timestamp: new Date(Date.now() - 30000),
      likes: 5
    },
    {
      id: '2',
      user: { name: 'John D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', verified: true },
      message: 'Looking forward to more content like this!',
      timestamp: new Date(Date.now() - 45000),
      likes: 12
    },
    {
      id: '3',
      user: { name: 'Alex K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      message: 'Just subscribed! 🎉',
      timestamp: new Date(Date.now() - 60000),
      likes: 8
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(streamConfig?.camera ?? true);
  const [isMicOn, setIsMicOn] = useState(streamConfig?.microphone ?? true);
  const [streamDuration, setStreamDuration] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Initialize media stream from passed config or create new one
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        let stream: MediaStream;
        
        // Check if media stream is already provided from the Go Live modal
        if (streamConfig?.mediaStream) {
          console.log('✅ Using existing media stream from Go Live modal');
          stream = streamConfig.mediaStream;
          setMediaStream(stream);
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
          
          console.log('✅ New media stream obtained:', stream);
          setMediaStream(stream);
        }
        
        // Assign stream to video element
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
            console.log('✅ Video playback started');
          } catch (playError) {
            console.error('❌ Error starting video playback:', playError);
            toast.error('Failed to start video playback');
          }
        }

        setIsInitializing(false);
        toast.success('📹 Camera and microphone connected!');
      } catch (error: any) {
        console.error('❌ Error accessing media devices:', error);
        setIsInitializing(false);
        
        let errorMessage = 'Camera access failed';
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and refresh.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        }
        
        toast.error(errorMessage);
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      // Only clean up if we created the stream, not if it was passed from modal
      if (mediaStream && !streamConfig?.mediaStream) {
        console.log('🛑 Cleaning up media stream...');
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [streamConfig?.mediaStream]);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        return Math.max(1, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Stream timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Simulate incoming comments
  useEffect(() => {
    const commentInterval = setInterval(() => {
      const randomMessages = [
        "Amazing content! 👏",
        "Love this stream!",
        "More of this please! 🙌",
        "You're doing great!",
        "Can you show that again?",
        "This is so helpful!",
        "Keep it up! 💪",
        "Best stream ever!",
        "Thanks for sharing! 🙏"
      ];

      const newComment: Comment = {
        id: Date.now().toString(),
        user: {
          name: `Viewer${Math.floor(Math.random() * 1000)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        },
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        likes: Math.floor(Math.random() * 3)
      };

      setComments(prev => [...prev, newComment]);
    }, 8000);

    return () => clearInterval(commentInterval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: user?.name || 'You',
        avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        verified: user?.verified
      },
      message: newComment,
      timestamp: new Date(),
      likes: 0
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleEndStream = () => {
    if (mediaStream) {
      console.log('🛑 Ending live stream...');
      mediaStream.getTracks().forEach(track => {
        track.stop();
      });
      setMediaStream(null);
    }
    setIsStreaming(false);
    toast.success('📺 Live stream ended successfully!');
    onEndStream?.();
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

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        toast.info(audioTrack.enabled ? '🎤 Microphone unmuted' : '🎤 Microphone muted');
      }
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Stream resumed' : 'Stream paused');
  };

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold">LIVE</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{formatDuration(streamDuration)}</span>
          </div>
          <Badge variant="secondary" className="bg-gray-700">
            <Eye className="w-3 h-3 mr-1" />
            {viewerCount.toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="bg-gray-700">
            <Heart className="w-3 h-3 mr-1" />
            {likeCount}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={togglePause}
            className="text-gray-300 hover:text-white"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-300 hover:text-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEndStream}
            className="bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-4 h-4 mr-1" />
            End Stream
          </Button>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex flex-col h-[calc(100vh-72px)]">
        {/* Top Side - Live Stream View */}
        <div className="flex-1 bg-black relative min-h-[50vh]">
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            {/* Video Stream Placeholder */}
            <div className="relative w-full h-full max-w-4xl max-h-full bg-gray-800 rounded-lg overflow-hidden">
              {isInitializing ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="animate-pulse mb-4">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-lg font-medium text-white">Connecting to camera...</p>
                    <p className="text-sm text-gray-400 mt-2">Please allow camera and microphone access</p>
                  </div>
                </div>
              ) : !isCameraOn ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <CameraOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Camera is off</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={false}
                  playsInline
                />
              )}
              
              {/* Stream Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Button
                    variant={isCameraOn ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleCamera}
                    className="bg-black/60 backdrop-blur-sm border border-white/20"
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isMicOn ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleMic}
                    className="bg-black/60 backdrop-blur-sm border border-white/20"
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                  <span className="text-sm font-medium">{streamConfig?.title || 'Live Stream'}</span>
                </div>
              </div>

              {isPaused && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center">
                    <Pause className="w-16 h-16 text-white mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold">Stream Paused</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Side - Comments Section */}
        <div className="w-full h-1/2 bg-gray-800 border-t border-gray-700 flex flex-col">
          {/* Comments Header */}
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </h3>
              <Badge variant="secondary" className="bg-gray-700">
                {comments.length} messages
              </Badge>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2 space-y-3">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback className="bg-gray-600">
                    {comment.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {comment.user.name}
                    </span>
                    {comment.user.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">
                      {comment.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 break-words">{comment.message}</p>
                  {comment.likes > 0 && (
                    <div className="flex items-center mt-1">
                      <ThumbsUp className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">{comment.likes}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex space-x-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <Button 
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>Press Enter to send</span>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4" />
                <span>Send gift</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}