
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { CheckCircle, Eye, Play, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState } from 'react';

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
  isLive?: boolean;
  isPremiere?: boolean;
  category?: string;
  watchProgress?: number; // 0-100 percentage
}

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  onDownload?: () => void;
  onChannelClick?: (channelName: string) => void;
  isTheaterMode?: boolean;
  isSelected?: boolean;
}

export function VideoCard({ video, onClick, onChannelClick, isTheaterMode = false, isSelected = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Theater mode sizing: 1202.520px × 505.568px
  const getCardSizeClasses = () => {
    if (isTheaterMode) {
      return "w-[1202.520px] h-[505.568px] max-w-none";
    }
    return "w-full";
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent video click when clicking channel
    onChannelClick?.(video.channel.name);
  };

  const formatViews = (views: string) => {
    const num = parseInt(views.replace(/,/g, ''));
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return views;
  };

  const getTimeSinceUpload = (uploadDate: string) => {
    // Simple time formatting for demo
    if (uploadDate.includes('hour')) return uploadDate.replace(' ago', '');
    if (uploadDate.includes('day')) return uploadDate.replace(' ago', '');
    if (uploadDate.includes('week')) return uploadDate.replace(' ago', '');
    return uploadDate.replace(' ago', '');
  };

  const formatTimeAgo = (uploadDate: string) => {
    // Enhanced time formatting like YouTube
    const now = new Date();
    const uploadTime = new Date(uploadDate);
    const diffInHours = Math.floor((now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  const isNewUpload = (uploadDate: string) => {
    // Check if video was uploaded in the last 24 hours
    const now = new Date();
    const uploadTime = new Date(uploadDate);
    const diffInHours = (now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-pointer group ${getCardSizeClasses()} bg-card rounded-lg p-2 transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary bg-primary/5 border-primary/20 shadow-primary/10 shadow-lg' 
          : 'hover:bg-accent/50 hover:shadow-lg'
      }`}
    >
      <div className="flex flex-col space-y-4">
        {/* YouTube-style enhanced thumbnail with advanced features */}
        <div className={`relative w-full ${isTheaterMode ? 'aspect-[2.37/1] h-[300px]' : 'aspect-video'} rounded-lg overflow-hidden bg-muted shadow-sm`}>
          <ImageWithFallback
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
          />
          
          {/* YouTube-style duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
            {video.duration}
          </div>
          
          {/* Enhanced play button overlay with YouTube styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
          >
            <div className="bg-black/80 backdrop-blur-sm rounded-full p-4 shadow-2xl border border-white/20">
              <Play className="w-7 h-7 text-white fill-white ml-0.5" />
            </div>
          </motion.div>

          {/* Enhanced quality indicator */}
          {video.quality && video.quality.length > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 font-bold border-0 shadow-lg">
                {video.quality.includes('2160p') ? '4K' : 
                 video.quality.includes('1440p') ? '1440p' :
                 video.quality.includes('1080p') ? 'HD' : 'SD'}
              </Badge>
            </div>
          )}

          {/* Live indicator for live streams */}
          {video.isLive && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-600 text-white text-xs px-2 py-1 font-bold border-0 shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
          )}

          {/* New upload indicator */}
          {isNewUpload(video.uploadDate) && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1 font-bold border-0 shadow-lg">
                NEW
              </Badge>
            </div>
          )}

          {/* Watch progress indicator */}
          {video.watchProgress && video.watchProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div 
                className={`h-full bg-red-600 transition-all duration-300`}
                style={{ width: `${Math.min(video.watchProgress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Enhanced video info section with better readability */}
        <div className={`flex gap-3 px-1 ${isTheaterMode ? 'p-4' : ''}`}>
          {/* Larger, more prominent channel avatar */}
          <Avatar 
            className={`${isTheaterMode ? 'w-16 h-16' : 'w-11 h-11'} mt-0.5 flex-shrink-0 ring-2 ring-background shadow-sm cursor-pointer hover:ring-primary/50 transition-all duration-200`}
            onClick={handleChannelClick}
          >
            {video.channel.avatar ? (
              <AvatarImage 
                src={video.channel.avatar} 
                alt={video.channel.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                {video.channel.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Enhanced video details with YouTube-inspired layout */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* YouTube-style video title with trending indicator */}
            <div className="flex items-start gap-2">
              <h3 className={`font-semibold ${isTheaterMode ? 'text-xl' : 'text-base'} line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 leading-tight flex-1`}>
                {video.title}
              </h3>
              {(video as any).trending && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 bg-red-600 hover:bg-red-700 flex-shrink-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            
            {/* Enhanced channel name with verification badge */}
            <div className="flex items-center gap-1.5">
              <p 
                className={`${isTheaterMode ? 'text-base' : 'text-sm'} font-medium text-muted-foreground/90 hover:text-foreground transition-colors duration-200 cursor-pointer`}
                onClick={handleChannelClick}
              >
                {video.channel.name}
              </p>
              {(video as any).verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            
            {/* YouTube-style metadata with enhanced formatting */}
            <div className={`flex items-center gap-2 ${isTheaterMode ? 'text-base' : 'text-sm'} text-muted-foreground`}>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-medium">{formatViews(video.views)} views</span>
              </div>
              <span className="text-muted-foreground/60">•</span>
              <span className="font-medium">{formatTimeAgo(video.uploadDate)}</span>
              {(video as any).category && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-accent/50">
                    {(video as any).category}
                  </Badge>
                </>
              )}
            </div>

            {/* Tags for better discoverability */}
            {(video as any).tags && (video as any).tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {(video as any).tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>


        </div>
      </div>
    </motion.div>
  );
}

