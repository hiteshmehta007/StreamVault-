import { useState } from "react";
import { Settings, Grid3x3, Heart, Bookmark, TrendingUp, Share2, Eye, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);

  const stats = [
    { label: "Clips", value: "247", icon: Grid3x3 },
    { label: "Followers", value: "1.2M", icon: Users },
    { label: "Views", value: "45M", icon: Eye },
  ];

  const myClips = [
    {
      id: "1",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      views: "2.8M",
      likes: "524K",
      game: "VALORANT",
    },
    {
      id: "2",
      thumbnail: "https://images.unsplash.com/photo-1708714164655-862c7263d756?w=400",
      views: "3.9M",
      likes: "687K",
      game: "GTA V",
    },
    {
      id: "3",
      thumbnail: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400",
      views: "4.2M",
      likes: "798K",
      game: "Fortnite",
    },
    {
      id: "4",
      thumbnail: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=400",
      views: "2.9M",
      likes: "542K",
      game: "League",
    },
    {
      id: "5",
      thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
      views: "1.8M",
      likes: "389K",
      game: "Minecraft",
    },
    {
      id: "6",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      views: "3.4M",
      likes: "621K",
      game: "Chatting",
    },
  ];

  const analytics = [
    { label: "Stream Hours", value: "847", change: "+42h", trend: "up", icon: Clock },
    { label: "Clip Views", value: "45.2M", change: "+12.3%", trend: "up", icon: Eye },
    { label: "Engagement", value: "8.7%", change: "+2.1%", trend: "up", icon: TrendingUp },
    { label: "Revenue", value: "$12.4K", change: "+18.5%", trend: "up", icon: DollarSign },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Gradient */}
          <div className="h-32 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl" />
          
          {/* Profile Info */}
          <div className="relative -mt-16 px-4">
            <div className="flex items-end gap-4">
              <Avatar className="w-28 h-28 border-4 border-black ring-4 ring-white/20">
                <AvatarImage src="https://images.unsplash.com/photo-1758025196434-563b0fe9f5ed?w=200" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                  S
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white">ShroudFPS</h2>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Partner
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">
                  Professional FPS Player | Streamer | Content Creator 🎮
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <button 
                    key={stat.label}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-purple-400" />
                      <p className="text-white">{stat.value}</p>
                    </div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 rounded-xl ${
                  isFollowing 
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20" 
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-xl bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="space-y-3">
          <h3 className="text-white px-4">Analytics</h3>
          <div className="grid grid-cols-2 gap-3 px-4">
            {analytics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label} 
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs text-gray-400">{metric.label}</p>
                  </div>
                  <p className="text-white text-xl mb-1">{metric.value}</p>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    <span>{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="clips" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 h-12 p-1">
            <TabsTrigger 
              value="clips" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 rounded-lg"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Clips
            </TabsTrigger>
            <TabsTrigger 
              value="liked" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 rounded-lg"
            >
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 rounded-lg"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clips" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {myClips.map((clip) => (
                <button
                  key={clip.id}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-white/5 hover:scale-105 transition-transform"
                >
                  <ImageWithFallback
                    src={clip.thumbnail}
                    alt="Clip thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-purple-600 text-white border-0 text-[10px]">
                      {clip.game}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{clip.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{clip.likes}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400">
                Clips you've liked will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400">
                Saved clips will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Partner Program */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Partner Revenue</h3>
              <p className="text-gray-300 text-sm mb-4">
                You've earned $12,456 this month from clips and subscriptions
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl">
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
