import { useState, useEffect, useRef } from 'react';
import { Auth } from './components/Auth';
import { HomePage } from './components/HomePage';
import { UserProfile } from './components/UserProfile';
import { ProfileUpdateDemo } from './components/ProfileUpdateDemo';
import { CreatorProfileLanding } from './components/CreatorProfileLanding';
import { SettingsPage } from './components/SettingsPage';
import { VideoWatchPage } from './components/VideoWatchPage';
import { AppSidebar } from './components/AppSidebar';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { EnhancedMiniPlayer as MiniPlayer } from './components/WorkingMiniPlayer';
import { useFloatingPlayerManager, createAccessControl } from './components/FloatingPlayerManager';
import { MusicPage } from './components/MusicPage';
import { MusicLandingPage } from './components/MusicLandingPage';
import { HistoryPage } from './components/HistoryPage';
import { PlaylistsPage } from './components/PlaylistsPage';
import { WatchLaterPage } from './components/WatchLaterPage';
import { LikedVideosPage } from './components/LikedVideosPage';
import { DownloadsPage } from './components/DownloadsPage';
import { ChannelPage } from './components/ChannelPage';
import { CreateChannelPage } from './components/CreateChannelPage';
import { CreatorDashboard } from './components/CreatorDashboard';
import { ChannelAnalytics } from './components/ChannelAnalytics';
import { Earnings } from './components/Earnings';
import { ChannelEdit } from './components/ChannelEdit';
import QuickEditLandingPage from './components/QuickEditLandingPage';
import { FeedbackPage } from './components/FeedbackPage';
import { ReportPage } from './components/ReportPage';
import { ActivityHistoryPage } from './components/ActivityHistoryPage';
import { HelpPage } from './components/HelpPage';
import { TranslationDemo } from './components/TranslationDemo';
import { GoLiveDemo } from './components/GoLiveDemo';
import { ModernLiveStreamingView } from './components/live/ModernLiveStreamingView';
import { CommunityPage } from './components/CommunityPage';
import { ReelsPage } from './components/ReelsPage';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { QueueProvider } from './components/QueueProvider';
import { InteractiveCardProvider } from './contexts/InteractiveCardContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './components/ui/breadcrumb';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedBrandName } from './components/AnimatedBrandName';
import { TaskbarActions } from './components/TaskbarActions';
import { EnhancedSearchBar } from './components/EnhancedSearchBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Users } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  username: string;
  registrationDate: string;
  recoveryCode?: string;
  channel?: UserChannel;
}

interface UserChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  createdAt: string;
  description?: string;
  profilePicture?: string;
  bannerImage?: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: {
    name: string;
    avatar?: string;
    subscribers?: string;
  };
  quality: string[];
  description?: string;
  likes?: string;
  dislikes?: string;
}

