
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { VideoCard } from './VideoCard';
import { Clock, Play, Trash2, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface WatchLaterItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  addedDate: string;
  channel: {
    name: string;
    avatar?: string;
  };
  quality: string[];
}

interface WatchLaterPageProps {
  onVideoClick: (video: any) => void;
}

export function WatchLaterPage({ onVideoClick }: WatchLaterPageProps) {
  const [watchLaterItems, setWatchLaterItems] = useState<WatchLaterItem[]>([
    {
      id: 'wl1',
      title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '12:45',
      views: '1,234,567',
      uploadDate: '2 days ago',
      addedDate: '3 hours ago',
      channel: { name: 'NatureVision' },
      quality: ['2160p', '1440p', '1080p', '720p', '480p'],
    },
    {
      id: 'wl2',
      title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '18:32',
      views: '892,341',
      uploadDate: '5 hours ago',
      addedDate: '1 day ago',
      channel: { name: 'TechReviewer' },
      quality: ['1440p', '1080p', '720p', '480p'],
    },
    {
      id: 'wl3',
      title: 'Cooking Masterclass: Italian Pasta from Scratch',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '25:18',
      views: '456,789',
      uploadDate: '1 week ago',
      addedDate: '2 days ago',
      channel: { name: 'ChefMaster' },
      quality: ['1080p', '720p', '480p', '360p'],
    },
    {
      id: 'wl4',
      title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '32:45',
      views: '2,187,654',
      uploadDate: '3 days ago',
      addedDate: '1 week ago',
      channel: { name: 'Wanderlust' },
      quality: ['2160p', '1440p', '1080p', '720p'],
    },
    {
      id: 'wl5',
      title: 'Music Production Tutorial: Beat Making with AI Tools',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '15:29',
      views: '687,432',
      uploadDate: '1 day ago',
      addedDate: '3 days ago',
      channel: { name: 'BeatMaker' },
      quality: ['1080p', '720p', '480p'],
    },
    {
      id: 'wl6',
      title: 'Fitness Challenge: 30-Day Transformation Results',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '8:47',
      views: '1,543,289',
      uploadDate: '4 days ago',
      addedDate: '1 week ago',
      channel: { name: 'FitLife' },
      quality: ['1440p', '1080p', '720p', '480p'],
    }
  ]);

  const removeFromWatchLater = (itemId: string) => {
    setWatchLaterItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Removed from Watch Later');
  };

  const clearAllWatchLater = () => {
    setWatchLaterItems([]);
    toast.success('Cleared all Watch Later videos');
  };

  const playAllVideos = () => {
    if (watchLaterItems.length > 0) {
      onVideoClick(watchLaterItems[0]);
      toast.success('Playing all Watch Later videos');
    }
  };

  const downloadAllVideos = () => {
    watchLaterItems.forEach(item => {
      toast.success(`Started downloading "${item.title}"`);
    });
  };

  const handleDownload = (video: any) => {
    toast.success(`Started downloading "${video.title}"`);
  };

  const getTotalDuration = () => {
    // Mock calculation - in real app, you'd sum up all durations
    const totalMinutes = watchLaterItems.length * 18; // Average 18 minutes per video
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6" />
          <h1>Watch Later</h1>
          <Badge variant="secondary">{watchLaterItems.length} videos</Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAllVideos}
            disabled={watchLaterItems.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={playAllVideos}
            disabled={watchLaterItems.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllWatchLater}
            disabled={watchLaterItems.length === 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {watchLaterItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="font-semibold">{watchLaterItems.length}</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{getTotalDuration()}</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {watchLaterItems.filter(item => 
                      new Date(item.addedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Added This Week</div>
                </div>
              </div>
              
              <Button onClick={playAllVideos}>
                <Play className="h-4 w-4 mr-2" />
                Play All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watch Later Items */}
      {watchLaterItems.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No videos in Watch Later</h3>
          <p className="text-muted-foreground">
            Save videos to watch them later when you have time
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List View with detailed info */}
          <div className="space-y-3">
            {watchLaterItems.map((item, index) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    {/* Video Index */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div 
                      className="relative cursor-pointer shrink-0"
                      onClick={() => onVideoClick(item)}
                    >
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                        {item.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Video Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 
                          className="cursor-pointer hover:text-primary line-clamp-2"
                          onClick={() => onVideoClick(item)}
                        >
                          {item.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchLater(item.id)}
                          className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{item.channel.name}</span>
                        <span>•</span>
                        <span>{item.views} views</span>
                        <span>•</span>
                        <span>{item.uploadDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Added {item.addedDate}</span>
                        </div>
                        
                        {item.quality.includes('2160p') && (
                          <Badge variant="secondary">4K Available</Badge>
                        )}
                        {item.quality.includes('1080p') && (
                          <Badge variant="outline">HD</Badge>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(item)}
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
        </div>
      )}
    </div>
  );
}

