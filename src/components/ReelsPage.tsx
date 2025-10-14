import { useState, useRef, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle, 
  Eye, 
  Play, 
  MoreVertical, 
  Volume2, 
  VolumeX, 
  Send,
  ChevronLeft,
  ThumbsDown,
  Shuffle
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ReelsPageProps {
  onNavigate: (page: string) => void;
}

interface ReelVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isLive?: boolean;
    viewerCount?: number;
  };
  caption: string;
  hashtags: string[];
  category: string;
  streamId?: string;
  clipTimestamp?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  isFollowing: boolean;
  createdAt: string;
  duration: number;
}

// Demo Reels Data using all local videos
const DEMO_REELS: ReelVideo[] = [
  {
    id: '1',
    videoUrl: './DemoReels/Video-153.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    creator: {
      id: 'user1',
      username: 'ShroudFPS',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 45200
    },
    caption: 'INSANE 1v5 ACE CLUTCH! They never saw it coming 🔥',
    hashtags: ['VALORANT', 'clutch', 'FPS', 'gaming'],
    category: 'VALORANT',
    streamId: 'vod_12345',
    clipTimestamp: '2:34:15',
    stats: {
      views: 2847000,
      likes: 524000,
      comments: 18900,
      shares: 12400
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-10-06T14:30:00Z',
    duration: 28
  },
  {
    id: '2',
    videoUrl: './DemoReels/Video-163.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    creator: {
      id: 'user2',
      username: 'xQc',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'HOW DID I WIN THIS?! Absolutely unbelievable ending!',
    hashtags: ['GTA', 'RP', 'funny', 'moments'],
    category: 'Grand Theft Auto V',
    streamId: 'vod_12346',
    clipTimestamp: '4:12:08',
    stats: {
      views: 3920000,
      likes: 687000,
      comments: 23400,
      shares: 19800
    },
    isLiked: true,
    isFollowing: true,
    createdAt: '2025-10-05T18:45:00Z',
    duration: 35
  },
  {
    id: '3',
    videoUrl: './DemoReels/Video-210.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    creator: {
      id: 'user3',
      username: 'Ninja',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      isVerified: true,
      isLive: false
    },
    caption: '200 IQ play! This is why positioning matters 🧠',
    hashtags: ['Fortnite', 'Victory', 'ProPlayer'],
    category: 'Fortnite',
    streamId: 'vod_12347',
    clipTimestamp: '1:45:22',
    stats: {
      views: 4210000,
      likes: 798000,
      comments: 28700,
      shares: 24100
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-10-04T12:20:00Z',
    duration: 42
  },
  {
    id: '4',
    videoUrl: './DemoReels/Video-270.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=400',
    creator: {
      id: 'user4',
      username: 'Pokimane',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 28900
    },
    caption: "I CAN'T BELIEVE THIS HAPPENED 😂 Chat went WILD!",
    hashtags: ['LeagueOfLegends', 'funny', 'fails'],
    category: 'League of Legends',
    streamId: 'vod_12348',
    clipTimestamp: '3:21:45',
    stats: {
      views: 1920000,
      likes: 412000,
      comments: 15600,
      shares: 9800
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-10-03T20:15:00Z',
    duration: 25
  },
  {
    id: '5',
    videoUrl: './DemoReels/Video-379.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400',
    creator: {
      id: 'user5',
      username: 'Ludwig',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'THE COMEBACK OF THE CENTURY! Never give up!',
    hashtags: ['Chess', 'PogChamp', 'GG'],
    category: 'Chess',
    streamId: 'vod_12349',
    clipTimestamp: '5:12:33',
    stats: {
      views: 2540000,
      likes: 589000,
      comments: 19200,
      shares: 14600
    },
    isLiked: false,
    isFollowing: true,
    createdAt: '2025-10-02T16:40:00Z',
    duration: 38
  },
  {
    id: '6',
    videoUrl: './DemoReels/Video-508.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    creator: {
      id: 'user6',
      username: 'Asmongold',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 67800
    },
    caption: 'FINALLY GOT IT! After 500 hours... the grind is real!',
    hashtags: ['WoW', 'MMO', 'Achievement'],
    category: 'World of Warcraft',
    streamId: 'vod_12350',
    clipTimestamp: '8:45:12',
    stats: {
      views: 3120000,
      likes: 654000,
      comments: 21800,
      shares: 16200
    },
    isLiked: true,
    isFollowing: true,
    createdAt: '2025-10-01T11:25:00Z',
    duration: 31
  },
  {
    id: '7',
    videoUrl: './DemoReels/Video-52.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    creator: {
      id: 'user7',
      username: 'Tfue',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'NO SCOPE HEADSHOT FROM ACROSS THE MAP! 🎯',
    hashtags: ['Warzone', 'sniper', 'headshot'],
    category: 'Call of Duty',
    streamId: 'vod_12351',
    clipTimestamp: '1:23:45',
    stats: {
      views: 1850000,
      likes: 425000,
      comments: 12400,
      shares: 8900
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-09-30T09:15:00Z',
    duration: 32
  },
  {
    id: '8',
    videoUrl: './DemoReels/Video-537.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
    creator: {
      id: 'user8',
      username: 'DrDisrespect',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 52300
    },
    caption: 'THE TWO-TIME STRIKES AGAIN! Violence, speed, momentum! 💪',
    hashtags: ['Champion', 'TwoTime', 'Doc'],
    category: 'Apex Legends',
    streamId: 'vod_12352',
    clipTimestamp: '3:45:12',
    stats: {
      views: 2750000,
      likes: 612000,
      comments: 18500,
      shares: 15200
    },
    isLiked: true,
    isFollowing: true,
    createdAt: '2025-09-29T14:30:00Z',
    duration: 29
  },
  {
    id: '9',
    videoUrl: './DemoReels/Video-596.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
    creator: {
      id: 'user9',
      username: 'TimTheTatman',
      avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'CHAT MADE ME DO THIS... and it actually worked! 😅',
    hashtags: ['Funny', 'ChatCommand', 'Fail'],
    category: 'Variety',
    streamId: 'vod_12353',
    clipTimestamp: '2:15:33',
    stats: {
      views: 1650000,
      likes: 387000,
      comments: 14200,
      shares: 9650
    },
    isLiked: false,
    isFollowing: true,
    createdAt: '2025-09-28T11:45:00Z',
    duration: 36
  },
  {
    id: '10',
    videoUrl: './DemoReels/Video-610.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400',
    creator: {
      id: 'user10',
      username: 'Sykkuno',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'OH MY GOD! Did that really just happen? I can\'t even... 😳',
    hashtags: ['AmongUs', 'Wholesome', 'Surprised'],
    category: 'Among Us',
    streamId: 'vod_12354',
    clipTimestamp: '4:23:18',
    stats: {
      views: 2180000,
      likes: 498000,
      comments: 16800,
      shares: 11400
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-09-27T16:20:00Z',
    duration: 27
  },
  {
    id: '11',
    videoUrl: './DemoReels/Video-629.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    creator: {
      id: 'user11',
      username: 'Summit1g',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 38700
    },
    caption: 'Perfect timing! This is why I love this game 🚗💨',
    hashtags: ['GTA', 'Perfect', 'Timing'],
    category: 'Grand Theft Auto V',
    streamId: 'vod_12355',
    clipTimestamp: '5:45:22',
    stats: {
      views: 1920000,
      likes: 445000,
      comments: 13500,
      shares: 8800
    },
    isLiked: true,
    isFollowing: true,
    createdAt: '2025-09-26T13:10:00Z',
    duration: 33
  },
  {
    id: '12',
    videoUrl: './DemoReels/Video-740.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    creator: {
      id: 'user12',
      username: 'Mizkif',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'REACT HARDER! Chat is going absolutely insane! 🤣',
    hashtags: ['React', 'Content', 'Funny'],
    category: 'Just Chatting',
    streamId: 'vod_12356',
    clipTimestamp: '1:34:56',
    stats: {
      views: 2340000,
      likes: 523000,
      comments: 19800,
      shares: 12900
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-09-25T18:45:00Z',
    duration: 41
  },
  {
    id: '13',
    videoUrl: './DemoReels/Video-762.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
    creator: {
      id: 'user13',
      username: 'HasanAbi',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 42100
    },
    caption: 'BREAKING: This changes everything! Let me explain... 📰',
    hashtags: ['News', 'Politics', 'Breaking'],
    category: 'Just Chatting',
    streamId: 'vod_12357',
    clipTimestamp: '3:12:44',
    stats: {
      views: 1780000,
      likes: 392000,
      comments: 15600,
      shares: 9200
    },
    isLiked: false,
    isFollowing: true,
    createdAt: '2025-09-24T20:30:00Z',
    duration: 39
  },
  {
    id: '14',
    videoUrl: './DemoReels/Video-805.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    creator: {
      id: 'user14',
      username: 'CodeMiko',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'VIRTUAL REALITY GONE WRONG! Technology is scary 🤖',
    hashtags: ['VR', 'Tech', 'Future'],
    category: 'Science & Technology',
    streamId: 'vod_12358',
    clipTimestamp: '2:45:11',
    stats: {
      views: 2650000,
      likes: 598000,
      comments: 17400,
      shares: 14600
    },
    isLiked: true,
    isFollowing: false,
    createdAt: '2025-09-23T15:20:00Z',
    duration: 35
  },
  {
    id: '15',
    videoUrl: './DemoReels/Video-83.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    creator: {
      id: 'user15',
      username: 'Amouranth',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 29400
    },
    caption: 'HOT TUB STREAM DISASTER! Things got a little too real 💦',
    hashtags: ['HotTub', 'Fail', 'Disaster'],
    category: 'Hot Tubs',
    streamId: 'vod_12359',
    clipTimestamp: '4:56:33',
    stats: {
      views: 3420000,
      likes: 687000,
      comments: 22100,
      shares: 18500
    },
    isLiked: false,
    isFollowing: true,
    createdAt: '2025-09-22T12:15:00Z',
    duration: 28
  },
  {
    id: '16',
    videoUrl: './DemoReels/Video-863.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    creator: {
      id: 'user16',
      username: 'Myth',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'BUILD BATTLE MASTERCLASS! 90s for days! 🏗️',
    hashtags: ['Fortnite', 'Building', 'Pro'],
    category: 'Fortnite',
    streamId: 'vod_12360',
    clipTimestamp: '1:12:45',
    stats: {
      views: 1890000,
      likes: 434000,
      comments: 14700,
      shares: 9800
    },
    isLiked: true,
    isFollowing: false,
    createdAt: '2025-09-21T10:45:00Z',
    duration: 44
  },
  {
    id: '17',
    videoUrl: './DemoReels/Video-896.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
    creator: {
      id: 'user17',
      username: 'Lirik',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 35600
    },
    caption: 'VARIETY GAMING AT ITS FINEST! Every game is an adventure 🎮',
    hashtags: ['Variety', 'Gaming', 'Adventure'],
    category: 'Variety',
    streamId: 'vod_12361',
    clipTimestamp: '6:23:12',
    stats: {
      views: 2120000,
      likes: 478000,
      comments: 16200,
      shares: 11300
    },
    isLiked: false,
    isFollowing: true,
    createdAt: '2025-09-20T17:30:00Z',
    duration: 37
  },
  {
    id: '18',
    videoUrl: './DemoReels/Video-971.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400',
    creator: {
      id: 'user18',
      username: 'Disguised Toast',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200',
      isVerified: true,
      isLive: false
    },
    caption: 'BIG BRAIN PLAY! 5Head strategy that actually worked 🧠',
    hashtags: ['BigBrain', '5Head', 'Strategy'],
    category: 'Hearthstone',
    streamId: 'vod_12362',
    clipTimestamp: '3:34:28',
    stats: {
      views: 1560000,
      likes: 356000,
      comments: 12900,
      shares: 7400
    },
    isLiked: true,
    isFollowing: true,
    createdAt: '2025-09-19T14:20:00Z',
    duration: 31
  },
  {
    id: '19',
    videoUrl: './DemoReels/Video-972.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
    creator: {
      id: 'user19',
      username: 'CohhCarnage',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
      isVerified: true,
      isLive: true,
      viewerCount: 18900
    },
    caption: 'POSITIVE VIBES ONLY! Wholesome gaming at its best ✨',
    hashtags: ['Positive', 'Wholesome', 'Community'],
    category: 'Variety',
    streamId: 'vod_12363',
    clipTimestamp: '2:18:55',
    stats: {
      views: 1240000,
      likes: 298000,
      comments: 9800,
      shares: 6200
    },
    isLiked: false,
    isFollowing: false,
    createdAt: '2025-09-18T11:10:00Z',
    duration: 26
  }
];

interface ReelCardProps {
  reel: ReelVideo;
  isActive: boolean;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onRemix: (id: string) => void;
  onFollow: (userId: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onNavigateToChannel: (creatorId: string) => void;
}

function ReelCard({ reel, isActive, onLike, onDislike, onRemix, onFollow, onComment, onShare, onNavigateToChannel }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing);
  const [likesCount, setLikesCount] = useState(reel.stats.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Auto-play prevented
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
    onLike(reel.id);
    
    if (newLikedState) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(reel.creator.id);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  useEffect(() => {
    setIsLiked(reel.isLiked);
    setIsFollowing(reel.isFollowing);
    setLikesCount(reel.stats.likes);
  }, [reel.id, reel.isLiked, reel.isFollowing, reel.stats.likes]);


  return (
    <div className="relative w-full h-full snap-start snap-always bg-black overflow-hidden">
      {/* Video Container with 9:16 aspect ratio - positioned exactly like overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-black rounded-[2.5rem] shadow-2xl"
        style={{ maxWidth: '56.25vh', left: '50%', transform: 'translateX(-50%)' }}
      >
        {/* Video/Image Background */}
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          loop
          muted={isMuted}
          playsInline
          onDoubleClick={handleDoubleTap}
          poster={reel.thumbnailUrl}
          style={{ pointerEvents: 'none' }}
        />

        {/* Transparent overlay for play/pause toggle */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: 'pointer', background: 'transparent', pointerEvents: 'auto' }}
          onClick={(e) => {
            // Only trigger if clicking directly on the overlay, not controls
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
            }
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-40% to-black/90 rounded-3xl pointer-events-none" />
      </div>

      {/* Double Tap Like Animation */}
      <AnimatePresence>
        {showLikeAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            style={{ maxWidth: '56.25vh', left: '50%', transform: 'translateX(-50%)' }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-28 h-28 fill-white text-white drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden"
            style={{ maxWidth: '56.25vh', left: '50%', transform: 'translateX(-50%)' }}
          >
            {/* Top Controls */}
            <div className="absolute top-4 left-0 right-0 flex flex-row items-center gap-3 z-10 overflow-x-auto scrollbar-hide pl-4 pr-4">
              {/* Audio (Mute/Unmute) Icon - far left */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full backdrop-blur-md bg-black/40 w-12 h-12 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              {/* ...removed menu button next to audio... */}
              {/* Fullscreen Icon - extreme right */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full backdrop-blur-md bg-black/40 w-12 h-12 flex-shrink-0 ml-auto"
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    } else if ((videoRef.current as any).webkitRequestFullscreen) {
                      (videoRef.current as any).webkitRequestFullscreen();
                    } else if ((videoRef.current as any).msRequestFullscreen) {
                      (videoRef.current as any).msRequestFullscreen();
                    }
                  }
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </Button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
              <div className="flex items-end gap-3">
                {/* Left Side - Creator Info & Caption */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* Creator Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <Avatar className="w-12 h-12 border-2 border-white">
                        <AvatarImage src={reel.creator.avatar} alt={reel.creator.username} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                          {reel.creator.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button className="text-white hover:text-white/80 transition-colors truncate max-w-[140px] font-semibold">
                            @{reel.creator.username}
                          </button>
                          {reel.creator.isVerified && (
                            <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        {reel.creator.isLive && reel.creator.viewerCount && (
                          <div className="flex items-center gap-1.5 text-sm text-red-400 mt-0.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{formatCount(reel.creator.viewerCount)} watching</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Subscribe Button */}
                      {!isFollowing && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow();
                          }}
                          className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-all shadow-lg"
                        >
                          Subscribe
                        </motion.button>
                      )}
                    </div>
                  </motion.div>

                  {/* Caption */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <p className="text-white leading-relaxed line-clamp-2 drop-shadow-lg">
                      {reel.caption}
                    </p>
                  </motion.div>

                  {/* Category & Stream Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-xl backdrop-blur-sm px-4 py-2 rounded-2xl">
                      {reel.category}
                    </Badge>
                  </motion.div>
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Progress Indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 z-30 rounded-full mx-4"
        style={{ maxWidth: 'calc(56.25vh - 2rem)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: isActive ? "100%" : "0%" }}
          transition={{ duration: reel.duration, ease: "linear" }}
        />
      </div>

      {/* Right Side - Action Buttons (Adjacent to Reel) */}
      {showInfo && (
        <div 
          className="absolute bottom-20 flex flex-col items-center gap-4 z-40"
          style={{ left: 'calc(50% + 28.125vh + 8px)' }}
        >
          {/* Menu Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <MoreVertical className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>

          {/* Like Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-1"
            style={{ marginTop: '200px' }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Heart
                className={`w-7 h-7 transition-colors ${
                  isLiked 
                    ? "fill-red-500 text-red-500" 
                    : "text-white"
                }`}
              />
            </motion.button>
            <span className="text-white text-xs font-medium">
              {formatCount(likesCount)}
            </span>
          </motion.div>

          {/* Dislike Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDislike(reel.id);
              }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ThumbsDown className="w-6 h-6 text-white" />
            </motion.button>
            <span className="text-white text-xs font-medium">Dislike</span>
          </motion.div>

          {/* Comment Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onComment(reel.id);
              }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
            <span className="text-white text-xs font-medium">
              {formatCount(reel.stats.comments)}
            </span>
          </motion.div>

          {/* Share Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onShare(reel.id);
              }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Send className="w-6 h-6 text-white" />
            </motion.button>
            <span className="text-white text-xs font-medium">Share</span>
          </motion.div>

          {/* Remix Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemix(reel.id);
              }}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Shuffle className="w-6 h-6 text-white" />
            </motion.button>
            <span className="text-white text-xs font-medium">Remix</span>
          </motion.div>

          {/* Creator Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToChannel(reel.creator.id);
              }}
            >
              <img 
                src={reel.creator.avatar} 
                alt={reel.creator.username}
                className="w-full h-full object-cover"
              />
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}


export function ReelsPage({ onNavigate }: ReelsPageProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reelsData, setReelsData] = useState(DEMO_REELS);
  const [isNavigating, setIsNavigating] = useState(false);

  // Navigation functions
  const navigateToReel = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < reelsData.length && !isNavigating) {
      setIsNavigating(true);
      setCurrentReelIndex(newIndex);
      
      const container = containerRef.current;
      if (container) {
        container.scrollTo({
          top: newIndex * container.clientHeight,
          behavior: 'smooth'
        });
      }
      
      // Reset navigation lock after smooth scroll completes
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const navigateToChannel = (creatorId: string) => {
    // Navigate to channel page - you can implement this based on your routing
    console.log('Navigating to channel:', creatorId);
    onNavigate('channel'); // You may need to pass the creator ID
  };

  // Wheel scroll handling (desktop)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isNavigating) return;
      if (e.deltaY < 0) {
        // Scroll up = next reel
        navigateToReel(currentReelIndex + 1);
      } else if (e.deltaY > 0) {
        // Scroll down = previous reel
        navigateToReel(currentReelIndex - 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentReelIndex, isNavigating]);

  // Touch handling for mobile swipes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || isNavigating) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging || isNavigating) return;
      isDragging = false;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = startY - endY;
      const deltaX = startX - endX;

      const minSwipeDistance = 50;

      // Horizontal swipe (left = go to channel)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe left - navigate to channel
          const currentReel = reelsData[currentReelIndex];
          if (currentReel) {
            navigateToChannel(currentReel.creator.id);
          }
        }
        return;
      }

      // Vertical swipe (up/down navigation)
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY < 0) {
          // Swipe up = next reel
          navigateToReel(currentReelIndex + 1);
        } else {
          // Swipe down = previous reel
          navigateToReel(currentReelIndex - 1);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentReelIndex, isNavigating, reelsData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          navigateToReel(currentReelIndex - 1);
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          navigateToReel(currentReelIndex + 1);
          break;
        case 'ArrowLeft':
        case 'h':
          e.preventDefault();
          const currentReel = reelsData[currentReelIndex];
          if (currentReel) {
            navigateToChannel(currentReel.creator.id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, isNavigating, reelsData]);

  // Update scroll position when index changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const reelHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / reelHeight);
      
      if (newIndex !== currentReelIndex && newIndex >= 0 && newIndex < DEMO_REELS.length && !isNavigating) {
        setCurrentReelIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentReelIndex, isNavigating]);

  const handleLike = (id: string) => {
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              stats: {
                ...reel.stats,
                likes: reel.isLiked ? reel.stats.likes - 1 : reel.stats.likes + 1,
              },
            }
          : reel
      )
    );
  };

  const handleFollow = (userId: string) => {
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.creator.id === userId
          ? { ...reel, isFollowing: !reel.isFollowing }
          : reel
      )
    );
    toast.success('Following updated!');
  };

  const handleComment = (id: string) => {
    toast.info('Comments feature coming soon!');
  };

  const handleShare = (id: string) => {
    toast.success('Share link copied to clipboard!');
  };

  const handleDislike = (id: string) => {
    toast.info('Dislike feature coming soon!');
  };

  const handleRemix = (id: string) => {
    toast.success('Remix feature coming soon! 🎵');
  };

  // Simulate user object and navigation for sidebar
  const user = {
    id: 'user1',
    username: 'ShroudFPS',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    channel: true,
  };

  // Sidebar navigation handler
  const handleSidebarPageChange = (page: string) => {
    if (page === 'reels') return; // Already on reels
    onNavigate(page);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-row">
      {/* Fully functional Sidebar from Home Page */}
      <AppSidebar
        currentPage="reels"
        onPageChange={handleSidebarPageChange}
        user={user}
        onProfileClick={() => onNavigate('profile')}
        onSettingsClick={() => onNavigate('settings')}
        onChannelClick={() => onNavigate('channel')}
        onCreateChannel={() => onNavigate('create-channel')}
      />
      {/* Reels Feed */}
      <div
        ref={containerRef}
        className="flex-1 h-full overflow-y-scroll scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {reelsData.map((reel, index) => (
          <div key={reel.id} className="w-full h-full snap-start">
            <ReelCard
              reel={reel}
              isActive={index === currentReelIndex}
              onLike={handleLike}
              onDislike={handleDislike}
              onRemix={handleRemix}
              onFollow={handleFollow}
              onComment={handleComment}
              onShare={handleShare}
              onNavigateToChannel={navigateToChannel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
