
import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Play,
  PlayCircle
} from 'lucide-react';
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
  likes: string;
  isPlaying?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverArt: string;
  trackCount: number;
  duration: string;
  creator: string;
  plays: string;
  tracks: Track[];
}

interface Artist {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  topTrack: string;
  monthlyListeners: string;
}

interface MusicLandingPageProps {
  onTrackClick?: (track: Track) => void;
  onPlaylistClick?: (playlist: Playlist) => void;
  onBrowseAllClick?: () => void;
}

export function MusicLandingPage({ 
  onTrackClick, 
  onPlaylistClick, 
  onBrowseAllClick 
}: MusicLandingPageProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Featured Playlists with Spotify-style data
  const [featuredPlaylists, _setFeaturedPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'Today\'s Top Hits',
      description: 'The biggest songs right now',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      trackCount: 50,
      duration: '2h 47m',
      creator: 'StreamVault',
      plays: '12.5M',
      tracks: []
    },
    {
      id: '2',
      name: 'Discover Weekly',
      description: 'Your weekly mixtape of fresh music',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      trackCount: 30,
      duration: '1h 52m',
      creator: 'Made for you',
      plays: 'Personal',
      tracks: []
    },
    {
      id: '3',
      name: 'Chill Hits',
      description: 'Kick back to the best new and recent chill hits.',
      coverArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
      trackCount: 80,
      duration: '4h 12m',
      creator: 'Spotify',
      plays: '8.9M',
      tracks: []
    },
    {
      id: '4',
      name: 'Release Radar',
      description: 'Catch all the latest music from artists you follow',
      coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
      trackCount: 30,
      duration: '2h 8m',
      creator: 'Made for you',
      plays: 'Personal',
      tracks: []
    },
    {
      id: '5',
      name: 'Lo-Fi Beats',
      description: 'Chill beats, lofi vibes.',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      trackCount: 157,
      duration: '8h 23m',
      creator: 'Chillhop Records',
      plays: '15.2M',
      tracks: []
    },
    {
      id: '6',
      name: 'RapCaviar',
      description: 'New music and big tracks.',
      coverArt: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop',
      trackCount: 65,
      duration: '3h 45m',
      creator: 'Spotify',
      plays: '22.1M',
      tracks: []
    }
  ]);

  // Trending Tracks
  const [trendingTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Peaceful Morning',
      artist: 'Nature Sounds',
      duration: 240,
      genre: 'Ambient',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
      plays: '1.2M',
      likes: '45K'
    },
    {
      id: '2',
      title: 'Urban Rhythm',
      artist: 'City Beats',
      duration: 195,
      genre: 'Electronic',
      coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=100&h=100&fit=crop',
      plays: '890K',
      likes: '32K'
    },
    {
      id: '3',
      title: 'Smooth Operator',
      artist: 'Jazz Masters',
      duration: 220,
      genre: 'Jazz',
      coverArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=100&h=100&fit=crop',
      plays: '756K',
      likes: '28K'
    },
    {
      id: '4',
      title: 'Study Helper',
      artist: 'Lo-Fi Collective',
      duration: 180,
      genre: 'Lo-Fi',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      plays: '2.1M',
      likes: '67K'
    },
    {
      id: '5',
      title: 'Meditation Flow',
      artist: 'Zen Masters',
      duration: 300,
      genre: 'Meditation',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      plays: '1.5M',
      likes: '52K'
    }
  ]);

  // Popular Artists
  const [popularArtists] = useState<Artist[]>([
    {
      id: '1',
      name: 'Nature Sounds',
      avatar: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop&crop=face',
      followers: '2.1M',
      topTrack: 'Peaceful Morning',
      monthlyListeners: '5.2M'
    },
    {
      id: '2',
      name: 'Jazz Collective',
      avatar: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=100&h=100&fit=crop&crop=face',
      followers: '1.8M',
      topTrack: 'Coffee Shop Jazz',
      monthlyListeners: '4.3M'
    },
    {
      id: '3',
      name: 'Lo-Fi Beats',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face',
      followers: '3.2M',
      topTrack: 'Study Helper',
      monthlyListeners: '8.1M'
    },
    {
      id: '4',
      name: 'Synth Wave',
      avatar: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=100&h=100&fit=crop&crop=face',
      followers: '1.5M',
      topTrack: 'Electronic Dreams',
      monthlyListeners: '3.7M'
    }
  ]);

  const musicCategories = [
    { name: 'Pop', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { name: 'Hip-Hop', color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop' },
    { name: 'Rock', color: 'bg-red-500', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop' },
    { name: 'Jazz', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop' },
    { name: 'Electronic', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { name: 'Classical', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop' },
    { name: 'Indie', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { name: 'R&B', color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track) => {
    if (currentlyPlaying === track.id) {
      setCurrentlyPlaying(null);
      toast.info('Music paused');
    } else {
      setCurrentlyPlaying(track.id);
      toast.success(`Now playing: ${track.title} by ${track.artist}`);
    }
    
    if (onTrackClick) {
      onTrackClick(track);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    toast.success(`Playing playlist: ${playlist.name}`);
    if (onPlaylistClick) {
      onPlaylistClick(playlist);
    }
  };

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Recently played items
  const recentlyPlayed = [
    { id: '1', name: 'Liked Songs', type: 'playlist', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { id: '2', name: 'Discover Weekly', type: 'playlist', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { id: '3', name: 'Release Radar', type: 'playlist', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { id: '4', name: 'Daily Mix 1', type: 'playlist', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop' },
    { id: '5', name: 'Chill Hits', type: 'playlist', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop' },
    { id: '6', name: 'Today\'s Top Hits', type: 'playlist', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop' }
  ];

  // Featured playlists for sections
  const madeForYou = [
    {
      id: '1',
      name: 'Discover Weekly',
      description: 'Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you. Updates every Monday.',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '2',
      name: 'Release Radar',
      description: 'Catch all the latest music from artists you follow, plus new singles picked for you. Updates every Friday.',
      coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '3',
      name: 'Daily Mix 1',
      description: 'Drake, The Weeknd, Future and more',
      coverArt: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '4',
      name: 'Daily Mix 2',
      description: 'Ed Sheeran, Taylor Swift, Billie Eilish and more',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '5',
      name: 'On Repeat',
      description: 'The songs you can\'t stop playing',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      creator: 'Spotify'
    }
  ];

  const popularPlaylists = [
    {
      id: '1',
      name: 'Today\'s Top Hits',
      description: 'The Weeknd is on top of the Hottest 50!',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '2',
      name: 'RapCaviar',
      description: 'New music and big tracks.',
      coverArt: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '3',
      name: 'All Out 2020s',
      description: 'The biggest songs of the 2020s.',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '4',
      name: 'Hot Country',
      description: 'The hottest country music.',
      coverArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
      creator: 'Spotify'
    },
    {
      id: '5',
      name: 'Mega Hit Mix',
      description: 'A mega mix of 75 favorites from the last few years!',
      coverArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
      creator: 'Spotify'
    }
  ];

  const browseCategories = [
    { name: 'Pop', color: 'bg-gradient-to-br from-pink-400 to-pink-600' },
    { name: 'Hip-Hop', color: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { name: 'Rock', color: 'bg-gradient-to-br from-red-500 to-red-700' },
    { name: 'Jazz', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { name: 'Electronic', color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { name: 'Classical', color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { name: 'Indie', color: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
    { name: 'R&B', color: 'bg-gradient-to-br from-indigo-400 to-indigo-600' }
  ];

  const handlePlayClick = (item: any) => {
    toast.success(`Playing: ${item.name}`);
    if (onPlaylistClick) {
      onPlaylistClick(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Header with greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6 pb-4 px-6"
      >
        <h1 className="text-4xl font-bold mb-2">{getGreeting()}</h1>
      </motion.div>

      {/* Recently Played Quick Access */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="px-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyPlayed.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-white/10 hover:bg-white/20 rounded-lg p-2 flex items-center space-x-4 cursor-pointer transition-all duration-300 backdrop-blur-sm"
              onClick={() => handlePlayClick(item)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center rounded-lg">
                  <PlayCircle className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <p className="text-sm text-gray-300 capitalize">{item.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Made For You Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-6 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Made for you
          </h2>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={onBrowseAllClick}
          >
            Show all
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {madeForYou.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer"
              onClick={() => handlePlayClick(playlist)}
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={playlist.coverArt}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-green-500 rounded-full p-3 shadow-lg hover:scale-105 transition-transform">
                    <Play className="h-5 w-5 text-black ml-0.5" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-white truncate group-hover:underline">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular Playlists Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-6 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Popular playlists
          </h2>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={onBrowseAllClick}
          >
            Show all
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popularPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer"
              onClick={() => handlePlayClick(playlist)}
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={playlist.coverArt}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-green-500 rounded-full p-3 shadow-lg hover:scale-105 transition-transform">
                    <Play className="h-5 w-5 text-black ml-0.5" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-white truncate group-hover:underline">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Browse All Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="px-6 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Browse all
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {browseCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`${category.color} relative h-32 rounded-lg cursor-pointer overflow-hidden group hover:scale-105 transition-transform duration-300`}
              onClick={onBrowseAllClick}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <h3 className="text-xl font-bold text-white">
                  {category.name}
                </h3>
                
                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-black/20 rounded-full transform rotate-12" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Played Artists */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="px-6 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Recently played artists
          </h2>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            Show all
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {madeForYou.slice(0, 5).map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer text-center"
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg mx-auto">
                  <img
                    src={artist.coverArt}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-green-500 rounded-full p-2 shadow-lg hover:scale-105 transition-transform">
                    <Play className="h-4 w-4 text-black ml-0.5" />
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-white truncate group-hover:underline">
                {artist.creator}
              </h3>
              <p className="text-sm text-gray-400">Artist</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}

