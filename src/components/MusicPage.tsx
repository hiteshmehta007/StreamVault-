
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Music, Play, Heart, Download, Search, Filter, Grid, List } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  coverArt?: string;
  plays: string;
  uploadDate: string;
}

interface MusicPageProps {
  onTrackClick?: (track: Track) => void;
}

export function MusicPage({ onTrackClick }: MusicPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  
  const [tracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Chill Vibes',
      artist: 'Lo-Fi Beats',
      duration: 180,
      genre: 'Lo-Fi',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      plays: '1.2M',
      uploadDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Focus Flow',
      artist: 'Ambient Sounds',
      duration: 240,
      genre: 'Ambient',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      plays: '890K',
      uploadDate: '5 days ago'
    },
    {
      id: '3',
      title: 'Study Session',
      artist: 'Nature Sounds',
      duration: 300,
      genre: 'Nature',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
      plays: '2.1M',
      uploadDate: '1 week ago'
    },
    {
      id: '4',
      title: 'Coffee Shop Jazz',
      artist: 'Jazz Collective',
      duration: 210,
      genre: 'Jazz',
      coverArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
      plays: '756K',
      uploadDate: '3 days ago'
    },
    {
      id: '5',
      title: 'Electronic Dreams',
      artist: 'Synth Wave',
      duration: 195,
      genre: 'Electronic',
      coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
      plays: '1.5M',
      uploadDate: '6 days ago'
    },
    {
      id: '6',
      title: 'Peaceful Meditation',
      artist: 'Mindful Music',
      duration: 420,
      genre: 'Meditation',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      plays: '987K',
      uploadDate: '4 days ago'
    }
  ]);

  const [filteredTracks, setFilteredTracks] = useState(tracks);

  useEffect(() => {
    let filtered = tracks;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(track => 
        track.genre.toLowerCase() === activeTab.toLowerCase()
      );
    }

    setFilteredTracks(filtered);
  }, [tracks, searchQuery, activeTab]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track) => {
    toast.success(`Now playing: ${track.title} by ${track.artist}`);
    if (onTrackClick) {
      onTrackClick(track);
    }
  };

  const handleDownload = (track: Track) => {
    toast.success(`Started downloading: ${track.title}`);
  };

  const genres = ['all', ...Array.from(new Set(tracks.map(t => t.genre.toLowerCase())))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Music className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Music Library</h1>
          <Badge variant="secondary" className="text-sm">
            {tracks.length} tracks
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks, artists, genres..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Genre Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          {genres.map(genre => (
            <TabsTrigger key={genre} value={genre} className="capitalize">
              {genre === 'all' ? 'All Music' : genre}
              {genre !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {tracks.filter(t => t.genre.toLowerCase() === genre).length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-square">
                        {track.coverArt ? (
                          <img
                            src={track.coverArt}
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Music className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full h-12 w-12 p-0"
                          onClick={() => handlePlayTrack(track)}
                        >
                          <Play className="h-6 w-6 ml-0.5" />
                        </Button>
                      </div>
                      
                      <Badge className="absolute top-2 right-2 text-xs">
                        {track.genre}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold truncate">{track.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatTime(track.duration)}</span>
                          <span>{track.plays} plays</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handlePlayTrack(track);
                            }}
                            className="h-8"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Play
                          </Button>
                          
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Heart className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleDownload(track);
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            {track.coverArt ? (
                              <img
                                src={track.coverArt}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Music className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-16 w-16 p-0"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play className="h-4 w-4 ml-0.5" />
                          </Button>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold truncate">{track.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {track.genre}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {track.plays} plays • {track.uploadDate}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="text-sm text-muted-foreground">
                                {formatTime(track.duration)}
                              </span>
                              
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Heart className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownload(track)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handlePlayTrack(track)}
                                  className="h-8"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Play
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredTracks.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tracks found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try different search terms' : 'No music matches the current filter'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

