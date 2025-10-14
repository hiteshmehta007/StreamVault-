
import { useState } from 'react';
import { useQueue } from './QueueProvider';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { VideoCard } from './VideoCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ListVideo, Plus, Play, Lock, Globe, Trash2, Edit, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner';

interface Playlist {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  isPrivate: boolean;
  createdDate: string;
  thumbnail: string;
  videos: any[];
  duration: string;
}

interface PlaylistsPageProps {
  onVideoClick: (video: any) => void;
}

export function PlaylistsPage({ onVideoClick }: PlaylistsPageProps) {
  const { addToQueue } = useQueue();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      title: 'Nature & Wildlife',
      description: 'Beautiful nature documentaries and wildlife videos',
      videoCount: 15,
      isPrivate: false,
      createdDate: '2 weeks ago',
      duration: '3h 45m',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      videos: [
        {
          id: 'p1v1',
          title: 'Amazing 4K Nature Documentary',
          thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
          duration: '12:45',
          views: '1,234,567',
          uploadDate: '2 days ago',
          channel: { name: 'NatureVision' },
          quality: ['2160p', '1440p', '1080p', '720p', '480p'],
        }
      ]
    },
    {
      id: '2',
      title: 'Tech Reviews 2024',
      description: 'Latest technology reviews and unboxings',
      videoCount: 8,
      isPrivate: true,
      createdDate: '1 month ago',
      duration: '2h 30m',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      videos: []
    },
    {
      id: '3',
      title: 'Cooking & Recipes',
      description: 'Delicious recipes and cooking tutorials',
      videoCount: 22,
      isPrivate: false,
      createdDate: '3 months ago',
      duration: '5h 20m',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      videos: []
    }
  ]);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isNewPlaylistPrivate, setIsNewPlaylistPrivate] = useState(false);

  const createPlaylist = () => {
    if (!newPlaylistTitle.trim()) {
      toast.error('Playlist title is required');
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: newPlaylistTitle,
      description: newPlaylistDescription,
      videoCount: 0,
      isPrivate: isNewPlaylistPrivate,
      createdDate: 'just now',
      duration: '0m',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      videos: []
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewPlaylistTitle('');
    setNewPlaylistDescription('');
    setIsNewPlaylistPrivate(false);
    toast.success('Playlist created successfully');
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    toast.success('Playlist deleted');
  };

  const playAllVideos = (playlist: Playlist) => {
    if (playlist.videos.length > 0) {
      onVideoClick(playlist.videos[0]);
      toast.success(`Playing all videos from "${playlist.title}"`);
    } else {
      toast.error('No videos in this playlist');
    }
  };

  const handleDownload = (video: any) => {
    toast.success(`Started downloading "${video.title}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ListVideo className="h-6 w-6" />
          <h1>Playlists</h1>
          <Badge variant="secondary">{playlists.length} playlists</Badge>
        </div>

        {/* Create New Playlist */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Enter playlist title..."
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <Input
                  placeholder="Enter playlist description..."
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isNewPlaylistPrivate}
                  onChange={(e) => setIsNewPlaylistPrivate(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="private" className="text-sm">Make playlist private</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setNewPlaylistTitle('');
                  setNewPlaylistDescription('');
                  setIsNewPlaylistPrivate(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={createPlaylist}>
                  Create Playlist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <ListVideo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No playlists yet</h3>
          <p className="text-muted-foreground">
            Create playlists to organize your favorite videos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <Card key={playlist.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                  <Button
                    onClick={() => playAllVideos(playlist)}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 border border-white/20"
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Play All
                  </Button>
                </div>

                {/* Video count overlay */}
                <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center">
                  <ListVideo className="h-3 w-3 mr-1" />
                  {playlist.videoCount}
                </div>

                {/* Privacy indicator */}
                <div className="absolute bottom-2 left-2">
                  {playlist.isPrivate ? (
                    <Lock className="h-4 w-4 text-white" />
                  ) : (
                    <Globe className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="group-hover:text-primary transition-colors line-clamp-2">
                    {playlist.title}
                  </h3>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedPlaylist(playlist)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deletePlaylist(playlist.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {playlist.description || 'No description'}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span>{playlist.videoCount} videos</span>
                    <span>•</span>
                    <span>{playlist.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground space-x-2">
                    <span>Created {playlist.createdDate}</span>
                    <Badge variant={playlist.isPrivate ? "secondary" : "outline"} className="text-xs">
                      {playlist.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Playlist Detail View */}
      {selectedPlaylist && (
        <Dialog open={!!selectedPlaylist} onOpenChange={() => setSelectedPlaylist(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedPlaylist.title}</span>
                <Badge variant={selectedPlaylist.isPrivate ? "secondary" : "outline"}>
                  {selectedPlaylist.isPrivate ? "Private" : "Public"}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedPlaylist.thumbnail}
                  alt={selectedPlaylist.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2">{selectedPlaylist.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{selectedPlaylist.videoCount} videos</span>
                    <span>•</span>
                    <span>{selectedPlaylist.duration} total</span>
                    <span>•</span>
                    <span>Created {selectedPlaylist.createdDate}</span>
                  </div>
                </div>
              </div>

              {selectedPlaylist.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlaylist.videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={() => {
                        onVideoClick(video);
                        setSelectedPlaylist(null);
                      }}
                      onDownload={() => handleDownload(video)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ListVideo className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No videos in this playlist yet</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

