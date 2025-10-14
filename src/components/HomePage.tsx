
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, Clock, Flame, Music, Gamepad2, BookOpen, Utensils, Plane, Laptop, Film, Heart, Star, Users } from 'lucide-react';
import { videoService } from '../services/videoService';
import { VideoCard } from './VideoCard';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedGrid, AnimatedText, FloatingElement } from './AnimatedContainer';
import { useScrollReveal } from './hooks/useScrollReveal';



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
  };
  quality: string[];
  category: string;
}

interface HomePageProps {
  user: any;
  onVideoClick: (video: Video) => void;
  onProfileClick: () => void;
  onNavigate?: (page: string) => void;
  onChannelClick?: (channelName: string) => void;
}

// Helper functions
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

// Define base genres outside component to prevent recreation on every render
const BASE_GENRES = [
  { id: 'all', name: 'All', icon: Star, trending: true },
  { id: 'technology', name: 'Tech', icon: Laptop, trending: true },
  { id: 'music', name: 'Music', icon: Music, trending: false },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, trending: true },
  { id: 'cooking', name: 'Cooking', icon: Utensils, trending: false },
  { id: 'travel', name: 'Travel', icon: Plane, trending: true },
  { id: 'education', name: 'Education', icon: BookOpen, trending: false },
  { id: 'entertainment', name: 'Entertainment', icon: Film, trending: false },
  { id: 'fitness', name: 'Fitness', icon: Heart, trending: true },
  { id: 'documentary', name: 'Documentary', icon: Users, trending: false },
];

