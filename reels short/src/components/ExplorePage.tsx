import { useState } from "react";
import { Search, TrendingUp, Flame, Users, Eye, Radio, Sparkles, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "live" | "clips">("all");

  const filters = [
    { id: "all" as const, label: "All", icon: Sparkles },
    { id: "live" as const, label: "Live", icon: Radio },
    { id: "clips" as const, label: "Clips", icon: TrendingUp },
  ];

  const liveChannels = [
    { 
      id: "1", 
      streamer: "ShroudFPS", 
      game: "VALORANT", 
      viewers: 45200, 
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      verified: true
    },
    { 
      id: "2", 
      streamer: "Pokimane", 
      game: "League of Legends", 
      viewers: 28900, 
      thumbnail: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=400",
      verified: true
    },
    { 
      id: "3", 
      streamer: "HasanAbi", 
      game: "Just Chatting", 
      viewers: 32100, 
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      verified: true
    },
  ];

  const gameCategories = [
    { name: "VALORANT", viewers: 245000, clips: "12.4K", color: "from-red-500 to-pink-600", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200" },
    { name: "Grand Theft Auto V", viewers: 189000, clips: "18.2K", color: "from-green-500 to-emerald-600", image: "https://images.unsplash.com/photo-1708714164655-862c7263d756?w=200" },
    { name: "Fortnite", viewers: 321000, clips: "24.8K", color: "from-blue-500 to-cyan-600", image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=200" },
    { name: "League of Legends", viewers: 198000, clips: "15.7K", color: "from-purple-500 to-violet-600", image: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=200" },
    { name: "Minecraft", viewers: 167000, clips: "22.1K", color: "from-green-600 to-lime-600", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200" },
    { name: "Just Chatting", viewers: 421000, clips: "31.5K", color: "from-pink-500 to-rose-600", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200" },
  ];

  const trendingClips = [
    {
      id: "1",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      views: "2.8M",
      creator: "ShroudFPS",
      game: "VALORANT",
    },
    {
      id: "2",
      thumbnail: "https://images.unsplash.com/photo-1708714164655-862c7263d756?w=400",
      views: "3.9M",
      creator: "xQc",
      game: "GTA V",
    },
    {
      id: "3",
      thumbnail: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400",
      views: "4.2M",
      creator: "Ninja",
      game: "Fortnite",
    },
    {
      id: "4",
      thumbnail: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=400",
      views: "2.9M",
      creator: "Pokimane",
      game: "League",
    },
    {
      id: "5",
      thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
      views: "1.8M",
      creator: "TommyInnit",
      game: "Minecraft",
    },
    {
      id: "6",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      views: "3.4M",
      creator: "HasanAbi",
      game: "Chatting",
    },
  ];

  const formatViewers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 space-y-6 pb-24">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-black/60 backdrop-blur-xl z-20 pt-4 pb-4 -mx-4 px-4 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white">Discover</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search games, creators, clips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 rounded-2xl"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = selectedFilter === filter.id;
                return (
                  <motion.button
                    key={filter.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Now Section */}
        {(selectedFilter === "all" || selectedFilter === "live") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </div>
                <h3 className="text-white">Live Now</h3>
              </div>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 h-auto p-0">
                View all
              </Button>
            </div>
            
            <div className="space-y-3">
              {liveChannels.map((channel, index) => (
                <motion.button
                  key={channel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                        <ImageWithFallback
                          src={channel.thumbnail}
                          alt={channel.streamer}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Badge className="absolute -top-1.5 -right-1.5 bg-red-600 text-white border-2 border-black text-[10px] px-2 h-5 animate-pulse shadow-lg">
                        LIVE
                      </Badge>
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white group-hover:text-purple-400 transition-colors truncate">
                          {channel.streamer}
                        </span>
                        {channel.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1.5 truncate">{channel.game}</p>
                      <div className="flex items-center gap-1.5 text-xs text-red-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{formatViewers(channel.viewers)} viewers</span>
                      </div>
                    </div>
                    
                    <Radio className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Categories */}
        {(selectedFilter === "all" || selectedFilter === "clips") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <h3 className="text-white">Top Categories</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {gameCategories.map((game, index) => (
                <motion.button
                  key={game.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative h-32 rounded-2xl overflow-hidden"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-40 group-hover:opacity-50 transition-opacity`} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full p-4 flex flex-col justify-end">
                    <h4 className="text-white mb-2 line-clamp-2 text-left">{game.name}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-purple-300">
                        <Users className="w-3 h-3" />
                        <span>{formatViewers(game.viewers)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-pink-300">
                        <TrendingUp className="w-3 h-3" />
                        <span>{game.clips} clips</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Clips */}
        {(selectedFilter === "all" || selectedFilter === "clips") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h3 className="text-white">Trending Clips</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {trendingClips.map((clip, index) => (
                <motion.button
                  key={clip.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-white/5"
                >
                  <ImageWithFallback
                    src={clip.thumbnail}
                    alt={`Clip by ${clip.creator}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 space-y-1">
                    <p className="text-xs text-white truncate">@{clip.creator}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-300 truncate">{clip.game}</p>
                      <div className="flex items-center gap-1 text-[10px] text-white backdrop-blur-sm bg-black/40 rounded-full px-2 py-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{clip.views}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
