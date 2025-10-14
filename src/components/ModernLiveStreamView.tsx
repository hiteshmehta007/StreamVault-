import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  Users,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical,
  Maximize,
  Volume2,
  VolumeX,
  Gift,
  Smile,
  Send,
  Eye,
  TrendingUp,
  Circle,
  MonitorPlay,
  Zap,
  Award,
  Shield,
  Star,
  X,
  PhoneOff,
  Camera,
  Monitor
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface LiveStreamViewProps {
  streamConfig?: {
    title?: string;
    streamerName?: string;
    streamKey?: string;
  };
  onEndStream?: () => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  avatar: string;
  timestamp: string;
  badges?: ('subscriber' | 'moderator' | 'vip' | 'supporter')[];
  gift?: {
    name: string;
    emoji: string;
    value: number;
  };
  likes: number;
}

const QUICK_EMOJIS = ['❤️', '😂', '👏', '🔥', '😍', '🎉', '💯', '✨'];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    username: 'Emma Wilson',
    message: 'Amazing stream! The quality is incredible! 🔥✨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    timestamp: '06:16 PM',
    badges: ['subscriber', 'moderator'],
    likes: 24
  },
  {
    id: '2',
    username: 'TechGuru_2024',
    message: 'Just followed! Keep up the great work! 🎯',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techguru',
    timestamp: '06:15 PM',
    badges: ['vip'],
    likes: 15
  },
  {
    id: '3',
    username: 'StreamFan_Alex',
    message: 'Sending love from California! 💖',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    timestamp: '06:14 PM',
    badges: ['supporter'],
    likes: 31
  },
  {
    id: '4',
    username: 'GiftGiver_Pro',
    message: "Here's a gift for you! 🎁",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giftgiver',
    timestamp: '06:13 PM',
    badges: ['subscriber'],
    gift: {
      name: 'Golden Star',
      emoji: '⭐',
      value: 50
    },
    likes: 42
  }
];

