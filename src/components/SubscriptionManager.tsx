
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

import { Input } from './ui/input';
import { Bell, BellOff, Users, Search, Grid, List, Filter, MoreHorizontal, Play } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Channel {
  id: string;
  name: string;
  avatar?: string;
  subscribers: string;
  isSubscribed: boolean;
  hasNotifications: boolean;
  isLive?: boolean;
  category: string;
  joinDate: string;
  videosWatched: number;
  latestVideo?: {
    title: string;
    uploadDate: string;
    views: string;
    thumbnail?: string;
  };
}

interface SubscriptionManagerProps {
  onChannelClick?: (channelId: string) => void;
  onVideoClick?: (video: any) => void;
}

export function SubscriptionManager({ onChannelClick, onVideoClick }: SubscriptionManagerProps) {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'NatureVision',
      avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop&crop=face',
      subscribers: '2.5M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
      category: 'Nature',
      joinDate: '2023-01-15',
      videosWatched: 47,
      latestVideo: {
        title: 'Amazing 4K Wildlife Documentary',
        uploadDate: '2 days ago',
        views: '1.2M',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?w=200&h=120&fit=crop'
      }
    },
    {
      id: '2',
      name: 'TechReviewer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      subscribers: '1.8M',
      isSubscribed: true,
      hasNotifications: false,
      isLive: true,
      category: 'Technology',
      joinDate: '2023-03-20',
      videosWatched: 23,
      latestVideo: {
        title: 'Latest Gaming Laptop Review',
        uploadDate: '5 hours ago',
        views: '892K',
        thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=120&fit=crop'
      }
    },
    {
      id: '3',
      name: 'ChefMaster',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      subscribers: '3.1M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
      category: 'Cooking',
      joinDate: '2022-11-10',
      videosWatched: 89,
      latestVideo: {
        title: 'Italian Pasta Masterclass',
        uploadDate: '1 week ago',
        views: '456K',
        thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200&h=120&fit=crop'
      }
    },
    {
      id: '4',
      name: 'Wanderlust',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      subscribers: '4.2M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
      category: 'Travel',
      joinDate: '2023-05-08',
      videosWatched: 34,
      latestVideo: {
        title: 'Hidden Gems in Japan',
        uploadDate: '3 days ago',
        views: '2.1M',
        thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=120&fit=crop'
      }
    },
    {
      id: '5',
      name: 'FitLife',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
      subscribers: '1.5M',
      isSubscribed: true,
      hasNotifications: false,
      isLive: false,
      category: 'Fitness',
      joinDate: '2023-02-14',
      videosWatched: 12,
      latestVideo: {
        title: '30-Day Fitness Challenge Results',
        uploadDate: '4 days ago',
        views: '1.5M',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop'
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredChannels, setFilteredChannels] = useState(channels);

  useEffect(() => {
    let filtered = channels;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by active tab
    switch (activeTab) {
      case 'notifications':
        filtered = filtered.filter(channel => channel.hasNotifications);
        break;
      case 'live':
        filtered = filtered.filter(channel => channel.isLive);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        break;
      default:
        break;
    }

    setFilteredChannels(filtered);
  }, [channels, searchQuery, activeTab]);

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

  if (channels.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Your Subscriptions</h1>
        </div>
        
        <Card className="w-full">
          <CardContent className="p-12">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-3">No subscriptions yet</h3>
              <p className="text-muted-foreground mb-6">
                Start subscribing to channels to see their latest content and manage your subscriptions here
              </p>
              <Button>Discover Channels</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Your Subscriptions</h1>
          <Badge variant="secondary" className="text-sm">
            {channels.length} channels
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your subscriptions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All ({channels.length})</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications ({channels.filter(c => c.hasNotifications).length})
          </TabsTrigger>
          <TabsTrigger value="live">
            Live ({channels.filter(c => c.isLive).length})
          </TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="relative">
                                <Avatar 
                                  className="w-16 h-16 cursor-pointer" 
                                  onClick={() => onChannelClick?.(channel.id)}
                                >
                                  <AvatarImage src={channel.avatar} alt={channel.name} />
                                  <AvatarFallback>
                                    {channel.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {channel.isLive && (
                                  <Badge 
                                    variant="destructive" 
                                    className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5"
                                  >
                                    LIVE
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleNotifications(channel.id)}
                                className="h-8 w-8 p-0"
                              >
                                {channel.hasNotifications ? (
                                  <Bell className="h-4 w-4" />
                                ) : (
                                  <BellOff className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            
                            <div>
                              <h3 
                                className="font-semibold cursor-pointer hover:text-primary transition-colors"
                                onClick={() => onChannelClick?.(channel.id)}
                              >
                                {channel.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {channel.subscribers} subscribers
                              </p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {channel.category}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              <p>Joined: {new Date(channel.joinDate).toLocaleDateString()}</p>
                              <p>Videos watched: {channel.videosWatched}</p>
                            </div>
                            
                            {channel.latestVideo && (
                              <div className="border-t pt-3">
                                <p className="text-sm font-medium line-clamp-1 mb-1">
                                  Latest: {channel.latestVideo.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {channel.latestVideo.views} views • {channel.latestVideo.uploadDate}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleUnsubscribe(channel.id)}
                              >
                                Unsubscribe
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar 
                                className="w-12 h-12 cursor-pointer" 
                                onClick={() => onChannelClick?.(channel.id)}
                              >
                                <AvatarImage src={channel.avatar} alt={channel.name} />
                                <AvatarFallback>
                                  {channel.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {channel.isLive && (
                                <Badge 
                                  variant="destructive" 
                                  className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5"
                                >
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 
                                    className="font-semibold cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => onChannelClick?.(channel.id)}
                                  >
                                    {channel.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {channel.subscribers} subscribers • {channel.category}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Joined {new Date(channel.joinDate).toLocaleDateString()} • {channel.videosWatched} videos watched
                                  </p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleNotifications(channel.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {channel.hasNotifications ? (
                                      <Bell className="h-4 w-4" />
                                    ) : (
                                      <BellOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUnsubscribe(channel.id)}
                                  >
                                    Unsubscribe
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {channel.latestVideo && (
                                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-start space-x-3">
                                    {channel.latestVideo.thumbnail && (
                                      <img
                                        src={channel.latestVideo.thumbnail}
                                        alt={channel.latestVideo.title}
                                        className="w-24 h-14 object-cover rounded cursor-pointer"
                                        onClick={() => onVideoClick?.(channel.latestVideo)}
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                                        {channel.latestVideo.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {channel.latestVideo.views} views • {channel.latestVideo.uploadDate}
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {filteredChannels.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No channels found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try different search terms' : 'No channels match the current filter'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

