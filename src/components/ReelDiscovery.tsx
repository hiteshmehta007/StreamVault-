import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Hash,
  MapPin,
  Users,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Award,
  Zap,
  Search,
  Filter,
  Calendar,
  Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ReelVideo, ReelTrend, ReelChallenge } from '../types/reels';

interface ReelDiscoveryProps {
  onReelSelect?: (reel: ReelVideo) => void;
  onCreateReel?: () => void;
}

const TRENDING_HASHTAGS: ReelTrend[] = [
  { hashtag: 'viral', count: 1250000, growth: 23.5, category: 'General' },
  { hashtag: 'gaming', count: 890000, growth: 18.2, category: 'Gaming' },
  { hashtag: 'cooking', count: 756000, growth: 15.8, category: 'Food' },
  { hashtag: 'travel', count: 643000, growth: 12.4, category: 'Travel' },
  { hashtag: 'fitness', count: 578000, growth: 9.7, category: 'Health' },
  { hashtag: 'comedy', count: 512000, growth: 8.3, category: 'Entertainment' },
  { hashtag: 'music', count: 467000, growth: 7.9, category: 'Music' },
  { hashtag: 'art', count: 423000, growth: 6.2, category: 'Art' }
];

const ACTIVE_CHALLENGES: ReelChallenge[] = [
  {
    id: '1',
    title: '60 Second Chef Challenge',
    description: 'Create a delicious meal in under 60 seconds!',
    hashtag: 'chef60',
    createdBy: 'CookingMaster',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    participantCount: 12500,
    prize: '$1,000 prize pool',
    rules: ['Must be under 60 seconds', 'Show entire cooking process', 'Use #chef60'],
    featuredReels: []
  },
  {
    id: '2',
    title: 'Pet Talent Show',
    description: 'Show off your pet\'s amazing talents!',
    hashtag: 'pettalent',
    createdBy: 'PetLovers',
    startDate: '2024-10-05',
    endDate: '2024-10-25',
    participantCount: 8900,
    prize: 'Featured on our main page',
    rules: ['Feature your pet', 'Show a unique talent', 'Use #pettalent'],
    featuredReels: []
  },
  {
    id: '3',
    title: 'Transform Tuesday',
    description: 'Before and after transformations that inspire!',
    hashtag: 'transformtuesday',
    createdBy: 'LifestyleHub',
    startDate: '2024-10-03',
    endDate: '2024-10-30',
    participantCount: 15600,
    prize: '$500 winner + collaboration',
    rules: ['Show before/after', 'Post on Tuesdays', 'Use #transformtuesday'],
    featuredReels: []
  }
];

const FEATURED_REELS: ReelVideo[] = [
  {
    id: 'featured-1',
    videoUrl: 'featured-video-1',
    thumbnailUrl: 'https://picsum.photos/300/400?random=1',
    title: 'Epic Skateboard Trick! 🛹',
    description: 'Landed my first kickflip after 100 tries!',
    creator: {
      id: 'skater_pro',
      username: 'SkaterPro',
      displayName: 'Tony Hawk Jr',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=skater',
      isVerified: true,
      followers: 234000
    },
    stats: {
      views: 1200000,
      likes: 89000,
      comments: 3400,
      shares: 12000,
      saves: 5600
    },
    hashtags: ['skateboard', 'tricks', 'viral', 'sports'],
    duration: 35,
    createdAt: '2024-10-07T12:00:00Z',
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    visibility: 'public',
    allowComments: true,
    allowDuets: true
  },
  {
    id: 'featured-2',
    videoUrl: 'featured-video-2',
    thumbnailUrl: 'https://picsum.photos/300/400?random=2',
    title: '5-Minute Room Makeover ✨',
    description: 'Transformed my room with just $20!',
    creator: {
      id: 'diy_queen',
      username: 'DIYQueen',
      displayName: 'Sarah DIY',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diy',
      isVerified: false,
      followers: 156000
    },
    stats: {
      views: 890000,
      likes: 67000,
      comments: 2800,
      shares: 8900,
      saves: 15600
    },
    hashtags: ['diy', 'roomdecor', 'budget', 'transformation'],
    duration: 42,
    createdAt: '2024-10-07T10:30:00Z',
    isLiked: true,
    isSaved: true,
    isFollowing: false,
    visibility: 'public',
    allowComments: true,
    allowDuets: true
  }
];

export function ReelDiscovery({ onReelSelect, onCreateReel }: ReelDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedTab, setSelectedTab] = useState('trending');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTrendingIcon = (growth: number) => {
    if (growth > 20) return '🚀';
    if (growth > 15) return '🔥';
    if (growth > 10) return '📈';
    return '⭐';
  };

  const filteredHashtags = TRENDING_HASHTAGS.filter(tag => 
    selectedCategory === 'all' || tag.category.toLowerCase() === selectedCategory
  ).filter(tag =>
    tag.hashtag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Reels
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore trending content and find your next viral moment
            </p>
          </div>
          <Button 
            onClick={onCreateReel}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            Create Reel
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search hashtags, creators, or trends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Award className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="featured">
              <Zap className="w-4 h-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Eye className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            {/* Top Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-500" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredHashtags.slice(0, 8).map((trend, index) => (
                      <motion.div
                        key={trend.hashtag}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {trend.category}
                              </Badge>
                              <span className="text-xl">
                                {getTrendingIcon(trend.growth)}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">
                              #{trend.hashtag}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {formatNumber(trend.count)} posts
                            </p>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500 font-medium">
                                +{trend.growth}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Trending Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2.4M</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Views Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">156K</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Likes This Hour</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">89K</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Creators</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACTIVE_CHALLENGES.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Challenge
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(challenge.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-purple-500" />
                        <span className="font-mono text-purple-600 dark:text-purple-400">
                          #{challenge.hashtag}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Participants</span>
                          <span className="font-medium">{formatNumber(challenge.participantCount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Prize</span>
                          <span className="font-medium text-green-600">{challenge.prize}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          Join Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {FEATURED_REELS.map((reel, index) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => onReelSelect?.(reel)}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(reel.stats.views)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>{formatNumber(reel.stats.likes)}</span>
                          </div>
                        </div>
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {reel.title}
                        </h3>
                      </div>

                      {/* Creator Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={reel.creator.avatar} />
                            <AvatarFallback>{reel.creator.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-white text-xs font-medium">
                            {reel.creator.username}
                          </span>
                          {reel.creator.isVerified && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {reel.duration}s
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1">45M</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Global Reach</p>
                  <p className="text-xs text-green-500 mt-1">+12% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1">2.8M</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Active Users</p>
                  <p className="text-xs text-green-500 mt-1">+8% this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1">156K</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reels Created Today</p>
                  <p className="text-xs text-green-500 mt-1">+15% vs yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1">89%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                  <p className="text-xs text-green-500 mt-1">+3% this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Charts would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  📊 Advanced analytics charts will be implemented here
                  <br />
                  <small>Including engagement trends, user demographics, and content performance</small>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}