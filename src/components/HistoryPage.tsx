
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { VideoCard } from './VideoCard';
import { History, Search, Trash2, Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  watchedDate: string;
  watchProgress: number; // percentage watched
  channel: {
    name: string;
    avatar?: string;
  };
  quality: string[];
}

interface HistoryPageProps {
  onVideoClick: (video: any) => void;
}

export function HistoryPage({ onVideoClick }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: 'h1',
      title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '12:45',
      views: '1,234,567',
      uploadDate: '2 days ago',
      watchedDate: '2 hours ago',
      watchProgress: 85,
      channel: { name: 'NatureVision' },
      quality: ['2160p', '1440p', '1080p', '720p', '480p'],
    },
    {
      id: 'h2',
      title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '18:32',
      views: '892,341',
      uploadDate: '5 hours ago',
      watchedDate: '1 day ago',
      watchProgress: 100,
      channel: { name: 'TechReviewer' },
      quality: ['1440p', '1080p', '720p', '480p'],
    },
    {
      id: 'h3',
      title: 'Cooking Masterclass: Italian Pasta from Scratch',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '25:18',
      views: '456,789',
      uploadDate: '1 week ago',
      watchedDate: '3 days ago',
      watchProgress: 45,
      channel: { name: 'ChefMaster' },
      quality: ['1080p', '720p', '480p', '360p'],
    },
    {
      id: 'h4',
      title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '32:45',
      views: '2,187,654',
      uploadDate: '3 days ago',
      watchedDate: '1 week ago',
      watchProgress: 75,
      channel: { name: 'Wanderlust' },
      quality: ['2160p', '1440p', '1080p', '720p'],
    },
    {
      id: 'h5',
      title: 'Music Production Tutorial: Beat Making with AI Tools',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '15:29',
      views: '687,432',
      uploadDate: '1 day ago',
      watchedDate: '2 weeks ago',
      watchProgress: 20,
      channel: { name: 'BeatMaker' },
      quality: ['1080p', '720p', '480p'],
    },
  ]);

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' ||
                         (filterBy === 'completed' && item.watchProgress >= 90) ||
                         (filterBy === 'partial' && item.watchProgress < 90 && item.watchProgress > 10) ||
                         (filterBy === 'recent' && new Date(item.watchedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesFilter;
  });

  const removeFromHistory = (itemId: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Removed from watch history');
  };

  const clearAllHistory = () => {
    setHistoryItems([]);
    toast.success('Watch history cleared');
  };

  const handleDownload = (video: any) => {
    toast.success(`Started downloading "${video.title}"`);
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 90) return <Badge variant="default">Completed</Badge>;
    if (progress >= 50) return <Badge variant="secondary">In Progress</Badge>;
    return <Badge variant="outline">Started</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-6 w-6" />
          <h1>Watch History</h1>
          <Badge variant="secondary">{historyItems.length} videos</Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your watch history..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Videos</SelectItem>
                <SelectItem value="recent">Recently Watched</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="partial">Partially Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Items */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">
            {searchQuery ? 'No matching videos found' : 'No watch history'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Try different search terms or adjust filters' 
              : 'Videos you watch will appear here'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List View for History (shows more details) */}
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div 
                      className="relative cursor-pointer"
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
                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-red-600 h-1 rounded-b-lg" 
                           style={{ width: `${item.watchProgress}%` }} />
                    </div>
                    
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
                          onClick={() => removeFromHistory(item.id)}
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
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Watched {item.watchedDate}</span>
                        </div>
                        {getProgressBadge(item.watchProgress)}
                        <span className="text-muted-foreground">{item.watchProgress}% completed</span>
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