type AppState = 'auth' | 'home' | 'video' | 'watch' | 'profile' | 'settings' | 'profile-update-demo' | 'creator-profile-landing' | 'subscriptions' | 'music' | 'music-landing' | 'musicLibrary' | 'trending' | 'history' | 'playlists' | 'watch-later' | 'watchlater' | 'liked-videos' | 'liked' | 'downloads' | 'channel' | 'create-channel' | 'creator-dashboard' | 'channel-analytics' | 'earnings' | 'channel-edit' | 'feedback' | 'report' | 'activity-history' | 'activityHistory' | 'help' | 'quick-edit' | 'translation-demo' | 'go-live-demo' | 'live-streaming' | 'community';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('auth');
  const [currentStreamConfig, setCurrentStreamConfig] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  
  // Global MiniPlayer state
  const globalVideoRef = useRef<HTMLVideoElement>(null);
  const [globalPlaybackState, setGlobalPlaybackState] = useState({
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isPlaying: false,
    playbackRate: 1,
    quality: '1080p'
  });
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelCategory, setChannelCategory] = useState('');
  
  // Global Floating Player Manager - Always call hook to avoid Rules of Hooks violation
  const globalFloatingPlayer = useFloatingPlayerManager({
    video: currentVideo || null,
    videoRef: globalVideoRef as React.RefObject<HTMLVideoElement>,
    playbackState: globalPlaybackState,
    accessControl: createAccessControl(false, false, false),
    queuePosition: { current: 1, total: 1 },
    hasNext: false,
    hasPrevious: false,
    onPlaybackChange: (state) => {
      setGlobalPlaybackState(prev => ({ ...prev, ...state }));
    },
    onPrevious: () => {},
    onNext: () => {},
    onToggleTheater: () => {
      if (currentVideo) {
        setCurrentState('watch');
      }
    },
    onShowComments: () => {},
    onShowQueue: () => {},
    onClose: () => {},
    onNavigateToHome: () => {
      setCurrentState('home');
    }
  });

  // Initialize demo accounts and check for existing session on app load
  useEffect(() => {
    // Initialize demo accounts if they don't exist
    const existingUsers = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
    if (existingUsers.length === 0) {
      const demoUsers: UserData[] = [
        {
          id: 'demo1',
          email: 'demo@streamvault.com',
          username: 'DemoUser',
          registrationDate: new Date().toISOString(), // Fresh registration with recovery code
          recoveryCode: 'ABCD1234EFGH5678'
        },
        {
          id: 'demo2',
          email: 'test@streamvault.com',
          username: 'TestUser',
          registrationDate: new Date().toISOString(),
          recoveryCode: 'WXYZ9876IJKL4321'
        },
        {
          id: 'demo3',
          email: 'admin@streamvault.com',
          username: 'AdminUser',
          registrationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (recovery code expired)
          // No recovery code since it's expired
        }
      ];
      localStorage.setItem('streamingUsers', JSON.stringify(demoUsers));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('Loaded user from localStorage:', user);
      
      if (user.channel) {
        console.log('User channel profile picture type:', typeof user.channel.profilePicture, user.channel.profilePicture);
        console.log('User channel banner image type:', typeof user.channel.bannerImage, user.channel.bannerImage);
      }
      
      // Check if recovery code should be removed (after 7 days)
      const registrationDate = new Date(user.registrationDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 7 && user.recoveryCode) {
        // Remove recovery code after 7 days
        user.recoveryCode = undefined;
        
        // Update in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
        const updatedUsers = existingUsers.map((u: UserData) => u.id === user.id ? user : u);
        localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      setCurrentUser(user);
      setCurrentState('home');
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentState('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentState('auth');
  };

  const handleVideoClick = (video: Video) => {
    setCurrentVideo(video);
    setCurrentState('watch');
  };

  const handleChannelCreated = (channelData: any) => {
    if (!currentUser) return;

    // Helper function to convert File objects to URLs
    const getImageUrl = (image: any): string => {
      if (!image) return '';
      if (typeof image === 'string') return image;
      if (image instanceof File || image instanceof Blob) {
        return URL.createObjectURL(image);
      }
      return '';
    };

    // Create a new channel object with additional metadata
    const newChannel: UserChannel = {
      id: `channel_${currentUser.id}_${Date.now()}`,
      name: channelData.name,
      handle: channelData.handle,
      description: channelData.description || '',
      profilePicture: getImageUrl(channelData.profilePicture) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channelData.name)}&backgroundColor=6366f1,8b5cf6,a855f7`,
      bannerImage: getImageUrl(channelData.bannerImage) || `https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=1200&h=300&fit=crop&crop=center`,
      createdAt: new Date().toISOString(),
      subscribers: Math.floor(Math.random() * 5000) + 100, // Random subscriber count for demo
      totalViews: Math.floor(Math.random() * 100000) + 1000, // Random view count for demo
      totalVideos: Math.floor(Math.random() * 50) + 5 // Random video count for demo
    };

    // Update user data with channel information
    const updatedUser = {
      ...currentUser,
      channel: newChannel
    };

    // Save to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
    const updatedUsers = existingUsers.map((u: UserData) => 
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Also save channel separately for global channel access
    const existingChannels = JSON.parse(localStorage.getItem('userChannels') || '[]');
    existingChannels.push(newChannel);
    localStorage.setItem('userChannels', JSON.stringify(existingChannels));

    // Update current user state
    setCurrentUser(updatedUser);
    
    // Show success message and navigate to creator dashboard
    toast.success(`🎉 Channel "${newChannel.name}" created successfully! Creator features unlocked!`);
    
    // Navigate to the creator dashboard
    setCurrentState('creator-dashboard');
  };

  const handleBackToHome = () => {
    setCurrentVideo(null);
    setCurrentState('home');
  };

  const handleProfileClick = () => {
    setCurrentState('profile');
  };

  const handleSettingsClick = () => {
    setCurrentState('settings');
  };

  const handlePageChange = (page: string) => {
    setCurrentState(page as AppState);
  };

  const handleViewCreatorDashboard = () => {
    if (!currentUser?.channel) {
      toast.error('Please create a channel first to access creator features');
      return;
    }
    setCurrentState('creator-dashboard');
  };

  const handleViewAnalytics = () => {
    if (!currentUser?.channel) {
      toast.error('Please create a channel first to access analytics');
      return;
    }
    setCurrentState('channel-analytics');
  };

  const handleViewEarnings = () => {
    if (!currentUser?.channel) {
      toast.error('Please create a channel first to access earnings');
      return;
    }
    setCurrentState('earnings');
  };

  const handleEditChannel = () => {
    if (!currentUser?.channel) {
      toast.error('Please create a channel first');
      return;
    }
    setCurrentState('channel-edit');
  };

  const handleStartLiveStream = (mode: 'quick' | 'studio', config: any) => {
    console.log(`🎬 Starting ${mode} live stream:`, config);
    setCurrentStreamConfig({ mode, ...config });
    setCurrentState('live-streaming');
    toast.success(`${mode === 'quick' ? '📱 Quick Live' : '🎥 Studio Live'} stream started!`);
  };

  const handleEndLiveStream = () => {
    setCurrentStreamConfig(null);
    setCurrentState('creator-dashboard');
    toast.info('Live stream ended');
  };

  const handleSaveChannel = (updatedChannel: Partial<UserChannel>) => {
    if (!currentUser?.channel) return;
    
    const updatedChannelData = {
      ...currentUser.channel,
      ...updatedChannel
    };
    
    const updatedUser = {
      ...currentUser,
      channel: updatedChannelData
    };
    
    // Update localStorage
    const existingUsers = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
    const updatedUsers = existingUsers.map((u: UserData) => 
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update current user state
    setCurrentUser(updatedUser);
    
    toast.success('Channel updated successfully!');
    setCurrentState('creator-dashboard');
  };

  const handleChannelClick = (channelId: string) => {
    setCurrentChannelId(channelId);
    setCurrentState('channel');
  };

  const handleCreateChannel = () => {
    if (!currentUser) {
      toast.error('Please log in to create a channel');
      return;
    }
    
    if (currentUser.channel) {
      toast.info('You already have a channel! Redirecting to your channel...');
      setCurrentChannelId(currentUser.channel.id);
      setCurrentState('channel');
      return;
    }
    
    setCurrentState('create-channel');
  };

  const handleBackFromChannel = () => {
    setCurrentChannelId(null);
    setCurrentState('home');
  };

  const handleSubmitChannel = () => {
    if (channelName && channelDescription && channelCategory) {
      toast.success(`Channel "${channelName}" created successfully! You can now upload content and go live.`);
      setShowCreateChannelModal(false);
      setChannelName('');
      setChannelDescription('');
      setChannelCategory('');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const renderMainContent = () => {
    switch (currentState) {
      case 'home':
      case 'trending':
        return (
          <HomePage
            user={currentUser}
            onVideoClick={handleVideoClick}
            onProfileClick={handleProfileClick}
            onNavigate={(page) => setCurrentState(page as AppState)}
            onChannelClick={handleChannelClick}
          />
        );
      
      case 'subscriptions':
        return <SubscriptionsPage onVideoClick={handleVideoClick} onChannelClick={handleChannelClick} />;
      
      case 'reels':
        return <ReelsPage onNavigate={(page) => setCurrentState(page as AppState)} />;
      
      case 'music':
      case 'music-landing':
        return (
          <MusicLandingPage 
            onTrackClick={(track) => toast.info(`Playing: ${track.title}`)}
            onPlaylistClick={(playlist) => toast.info(`Playing playlist: ${playlist.name}`)}
            onBrowseAllClick={() => setCurrentState('musicLibrary')}
          />
        );
      
      case 'musicLibrary':
        return <MusicPage onTrackClick={(track) => toast.info(`Playing: ${track.title}`)} />;
      
      case 'quick-edit':
        return <QuickEditLandingPage user={currentUser} />;
      
      case 'history':
        return <HistoryPage onVideoClick={handleVideoClick} />;
      
      case 'playlists':
        return <PlaylistsPage onVideoClick={handleVideoClick} />;
      
      case 'watch-later':
      case 'watchlater':
        return <WatchLaterPage onVideoClick={handleVideoClick} />;
      
      case 'liked-videos':
      case 'liked':
        return <LikedVideosPage onVideoClick={handleVideoClick} />;
      
      case 'downloads':
        return <DownloadsPage onVideoClick={handleVideoClick} />;
      
      case 'channel':
        return currentChannelId ? (
          <ChannelPage 
            channelId={currentChannelId}
            onBack={handleBackFromChannel}
            onVideoClick={handleVideoClick}
          />
        ) : null;
      
      case 'create-channel':
        return (
          <CreateChannelPage 
            onBack={handleBackToHome}
            onChannelCreated={handleChannelCreated}
          />
        );

case 'creator-dashboard':
  return currentUser?.channel ? (
    <CreatorDashboard
      channel={currentUser.channel}
      onViewAnalytics={handleViewAnalytics}
      onViewEarnings={handleViewEarnings}
      onEditChannel={handleEditChannel}
      onScheduleContent={() => toast.info('Schedule feature allows you to plan video uploads and live streams!')}
      onNavigate={(page) => setCurrentState(page as AppState)}
      onStreamStart={handleStartLiveStream}
    />
  ) : null;      case 'channel-analytics':
        return currentUser?.channel ? (
          <ChannelAnalytics 
            channel={currentUser.channel}
            onBack={handleViewCreatorDashboard}
          />
        ) : null;

      case 'earnings':
        return currentUser?.channel ? (
          <Earnings 
            channel={currentUser.channel}
            onBack={handleViewCreatorDashboard}
          />
        ) : null;

      case 'channel-edit':
        return currentUser?.channel ? (
          <ChannelEdit 
            channel={currentUser.channel}
            onSave={handleSaveChannel}
            onCancel={handleViewCreatorDashboard}
          />
        ) : null;
      
      case 'profile':
        return currentUser ? (
          <UserProfile 
            user={currentUser} 
            onLogout={handleLogout}
            onCreateChannel={handleCreateChannel}
            onChannelClick={(channelId) => {
              // Navigate to channel page - you can implement this later
              console.log('Navigate to channel:', channelId);
            }}
          />
        ) : null;
      
      case 'settings':
        return <SettingsPage onNavigate={(page) => setCurrentState(page as AppState)} />;
      
      case 'profile-update-demo':
        return <ProfileUpdateDemo />;
      
      case 'creator-profile-landing':
        return (
          <CreatorProfileLanding 
            onBack={() => setCurrentState('home')}
            onSaveComplete={(profile) => {
              console.log('Profile saved:', profile);
              toast.success('Profile updated successfully!');
              setCurrentState('creator-dashboard');
            }}
          />
        );
      
      case 'feedback':
        return <FeedbackPage />;
      
      case 'community':
        return (
          <CommunityPage 
            user={currentUser ? {
              id: currentUser.id,
              name: currentUser.username,
              avatar: currentUser.channel?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.username)}`,
              verified: !!currentUser.channel,
              isCreator: !!currentUser.channel
            } : undefined}
            onNavigate={(page) => setCurrentState(page as AppState)}
          />
        );
      
      case 'report':
        return <ReportPage />;
      
      case 'activity-history':
      case 'activityHistory':
        return <ActivityHistoryPage user={currentUser} />;
      
      case 'help':
        return <HelpPage />;
      
      case 'translation-demo':
        return <TranslationDemo />;
      
      case 'go-live-demo':
        return <GoLiveDemo user={currentUser} onStreamStart={handleStartLiveStream} />;
      
      case 'live-streaming':
        try {
          return (
            <ModernLiveStreamingView 
              streamConfig={currentStreamConfig}
              user={currentUser}
              onEndStream={handleEndLiveStream}
            />
          );
        } catch (error) {
          console.error('Error rendering ModernLiveStreamingView:', error);
          toast.error('Failed to load live streaming interface');
          setCurrentState('creator-dashboard');
          return null;
        }
      
      default:
        return (
          <HomePage
            user={currentUser}
            onVideoClick={handleVideoClick}
            onProfileClick={handleProfileClick}
            onNavigate={(page) => setCurrentState(page as AppState)}
            onChannelClick={handleChannelClick}
          />
        );
    }
  };

  const getBreadcrumbTitle = () => {
    switch (currentState) {
      case 'home': return 'Home';
      case 'trending': return 'Trending';
      case 'subscriptions': return 'Subscriptions';
      case 'music': 
      case 'music-landing': return 'Music';
      case 'musicLibrary': return 'Music Library';
      case 'history': return 'Watch History';
      case 'playlists': return 'Playlists';
      case 'watch-later':
      case 'watchlater': return 'Watch Later';
      case 'liked-videos':
      case 'liked': return 'Liked Videos';
      case 'downloads': return 'Downloads';
      case 'channel': return 'Channel';
      case 'create-channel': return 'Create Channel';
      case 'creator-dashboard': return 'Creator Dashboard';
      case 'channel-analytics': return 'Channel Analytics';
      case 'earnings': return 'Earnings & Monetization';
      case 'channel-edit': return 'Edit Channel';
      case 'profile': return 'Profile Settings';
      case 'settings': return 'Settings';
      case 'profile-update-demo': return 'Profile Update Demo';
      case 'creator-profile-landing': return 'Creator Profile Setup';
      case 'feedback': return 'Send Feedback';
      case 'report': return 'Report Issue';
      case 'activity-history':
      case 'activityHistory': return 'Activity History';
      case 'help': return 'Help Center';
      default: return 'Home';
    }
  };

  // Show auth screen if not logged in
  if (currentState === 'auth') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AnimatePresence mode="wait">
          <motion.div 
            className="min-h-screen bg-background"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <Auth onLogin={handleLogin} />
            <Toaster position="top-right" />
          </motion.div>
          </AnimatePresence>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  // Show video watch page without sidebar
  if (currentState === 'watch') {
    return currentVideo ? (
      <ThemeProvider>
        <LanguageProvider>
          <QueueProvider>
            <AnimatePresence mode="wait">
            <motion.div 
              className="min-h-screen bg-background"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <VideoWatchPage
                video={currentVideo}
                onBack={handleBackToHome}
                onVideoClick={handleVideoClick}
                onChannelClick={handleChannelClick}
                onCreateChannel={handleCreateChannel}
                onNavigateToHome={handleBackToHome}
                globalFloatingPlayer={globalFloatingPlayer}
                onMiniPlayerActivated={(videoRef, playbackState) => {
                  // Transfer video state to global when MiniPlayer is activated
                  if (globalVideoRef.current && videoRef.current) {
                    globalVideoRef.current.src = videoRef.current.src;
                    globalVideoRef.current.currentTime = playbackState.currentTime;
                    globalVideoRef.current.volume = playbackState.volume;
                    globalVideoRef.current.muted = playbackState.isMuted;
                  }
                  setGlobalPlaybackState(playbackState);
                }}
              />
              <Toaster position="top-right" />
            </motion.div>
            </AnimatePresence>
          </QueueProvider>
        </LanguageProvider>
      </ThemeProvider>
    ) : null;
  }

  // Main app with sidebar
  return (
    <ThemeProvider>
      <LanguageProvider>
        <InteractiveCardProvider>
          <QueueProvider>
          <AnimatePresence mode="wait">
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
          <SidebarProvider>
            <AppSidebar 
              currentPage={currentState}
              onPageChange={handlePageChange}
              user={currentUser}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
              onChannelClick={handleChannelClick}
              onCreateChannel={handleCreateChannel}
            />
            <SidebarInset>
              <motion.header 
                className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Left section - Sidebar trigger and Brand */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SidebarTrigger className="-ml-1" />
                  </motion.div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="hidden lg:block">
                    <AnimatedBrandName />
                  </div>
                </div>

                {/* Center section - Enhanced Search Bar */}
                <div className="flex-1 max-w-2xl mx-4">
                  <EnhancedSearchBar
                    value={globalSearchQuery}
                    onChange={setGlobalSearchQuery}
                    placeholder="Search videos, channels..."
                  />
                </div>

                {/* Right section - Taskbar Actions and Breadcrumb */}
                <div className="flex items-center gap-4 min-w-0 flex-1 justify-end">
                  <div className="hidden md:block">
                    <Breadcrumb>
                      <BreadcrumbList>
                        {currentState === 'musicLibrary' ? (
                          <>
                            <BreadcrumbItem>
                              <BreadcrumbLink 
                                onClick={() => setCurrentState('music')}
                                className="cursor-pointer text-sm"
                              >
                                Music
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <motion.div
                                key={currentState}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <BreadcrumbPage className="text-sm font-medium">
                                  Library
                                </BreadcrumbPage>
                              </motion.div>
                            </BreadcrumbItem>
                          </>
                        ) : (
                          <BreadcrumbItem>
                            <motion.div
                              key={currentState}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <BreadcrumbPage className="text-sm font-medium">
                                {getBreadcrumbTitle()}
                              </BreadcrumbPage>
                            </motion.div>
                          </BreadcrumbItem>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                  <TaskbarActions
                    user={currentUser}
                    onProfileClick={handleProfileClick}
                    onLogout={handleLogout}
                    searchQuery={globalSearchQuery}
                    onSearchChange={setGlobalSearchQuery}
                  />
                </div>
              </motion.header>
              <motion.div 
                className="flex flex-1 flex-col gap-4 p-4 pt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentState}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    {renderMainContent()}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </SidebarInset>

            <Toaster position="top-right" />
          </SidebarProvider>
        </motion.div>
      </AnimatePresence>
          </QueueProvider>
        </InteractiveCardProvider>

      {/* Create Channel Modal */}
      <Dialog open={showCreateChannelModal} onOpenChange={setShowCreateChannelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create Your Channel
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name *</Label>
              <Input
                id="channelName"
                placeholder="Enter your channel name..."
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelDescription">Channel Description *</Label>
              <Textarea
                id="channelDescription"
                placeholder="Describe what your channel is about..."
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelCategory">Category *</Label>
              <Select value={channelCategory} onValueChange={setChannelCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="news">News & Politics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Channel Features:</strong> Once created, you'll be able to upload videos, 
                go live, interact with your audience, and build your community. Your channel will 
                be discoverable by other users on the platform.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateChannelModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitChannel} className="gap-2">
                <Users className="h-4 w-4" />
                Create Channel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global MiniPlayer - appears on all pages */}
      {currentVideo && globalFloatingPlayer && (
        <div>
          {/* Hidden global video element for continuous playback */}
          <video
            ref={globalVideoRef}
            className="hidden"
            src={`/api/placeholder/video/${currentVideo.id}`}
            preload="metadata"
            onTimeUpdate={(e) => {
              const target = e.target as HTMLVideoElement;
              setGlobalPlaybackState(prev => ({ 
                ...prev, 
                currentTime: target.currentTime,
                duration: target.duration || 0 
              }));
            }}
            onPlay={() => setGlobalPlaybackState(prev => ({ ...prev, isPlaying: true }))}
            onPause={() => setGlobalPlaybackState(prev => ({ ...prev, isPlaying: false }))}
            onVolumeChange={(e) => {
              const target = e.target as HTMLVideoElement;
              setGlobalPlaybackState(prev => ({ 
                ...prev, 
                volume: target.volume,
                isMuted: target.muted 
              }));
            }}
          />
          <MiniPlayer
          video={currentVideo}
          videoRef={globalVideoRef}
          isVisible={globalFloatingPlayer.isVisible && globalFloatingPlayer.currentMode === 'miniplayer'}
          isPlaying={globalPlaybackState.isPlaying}
          currentTime={globalPlaybackState.currentTime}
          duration={globalPlaybackState.duration}
          volume={globalPlaybackState.volume}
          isMuted={globalPlaybackState.isMuted}
          position={globalFloatingPlayer.preferences.miniPlayerPosition}
          size={globalFloatingPlayer.preferences.miniPlayerSize}
          queuePosition={{ current: 1, total: 1 }}
          hasNext={false}
          hasPrevious={false}
          canUseMultiPlayer={globalFloatingPlayer.canUseMultiPlayer}
          onPlay={() => {
            setGlobalPlaybackState(prev => ({ ...prev, isPlaying: true }));
            if (globalVideoRef.current) {
              globalVideoRef.current.play();
            }
          }}
          onPause={() => {
            setGlobalPlaybackState(prev => ({ ...prev, isPlaying: false }));
            if (globalVideoRef.current) {
              globalVideoRef.current.pause();
            }
          }}
          onSeek={(time) => {
            setGlobalPlaybackState(prev => ({ ...prev, currentTime: time }));
            if (globalVideoRef.current) {
              globalVideoRef.current.currentTime = time;
            }
          }}
          onVolumeChange={(volume) => {
            setGlobalPlaybackState(prev => ({ ...prev, volume }));
            if (globalVideoRef.current) {
              globalVideoRef.current.volume = volume;
            }
          }}
          onMute={() => {
            const newMuted = !globalPlaybackState.isMuted;
            setGlobalPlaybackState(prev => ({ ...prev, isMuted: newMuted }));
            if (globalVideoRef.current) {
              globalVideoRef.current.muted = newMuted;
            }
          }}
          onPrevious={() => {}}
          onNext={() => {}}
          onToggleTheater={() => {
            if (currentVideo) {
              setCurrentState('watch');
            }
          }}
          onToggleMultiPlayer={globalFloatingPlayer.toggleMultiPlayer}
          onClose={globalFloatingPlayer.exitMiniPlayer}
          onPositionChange={globalFloatingPlayer.updateMiniPlayerPosition}
          onSizeChange={globalFloatingPlayer.updateMiniPlayerSize}
          onShowComments={() => {}}
          onShowQueue={() => {}}
        />
        </div>
      )}

      </LanguageProvider>
    </ThemeProvider>
  );
}