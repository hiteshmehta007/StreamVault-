import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Eye, 
  Calendar,
  Grid3X3,
  List,
  Edit3,
  Video,
  Check,
  Play
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadDate: string;
  status: 'published' | 'draft' | 'scheduled' | 'private';
  category?: string;
  tags?: string[];
}

interface VideoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: VideoData) => void;
  videos?: VideoData[];
}

// Mock video data for demonstration
const DEMO_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: 'Getting Started with React Components',
    description: 'Learn the basics of React components in this comprehensive tutorial.',
    thumbnail: 'https://picsum.photos/320/180?random=1',
    duration: '15:24',
    views: 12450,
    likes: 892,
    uploadDate: '2024-01-20',
    status: 'published',
    category: 'Education',
    tags: ['react', 'tutorial', 'frontend']
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore advanced TypeScript patterns and best practices.',
    thumbnail: 'https://picsum.photos/320/180?random=2',
    duration: '22:11',
    views: 8720,
    likes: 654,
    uploadDate: '2024-01-18',
    status: 'published',
    category: 'Programming',
    tags: ['typescript', 'patterns', 'advanced']
  },
  {
    id: '3',
    title: 'Building Modern Web Apps',
    description: 'Complete guide to building modern web applications.',
    thumbnail: 'https://picsum.photos/320/180?random=3',
    duration: '18:45',
    views: 15680,
    likes: 1203,
    uploadDate: '2024-01-15',
    status: 'published',
    category: 'Web Development',
    tags: ['webapp', 'modern', 'development']
  },
  {
    id: '4',
    title: 'CSS Grid Layout Masterclass',
    description: 'Master CSS Grid layout with practical examples.',
    thumbnail: 'https://picsum.photos/320/180?random=4',
    duration: '12:33',
    views: 9340,
    likes: 567,
    uploadDate: '2024-01-12',
    status: 'published',
    category: 'CSS',
    tags: ['css', 'grid', 'layout']
  },
  {
    id: '5',
    title: 'JavaScript ES2024 Features',
    description: 'Explore the latest JavaScript features and improvements.',
    thumbnail: 'https://picsum.photos/320/180?random=5',
    duration: '20:18',
    views: 6789,
    likes: 445,
    uploadDate: '2024-01-10',
    status: 'draft',
    category: 'JavaScript',
    tags: ['javascript', 'es2024', 'features']
  },
  {
    id: '6',
    title: 'Node.js Performance Optimization',
    description: 'Tips and tricks for optimizing Node.js applications.',
    thumbnail: 'https://picsum.photos/320/180?random=6',
    duration: '25:07',
    views: 11230,
    likes: 789,
    uploadDate: '2024-01-08',
    status: 'scheduled',
    category: 'Backend',
    tags: ['nodejs', 'performance', 'optimization']
  }
];

export function VideoSelector({ 
  isOpen, 
  onClose, 
  onSelectVideo, 
  videos = DEMO_VIDEOS 
}: VideoSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'private'>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'private': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSelectVideo = (video: VideoData) => {
    setSelectedVideo(video);
  };

  const handleConfirmSelection = () => {
    if (selectedVideo) {
      onSelectVideo(selectedVideo);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Select Video to Edit
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Creator Dashboard → Quick Edit → Video Selection
            </p>
          </div>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm min-w-[120px]"
              title="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="private">Private</option>
            </select>

            <div className="flex border border-input rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="flex-1 overflow-y-auto">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria' : 'No videos match the selected filters'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4" 
                : "space-y-2 p-4"
            }>
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video, index) => {
                  const isSelected = selectedVideo?.id === video.id;
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-lg shadow-primary/20' 
                            : 'hover:bg-accent/50 hover:shadow-md hover:border-primary/20'
                        } ${viewMode === 'list' ? 'p-3' : ''}`}
                        onClick={() => handleSelectVideo(video)}
                      >
                        {/* Selection indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2, type: "spring" }}
                              className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg"
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Subtle glow effect for selected items */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                        )}
                        {viewMode === 'grid' ? (
                          <CardContent className="p-4">
                            {/* Enhanced Thumbnail with hover effects */}
                            <div className="relative aspect-video mb-3 rounded-lg overflow-hidden bg-muted group/thumbnail">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                              />
                              
                              {/* Play button overlay on hover */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform scale-75 group-hover/thumbnail:scale-100 transition-transform duration-200">
                                  <Play className="h-4 w-4 text-gray-800 fill-gray-800" />
                                </div>
                              </div>
                              {/* Duration badge with enhanced styling */}
                              <div className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                                {video.duration}
                              </div>
                              
                              {/* Status badge with improved visibility */}
                              <div className="absolute top-2 left-2">
                                <Badge className={`${getStatusColor(video.status)} backdrop-blur-sm shadow-sm`} variant="secondary">
                                  {video.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Enhanced Video Info */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200 flex-1">
                                  {video.title}
                                </h3>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex-shrink-0 text-primary"
                                  >
                                    <Check className="h-4 w-4" />
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Badge className={getStatusColor(video.status)} variant="secondary">
                                  {video.status}
                                </Badge>
                                {isSelected && (
                                  <motion.span 
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs text-primary font-medium"
                                  >
                                    Selected
                                  </motion.span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {formatNumber(video.views)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(video.uploadDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        ) : (
                          <div className="flex gap-4 items-start p-3">
                            {/* Enhanced List Thumbnail */}
                            <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0 group/list-thumb">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              
                              {/* Play overlay for list view */}
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/list-thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                                {video.duration}
                              </div>
                            </div>
                            
                            {/* Enhanced List Video Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200 flex-1">
                                  {video.title}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      className="text-primary"
                                    >
                                      <Check className="h-4 w-4" />
                                    </motion.div>
                                  )}
                                  <Badge className={getStatusColor(video.status)} variant="secondary">
                                    {video.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              {video.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {video.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {formatNumber(video.views)} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(video.uploadDate).toLocaleDateString()}
                                </div>
                                {video.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {video.category}
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Selection indicator for list view */}
                              {isSelected && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="mt-1 text-xs text-primary font-medium flex items-center gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  Selected for editing
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-3">
            {selectedVideo ? (
              <div className="flex items-center gap-3">
                <div className="w-16 aspect-video rounded overflow-hidden bg-muted">
                  <img 
                    src={selectedVideo.thumbnail} 
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="font-medium line-clamp-1">{selectedVideo.title}</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span>{selectedVideo.duration}</span>
                    <span>•</span>
                    <span>{formatNumber(selectedVideo.views)} views</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a video to edit
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              ← Back to Dashboard
            </Button>
            <Button 
              onClick={handleConfirmSelection} 
              disabled={!selectedVideo}
              className="min-w-[120px]"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}