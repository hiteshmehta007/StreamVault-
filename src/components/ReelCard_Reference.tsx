import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, CheckCircle, Eye, Play, MoreVertical, Bookmark, Volume2, VolumeX, Send } from "lucide-react";
import { Reel } from "../types";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  onLike: (id: string) => void;
  onFollow: (userId: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

export function ReelCard({ reel, isActive, onLike, onFollow, onComment, onShare }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing);
  const [likesCount, setLikesCount] = useState(reel.stats.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
    onLike(reel.id);
    
    if (newLikedState) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(reel.creator.id);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  useEffect(() => {
    setIsLiked(reel.isLiked);
    setIsFollowing(reel.isFollowing);
    setLikesCount(reel.stats.likes);
  }, [reel.id, reel.isLiked, reel.isFollowing, reel.stats.likes]);

  return (
    <div className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-black overflow-hidden">
      {/* Video/Image Background */}
      <div
        ref={videoRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
        onDoubleClick={handleDoubleTap}
        onClick={() => setShowInfo(!showInfo)}
      >
        {/* Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-40% to-black/90" />
      </div>

      {/* Double Tap Like Animation */}
      <AnimatePresence>
        {showLikeAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-28 h-28 fill-white text-white drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 backdrop-blur-xl bg-black/40 rounded-full px-4 py-2.5 border border-white/10"
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                  <span className="text-white">For You</span>
                </motion.div>
                {reel.creator.isLive && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 gap-2 px-3 py-2 h-auto">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                      </span>
                      LIVE
                    </Badge>
                  </motion.div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10 rounded-full backdrop-blur-xl bg-black/40 border border-white/10 w-10 h-10"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
              <div className="flex items-end gap-3">
                {/* Left Side - Creator Info & Caption */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* Creator Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <button className="relative flex-shrink-0 group">
                      <Avatar className="w-14 h-14 border-2 border-white ring-4 ring-white/20 transition-all group-hover:ring-white/40">
                        <AvatarImage src={reel.creator.avatar} alt={reel.creator.username} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {reel.creator.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {!isFollowing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow();
                          }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-3 border-black shadow-lg"
                        >
                          <span className="text-white leading-none pb-0.5">+</span>
                        </motion.button>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button className="text-white hover:text-white/80 transition-colors truncate max-w-[180px]">
                          @{reel.creator.username}
                        </button>
                        {reel.creator.isVerified && (
                          <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      {reel.creator.isLive && reel.creator.viewerCount && (
                        <div className="flex items-center gap-1.5 text-sm text-red-400 mt-0.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{formatCount(reel.creator.viewerCount)} watching</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Caption */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <p className="text-white leading-relaxed line-clamp-2 drop-shadow-lg">
                      {reel.caption}
                    </p>
                  </motion.div>

                  {/* Category & Stream Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1.5">
                      {reel.category}
                    </Badge>
                    
                    {reel.clipTimestamp && (
                      <div className="flex items-center gap-1.5 text-white/90 backdrop-blur-xl bg-black/40 rounded-full px-3 py-1.5 border border-white/10">
                        <Play className="w-3 h-3" />
                        <span className="text-sm">{reel.clipTimestamp}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Watch Full VOD Button */}
                  {reel.streamId && (
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-full px-4 py-2.5 border border-white/20 transition-all group"
                    >
                      <Play className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      <span className="text-white text-sm">Watch Full Stream</span>
                    </motion.button>
                  )}
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex flex-col items-center gap-5 pb-2">
                  {/* Like Button */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                      }}
                      className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all shadow-lg"
                    >
                      <Heart
                        className={`w-7 h-7 transition-all ${
                          isLiked 
                            ? "fill-red-500 text-red-500 scale-110" 
                            : "text-white"
                        }`}
                      />
                    </motion.button>
                    <span className="text-white drop-shadow-lg">
                      {formatCount(likesCount)}
                    </span>
                  </motion.div>

                  {/* Comment Button */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onComment(reel.id);
                      }}
                      className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all shadow-lg"
                    >
                      <MessageCircle className="w-7 h-7 text-white" />
                    </motion.button>
                    <span className="text-white drop-shadow-lg">
                      {formatCount(reel.stats.comments)}
                    </span>
                  </motion.div>

                  {/* Share Button */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(reel.id);
                      }}
                      className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all shadow-lg"
                    >
                      <Send className="w-6 h-6 text-white" />
                    </motion.button>
                    <span className="text-white drop-shadow-lg">
                      {formatCount(reel.stats.shares)}
                    </span>
                  </motion.div>

                  {/* Creator Avatar (Bottom) */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                    className="mt-2"
                  >
                    <button className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg hover:scale-110 transition-transform">
                      <img 
                        src={reel.creator.avatar} 
                        alt={reel.creator.username}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume Control - Always Visible */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute top-20 right-4 w-12 h-12 rounded-full backdrop-blur-xl bg-black/40 hover:bg-black/50 border border-white/20 flex items-center justify-center transition-all z-20 shadow-lg"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: isActive ? "100%" : "0%" }}
          transition={{ duration: reel.duration, ease: "linear" }}
        />
      </div>
    </div>
  );
}
