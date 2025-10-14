import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Users,
  MessageSquare,
  Heart,
  Gift,
  Star,
  Smile,
  Send,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Share,
  Flag,
  Crown,
  Zap,
  DollarSign,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Square,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveStreamPlayerProps {
  streamData: {
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
  };
  isCreator?: boolean;
  onEndStream?: () => void;
}

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    subscriber: boolean;
    moderator: boolean;
  };
  message: string;
  timestamp: Date;
  type: 'message' | 'superchat' | 'emoji' | 'system';
  amount?: number;
  color?: string;
  emojis?: string[];
}

interface SuperChatData {
  amount: number;
  message: string;
  color: string;
  duration: number;
}

const EMOJI_LIST = ['❤️', '👍', '👏', '😂', '😍', '🔥', '💯', '🎉', '⚡', '💎', '🚀', '🌟'];

const SUPERCHAT_TIERS = [
  { amount: 2, color: '#1565C0', duration: 2000 },
  { amount: 5, color: '#00C851', duration: 5000 },
  { amount: 10, color: '#FF8A00', duration: 10000 },
  { amount: 20, color: '#E91E63', duration: 15000 },
  { amount: 50, color: '#9C27B0', duration: 30000 },
  { amount: 100, color: '#FFD700', duration: 60000 }
];

