import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Zap,
  Eye,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

// ReelVideo interface definition
interface ReelVideo {
  id: string;
  url: string;
  thumbnail: string;
  thumbnailUrl?: string; // Support both naming conventions
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  music?: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
  };
  hashtags: string[];
  location?: string;
  duration: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

interface ReelsCarouselProps {
  reels: ReelVideo[];
  onReelClick?: (reel: ReelVideo) => void;
  onCreateReel?: () => void;
}

export function ReelsCarousel({ reels, onReelClick, onCreateReel }: ReelsCarouselProps) {
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Trending Reels</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Short-form content that's going viral
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View All
          </Button>
          <Button 
            onClick={onCreateReel}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {reels.slice(0, 12).map((reel, index) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onHoverStart={() => setHoveredReel(reel.id)}
            onHoverEnd={() => setHoveredReel(null)}
            onClick={() => onReelClick?.(reel)}
          >
            <Card className="overflow-hidden border-0 bg-black rounded-2xl aspect-[3/4] relative">
              {/* Thumbnail/Video */}
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={reel.thumbnailUrl || reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Play Button */}
                <AnimatePresence>
                  {hoveredReel === reel.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Creator Avatar */}
                <div className="absolute top-3 left-3">
                  <Avatar className="w-8 h-8 ring-2 ring-white/50">
                    <AvatarImage src={reel.creator.avatar} />
                    <AvatarFallback>{reel.creator.displayName[0]}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Duration */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                    <Clock className="w-2 h-2 mr-1" />
                    {reel.duration}s
                  </Badge>
                </div>

                {/* Stats */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(reel.stats.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatNumber(reel.stats.likes)}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-medium text-xs line-clamp-2 leading-tight">
                    {reel.title}
                  </h3>
                  
                  {/* Creator */}
                  <p className="text-white/80 text-xs mt-1 truncate">
                    @{reel.creator.username}
                  </p>
                </div>

                {/* Trending Indicator */}
                {reel.stats.views > 100000 && (
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs animate-pulse">
                      🔥 Trending
                    </Badge>
                  </div>
                )}

                {/* Music Info */}
                {reel.music && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-xs truncate">
                          {reel.music.title}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Actions */}
              <AnimatePresence>
                {hoveredReel === reel.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 flex items-end p-3"
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View More */}
      {reels.length > 12 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            View All {formatNumber(reels.length)} Reels
          </Button>
        </div>
      )}
    </div>
  );
}

// Mini Reels Widget for sidebar or smaller spaces
export function ReelsMiniWidget({ reels, onViewAll }: { 
  reels: ReelVideo[]; 
  onViewAll?: () => void; 
}) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-500" />
            Trending Reels
          </h3>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {reels.slice(0, 3).map((reel) => (
            <div key={reel.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                <img
                  src={reel.thumbnailUrl || reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1">{reel.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  @{reel.creator.username}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{formatNumber(reel.stats.views)} views</span>
                  <span>•</span>
                  <span>{reel.duration}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}