
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Bell, BellOff, Users, MoreHorizontal, Play, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'motion/react';

interface Channel {
  id: string;
  name: string;
  avatar?: string;
  subscribers: string;
  isSubscribed: boolean;
  hasNotifications: boolean;
  isLive?: boolean;
  latestVideo?: {
    title: string;
    uploadDate: string;
    views: string;
    thumbnail?: string;
  };
}

interface SubscriptionBlockProps {
  onChannelClick?: (channelId: string) => void;
  onViewAllClick?: () => void;
  compact?: boolean;
}

export function SubscriptionBlock({ 
  onChannelClick, 
  onViewAllClick, 
  compact = false 
}: SubscriptionBlockProps) {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'NatureVision',
      avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop&crop=face',
      subscribers: '2.5M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
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
      latestVideo: {
        title: '30-Day Fitness Challenge Results',
        uploadDate: '4 days ago',
        views: '1.5M',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop'
      }
    }
  ]);

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

  const handleUnsubscribe = (_channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== _channelId));
    const channel = channels.find(c => c.id === _channelId);
    toast.success(`Unsubscribed from ${channel?.name}`);
  };

  const displayChannels = compact ? channels.slice(0, 3) : channels;

  if (channels.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
            <p className="text-muted-foreground">
              Subscribe to channels to see their latest content here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>Your Subscriptions</CardTitle>
            <Badge variant="secondary">{channels.length}</Badge>
          </div>
          {compact && onViewAllClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAllClick}
              className="text-sm"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-0">
          {displayChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={compact ? { opacity: 0, y: 20 } : undefined}
              animate={compact ? { opacity: 1, y: 0 } : undefined}
              transition={compact ? { delay: index * 0.1 } : undefined}
            >
              <div className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 cursor-pointer" onClick={() => onChannelClick?.(channel.id)}>
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback>
                        {channel.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {channel.isLive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1"
                      >
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          LIVE
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 
                          className="font-medium cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onChannelClick?.(channel.id)}
                        >
                          {channel.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {channel.subscribers} subscribers
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNotifications(channel.id)}
                          className="h-8 w-8 p-0"
                        >
                          {channel.hasNotifications ? (
                            <Bell className="h-3 w-3" />
                          ) : (
                            <BellOff className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {channel.latestVideo && !compact && (
                      <div className="flex items-start space-x-2 mt-2">
                        {channel.latestVideo.thumbnail && (
                          <div className="relative">
                            <img
                              src={channel.latestVideo.thumbnail}
                              alt={channel.latestVideo.title}
                              className="w-20 h-12 object-cover rounded cursor-pointer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer rounded">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-1">
                          <p className="text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                            {channel.latestVideo.title}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {channel.latestVideo.views} views • {channel.latestVideo.uploadDate}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {index < displayChannels.length - 1 && <Separator />}
            </motion.div>
          ))}
        </div>
        
        {!compact && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Manage your subscriptions</span>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

