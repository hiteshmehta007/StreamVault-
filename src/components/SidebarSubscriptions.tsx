
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from './ui/sidebar';
import { Bell, BellOff, Users, ChevronRight, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Channel {
  id: string;
  name: string;
  avatar?: string;
  subscribers: string;
  isSubscribed: boolean;
  hasNotifications: boolean;
  isLive?: boolean;
}

interface SidebarSubscriptionsProps {
  onChannelClick?: (channelId: string) => void;
  onViewAllClick?: () => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function SidebarSubscriptions({ 
  onChannelClick, 
  onViewAllClick, 
  currentPage,
  onPageChange 
}: SidebarSubscriptionsProps) {
  const [channels] = useState<Channel[]>([
    {
      id: '1',
      name: 'NatureVision',
      avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=50&h=50&fit=crop&crop=face',
      subscribers: '2.5M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
    },
    {
      id: '2',
      name: 'TechReviewer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      subscribers: '1.8M',
      isSubscribed: true,
      hasNotifications: false,
      isLive: true,
    },
    {
      id: '3',
      name: 'ChefMaster',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
      subscribers: '3.1M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
    },
    {
      id: '4',
      name: 'Wanderlust',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      subscribers: '4.2M',
      isSubscribed: true,
      hasNotifications: true,
      isLive: false,
    },
    {
      id: '5',
      name: 'FitLife',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face',
      subscribers: '1.5M',
      isSubscribed: true,
      hasNotifications: false,
      isLive: false,
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  const displayChannels = isExpanded ? channels : channels.slice(0, 3);
  const liveChannels = channels.filter(channel => channel.isLive);

  const handleChannelClick = (channelId: string) => {
    if (onChannelClick) {
      onChannelClick(channelId);
    } else {
      toast.info(`Navigate to channel: ${channelId}`);
    }
  };

  const handleViewAll = () => {
    if (onPageChange) {
      onPageChange('subscriptions');
    } else if (onViewAllClick) {
      onViewAllClick();
    } else {
      toast.info('Navigate to subscriptions page');
    }
  };

  if (channels.length === 0) {
    return (
      <>
        <SidebarMenuItem>
          <div className="px-2 py-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-sidebar-foreground/70" />
              <span className="text-sm font-semibold text-sidebar-foreground">
                Subscriptions
              </span>
            </div>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <div className="px-4 py-6 text-center space-y-3">
            <Users className="h-8 w-8 mx-auto text-muted-foreground/60" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">No subscriptions yet</p>
              <p className="text-xs text-muted-foreground/80">Find channels to follow</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 w-full"
              onClick={handleViewAll}
            >
              Discover Channels
            </Button>
          </div>
        </SidebarMenuItem>
      </>
    );
  }

  return (
    <>
      {/* Subscriptions Header */}
      <SidebarMenuItem>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-between px-2 py-2"
        >
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-sidebar-foreground/70" />
            <span className="text-sm font-semibold text-sidebar-foreground">
              Subscriptions
            </span>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
              {channels.length}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {liveChannels.length > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="destructive" className="text-xs px-2 py-0.5 flex items-center space-x-1 rounded-full">
                  <Circle className="h-2 w-2 fill-current" />
                  <span>{liveChannels.length} LIVE</span>
                </Badge>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-muted/80"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Show less' : 'Show all'}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>
        </motion.div>
      </SidebarMenuItem>

      {/* Subscribed Channels List */}
      <SidebarMenuSub className="ml-0">
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 'auto',
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {displayChannels.map((channel, index) => (
            <SidebarMenuSubItem key={channel.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 1.1 + (index * 0.1),
                  duration: 0.4 
                }}
                whileHover={{ x: 3 }}
              >
                <SidebarMenuSubButton
                  onClick={() => handleChannelClick(channel.id)}
                  className="relative group h-auto py-2 px-2"
                >
                  <div className="flex items-center space-x-3 w-full min-h-[40px]">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={channel.avatar} alt={channel.name} />
                        <AvatarFallback className="text-xs font-medium">
                          {channel.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {channel.isLive && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -top-1 -right-1"
                        >
                          <div className="h-3 w-3 bg-red-500 rounded-full border-2 border-background shadow-sm" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate leading-tight">
                          {channel.name}
                        </p>
                        {channel.isLive && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0 leading-tight">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {channel.subscribers} subscribers
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
                      {channel.hasNotifications ? (
                        <Bell className="h-3 w-3 text-primary" />
                      ) : (
                        <BellOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </SidebarMenuSubButton>
              </motion.div>
            </SidebarMenuSubItem>
          ))}
        </motion.div>
      </SidebarMenuSub>

      {/* Show More/Less Button */}
      {channels.length > 3 && (
        <SidebarMenuItem>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="px-2 py-1"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 h-8"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                <ChevronRight className="h-3 w-3" />
              </motion.div>
              <span>
                {isExpanded 
                  ? 'Show less channels' 
                  : `Show ${channels.length - 3} more channels`
                }
              </span>
            </Button>
          </motion.div>
        </SidebarMenuItem>
      )}

      {/* View All Subscriptions */}
      <SidebarMenuItem>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="px-2 py-1"
        >
          <SidebarMenuButton
            onClick={handleViewAll}
            isActive={currentPage === 'subscriptions'}
            className="text-sm font-medium relative h-9 hover:bg-muted/80"
          >
            <Users className="h-4 w-4" />
            <span>Manage All</span>
            {currentPage === 'subscriptions' && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                layoutId="subscriptionIndicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </SidebarMenuButton>
        </motion.div>
      </SidebarMenuItem>
    </>
  );
}