export function HomePage({ user, onVideoClick, onProfileClick: _onProfileClick, onNavigate, onChannelClick }: HomePageProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const { ref: tabsRef, isVisible: tabsVisible } = useScrollReveal();
  const { ref: genreRef, isVisible: genreVisible } = useScrollReveal();

  // Load videos from backend
  useEffect(() => {
    const loadVideos = async () => {

      try {
        // Try to load from backend first
        const feedData = await videoService.getVideosFeed({
          page: 1,
          limit: 20,
          category: selectedGenre === 'all' ? undefined : selectedGenre
        });
        
        // Transform backend data to match our Video interface
        const backendVideos = (feedData.videos || feedData.results || []).map((video: any) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: formatDuration(video.duration || 0),
          views: formatViews(video.viewCount || 0),
          uploadDate: video.createdAt,
          channel: {
            name: video.channel?.displayName || 'Unknown Channel',
            avatar: video.channel?.profilePicture
          },
          quality: video.resolutions || ['1080p', '720p', '480p'],
          category: video.category || 'general'
        }));
        
        setVideos(backendVideos);
        setFilteredVideos(backendVideos);
      } catch (error) {
        console.warn('Backend not available, using mock data:', error);
        // Fallback to mock data if backend is not available
        loadMockData();
      } finally {
        // Loading complete
      }
    };

    const loadMockData = () => {
      const mockVideos: Video[] = [
      {
        id: '1',
        title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '12:45',
        views: '1,234,567',
        uploadDate: '2024-01-15T10:30:00Z',
        channel: { name: 'NatureVision', isVerified: true },
        quality: ['2160p', '1440p', '1080p', '720p', '480p'],
        category: 'documentary',
        trending: true,
        verified: true,
        watchProgress: 35,
        tags: ['nature', '4K', 'documentary', 'wildlife']
      } as any,
      {
        id: '2',
        title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '18:32',
        views: '892,341',
        uploadDate: '2024-01-20T14:20:00Z',
        channel: { name: 'TechReviewer', isVerified: true },
        quality: ['1440p', '1080p', '720p', '480p'],
        category: 'technology',
        verified: true,
        watchProgress: 78,
        tags: ['tech', 'gaming', 'laptop', 'review', '2024']
      } as any,
      {
        id: '3',
        title: 'Cooking Masterclass: Italian Pasta from Scratch',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '25:18',
        views: '456,789',
        uploadDate: '1 week ago',
        channel: { name: 'ChefMaster' },
        quality: ['1080p', '720p', '480p', '360p'],
        category: 'cooking'
      },
      {
        id: '4',
        title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '32:45',
        views: '2,187,654',
        uploadDate: '2024-01-18T09:15:00Z',
        channel: { name: 'Wanderlust', isVerified: true },
        quality: ['2160p', '1440p', '1080p', '720p'],
        category: 'travel',
        trending: true,
        verified: true,
        isLive: false,
        tags: ['japan', 'travel', 'vlog', 'explore', 'culture']
      } as any,
      {
        id: '5',
        title: 'Music Production Tutorial: Beat Making with AI Tools',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '15:29',
        views: '687,432',
        uploadDate: '1 day ago',
        channel: { name: 'BeatMaker' },
        quality: ['1080p', '720p', '480p'],
        category: 'music'
      },
      {
        id: '6',
        title: 'Ultimate Gaming Setup 2024: RGB Everything!',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '22:15',
        views: '1,543,892',
        uploadDate: '2024-01-20T20:30:00Z',
        channel: { name: 'GameZone', isVerified: true },
        quality: ['2160p', '1440p', '1080p', '720p'],
        category: 'gaming',
        verified: true,
        tags: ['gaming', 'setup', 'RGB', '2024', 'tech']
      } as any,
      {
        id: '7',
        title: 'Learning Spanish: 10 Essential Phrases for Beginners',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.0&q=80&w=1080',
        duration: '8:45',
        views: '234,567',
        uploadDate: '2 weeks ago',
        channel: { name: 'LearnHub' },
        quality: ['1080p', '720p', '480p'],
        category: 'education'
      },
      {
        id: '8',
        title: 'Movie Review: Latest Blockbuster Analysis',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.0&q=80&w=1080',
        duration: '19:33',
        views: '876,543',
        uploadDate: '6 days ago',
        channel: { name: 'CinemaScope' },
        quality: ['1440p', '1080p', '720p'],
        category: 'entertainment'
      },
      {
        id: '9',
        title: 'Fitness Routine: 30-Minute Full Body Workout',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.0&q=80&w=1080',
        duration: '30:12',
        views: '1,234,890',
        uploadDate: '1 week ago',
        channel: { name: 'FitLife' },
        quality: ['1080p', '720p', '480p'],
        category: 'fitness'
      },
      {
        id: '10',
        title: 'LIVE: Jazz Night Under the Stars - Interactive Concert',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.0&q=80&w=1080',
        duration: '45:20',
        views: '567,234',
        uploadDate: '2024-01-20T22:00:00Z',
        channel: { name: 'JazzLounge', isVerified: true },
        quality: ['2160p', '1440p', '1080p'],
        category: 'music',
        isLive: true,
        verified: true,
        tags: ['live', 'jazz', 'concert', 'music', 'interactive']
      },
      {
        id: '11',
        title: 'Fitness Challenge: 30-Day Transformation Results',
        thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        duration: '8:47',
        views: '1,543,289',
        uploadDate: '4 days ago',
        channel: { name: 'FitLife' },
        quality: ['1440p', '1080p', '720p', '480p'],
        category: 'fitness'
      }
    ];

      setVideos(mockVideos);
      setFilteredVideos(mockVideos);
    };

    loadVideos();
  }, [selectedGenre]);

  // Add counts to genres based on current videos - uses static BASE_GENRES
  const genres = BASE_GENRES.map(genre => ({
    ...genre,
    count: genre.id === 'all' ? videos.length : videos.filter(v => v.category === genre.id).length
  }));

  // Filter videos based on selected genre
  useEffect(() => {
    let filtered = videos;
    
    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(video => video.category === selectedGenre);
    }
    
    setFilteredVideos(filtered);
  }, [videos, selectedGenre]);

  const getTabVideos = () => {
    switch (activeTab) {
      case 'trending':
        return [...filteredVideos].sort((a, b) => parseInt(b.views.replace(/,/g, '')) - parseInt(a.views.replace(/,/g, '')));
      case 'recent':
        return [...filteredVideos].sort((a, b) => {
          const dateA = new Date(a.uploadDate);
          const dateB = new Date(b.uploadDate);
          return dateB.getTime() - dateA.getTime();
        });
      case 'popular':
        return [...filteredVideos].sort((a, b) => parseInt(b.views.replace(/,/g, '')) - parseInt(a.views.replace(/,/g, '')));
      default:
        return filteredVideos;
    }
  };

  // Don't hide the entire component while loading - show genre buttons at least
  // This prevents disappearing on refresh

  return (
    <motion.div 
      className="space-y-6 homepage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* YouTube-inspired Genre Tabs */}
      <motion.div
        ref={genreRef as any}
        initial={{ opacity: 0, y: 20 }}
        animate={genreVisible ? { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        } : {}}
        className="relative"
      >
        <div className="mb-6">
          <div className="relative w-full genre-container">
            {/* Scroll indicators for mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none opacity-60 lg:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none opacity-60 lg:hidden"></div>
            
            {/* YouTube-style horizontal scrollable chip filter */}
            <div className="overflow-x-auto scrollbar-hide max-w-full scroll-smooth touch-pan-x genre-chips-scroll">
              <div className="genre-chips-container flex gap-2 py-3 px-4 w-max min-w-full" role="tablist">
                
                {genres.length > 0 ? genres.map((genre) => {
                  const Icon = genre.icon;
                  const isSelected = selectedGenre === genre.id;
                  const hasContent = genre.count > 0;
                  
                  return (
                    <div key={genre.id} className="chip-shape-container">
                      <div className="chip-shape-host">
                        <button
                          onClick={() => setSelectedGenre(genre.id)}
                          className={`
                            chip-shape-button-reset genre-chip
                            relative overflow-hidden rounded-lg px-3 py-2 text-sm font-medium
                            transition-all duration-200 ease-out whitespace-nowrap
                            flex items-center gap-1.5 min-h-[32px] touch-manipulation
                            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
                            ${isSelected 
                              ? 'bg-foreground text-background shadow-sm border border-foreground/20' 
                              : 'bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/40 hover:border-border/60'
                            }
                          `}
                          role="tab"
                          aria-selected={isSelected ? "true" : "false"}
                          data-selected={isSelected}
                          data-has-content={hasContent}
                          aria-label={`${genre.name} category - ${genre.count} videos${genre.trending ? ' - Trending' : ''}`}
                          title={`${genre.name}: ${genre.count} videos available${genre.trending ? ' (Trending)' : ''}`}
                        >
                          {/* YouTube-style chip content */}
                          <div className="chip-content relative flex items-center gap-1.5">
                            {/* Icon */}
                            {Icon && (
                              <Icon className={`h-4 w-4 flex-shrink-0 ${genre.trending ? 'text-orange-500' : ''}`} />
                            )}
                            
                            {/* Genre name */}
                            <span className="font-medium leading-tight">
                              {genre.name}
                            </span>
                            
                            {/* Count badge for non-mobile */}
                            {genre.count > 0 && (
                              <span className={`
                                hidden sm:inline-flex px-1.5 py-0.5 rounded-full text-xs font-semibold
                                ${isSelected 
                                  ? 'bg-background/20 text-background' 
                                  : 'bg-primary/15 text-primary'
                                }
                              `}>
                                {genre.count}
                              </span>
                            )}
                            
                            {/* Trending indicator */}
                            {genre.trending && (
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          {/* Touch feedback shape */}
                          <div 
                            className="touch-feedback-shape absolute inset-0 pointer-events-none"
                            aria-hidden="true"
                          >
                            <div className="touch-feedback-stroke absolute inset-0 rounded-lg border-2 border-transparent transition-colors" />
                            <div className="touch-feedback-fill absolute inset-0 rounded-lg bg-transparent transition-colors" />
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  // Fallback loading state for genre chips
                  <div className="chip-shape-container">
                    <div className="chip-shape-host">
                      <div className="chip-loading flex items-center gap-2 px-4 py-2 bg-secondary/60 rounded-lg">
                        <div className="w-4 h-4 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected genre info */}
        {selectedGenre !== 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 p-3 bg-accent/30 rounded-lg border"
          >
            <div className="flex items-center space-x-3">
              {(() => {
                const selectedGenreData = genres.find(g => g.id === selectedGenre);
                const Icon = selectedGenreData?.icon || Star;
                return (
                  <>
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedGenreData?.name} Videos
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedGenreData?.count} videos available
                        {selectedGenreData?.trending && (
                          <span className="ml-2 inline-flex items-center text-orange-600">
                            <Flame className="h-3 w-3 mr-1" />
                            Trending
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGenre('all')}
              className="text-muted-foreground hover:text-foreground"
            >
              Show All
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            ref={tabsRef as any}
            initial={{ opacity: 0, x: -50 }}
            animate={tabsVisible ? { 
              opacity: 1, 
              x: 0,
              transition: {
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            } : {}}
          >
            <TabsList className="w-full justify-start mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger value="trending" className="flex items-center space-x-2 relative overflow-hidden">
                  <motion.div
                    animate={activeTab === 'trending' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </motion.div>
                  <span>Trending</span>
                  {activeTab === 'trending' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger value="recent" className="flex items-center space-x-2 relative overflow-hidden">
                  <motion.div
                    animate={activeTab === 'recent' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                  <span>Recent</span>
                  {activeTab === 'recent' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger value="popular" className="flex items-center space-x-2 relative overflow-hidden">
                  <motion.div
                    animate={activeTab === 'popular' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Flame className="h-4 w-4" />
                  </motion.div>
                  <span>Most Popular</span>
                  {activeTab === 'popular' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TabsContent value={activeTab}>
                {getTabVideos().length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FloatingElement intensity={8} duration={3}>
                      <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    </FloatingElement>
                    <AnimatedText 
                      text="No videos found" 
                      className="mb-2" 
                    />
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      No videos available in this category
                    </motion.p>
                  </motion.div>
                ) : (
                  <AnimatedGrid 
                    className="video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full w-full"
                    staggerDelay={0.1}
                  >
                    {getTabVideos().map((video, index) => (
                      <motion.div
                        key={`${video.id}-${index}`}
                        initial={{ opacity: 0, y: 50, rotateX: -15 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          rotateX: 0,
                          transition: {
                            delay: index * 0.1,
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -30, 
                          transition: { duration: 0.3 } 
                        }}
                        layout
                      >
                        <VideoCard
                          video={video}
                          onClick={() => onVideoClick(video)}
                          onChannelClick={onChannelClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatedGrid>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </motion.div>
  );
}

