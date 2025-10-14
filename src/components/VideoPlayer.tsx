
import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';

import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Play, Pause, Volume2, VolumeX, Download, Maximize, Settings, 
  SkipBack, SkipForward, Repeat, Shuffle, Share2, 
  RotateCcw, RotateCw, Subtitles, Monitor,
  Gauge, Moon, Sun, PictureInPicture2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { CardOverlay } from './cards/CardOverlay';
import { useCards } from '../contexts/CardContext';
import { VideoCard } from '../types/cards';
import { SUPPORTED_LANGUAGES } from './LanguageSelector';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  videoId?: string;
  isCreator?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
  onTheaterMode?: () => void;
  onToggleMiniPlayer?: () => void;
  isTheaterMode?: boolean;
  theaterVariant?: 'standard' | 'cinema' | 'ultrawide';
  onCardClick?: (card: VideoCard) => void;
  onAddCard?: () => void;
  onPreviousVideo?: () => void;
  onNextVideo?: () => void;
  onVideoEnd?: () => void;
  hasNextVideo?: boolean;
  hasPreviousVideo?: boolean;
  currentVideoIndex?: number;
  totalVideos?: number;
}

interface QualityOption {
  label: string;
  value: string;
  resolution: string;
}

interface PlaybackSpeed {
  label: string;
  value: number;
}

interface Caption {
  label: string;
  value: string;
  language: string;
}

const qualityOptions: QualityOption[] = [
  { label: '4K', value: '2160p', resolution: '3840x2160' },
  { label: '1440p', value: '1440p', resolution: '2560x1440' },
  { label: '1080p', value: '1080p', resolution: '1920x1080' },
  { label: '720p', value: '720p', resolution: '1280x720' },
  { label: '480p', value: '480p', resolution: '854x480' },
  { label: '360p', value: '360p', resolution: '640x360' },
];

const playbackSpeeds: PlaybackSpeed[] = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2x', value: 2 },
];

const captionOptions: Caption[] = [
  { label: 'Off', value: 'off', language: '' },
  ...SUPPORTED_LANGUAGES.slice(0, 10).map(lang => ({
    label: lang.name,
    value: lang.code,
    language: lang.nativeName
  }))
];

