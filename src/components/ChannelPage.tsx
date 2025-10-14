import { useState, useEffect } from 'react';
import { useQueue } from './QueueProvider';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VideoCard } from './VideoCard';
import {
  Bell,
  BellOff,
  Users,
  Play,
  ListVideo,
  Info,
  Share,
  MoreHorizontal,
  CheckCircle,
  Calendar,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ChannelPageProps {
  channelId: string;
  onBack: () => void;
  onVideoClick?: (video: any) => void;
}

interface ChannelData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribers: string;
  videosCount: string;
  description: string;
  isSubscribed: boolean;
  hasNotifications: boolean;
  isVerified: boolean;
  joinDate: string;
  totalViews: string;
  isLive?: boolean;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  description?: string;
}

export function ChannelPage({ channelId, onBack, onVideoClick }: ChannelPageProps) {
  const { addToQueue } = useQueue();
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [isLoading, setIsLoading] = useState(true);

  // Mock channel data - in a real app, this would come from an API
  const mockChannels: Record<string, ChannelData> = {
    '1': {
      id: '1',
      name: 'NatureVision',
      handle: '@naturevision',
      avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&h=120&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop',
      subscribers: '2.5M',
      videosCount: '1,247',
      description: 'Exploring the wonders of nature through breathtaking cinematography. Join us on incredible journeys to the most beautiful places on Earth. New videos every Tuesday and Friday!',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      joinDate: 'Mar 15, 2020',
      totalViews: '487M',
      isLive: false
    },
    '2': {
      id: '2',
      name: 'TechReviewer',
      handle: '@techreviewer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop',
      subscribers: '1.8M',
      videosCount: '892',
      description: 'In-depth reviews of the latest tech gadgets, smartphones, laptops, and more. Honest opinions and detailed analysis to help you make informed decisions.',
      isSubscribed: true,
      hasNotifications: false,
      isVerified: true,
      joinDate: 'Aug 22, 2019',
      totalViews: '234M',
      isLive: true
    },
    '3': {
      id: '3',
      name: 'ChefMaster',
      handle: '@chefmaster',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop',
      subscribers: '3.1M',
      videosCount: '1,156',
      description: 'Professional cooking tutorials, recipe guides, and culinary adventures. Learn to cook like a master chef with step-by-step instructions.',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      joinDate: 'Jan 10, 2018',
      totalViews: '678M',
      isLive: false
    },
    '4': {
      id: '4',
      name: 'Wanderlust',
      handle: '@wanderlust',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=300&fit=crop',
      subscribers: '4.2M',
      videosCount: '1,789',
      description: 'Travel vlogs from around the world. Discover hidden gems, local cultures, and amazing destinations through immersive travel experiences.',
      isSubscribed: true,
      hasNotifications: true,
      isVerified: true,
      joinDate: 'Nov 5, 2017',
      totalViews: '892M',
      isLive: false
    },
    '5': {
      id: '5',
      name: 'FitLife',
      handle: '@fitlife',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop',
      subscribers: '1.5M',
      videosCount: '623',
      description: 'Fitness tutorials, workout routines, and healthy lifestyle tips. Transform your body and mind with our comprehensive fitness programs.',
      isSubscribed: true,
      hasNotifications: false,
      isVerified: true,
      joinDate: 'Apr 18, 2021',
      totalViews: '156M',
      isLive: false
    }
  };

  // Mock videos for the channel
  const mockVideos: Video[] = [
    {
      id: '1',
      title: 'Amazing Wildlife Documentary - Lions of Africa',
      thumbnail: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=320&h=180&fit=crop',
      duration: '24:15',
      views: '2.1M',
      uploadDate: '2 days ago',
      description: 'Journey into the heart of Africa to witness the majestic lions in their natural habitat.'
    },
    {
      id: '2',
      title: 'Ocean Depths: The Mysterious Deep Sea',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=320&h=180&fit=crop',
      duration: '18:42',
      views: '1.8M',
      uploadDate: '5 days ago',
      description: 'Explore the mysterious depths of our oceans and discover incredible marine life.'
    },
    {
      id: '3',
      title: 'Mountain Peaks: Climbing the Himalayas',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=180&fit=crop',
      duration: '31:28',
      views: '3.2M',
      uploadDate: '1 week ago',
      description: 'Join us on an epic journey to the roof of the world - the Himalayan mountain range.'
    },
    {
      id: '4',
      title: 'Rainforest Wonders: Amazon Expedition',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=320&h=180&fit=crop',
      duration: '26:33',
      views: '1.5M',
      uploadDate: '2 weeks ago',
      description: 'Venture deep into the Amazon rainforest and discover its incredible biodiversity.'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const channelData = mockChannels[channelId];
      if (channelData) {
        setChannel(channelData);
        setVideos(mockVideos);
      }
      setIsLoading(false);
    }, 800);
  }, [channelId]);

  const handleSubscribe = () => {
    if (!channel) return;
    
    const newSubscribedState = !channel.isSubscribed;
    setChannel(prev => prev ? { ...prev, isSubscribed: newSubscribedState } : null);
    
    toast.success(
      newSubscribedState 
        ? `Subscribed to ${channel.name}!` 
        : `Unsubscribed from ${channel.name}`
    );
  };

  const handleNotificationToggle = () => {
    if (!channel) return;
    
    const newNotificationState = !channel.hasNotifications;
    setChannel(prev => prev ? { ...prev, hasNotifications: newNotificationState } : null);
    
    toast.success(
      newNotificationState 
        ? `Notifications enabled for ${channel.name}` 
        : `Notifications disabled for ${channel.name}`
    );
  };

  const handleVideoClick = (video: Video) => {
    if (onVideoClick) {
      onVideoClick(video);
    }
    toast.info(`Playing: ${video.title}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <div className="flex items-center space-x-4 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading channel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <div className="flex items-center space-x-4 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">Channel not found</p>
            <p className="text-muted-foreground">The channel you're looking for doesn't exist.</p>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channel Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div 
          className="h-32 md:h-48 lg:h-64 bg-gradient-to-r from-primary/20 to-accent/20 bg-cover bg-center"
          style={channel.banner ? { backgroundImage: `url(${channel.banner})` } : undefined}
        />
      </motion.div>

      {/* Channel Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4 py-6 border-b"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="h-20 w-20 md:h-24 md:w-24">
            <AvatarImage src={channel.avatar} alt={channel.name} />
            <AvatarFallback className="text-2xl font-bold">
              {channel.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-bold">{channel.name}</h1>
              {channel.isVerified && (
                <CheckCircle className="h-6 w-6 text-primary" />
              )}
              {channel.isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground">{channel.handle}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{channel.subscribers} subscribers</span>
              </div>
              <div className="flex items-center space-x-1">
                <ListVideo className="h-4 w-4" />
                <span>{channel.videosCount} videos</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{channel.totalViews} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {channel.joinDate}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
              {channel.description}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSubscribe}
              variant={channel.isSubscribed ? "secondary" : "default"}
              className="min-w-[120px]"
            >
              {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
            
            {channel.isSubscribed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotificationToggle}
                className="flex items-center space-x-2"
              >
                {channel.hasNotifications ? (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>All</span>
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4" />
                    <span>None</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-1"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 bg-transparent border-b rounded-none h-12">
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center space-x-2">
              <ListVideo className="h-4 w-4" />
              <span>Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <VideoCard
                    video={{
                      ...video,
                      channel: {
                        name: channel.name,
                        avatar: channel.avatar
                      },
                      quality: ['1080p', '720p', '480p']
                    }}
                    onClick={() => handleVideoClick(video)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="mt-0 p-4">
            <div className="text-center py-12">
              <ListVideo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No public playlists</h3>
              <p className="text-muted-foreground">This channel hasn't created any public playlists yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-0 p-4">
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {channel.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Channel Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{channel.subscribers}</div>
                      <div className="text-sm text-muted-foreground">Subscribers</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{channel.totalViews}</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{channel.videosCount}</div>
                      <div className="text-sm text-muted-foreground">Videos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}