export function ModernLiveStreamView({ streamConfig, onEndStream }: LiveStreamViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [viewerCount, setViewerCount] = useState(137);
  const [likeCount, setLikeCount] = useState(67);
  const [followerCount, setFollowerCount] = useState(43);
  const [earnings, setEarnings] = useState(45);
  const [streamDuration, setStreamDuration] = useState(80); // seconds
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamAttachedRef = useRef(false);

  // Format stream duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Stream duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleMessages = [
        'This is so cool! 😎',
        'Love your content! 💖',
        'Just subscribed! 🎉',
        'Keep it up! 💪',
        'Amazing! 🔥'
      ];
      
      const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        username: randomUsername,
        message: randomMessage,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomUsername}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badges: Math.random() > 0.7 ? ['supporter'] : undefined,
        likes: Math.floor(Math.random() * 10)
      };
      
      setMessages(prev => [...prev.slice(-20), newMsg]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Camera stream setup
  const attachStreamToVideo = useCallback(async () => {
    if (streamAttachedRef.current || !videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamAttachedRef.current = true;
        console.log('✅ Camera stream attached successfully');
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  }, []);

  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    if (element && !streamAttachedRef.current) {
      videoRef.current = element;
      attachStreamToVideo();
    }
  }, [attachStreamToVideo]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      streamAttachedRef.current = false;
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: newMessage,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badges: ['moderator'],
      likes: 0
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleQuickEmoji = (emoji: string) => {
    toast.success(`${emoji} sent to chat!`);
    setLikeCount(prev => prev + 1);
  };

  const toggleCamera = () => {
    setIsCameraOn(prev => {
      const newState = !prev;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach(track => track.enabled = newState);
      }
      toast.success(newState ? 'Camera enabled' : 'Camera disabled');
      return newState;
    });
  };

  const toggleMic = () => {
    setIsMicOn(prev => {
      const newState = !prev;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach(track => track.enabled = newState);
      }
      toast.success(newState ? 'Microphone enabled' : 'Microphone muted');
      return newState;
    });
  };

  const handleEndStream = () => {
    if (window.confirm('Are you sure you want to end this stream?')) {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      toast.success('Stream ended successfully');
      onEndStream?.();
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'subscriber': return <Star className="w-2 h-2" />;
      case 'moderator': return <Shield className="w-2 h-2" />;
      case 'vip': return <Award className="w-2 h-2" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'subscriber': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'moderator': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'vip': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-white/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Stream Info */}
            <div className="flex items-center space-x-6">
              <motion.div 
                className="flex items-center space-x-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  <motion.div 
                    className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span className="text-red-400 font-bold text-lg tracking-wide">LIVE</span>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Circle className="w-3 h-3 mr-1 fill-current" />
                  {formatDuration(streamDuration)}
                </Badge>
              </motion.div>

              <div className="text-white border-l border-white/10 pl-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {streamConfig?.title || 'Live Stream'}
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Monitor className="w-3 h-3" />
                  {streamConfig?.streamerName || 'Streamer'}
                </p>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-2">
                  <Eye className="w-4 h-4 mr-2" />
                  {viewerCount.toLocaleString()}
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-400/30 px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  {likeCount.toLocaleString()}
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  {followerCount.toLocaleString()}
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  ${earnings.toLocaleString()}
                </Badge>
              </motion.div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm"
                  onClick={() => toast.info('Share feature coming soon!')}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm"
                  onClick={() => toast.info('Settings coming soon!')}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="destructive"
                  onClick={handleEndStream}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 backdrop-blur-sm"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Video Section */}
        <motion.div 
          className="flex-1 relative p-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden relative group">
            {/* Video Container */}
            <div className="relative w-full h-full">
              <video
                ref={handleVideoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover rounded-lg"
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* Camera Off Overlay */}
              <AnimatePresence>
                {!isCameraOn && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <VideoOff className="w-12 h-12 text-white/50" />
                      </div>
                      <p className="text-white/70 text-lg">Camera is off</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Controls Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant={isCameraOn ? 'default' : 'destructive'}
                        onClick={toggleCamera}
                        className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                      >
                        {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant={isMicOn ? 'default' : 'destructive'}
                        onClick={toggleMic}
                        className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                      >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                      >
                        <Maximize className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Live Indicator Corner */}
              <div className="absolute top-4 left-4">
                <motion.div 
                  className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center space-x-2 shadow-lg shadow-red-500/50"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Circle className="w-2 h-2 fill-white" />
                  <span className="text-white font-bold text-sm">BROADCASTING</span>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Chat Section */}
        <motion.div 
          className="w-96 bg-black/40 backdrop-blur-xl border-l border-white/5 flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Chat Header */}
          <div className="flex-shrink-0 p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                Live Chat
              </h3>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                {messages.length} messages
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scroll-smooth"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent'
            }}
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-xl transition-all duration-300 hover:bg-white/5 ${
                    msg.gift 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-8 h-8 ring-2 ring-white/20">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.username[0]}</AvatarFallback>
                      </Avatar>
                      {msg.badges?.includes('moderator') && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="font-semibold text-white text-sm truncate">
                          {msg.username}
                        </span>
                        {msg.badges?.map((badge, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className={`text-xs px-1.5 py-0.5 ${getBadgeColor(badge)}`}
                          >
                            {getBadgeIcon(badge)}
                            <span className="ml-1">{badge}</span>
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>

                      {msg.gift && (
                        <motion.div 
                          className="mb-2 p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{msg.gift.emoji}</span>
                            <div>
                              <p className="text-yellow-300 font-semibold text-sm">{msg.gift.name}</p>
                              <p className="text-yellow-400 text-xs">${msg.gift.value}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <p className="text-gray-200 text-sm break-words leading-relaxed">{msg.message}</p>

                      <div className="flex items-center mt-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition-colors"
                        >
                          <Heart className="w-3 h-3 text-pink-400" />
                          {msg.likes}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Reactions */}
          <div className="flex-shrink-0 p-3 border-t border-white/10">
            <div className="flex items-center justify-center space-x-2 mb-3">
              {QUICK_EMOJIS.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickEmoji(emoji)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="text-lg">{emoji}</span>
                </motion.button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Send a message..."
                  maxLength={200}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => toast.info('Gift feature coming soon!')}
                  >
                    <Gift className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{newMessage.length}/200</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3" />
                <span>Live engagement</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
