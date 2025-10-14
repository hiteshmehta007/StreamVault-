
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { VideoCard } from './VideoCard';
import { Download, Play, Trash2, Pause, FolderOpen, HardDrive } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  downloadDate: string;
  channel: {
    name: string;
    avatar?: string;
  };
  quality: string;
  fileSize: string;
  filePath: string;
  status: 'completed' | 'downloading' | 'paused' | 'failed';
  progress?: number;
}

interface DownloadsPageProps {
  onVideoClick: (video: any) => void;
}

export function DownloadsPage({ onVideoClick }: DownloadsPageProps) {
  const [downloads, setDownloads] = useState<DownloadedVideo[]>([
    {
      id: 'd1',
      title: 'Amazing 4K Nature Documentary - Wildlife in Ultra High Definition',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '12:45',
      views: '1,234,567',
      uploadDate: '2 days ago',
      downloadDate: '1 hour ago',
      channel: { name: 'NatureVision' },
      quality: '4K',
      fileSize: '8.5 GB',
      filePath: '/downloads/nature-documentary-4k.mp4',
      status: 'completed'
    },
    {
      id: 'd2',
      title: 'Latest Tech Review: Gaming Laptop Performance Test 2024',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '18:32',
      views: '892,341',
      uploadDate: '5 hours ago',
      downloadDate: 'now',
      channel: { name: 'TechReviewer' },
      quality: '1080p',
      fileSize: '2.1 GB',
      filePath: '/downloads/gaming-laptop-review.mp4',
      status: 'downloading',
      progress: 67
    },
    {
      id: 'd3',
      title: 'Cooking Masterclass: Italian Pasta from Scratch',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '25:18',
      views: '456,789',
      uploadDate: '1 week ago',
      downloadDate: '2 days ago',
      channel: { name: 'ChefMaster' },
      quality: '720p',
      fileSize: '1.2 GB',
      filePath: '/downloads/pasta-masterclass.mp4',
      status: 'completed'
    },
    {
      id: 'd4',
      title: 'Epic Travel Vlog: Exploring Hidden Gems in Japan',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '32:45',
      views: '2,187,654',
      uploadDate: '3 days ago',
      downloadDate: 'now',
      channel: { name: 'Wanderlust' },
      quality: '1440p',
      fileSize: '4.8 GB',
      filePath: '/downloads/japan-travel-vlog.mp4',
      status: 'paused',
      progress: 23
    },
    {
      id: 'd5',
      title: 'Music Production Tutorial: Beat Making with AI Tools',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '15:29',
      views: '687,432',
      uploadDate: '1 day ago',
      downloadDate: 'failed',
      channel: { name: 'BeatMaker' },
      quality: '1080p',
      fileSize: '1.8 GB',
      filePath: '/downloads/music-production-tutorial.mp4',
      status: 'failed'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDownloads = downloads.filter(download => {
    if (filterStatus === 'all') return true;
    return download.status === filterStatus;
  });

  const pauseDownload = (downloadId: string) => {
    setDownloads(prev => prev.map(download =>
      download.id === downloadId && download.status === 'downloading'
        ? { ...download, status: 'paused' as const }
        : download
    ));
    toast.success('Download paused');
  };

  const resumeDownload = (downloadId: string) => {
    setDownloads(prev => prev.map(download =>
      download.id === downloadId && download.status === 'paused'
        ? { ...download, status: 'downloading' as const }
        : download
    ));
    toast.success('Download resumed');
  };

  const retryDownload = (downloadId: string) => {
    setDownloads(prev => prev.map(download =>
      download.id === downloadId && download.status === 'failed'
        ? { ...download, status: 'downloading' as const, progress: 0 }
        : download
    ));
    toast.success('Download restarted');
  };

  const deleteDownload = (downloadId: string) => {
    setDownloads(prev => prev.filter(download => download.id !== downloadId));
    toast.success('Download removed');
  };

  const openFileLocation = (filePath: string) => {
    toast.success(`Opening: ${filePath}`);
    // In a real app, this would open the file manager to the download location
  };

  const getTotalDownloadSize = () => {
    return downloads
      .filter(d => d.status === 'completed')
      .reduce((total, download) => {
        const size = parseFloat(download.fileSize.replace(' GB', ''));
        return total + size;
      }, 0)
      .toFixed(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'downloading':
        return <Badge variant="secondary" className="bg-blue-600">Downloading</Badge>;
      case 'paused':
        return <Badge variant="outline">Paused</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (download: DownloadedVideo) => {
    switch (download.status) {
      case 'completed':
        return <Play className="h-4 w-4" />;
      case 'downloading':
        return <Pause className="h-4 w-4" />;
      case 'paused':
        return <Play className="h-4 w-4" />;
      case 'failed':
        return <Download className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const handleStatusAction = (download: DownloadedVideo) => {
    switch (download.status) {
      case 'completed':
        onVideoClick(download);
        break;
      case 'downloading':
        pauseDownload(download.id);
        break;
      case 'paused':
        resumeDownload(download.id);
        break;
      case 'failed':
        retryDownload(download.id);
        break;
    }
  };

  const completedDownloads = downloads.filter(d => d.status === 'completed');
  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Download className="h-6 w-6" />
          <h1>Downloads</h1>
          <Badge variant="secondary">{downloads.length} items</Badge>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Downloads</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="downloading">Downloading</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Download Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="font-semibold text-green-600">{completedDownloads.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{activeDownloads.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="font-semibold">{getTotalDownloadSize()} GB</div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">256 GB</span>
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Downloads */}
      {activeDownloads.length > 0 && (
        <div className="space-y-4">
          <h2>Active Downloads</h2>
          <div className="space-y-3">
            {activeDownloads.map((download) => (
              <Card key={download.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={download.thumbnail} 
                      alt={download.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="line-clamp-1">{download.title}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(download.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusAction(download)}
                          >
                            {getStatusIcon(download)}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{download.channel.name}</span>
                        <span>•</span>
                        <span>{download.quality}</span>
                        <span>•</span>
                        <span>{download.fileSize}</span>
                      </div>
                      
                      {download.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{download.progress}% complete</span>
                            <span>{download.status === 'downloading' ? 'Downloading...' : 'Paused'}</span>
                          </div>
                          <Progress value={download.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Downloaded Videos */}
      {filteredDownloads.length === 0 ? (
        <div className="text-center py-12">
          <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No downloads found</h3>
          <p className="text-muted-foreground">
            {filterStatus === 'all' 
              ? 'Downloaded videos will appear here' 
              : `No ${filterStatus} downloads`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>
              {filterStatus === 'all' ? 'All Downloads' : 
               filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) + ' Downloads'}
            </h2>
          </div>
          
          <div className="space-y-3">
            {filteredDownloads.map((download) => (
              <Card key={download.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div 
                      className="relative cursor-pointer shrink-0"
                      onClick={() => download.status === 'completed' && onVideoClick(download)}
                    >
                      <img 
                        src={download.thumbnail} 
                        alt={download.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                        {download.duration}
                      </div>
                      {download.status === 'completed' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 
                          className={`line-clamp-2 ${
                            download.status === 'completed' ? 'cursor-pointer hover:text-primary' : ''
                          }`}
                          onClick={() => download.status === 'completed' && onVideoClick(download)}
                        >
                          {download.title}
                        </h3>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          {getStatusBadge(download.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDownload(download.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{download.channel.name}</span>
                        <span>•</span>
                        <span>{download.views} views</span>
                        <span>•</span>
                        <span>{download.uploadDate}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span>Quality: {download.quality}</span>
                          <span>Size: {download.fileSize}</span>
                          <span>Downloaded: {download.downloadDate}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusAction(download)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {getStatusIcon(download)}
                            <span className="ml-1">
                              {download.status === 'completed' ? 'Play' :
                               download.status === 'downloading' ? 'Pause' :
                               download.status === 'paused' ? 'Resume' : 'Retry'}
                            </span>
                          </Button>
                          
                          {download.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openFileLocation(download.filePath)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {download.progress !== undefined && download.status !== 'completed' && (
                        <div className="mt-2">
                          <Progress value={download.progress} className="h-2" />
                        </div>
                      )}
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