export function LiveStreamPlayer({ streamData, isCreator = false, onEndStream }: LiveStreamPlayerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [slowMode, setSlowMode] = useState(false);
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  
  // Creator controls
  const [streamStatus, setStreamStatus] = useState<'live' | 'paused' | 'ended'>('live');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  
  // Live stats
  const [viewers, setViewers] = useState(streamData.viewers);
  const [duration, setDuration] = useState(streamData.duration);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 100);
  const [totalSuperChats, setTotalSuperChats] = useState(0);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate live chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedMessages = [
        "Great stream! 🔥",
        "Love this content",
        "First time watching, amazing!",
        "Keep it up! 👏",
        "This is so helpful",
        "Amazing quality!",
        "Been waiting for this",
        "Tutorial please?",
        "What's your setup?",
        "Stream more often! ❤️"
      ];
      
      const randomUser = {
        name: `User${Math.floor(Math.random() * 1000)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        verified: Math.random() > 0.9,
        subscriber: Math.random() > 0.7,
        moderator: Math.random() > 0.95
      };
      
      if (Math.random() > 0.3) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: randomUser,
          message: simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)],
          timestamp: new Date(),
          type: 'message'
        };
        
        setChatMessages(prev => [...prev.slice(-49), newMessage]);
      }
      
      // Simulate viewer count changes
      setViewers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        verified: false,
        subscriber: isSubscribed,
        moderator: false
      },
      message: messageInput,
      timestamp: new Date(),
      type: 'message'
    };
    
    setChatMessages(prev => [...prev.slice(-49), newMessage]);
    setMessageInput('');
    toast.success('Message sent!');
  };

  const handleEmojiClick = (emoji: string) => {
    const emojiMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        verified: false,
        subscriber: isSubscribed,
        moderator: false
      },
      message: emoji,
      timestamp: new Date(),
      type: 'emoji',
      emojis: [emoji]
    };
    
    setChatMessages(prev => [...prev.slice(-49), emojiMessage]);
    setShowEmojiPanel(false);
  };

  const handleSuperChat = (amount: number, message: string) => {
    const tier = SUPERCHAT_TIERS.find(t => t.amount <= amount) || SUPERCHAT_TIERS[0];
    
    const superChatMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        verified: false,
        subscriber: isSubscribed,
        moderator: false
      },
      message,
      timestamp: new Date(),
      type: 'superchat',
      amount,
      color: tier.color
    };
    
    setChatMessages(prev => [...prev.slice(-49), superChatMessage]);
    setTotalSuperChats(prev => prev + amount);
    setShowSuperChatModal(false);
    toast.success(`Super Chat sent! $${amount}`);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? 'Unsubscribed!' : 'Subscribed! 🎉');
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
    toast.success('Liked! ❤️');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto">
        {/* Main Video Player */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Container */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {/* Live Badge */}
              <Badge className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-600 text-white animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
              
              {/* Viewer Count */}
              <Badge className="absolute top-4 right-4 z-10 bg-black/70 text-white">
                <Users className="h-3 w-3 mr-1" />
                {viewers.toLocaleString()}
              </Badge>

              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
                muted={isMuted}
                autoPlay
                loop
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCreator ? (
                      <>
                        <Button
                          size="sm"
                          variant={streamStatus === 'live' ? 'destructive' : 'default'}
                          onClick={() => setStreamStatus(streamStatus === 'live' ? 'paused' : 'live')}
                        >
                          {streamStatus === 'live' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={cameraEnabled ? 'outline' : 'destructive'}
                          onClick={() => setCameraEnabled(!cameraEnabled)}
                        >
                          {cameraEnabled ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={micEnabled ? 'outline' : 'destructive'}
                          onClick={() => setMicEnabled(!micEnabled)}
                        >
                          {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={screenShare ? 'default' : 'outline'}
                          onClick={() => setScreenShare(!screenShare)}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">
                      {formatDuration(duration)}
                    </span>
                    <Button size="sm" variant="outline" onClick={toggleFullscreen}>
                      <Maximize className="h-4 w-4" />
                    </Button>
                    {isCreator && (
                      <Button size="sm" variant="destructive" onClick={onEndStream}>
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stream Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{streamData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{viewers.toLocaleString()} watching</span>
                    <span>Started {formatDuration(duration)} ago</span>
                    <Badge variant="secondary">{streamData.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {streamData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={isSubscribed ? 'outline' : 'default'}
                    onClick={handleSubscribe}
                    className={isSubscribed ? '' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                  <Button variant="outline" onClick={handleLike}>
                    <Heart className={`h-4 w-4 mr-2 ${likes > streamData.viewers ? 'fill-current text-red-500' : ''}`} />
                    {likes}
                  </Button>
                  <Button variant="outline">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={streamData.creator.avatar}
                    alt={streamData.creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{streamData.creator.name}</h3>
                      {streamData.creator.verified && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {streamData.creator.subscribers.toLocaleString()} subscribers
                    </p>
                  </div>
                </div>
                
                {isCreator && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Super Chats</p>
                      <p className="font-semibold text-green-600">${totalSuperChats}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="text-muted-foreground">{streamData.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Chat */}
        <div className="lg:col-span-1">
          <Card className="h-[800px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
                {isCreator && (
                  <Button size="sm" variant="outline" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Chat Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{chatMessages.length} messages</span>
                <span>{viewers} viewers</span>
              </div>
            </CardHeader>

            {/* Messages Container */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div
                ref={chatContainerRef}
                className="h-full overflow-y-auto p-4 space-y-3"
                style={{ scrollBehavior: 'smooth' }}
              >
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`${
                        message.type === 'superchat'
                          ? 'p-3 rounded-lg border-l-4'
                          : message.type === 'emoji'
                          ? 'text-center'
                          : ''
                      }`}
                      style={{
                        backgroundColor: message.type === 'superchat' ? `${message.color}20` : undefined,
                        borderLeftColor: message.type === 'superchat' ? message.color : undefined
                      }}
                    >
                      {message.type === 'superchat' && (
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4" style={{ color: message.color }} />
                          <span className="font-bold" style={{ color: message.color }}>
                            ${message.amount} Super Chat
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        <img
                          src={message.user.avatar}
                          alt={message.user.name}
                          className="w-6 h-6 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="font-medium text-sm truncate">
                              {message.user.name}
                            </span>
                            {message.user.verified && (
                              <Star className="h-3 w-3 text-blue-500 flex-shrink-0" />
                            )}
                            {message.user.moderator && (
                              <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                            {message.user.subscriber && (
                              <Zap className="h-3 w-3 text-purple-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm break-words ${
                            message.type === 'emoji' ? 'text-2xl' : ''
                          }`}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>

            {/* Chat Input */}
            <div className="p-4 border-t bg-muted/50">
              {/* Emoji Panel */}
              <AnimatePresence>
                {showEmojiPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-3 p-3 bg-background rounded-lg border grid grid-cols-6 gap-2"
                  >
                    {EMOJI_LIST.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="text-lg"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSuperChatModal(true)}
                  className="flex-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Super Chat
                </Button>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={chatEnabled ? "Say something..." : "Chat is disabled"}
                  disabled={!chatEnabled || (subscribersOnly && !isSubscribed)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !chatEnabled || (subscribersOnly && !isSubscribed)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {subscribersOnly && !isSubscribed && (
                <p className="text-xs text-muted-foreground mt-2">
                  Subscribe to participate in chat
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Super Chat Modal */}
      <Dialog open={showSuperChatModal} onOpenChange={setShowSuperChatModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-500" />
              Send Super Chat
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {SUPERCHAT_TIERS.map((tier, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-12 text-sm"
                    style={{ borderColor: tier.color, color: tier.color }}
                    onClick={() => {
                      const message = prompt('Enter your message (optional):') || '';
                      handleSuperChat(tier.amount, message);
                    }}
                  >
                    ${tier.amount}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Super Chats help support the creator and highlight your message in the chat.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Settings Modal (Creator Only) */}
      {isCreator && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Chat</span>
                <Switch checked={chatEnabled} onCheckedChange={setChatEnabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Slow Mode</span>
                <Switch checked={slowMode} onCheckedChange={setSlowMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Subscribers Only</span>
                <Switch checked={subscribersOnly} onCheckedChange={setSubscribersOnly} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}