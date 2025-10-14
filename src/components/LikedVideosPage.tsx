
import { useState } from 'react';
import { Heart, Play, Download, Trash2, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { VideoCard } from './VideoCard';
import { toast } from 'sonner';

interface LikedVideo {
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
  likedDate: string;
  likes: string;
}

interface LikedVideosPageProps {
  onVideoClick: (video: LikedVideo) => void;
  onChannelClick?: (channelName: string) => void;
}

export function LikedVideosPage({ onVideoClick, onChannelClick }: LikedVideosPageProps) {
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([
    {
      id: 'lv1',
      title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '12:45',
      views: '1,234,567',
      uploadDate: '2 days ago',
      likedDate: '2 hours ago',
      channel: { name: 'NatureVision' },
      quality: ['2160p', '1440p', '1080p', '720p', '480p'],
      likes: '125K'
    },
    {
      id: 'lv2',
      title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '18:32',
      views: '892,341',
      uploadDate: '5 hours ago',
      likedDate: '1 day ago',
      channel: { name: 'TechReviewer' },
      quality: ['1440p', '1080p', '720p', '480p'],
      likes: '89K'
    },
    {
      id: 'lv3',
      title: 'Cooking Masterclass: Italian Pasta from Scratch',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '25:18',
      views: '456,789',
      uploadDate: '1 week ago',
      likedDate: '3 days ago',
      channel: { name: 'ChefMaster' },
      quality: ['1080p', '720p', '480p', '360p'],
      likes: '45K'
    },
    {
      id: 'lv4',
      title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '32:45',
      views: '2,187,654',
      uploadDate: '3 days ago',
      likedDate: '1 week ago',
      channel: { name: 'Wanderlust' },
      quality: ['2160p', '1440p', '1080p', '720p'],
      likes: '218K'
    },
    {
      id: 'lv5',
      title: 'Music Production Tutorial: Beat Making with AI Tools',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '15:29',
      views: '687,432',
      uploadDate: '1 day ago',
      likedDate: '2 weeks ago',
      channel: { name: 'BeatMaker' },
      quality: ['1080p', '720p', '480p'],
      likes: '68K'
    },
    {
      id: 'lv6',
      title: 'Fitness Challenge: 30-Day Transformation Results',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '8:47',
      views: '1,543,289',
      uploadDate: '4 days ago',
      likedDate: '1 month ago',
      channel: { name: 'FitLife' },
      quality: ['1440p', '1080p', '720p', '480p'],
      likes: '154K'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const unlikeVideo = (videoId: string) => {
    setLikedVideos(prev => prev.filter(video => video.id !== videoId));
    toast.success('Removed from liked videos');
  };

  const clearAllLikes = () => {
    setLikedVideos([]);
    toast.success('Cleared all liked videos');
  };

  const playAllVideos = () => {
    if (likedVideos.length > 0) {
      onVideoClick(likedVideos[0]);
      toast.success('Playing all liked videos');
    }
  };

  const downloadAllVideos = () => {
    likedVideos.forEach(video => {
      toast.success(`Started downloading "${video.title}"`);
    });
  };

  const handleDownload = (video: any) => {
    toast.success(`Started downloading "${video.title}"`);
  };

  const getTotalDuration = () => {
    // Mock calculation
    const totalMinutes = likedVideos.length * 19; // Average 19 minutes per video
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getTotalLikes = () => {
    // Mock calculation
    return likedVideos.reduce((total, video) => {
      const likes = parseInt(video.likes.replace('K', '')) * 1000;
      return total + likes;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-6 w-6 text-red-500" />
          <h1>Liked Videos</h1>
          <Badge variant="secondary">{likedVideos.length} videos</Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAllVideos}
            disabled={likedVideos.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={playAllVideos}
            disabled={likedVideos.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllLikes}
            disabled={likedVideos.length === 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {likedVideos.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="font-semibold text-red-600">{likedVideos.length}</div>
                  <div className="text-sm text-muted-foreground">Liked Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{getTotalDuration()}</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{(getTotalLikes() / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-muted-foreground">Combined Likes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {likedVideos.filter(video => 
                      new Date(video.likedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Liked This Week</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liked Videos */}
      {likedVideos.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No liked videos yet</h3>
          <p className="text-muted-foreground">
            Videos you like will appear here
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
              onDownload={() => handleDownload(video)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {likedVideos.map((video, index) => (
            <Card key={video.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  {/* Video Index */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div 
                    className="relative cursor-pointer shrink-0"
                    onClick={() => onVideoClick(video)}
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    {/* Liked indicator */}
                    <div className="absolute top-1 left-1">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 
                        className="cursor-pointer hover:text-primary line-clamp-2"
                        onClick={() => onVideoClick(video)}
                      >
                        {video.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unlikeVideo(video.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{video.channel.name}</span>
                      <span>•</span>
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.uploadDate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Liked {video.likedDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-red-600">
                        <Heart className="h-3 w-3 fill-red-600" />
                        <span>{video.likes} likes</span>
                      </div>
                      
                      {video.quality.includes('2160p') && (
                        <Badge variant="secondary">4K Available</Badge>
                      )}
                      {video.quality.includes('1080p') && (
                        <Badge variant="outline">HD</Badge>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(video)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