export function VideoPlayer({ 
  videoUrl,
  videoId: _videoId,
  // isCreator = false, // Reserved for future creator features 
  title, 
  onDownload, 
  onShare, 
  onTheaterMode,
  onToggleMiniPlayer,
  isTheaterMode = false,
  theaterVariant = 'standard',
  onCardClick,
  // onAddCard, // Reserved for interactive card functionality
  onPreviousVideo,
  onNextVideo,
  onVideoEnd,
  hasNextVideo = false,
  hasPreviousVideo = false,
  // currentVideoIndex = 1, // Reserved for playlist functionality
  // totalVideos = 1 // Reserved for playlist functionality
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { getActiveCards, setCurrentTime: updateCardTime } = useCards();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [captions, setCaptions] = useState('off');
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  // PiP functionality removed - using MiniPlayer instead
  const [showStats, setShowStats] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Detect mobile device with better accuracy
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouchDevice || isSmallScreen || isMobileUserAgent);
    };
    
    checkMobile();
    
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      updateCardTime(time);
    };
    const updateDuration = () => setDuration(video.duration);
    
    // PiP handlers removed - using MiniPlayer functionality instead
    const handleMiniPlayerActivation = () => {
      console.log('Activating MiniPlayer mode');
      // Trigger MiniPlayer through parent component
      toast.success('MiniPlayer mode activated - Press i key to activate');
    };

    // Enhanced keyboard shortcuts with mobile consideration
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts on mobile or when typing in inputs
      if (isMobile || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 't':
          e.preventDefault();
          toggleTheaterMode();
          toast.success(`Theater mode ${isTheaterMode ? 'disabled' : 'enabled'}`, {
            description: 'Press T to toggle theater mode anytime',
            duration: 2000
          });
          break;
        case 'i':
          e.preventDefault();
          handleMiniPlayerActivation();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'l':
          e.preventDefault();
          toggleLoop();
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(!showKeyboardHelp);
          break;
        case 'p':
          if (e.shiftKey) {
            e.preventDefault();
            handlePreviousVideo();
          }
          break;
        case 'n':
          if (e.shiftKey) {
            e.preventDefault();
            handleNextVideo();
          }
          break;
      }
    };

    const handleVideoError = (e: Event) => {
      console.error('Video error:', e);
      toast.error('Video failed to load.');
    };

    const handleVideoLoad = () => {
      console.log('Video loaded successfully');
    };

    const handleVideoEnded = () => {
      if (onVideoEnd) {
        onVideoEnd();
      } else if (hasNextVideo && onNextVideo) {
        toast.info('Playing next video...', { duration: 2000 });
        setTimeout(() => onNextVideo(), 1000); // Auto-play next video after 1 second
      } else {
        toast.info('Playlist ended');
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    // PiP event listeners removed - using MiniPlayer instead
    video.addEventListener('error', handleVideoError);
    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('ended', handleVideoEnded);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      // PiP event listener cleanup removed
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('ended', handleVideoEnded);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, volume, isLoop]);

  // Show controls when video is paused
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
    }
  }, [isPlaying]);

  const togglePlayPause = async () => {
    if (!videoRef.current || isLoading) return;
    
    // Prevent rapid clicking
    const now = Date.now();
    if (now - lastClickTime < 200) return;
    setLastClickTime(now);
    
    // Haptic feedback simulation for mobile
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(50);
    }
    
    setIsLoading(true);
    
    try {
      if (isPlaying) {
        await videoRef.current.pause();
        setIsPlaying(false);
        toast.info('Video paused');
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
        toast.success('Playing video');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      toast.error('Error playing video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (newTime: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = newVolume[0];
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      toast.success(`Started downloading "${title}" in ${quality} quality`);
    }
  };

  const handlePlaybackSpeedChange = (speed: string) => {
    const video = videoRef.current;
    if (!video) return;
    const speedValue = parseFloat(speed);
    video.playbackRate = speedValue;
    setPlaybackSpeed(speedValue);
    toast.success(`Playback speed set to ${speed === '1' ? 'Normal' : speed + 'x'}`);
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const handlePreviousVideo = () => {
    if (onPreviousVideo && hasPreviousVideo) {
      onPreviousVideo();
    } else if (!hasPreviousVideo) {
      toast.info('No previous video in playlist');
    }
  };

  const handleNextVideo = () => {
    if (onNextVideo && hasNextVideo) {
      onNextVideo();
    } else if (!hasNextVideo) {
      toast.info('No next video in playlist');
    }
  };

  const toggleLoop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = !isLoop;
    setIsLoop(!isLoop);
    toast.success(`Loop ${!isLoop ? 'enabled' : 'disabled'}`);
  };

  // PiP functionality completely removed - replaced with MiniPlayer
  // Users should use the MiniPlayer button or press 'i' key to activate MiniPlayer mode

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard');
    }
  };

  const toggleTheaterMode = () => {
    if (onTheaterMode) {
      onTheaterMode();
      toast.success(`Theater mode ${isTheaterMode ? 'disabled' : 'enabled'}`);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAvailableQualities = () => {
    // Simulate device capability detection
    const screenWidth = window.screen.width;
    const maxQuality = screenWidth >= 3840 ? '2160p' : 
                      screenWidth >= 2560 ? '1440p' : 
                      screenWidth >= 1920 ? '1080p' : 
                      screenWidth >= 1280 ? '720p' : '480p';
    
    const maxIndex = qualityOptions.findIndex(q => q.value === maxQuality);
    return qualityOptions.slice(maxIndex);
  };

  // isPiPSupported function removed - PiP functionality replaced with MiniPlayer

  const getTheaterVideoClasses = (variant: 'standard' | 'cinema' | 'ultrawide') => {
    const baseClasses = 'object-contain transition-all duration-500 ease-in-out cursor-pointer';
    
    // Enhanced theater mode with smooth transitions and mobile-responsive scaling
    if (isTheaterMode) {
      switch (variant) {
        case 'standard':
          return `${baseClasses} w-full h-auto min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] max-h-[70vh] sm:max-h-[75vh] aspect-video`;
        case 'cinema':
          return `${baseClasses} w-full h-auto min-h-[35vh] sm:min-h-[45vh] md:min-h-[50vh] max-h-[65vh] sm:max-h-[70vh] aspect-video`;
        case 'ultrawide':
          return `${baseClasses} w-full h-auto min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] max-h-[60vh] sm:max-h-[70vh] aspect-video`;
        default:
          return `${baseClasses} w-full h-auto min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] max-h-[70vh] sm:max-h-[75vh] aspect-video`;
      }
    }
    
    // Regular mode - mobile-first responsive
    return `${baseClasses} w-full aspect-video min-h-[30vh] sm:min-h-auto`;
  };

  return (
    <div 
      className={`relative overflow-hidden group bg-black transition-all duration-500 ease-in-out touch-manipulation select-none ${
        isTheaterMode 
          ? 'rounded-xl w-full shadow-2xl border border-gray-700/50 ring-4 ring-blue-500/20 ring-opacity-50' 
          : 'rounded-lg w-full'
      } ${
        isTheaterMode 
          ? 'shadow-[0_0_50px_rgba(59,130,246,0.15),0_0_100px_rgba(59,130,246,0.1)] backdrop-blur-sm' 
          : ''
      }`}
      role="region"
      aria-label="Video player"
      onClick={(e) => {
        // Only handle clicks if they're not on the control button
        if (!(e.target as HTMLElement).closest('button')) {
          togglePlayPause();
        }
      }}
    >
      <video
        ref={videoRef}
        className={`${getTheaterVideoClasses(theaterVariant)} touch-manipulation`}
        poster="/api/placeholder/800/450"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isMobile && setShowControls(false)}
        onTouchStart={() => {
          setShowControls(true);
          // Hide controls after 3 seconds on mobile
          if (isMobile) {
            setTimeout(() => setShowControls(false), 3000);
          }
        }}
        onDoubleClick={() => onTheaterMode && onTheaterMode()}
        loop={isLoop}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
        disablePictureInPicture={false}
        controlsList="nodownload"
        aria-label="Video content"
        tabIndex={0}
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Fallback for demo - use a working video URL */}
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Interactive Cards Overlay */}
      <CardOverlay 
        cards={getActiveCards(currentTime)} 
        onCardClick={onCardClick || (() => {})}
      />



      {/* Overlay Controls - YouTube Style */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"
          >
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 flex justify-between items-start">
              <motion.div 
                className="flex items-center space-x-1 sm:space-x-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <Badge variant="secondary" className="bg-red-600 text-white border-0">
                  LIVE
                </Badge>
                <Badge variant="outline" className="text-white border-white/30">
                  {quality}
                </Badge>
                {isTheaterMode && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                    THEATER
                  </Badge>
                )}
                {/* PiP badge removed - using MiniPlayer instead */}
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-white hover:bg-white/20"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStats(!showStats)}
                  className="text-white hover:bg-white/20"
                  title="Show stats"
                >
                  <Gauge className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                  className="text-white hover:bg-white/20"
                  title="Keyboard shortcuts (?)"
                >
                  ?
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Center Control Group */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {(showControls || !isPlaying) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.2
                    }}
                    className="flex items-center gap-3 sm:gap-4 md:gap-6 pointer-events-auto"
                  >
                    {/* Previous Video Button */}
                    <motion.div
                      whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="touch-manipulation relative group cursor-pointer"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePreviousVideo();
                        }}
                        className="relative text-white hover:bg-white/25 active:bg-white/35 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full transition-all duration-300 backdrop-blur-md bg-black/40 border-2 border-white/40 shadow-xl hover:shadow-white/20 group-hover:border-white/60 focus:ring-2 focus:ring-white/50 aspect-square flex items-center justify-center"
                        aria-label="Previous video"
                        title="Previous video (Shift+P)"
                      >
                        <SkipBack className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 drop-shadow-lg" />
                      </Button>
                    </motion.div>

                    {/* Main Play/Pause Button */}
                    <motion.div
                      whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="touch-manipulation relative group cursor-pointer"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                    >
                    {/* Enhanced circular container with inner shadow */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {/* Inner circle shadow for depth */}
                      <div className="absolute inset-1 rounded-full shadow-inner bg-gradient-to-br from-white/10 to-transparent" />
                      
                      {/* Ripple effect */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 bg-white/20 rounded-full"
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      disabled={isLoading}
                      className={`relative text-white hover:bg-white/35 active:bg-white/45 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full transition-all duration-300 backdrop-blur-md bg-black/50 border-3 border-white/50 shadow-2xl hover:shadow-white/30 group-hover:border-white/70 focus:ring-4 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent aspect-square flex items-center justify-center ${isLoading ? 'cursor-wait opacity-75' : 'cursor-pointer'}`}
                      aria-label={isLoading ? 'Loading...' : (isPlaying ? 'Pause video' : 'Play video')}
                      title={isLoading ? 'Loading...' : (isPlaying ? 'Pause (Space)' : 'Play (Space)')}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center justify-center"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-2 border-white/30 border-t-white rounded-full"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key={isPlaying ? 'pause' : 'play'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 drop-shadow-lg" />
                            ) : (
                              <Play className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 ml-0.5 sm:ml-1 drop-shadow-lg" />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Enhanced circular pulse animation for play state */}
                      {!isPlaying && !isLoading && (
                        <>
                          <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                            className="absolute inset-0 border-3 border-white/50 rounded-full"
                          />
                          <motion.div
                            initial={{ scale: 1, opacity: 0.3 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              ease: "easeOut",
                              delay: 0.5
                            }}
                            className="absolute inset-0 border-2 border-blue-400/60 rounded-full"
                          />
                        </>
                      )}
                      
                      {/* Enhanced circular loading ring animation */}
                      {isLoading && (
                        <>
                          <motion.div
                            initial={{ scale: 1, opacity: 0.4 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ 
                              duration: 1.2, 
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                            className="absolute inset-0 border-3 border-blue-400/70 rounded-full"
                          />
                          <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.1, opacity: 0 }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity,
                              ease: "easeOut",
                              delay: 0.2
                            }}
                            className="absolute inset-0 border-2 border-white/50 rounded-full"
                          />
                        </>
                      )}
                    </Button>
                    
                    {/* Enhanced circular glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                    
                    {/* Circular highlight ring */}
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-300 pointer-events-none" />
                    
                    {/* Success feedback ring */}
                    {isPlaying && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-1 border-2 border-green-400/50 rounded-full pointer-events-none"
                      />
                    )}
                  </motion.div>

                    {/* Next Video Button */}
                    <motion.div
                      whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="touch-manipulation relative group cursor-pointer"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNextVideo();
                        }}
                        className="relative text-white hover:bg-white/25 active:bg-white/35 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full transition-all duration-300 backdrop-blur-md bg-black/40 border-2 border-white/40 shadow-xl hover:shadow-white/20 group-hover:border-white/60 focus:ring-2 focus:ring-white/50 aspect-square flex items-center justify-center"
                        aria-label="Next video"
                        title="Next video (Shift+N)"
                      >
                        <SkipForward className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 drop-shadow-lg" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Skip Controls Container */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="flex items-center justify-between h-full px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="touch-manipulation"
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleSkip(-10)}
                    className="text-white hover:bg-white/20 active:bg-white/30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 flex items-center justify-center backdrop-blur-sm bg-black/20"
                    aria-label="Skip backward 10 seconds"
                  >
                    <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="touch-manipulation"
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleSkip(10)}
                    className="text-white hover:bg-white/20 active:bg-white/30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 flex items-center justify-center backdrop-blur-sm bg-black/20"
                    aria-label="Skip forward 10 seconds"
                  >
                    <RotateCw className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
              {/* Progress Bar */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="px-2 sm:px-0"
              >
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  className="w-full [&>span:first-child]:bg-red-600 [&>span:last-child]:bg-red-600 [&>span:first-child]:h-1 sm:[&>span:first-child]:h-1.5 [&>span:last-child]:h-3 [&>span:last-child]:w-3 sm:[&>span:last-child]:h-4 sm:[&>span:last-child]:w-4 touch-manipulation"
                  onValueChange={handleSeek}
                />
              </motion.div>

              {/* Control Buttons */}
              <motion.div 
                className="flex items-center justify-between px-1 sm:px-2"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip(-10)}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden sm:flex items-center justify-center"
                    aria-label="Skip backward 10 seconds"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip(10)}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden sm:flex items-center justify-center"
                    aria-label="Skip forward 10 seconds"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </Button>
                    <div className="w-12 sm:w-16 md:w-20 hidden sm:block">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="[&>span:first-child]:bg-white [&>span:last-child]:bg-white [&>span:last-child]:h-3 [&>span:last-child]:w-3 touch-manipulation"
                      />
                    </div>
                  </div>

                  <span className="text-white text-xs sm:text-sm font-mono hidden md:block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Essential controls always visible */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden sm:flex items-center justify-center"
                    aria-label="Share video"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLoop}
                    className={`text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden md:flex items-center justify-center ${isLoop ? 'text-blue-400' : ''}`}
                    aria-label="Toggle loop"
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden md:flex items-center justify-center ${isShuffle ? 'text-blue-400' : ''}`}
                    aria-label="Toggle shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden sm:flex items-center justify-center"
                    aria-label="Download video"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {/* Playback Speed - Hidden on mobile */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-auto sm:h-9 rounded-full touch-manipulation transition-all duration-200 hidden lg:flex items-center justify-center"
                        aria-label="Playback speed"
                      >
                        <Gauge className="h-4 w-4 mr-1" />
                        <span className="text-xs">{playbackSpeed}x</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2" side="top">
                      <div className="space-y-1">
                        {playbackSpeeds.map((speed) => (
                          <Button
                            key={speed.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlaybackSpeedChange(speed.value.toString())}
                            className={`w-full justify-start touch-manipulation ${playbackSpeed === speed.value ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {speed.label}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Captions - Hidden on mobile */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden md:flex items-center justify-center"
                        aria-label="Captions"
                      >
                        <Subtitles className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2" side="top">
                      <div className="space-y-1">
                        {captionOptions.map((caption) => (
                          <Button
                            key={caption.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => setCaptions(caption.value)}
                            className={`w-full justify-start touch-manipulation ${captions === caption.value ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {caption.label}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Quality Settings */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200"
                        aria-label="Quality settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2" side="top">
                      <div className="space-y-1">
                        {getAvailableQualities().map((option) => (
                          <Button
                            key={option.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuality(option.value)}
                            className={`w-full justify-start touch-manipulation ${quality === option.value ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* MiniPlayer Activate Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('🎬 MiniPlayer button clicked from VideoPlayer');
                      if (onToggleMiniPlayer) {
                        onToggleMiniPlayer();
                      } else {
                        toast.info('MiniPlayer not available');
                      }
                    }}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden sm:flex items-center justify-center"
                    title="Open in Mini Player"
                    aria-label="Open in Mini Player"
                  >
                    <PictureInPicture2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheaterMode}
                    className={`text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200 hidden md:flex items-center justify-center ${
                      isTheaterMode ? 'text-blue-400 bg-blue-400/20' : ''
                    }`}
                    title={`${isTheaterMode ? 'Exit' : 'Enter'} Theater Mode (T)`}
                    aria-label={`${isTheaterMode ? 'Exit' : 'Enter'} Theater Mode`}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20 active:bg-white/30 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-manipulation transition-all duration-200"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overlay */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1"
          >
            <div>Resolution: {quality}</div>
            <div>Speed: {playbackSpeed}x</div>
            <div>Volume: {Math.round(volume * 100)}%</div>
            <div>Buffer: 98%</div>
            <div>Dropped Frames: 0</div>
            <div>MiniPlayer: Available</div>
            <div>Theater: {isTheaterMode ? 'On' : 'Off'}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Help Overlay - Hidden on mobile */}
      <AnimatePresence>
        {showKeyboardHelp && !isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-4 bg-black/90 backdrop-blur-sm rounded-lg p-6 text-white overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardHelp(false)}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-400">Playback</h4>
                <div className="flex justify-between">
                  <span>Play/Pause</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Play/Pause</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Skip backward 10s</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">←</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Skip forward 10s</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">→</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Toggle loop</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">L</kbd>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-green-400">View & Audio</h4>
                <div className="flex justify-between">
                  <span>Theater mode</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">T</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Picture-in-Picture</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">I</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Fullscreen</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">F</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Mute/Unmute</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">M</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Volume up/down</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">↑↓</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Show shortcuts</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded">?</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

