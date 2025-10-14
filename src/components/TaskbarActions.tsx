
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Plus, 
  User, 
  Mic, 
  MicOff,
  Video,
  Users,
  Settings,
  LogOut,
  Clock,
  Heart,
  Eye,
  MessageSquare,

} from 'lucide-react';
import { toast } from 'sonner';
import { VideoUpload } from './VideoUpload';
import { LiveStreamManager, useIsStreaming } from './LiveStreamManager';

interface TaskbarActionsProps {
  user: any;
  onProfileClick: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const TaskbarActions: React.FC<TaskbarActionsProps> = ({
  user,
  onProfileClick,
  onLogout,

  onSearchChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLiveStreamManager, setShowLiveStreamManager] = useState(false);
  const { isStreaming } = useIsStreaming();

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'like',
      message: 'TechReviewer liked your video "Amazing 4K Nature Documentary"',
      time: '2 minutes ago',
      unread: true,
      avatar: null
    },
    {
      id: '2',
      type: 'comment',
      message: 'New comment on "Latest Tech Review: Gaming Laptop Performance Test 2024"',
      time: '15 minutes ago',
      unread: true,
      avatar: null
    },
    {
      id: '3',
      type: 'subscriber',
      message: 'ChefMaster subscribed to your channel',
      time: '1 hour ago',
      unread: false,
      avatar: null
    },
    {
      id: '4',
      type: 'milestone',
      message: 'Your video reached 10K views!',
      time: '3 hours ago',
      unread: false,
      avatar: null
    },
    {
      id: '5',
      type: 'system',
      message: 'Your channel verification has been approved',
      time: '1 day ago',
      unread: false,
      avatar: null
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onSearchChange) {
        onSearchChange(transcript);
      }
      toast.success(`Voice search: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Voice search error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCreateChannel = () => {
    toast.success('Channel creation feature coming soon!');
    setShowChannelMenu(false);
  };

  const handleCreateVideo = () => {
    setShowUploadModal(true);
    setShowChannelMenu(false);
  };

  const handleGoLive = () => {
    setShowLiveStreamManager(true);
    setShowChannelMenu(false);
  };

  const handleCreatePlaylist = () => {
    toast.success('Playlist creation feature coming soon!');
    setShowChannelMenu(false);
  };

  const handleVideoUploaded = (video: any) => {
    toast.success(`Video "${video.title}" uploaded successfully! Processing will begin shortly.`);
    setShowUploadModal(false);
  };

  const handleLiveStreamEnd = () => {
    setShowLiveStreamManager(false);
    toast.success('Stream ended successfully!');
  };

  const handleNotificationClick = (notification: any) => {
    toast.info(`Opened: ${notification.message}`);
  };

  const handleMarkAllRead = () => {
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'subscriber': return <Users className="h-4 w-4 text-green-500" />;
      case 'milestone': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'system': return <Settings className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Search Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVoiceSearch}
          disabled={isListening}
          className={`relative ${isListening ? 'bg-red-500/20 text-red-500' : ''}`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Mic className="h-4 w-4" />
            </motion.div>
          ) : (
            <MicOff className="h-4 w-4" />
          )}
          {isListening && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </Button>
      </motion.div>

      {/* Create Content Menu */}
      <Popover open={showChannelMenu} onOpenChange={setShowChannelMenu}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" className="relative">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCreateVideo}
            >
              <Video className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${isStreaming ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400'}`}
              onClick={handleGoLive}
            >
              <div className={`h-4 w-4 mr-2 ${isStreaming ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isStreaming ? '' : 'animate-pulse'}`} />
              {isStreaming ? 'Manage Stream' : 'Go Live'}
            </Button>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCreateChannel}
            >
              <Users className="h-4 w-4 mr-2" />
              Create Channel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCreatePlaylist}
            >
              <Clock className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Notifications */}
      <Popover open={showNotifications} onOpenChange={setShowNotifications}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="p-2 space-y-1">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      notification.unread ? 'bg-primary/5 border border-primary/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Profile Menu */}
      <Popover open={showProfile} onOpenChange={setShowProfile}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" className="p-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <div className="px-2 py-1.5 border-b">
              <p className="font-medium text-sm">{user?.username || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                onProfileClick();
                setShowProfile(false);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Your Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                toast.info('Channel settings coming soon!');
                setShowProfile(false);
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Separator />
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  onLogout();
                  setShowProfile(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Video Upload Modal */}
      <VideoUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* Live Stream Modal */}
      {/* Live Stream Manager */}
      {showLiveStreamManager && (
        <div className="fixed inset-0 z-50 bg-background">
          <LiveStreamManager 
            user={user}
            onStreamEnd={handleLiveStreamEnd}
          />
          
          {/* Close button */}
          <button
            onClick={() => setShowLiveStreamManager(false)}
            className="fixed top-4 left-4 z-50 bg-background/95 hover:bg-muted rounded-full p-2 border shadow-lg"
            title="Close Stream Manager"
            aria-label="Close Stream Manager"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

