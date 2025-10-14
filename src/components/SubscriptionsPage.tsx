
import { useState } from 'react';
import { Grid3X3, List, Filter, Bell, SortDesc, Flame, TrendingUp, BellOff, MoreHorizontal, Flag, ThumbsUp, ThumbsDown, Share2, MessageCircle, ChevronRight, UserPlus, DollarSign, Gift, Heart, Bookmark, Clock, Play } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

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
    isVerified?: boolean;
  };
  quality: string[];
  category?: string;
  description?: string;
  tags?: string[];
  isLive?: boolean;
  isPremiere?: boolean;
  watchProgress?: number;
}

interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  isSubscribed: boolean;
  hasNotifications: boolean;
  isVerified: boolean;
  newVideosCount?: number;
  lastUpload?: string;
  latestVideo?: {
    title: string;
    uploadDate: string;
    views: string;
    thumbnail?: string;
  };
}

interface SubscriptionsPageProps {
  onVideoClick: (video: Video) => void;
  onChannelClick?: (channelName: string) => void;
}

export function SubscriptionsPage({ onVideoClick, onChannelClick }: SubscriptionsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  // Removed useQueue as it's not available
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [dislikedVideos, setDislikedVideos] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');
  const [superChatAmount, setSuperChatAmount] = useState('');
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'NatureVision',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      subscribers: '2.5M',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      newVideosCount: 3,
      lastUpload: '2 days ago',
      latestVideo: {
        title: 'Amazing 4K Wildlife Documentary - Rare Species Discovered',
        uploadDate: '2 days ago',
        views: '1.2M',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=300'
      }
    },
    {
      id: '2',
      name: 'TechReviewer Pro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      subscribers: '1.8M',
      isSubscribed: true,
      hasNotifications: false,
      isVerified: true,
      newVideosCount: 1,
      lastUpload: '5 hours ago',
      latestVideo: {
        title: 'Latest Gaming Laptop Review - RTX 4090 Beast Mode!',
        uploadDate: '5 hours ago',
        views: '892K',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=300'
      }
    },
    {
      id: '3',
      name: 'ChefMaster Kitchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      subscribers: '3.1M',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      newVideosCount: 2,
      lastUpload: '1 week ago',
      latestVideo: {
        title: 'Italian Pasta Masterclass - Authentic Recipes Revealed',
        uploadDate: '1 week ago',
        views: '456K',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=300'
      }
    },
    {
      id: '4',
      name: 'Wanderlust Adventures',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      subscribers: '4.2M',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      newVideosCount: 5,
      lastUpload: '3 days ago',
      latestVideo: {
        title: 'Hidden Gems in Japan - Secret Places Locals Love',
        uploadDate: '3 days ago',
        views: '2.1M',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=300'
      }
    },
    {
      id: '5',
      name: 'FitLife Transformation',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      subscribers: '1.5M',
      isSubscribed: true,
      hasNotifications: false,
      isVerified: false,
      newVideosCount: 0,
      lastUpload: '4 days ago',
      latestVideo: {
        title: '30-Day Fitness Challenge Results - Incredible Transformation',
        uploadDate: '4 days ago',
        views: '1.5M',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=300'
      }
    }
  ]);

  const recentVideos = [
    {
      id: 'sub1',
      title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '12:45',
      views: '1,234,567',
      uploadDate: '2024-01-15T10:30:00Z',
      channel: { name: 'NatureVision', isVerified: true },
      quality: ['2160p', '1440p', '1080p', '720p', '480p'],
      category: 'documentary',
      trending: true,
      verified: true,
      tags: ['nature', '4K', 'documentary', 'wildlife']
    },
    {
      id: 'sub2',
      title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '18:32',
      views: '892,341',
      uploadDate: '2024-01-20T14:20:00Z',
      channel: { name: 'TechReviewer Pro', isVerified: true },
      quality: ['1440p', '1080p', '720p', '480p'],
      category: 'technology',
      verified: true,
      watchProgress: 45,
      tags: ['tech', 'gaming', 'laptop', 'review']
    },
    {
      id: 'sub3',
      title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '32:45',
      views: '2,187,654',
      uploadDate: '2024-01-18T09:15:00Z',
      channel: { name: 'Wanderlust Adventures', isVerified: true },
      quality: ['2160p', '1440p', '1080p', '720p'],
      category: 'travel',
      verified: true,
      tags: ['japan', 'travel', 'vlog', 'explore']
    },
  ];

  const toggleNotifications = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, hasNotifications: !channel.hasNotifications }
        : channel
    ));
    
    const channel = channels.find(c => c.id === channelId);
    toast.success(
      `Notifications ${channel?.hasNotifications ? 'disabled' : 'enabled'} for ${channel?.name}`
    );
  };

  const handleUnsubscribe = (channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    const channel = channels.find(c => c.id === channelId);
    toast.success(`Unsubscribed from ${channel?.name}`);
  };

  const handleDownload = (video: any) => {
    toast.success(`Started downloading "${video.title}"`);
  };

  const handleChannelClick = (channelId: string) => {
    toast.info(`Navigate to ${channels.find(c => c.id === channelId)?.name} channel`);
  };

  // Video interaction handlers
  const handleSaveVideo = (videoId: string) => {
    setSavedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
    toast.success(
      savedVideos.includes(videoId) ? 'Removed from saved videos' : 'Video saved to Watch Later'
    );
  };

  const handleLikeVideo = (videoId: string) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
    setDislikedVideos(prev => prev.filter(id => id !== videoId));
    toast.success(likedVideos.includes(videoId) ? 'Like removed' : 'Video liked!');
  };

  const handleDislikeVideo = (videoId: string) => {
    setDislikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
    setLikedVideos(prev => prev.filter(id => id !== videoId));
    toast.success(dislikedVideos.includes(videoId) ? 'Dislike removed' : 'Feedback recorded');
  };

  const handleComment = () => {
    if (commentText.trim()) {
      toast.success('Comment posted successfully!');
      setCommentText('');
    }
  };

  const handleSuperChat = (channelId: string) => {
    if (superChatAmount && superChatMessage.trim()) {
      const channel = channels.find(c => c.id === channelId);
      toast.success(
        `Super Chat sent! $${superChatAmount} to ${channel?.name}`,
        {
          description: superChatMessage,
          duration: 5000,
        }
      );
      setSuperChatAmount('');
      setSuperChatMessage('');
    }
  };

  const handleReport = (type: 'video' | 'channel') => {
    if (reportReason && reportDetails.trim()) {
      toast.success(`${type === 'video' ? 'Video' : 'Channel'} reported. Thank you for helping keep our community safe.`);
      setReportReason('');
      setReportDetails('');
    }
  };

  const handleShare = (videoId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* YouTube-style Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-600" />
              Subscriptions
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortDesc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {/* Channel Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto p-1">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="today" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="unwatched" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Unwatched
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Quick Channel Access - YouTube Style */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your channels</h2>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-muted hover:ring-primary transition-all">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {channel.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {channel.newVideosCount && channel.newVideosCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                        {channel.newVideosCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium mt-2 text-center max-w-[64px] truncate">
                    {channel.name}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* ScrollBar removed - not available in ScrollArea */}
          </ScrollArea>
        </div>

        {/* Channel Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Manage subscriptions</h2>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Browse channels
            </Button>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{channel.name}</h3>
                        {channel.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {channel.subscribers} subscribers • Last upload {channel.lastUpload}
                      </p>
                      {channel.latestVideo && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          Latest: {channel.latestVideo.title}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Super Chat Support Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Support
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Gift className="w-5 h-5 text-green-600" />
                              Support {channel.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Amount ($)</Label>
                              <Select value={superChatAmount} onValueChange={setSuperChatAmount}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose amount" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">$5</SelectItem>
                                  <SelectItem value="10">$10</SelectItem>
                                  <SelectItem value="25">$25</SelectItem>
                                  <SelectItem value="50">$50</SelectItem>
                                  <SelectItem value="100">$100</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="message">Support Message</Label>
                              <Textarea
                                placeholder="Send a message of support to the creator..."
                                value={superChatMessage}
                                onChange={(e) => setSuperChatMessage(e.target.value)}
                                maxLength={200}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {superChatMessage.length}/200 characters
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => handleSuperChat(channel.id)}
                              disabled={!superChatAmount || !superChatMessage.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              Send Super Chat
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Notification Toggle */}
                      <Button
                        variant={channel.hasNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleNotifications(channel.id)}
                      >
                        {channel.hasNotifications ? (
                          <Bell className="w-4 h-4" />
                        ) : (
                          <BellOff className="w-4 h-4" />
                        )}
                      </Button>

                      {/* Channel Options Menu */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Channel Options</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => handleUnsubscribe(channel.id)}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Unsubscribe
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-red-600">
                                  <Flag className="w-4 h-4 mr-2" />
                                  Report Channel
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Report Channel</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Reason for reporting</Label>
                                    <Select value={reportReason} onValueChange={setReportReason}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="spam">Spam or misleading content</SelectItem>
                                        <SelectItem value="harassment">Harassment or cyberbullying</SelectItem>
                                        <SelectItem value="hateful">Hateful or abusive content</SelectItem>
                                        <SelectItem value="copyright">Copyright infringement</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Additional details</Label>
                                    <Textarea
                                      placeholder="Please provide more information..."
                                      value={reportDetails}
                                      onChange={(e) => setReportDetails(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReport('channel')}
                                    disabled={!reportReason || !reportDetails.trim()}
                                  >
                                    Submit Report
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Latest Videos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest from your subscriptions</h2>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Play all
            </Button>
          </div>
          
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {recentVideos.map((video) => (
              <div key={video.id} className="group">
                <VideoCard
                  video={video as any}
                  onClick={() => onVideoClick(video)}
                  onDownload={() => handleDownload(video)}
                  onChannelClick={onChannelClick}
                />
                
                {/* Enhanced Video Interaction Bar */}
                <div className="mt-3 flex items-center justify-between p-2 bg-card rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-2">
                    {/* Like/Dislike */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeVideo(video.id)}
                      className={likedVideos.includes(video.id) ? 'text-green-600' : ''}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislikeVideo(video.id)}
                      className={dislikedVideos.includes(video.id) ? 'text-red-600' : ''}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    
                    {/* Save Video */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveVideo(video.id)}
                      className={savedVideos.includes(video.id) ? 'text-blue-600' : ''}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    
                    {/* Share */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(video.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Comments Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Comments</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="max-h-60 overflow-y-auto space-y-3">
                            {/* Sample Comments */}
                            <div className="flex gap-3 p-3 bg-muted rounded-lg">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">User123</p>
                                <p className="text-sm text-muted-foreground">Great video! Really helpful content.</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    12
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex justify-end">
                              <Button 
                                size="sm"
                                onClick={() => handleComment()}
                                disabled={!commentText.trim()}
                              >
                                Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Report Video */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Video</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Reason for reporting</Label>
                            <Select value={reportReason} onValueChange={setReportReason}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                                <SelectItem value="spam">Spam or misleading</SelectItem>
                                <SelectItem value="copyright">Copyright violation</SelectItem>
                                <SelectItem value="violence">Violence or harmful content</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Additional details</Label>
                            <Textarea
                              placeholder="Please describe the issue..."
                              value={reportDetails}
                              onChange={(e) => setReportDetails(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="destructive"
                            onClick={() => handleReport('video')}
                            disabled={!reportReason || !reportDetails.trim()}
                          >
                            Submit Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

