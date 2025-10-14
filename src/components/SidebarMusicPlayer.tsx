
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from './ui/sidebar';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  ChevronRight,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  audioUrl: string;
  coverArt?: string;
  genre?: string;
}

interface SidebarMusicPlayerProps {
  onPlaylistClick?: () => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function SidebarMusicPlayer({ 
  onPlaylistClick: _onPlaylistClick, 
  currentPage,
  onPageChange 
}: SidebarMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  const [playlist] = useState<Track[]>([
    {
      id: '1',
      title: 'Chill Vibes',
      artist: 'Lo-Fi Beats',
      duration: 180,
      audioUrl: '/music/chill-vibes.mp3',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      genre: 'Lo-Fi'
    },
    {
      id: '2',
      title: 'Focus Flow',
      artist: 'Ambient Sounds',
      duration: 240,
      audioUrl: '/music/focus-flow.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
      genre: 'Ambient'
    },
    {
      id: '3',
      title: 'Study Session',
      artist: 'Nature Sounds',
      duration: 300,
      audioUrl: '/music/study-session.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
      genre: 'Nature'
    },
    {
      id: '4',
      title: 'Coffee Shop Jazz',
      artist: 'Jazz Collective',
      duration: 210,
      audioUrl: '/music/coffee-jazz.mp3',
      coverArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=100&h=100&fit=crop',
      genre: 'Jazz'
    },
    {
      id: '5',
      title: 'Electronic Dreams',
      artist: 'Synth Wave',
      duration: 195,
      audioUrl: '/music/electronic-dreams.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=100&h=100&fit=crop',
      genre: 'Electronic'
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    if (playlist.length > 0) {
      setCurrentTrack(playlist[0]);
    }
  }, [playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Note: In a real implementation, you'd have actual audio files
      // For demo purposes, we'll simulate playback
      toast.info(`Now playing: ${currentTrack.title} by ${currentTrack.artist}`);
      // audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setCurrentTime(0);
    
    if (isPlaying) {
      toast.info(`Now playing: ${playlist[nextIndex].title}`);
    }
  };

  const handlePrevious = () => {
    let prevIndex;
    if (currentTime > 3) {
      // If more than 3 seconds have passed, restart current track
      setCurrentTime(0);
      return;
    }
    
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setCurrentTime(0);
    
    if (isPlaying) {
      toast.info(`Now playing: ${playlist[prevIndex].title}`);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackSelect = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    toast.info(`Selected: ${track.title} by ${track.artist}`);
  };

  const displayTracks = isExpanded ? playlist : playlist.slice(0, 3);

  return (
    <>
      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        preload="metadata"
        className="hidden"
      />

      {/* Music Player Header */}
      <SidebarMenuItem>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between px-2 py-2"
        >
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4 text-sidebar-foreground/70" />
            <span className="text-sm font-semibold text-sidebar-foreground">
              Music Player
            </span>
            <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full">
              {playlist.length}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted/80"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Show less' : 'Show playlist'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </SidebarMenuItem>

      {/* Current Track Display */}
      {currentTrack && (
        <SidebarMenuItem>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-2 py-2"
          >
            <div className="bg-muted/30 rounded-lg p-3 space-y-3">
              {/* Track Info */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {currentTrack.coverArt ? (
                      <img 
                        src={currentTrack.coverArt} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  {isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-tight">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {currentTrack.artist}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Heart className="h-3 w-3" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  className="w-full h-1"
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setIsShuffled(!isShuffled)}
                  >
                    <Shuffle className={`h-3 w-3 ${isShuffled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handlePrevious}
                  >
                    <SkipBack className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleNext}
                  >
                    <SkipForward className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
                      const currentIndex = modes.indexOf(repeatMode);
                      const nextMode = modes[(currentIndex + 1) % modes.length];
                      setRepeatMode(nextMode);
                    }}
                  >
                    <Repeat className={`h-3 w-3 ${repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  className="flex-1 h-1"
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </motion.div>
        </SidebarMenuItem>
      )}

      {/* Playlist */}
      <SidebarMenuSub className="ml-0">
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 'auto',
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {displayTracks.map((track, index) => (
            <SidebarMenuSubItem key={track.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.7 + (index * 0.1),
                  duration: 0.4 
                }}
                whileHover={{ x: 3 }}
              >
                <SidebarMenuSubButton
                  onClick={() => handleTrackSelect(track, playlist.findIndex(t => t.id === track.id))}
                  className={`relative group h-auto py-2 px-2 ${
                    currentTrack?.id === track.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full min-h-[35px]">
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {track.coverArt ? (
                          <img 
                            src={track.coverArt} 
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      
                      {currentTrack?.id === track.id && isPlaying && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -top-0.5 -right-0.5"
                        >
                          <div className="h-2 w-2 bg-green-500 rounded-full border border-background" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm truncate leading-tight ${
                          currentTrack?.id === track.id ? 'font-medium text-primary' : 'font-medium'
                        }`}>
                          {track.title}
                        </p>
                        {track.genre && (
                          <Badge variant="outline" className="text-xs px-1 py-0 leading-tight">
                            {track.genre}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground leading-tight truncate">
                          {track.artist}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {formatTime(track.duration)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </SidebarMenuSubButton>
              </motion.div>
            </SidebarMenuSubItem>
          ))}
        </motion.div>
      </SidebarMenuSub>

      {/* Show More/Less Button */}
      {playlist.length > 3 && (
        <SidebarMenuItem>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="px-2 py-1"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 h-8"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                <ChevronRight className="h-3 w-3" />
              </motion.div>
              <span>
                {isExpanded 
                  ? 'Show less tracks' 
                  : `Show ${playlist.length - 3} more tracks`
                }
              </span>
            </Button>
          </motion.div>
        </SidebarMenuItem>
      )}

      {/* Browse Music Library */}
      <SidebarMenuItem>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="px-2 py-1"
        >
          <SidebarMenuButton
            onClick={() => {
              if (onPageChange) {
                onPageChange('music');
              } else {
                toast.info('Navigate to music library');
              }
            }}
            isActive={currentPage === 'music'}
            className="text-sm font-medium relative h-9 hover:bg-muted/80"
          >
            <Music className="h-4 w-4" />
            <span>Browse Library</span>
            {currentPage === 'music' && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                layoutId="musicIndicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </SidebarMenuButton>
        </motion.div>
      </SidebarMenuItem>
    </>
  );
}

