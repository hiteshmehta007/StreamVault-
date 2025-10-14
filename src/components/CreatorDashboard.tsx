import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScheduleCalendar } from './ScheduleCalendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { QuickEditModal } from './QuickEditModal';
// import { SimpleChannelEdit } from './SimpleChannelEdit';
import { MinimalChannelEdit } from './MinimalChannelEdit';
import { ProfilePhotoEdit } from './ProfilePhotoEdit';
import { QuickEditStudio } from './QuickEditStudio';
import { VideoSelector } from './VideoSelector';
import { VideoUpload } from './VideoUpload';
import { useIsStreaming } from './LiveStreamManager';
import { GoLiveButton } from './live/GoLiveButton';
import { LiveStreamPreview } from './live/LiveStreamPreview';
import { 
  BarChart3, 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Video, 
  Clock, 
  Heart,
  MessageSquare,
  Share2,
  Upload,
  Edit,
  Camera,
  Verified,
  User,
  Settings,
  Instagram,
  Twitter,
  Globe,
  MessageCircle,
  Plus,
  Trash2,
  Calendar,
  SquarePen,
  Save,
  Mail,
  FileText,
  Sparkles
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
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
  displayName?: string;
  bio?: string;
  contactEmail?: string;
  socialLinks?: SocialLink[];
}

interface CreatorDashboardProps {
  channel?: UserChannel;
  onUploadVideo?: () => void;
  onViewAnalytics?: () => void;
  onViewEarnings?: () => void;
  onEditChannel?: () => void;
  onScheduleContent?: () => void;
  onBannerUpdate?: (newBannerUrl: string) => void;
  onNavigate?: (page: string) => void;
  onStreamStart?: (mode: 'quick' | 'studio', config: any) => void;
}

// Default channel data to prevent crashes
const DEFAULT_CHANNEL: UserChannel = {
  id: 'default-1',
  name: 'Your Channel',
  handle: 'yourchannel',
  subscribers: 2840,
  totalViews: 125340,
  totalVideos: 45,
  createdAt: '2024-01-01',
  description: 'Welcome to your creator dashboard! Start uploading content to grow your channel.',
  profilePicture: 'https://api.dicebear.com/7.x/initials/svg?seed=Your%20Channel&backgroundColor=6366f1',
  bannerImage: 'https://picsum.photos/1200/300?random=1'
};

export function CreatorDashboard({ 
  channel,
  // onUploadVideo = () => {}, // Reserved for upload functionality
  onViewAnalytics = () => {},
  onStreamStart = () => {},
  onViewEarnings = () => {},
  onNavigate = () => {},
  // onEditChannel = () => {},
  // onScheduleContent = () => {}, // Reserved for scheduling functionality
  onBannerUpdate = () => {}
}: CreatorDashboardProps) {
  // Safe channel data with fallbacks - moved before state initialization
  const safeChannel: UserChannel = {
    ...DEFAULT_CHANNEL,
    ...channel
  };

  const [timeRange] = useState('7d');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerLoadFailed, setBannerLoadFailed] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userVideos, setUserVideos] = useState<any[]>([]);

  // Profile editing state - now safeChannel is available
  const [profileData, setProfileData] = useState({
    displayName: safeChannel.displayName || safeChannel.name || '',
    handle: safeChannel.handle || '',
    bio: safeChannel.bio || safeChannel.description || '',
    contactEmail: safeChannel.contactEmail || '',
    socialLinks: safeChannel.socialLinks || []
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  

  // Quick Edit Modal state
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [isVideoSelectorOpen, setIsVideoSelectorOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // Channel Edit Modal state - MINIMAL VERSION
  const [isMinimalEditOpen, setIsMinimalEditOpen] = useState(false);

  // Profile Photo Edit state
  const [isProfilePhotoEditOpen, setIsProfilePhotoEditOpen] = useState(false);

  // Schedule Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Live Stream Preview state
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Live streaming state
  const { isStreaming, streamData } = useIsStreaming();
  const [showLiveStreamManager, setShowLiveStreamManager] = useState(false);

  // Auto-show live preview when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setShowLivePreview(true);
    }
  }, [isStreaming]);

  // Get current user for streaming
  const getCurrentUser = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return currentUser;
    } catch {
      return null;
    }
  };

  // Safe function to open channel edit modal - MINIMAL VERSION
  const openChannelEdit = () => {
    try {
      console.log('Opening minimal channel editor...');
      setIsMinimalEditOpen(true);
    } catch (error) {
      console.error('Error opening editor:', error);
      toast.error('Unable to open editor.');
    }
  };

  // Safe function to open profile photo edit modal
  const openProfilePhotoEdit = () => {
    try {
      console.log('Opening profile photo editor...');
      setIsProfilePhotoEditOpen(true);
    } catch (error) {
      console.error('Error opening photo editor:', error);
      toast.error('Unable to open photo editor.');
    }
  };

  // Handle profile photo save
  const handleProfilePhotoSave = (photoData: string | File) => {
    try {
      console.log('Profile photo updated:', photoData);
      // Here you would typically upload the photo to your backend
      // For now, we'll just log it
    } catch (error) {
      console.error('Error saving profile photo:', error);
      toast.error('Failed to save profile photo.');
    }
  };

  // Channel save handler with error handling - TEMPORARILY DISABLED
  // const handleChannelSave = (updatedData: any) => {
  //   try {
  //     console.log('Channel data updated:', updatedData);
  //     
  //     // Here you would typically update the channel data in your state/backend
  //     // For now, we'll just show a success message
  //     toast.success('Channel updated successfully!');
  //     
  //     // You could also call onEditChannel if you need to notify parent component
  //     if (onEditChannel) {
  //       onEditChannel();
  //     }
  //   } catch (error) {
  //     console.error('Error saving channel data:', error);
  //     toast.error('Failed to save channel changes. Please try again.');
  //   }
  // };

  // Mock data for demonstration
  const analytics = {
    views: 45230,
    watchTime: 1250,
    subscribers: safeChannel.subscribers,
    revenue: 2847.50,
    viewsChange: 12.5,
    subscribersChange: 8.3,
    watchTimeChange: 15.2,
    revenueChange: 23.1
  };



  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  // Enhanced URL converter with better validation and fallbacks
  const getSafeImageUrl = (url: any): string | null => {
    if (!url) {
      console.log('No image URL provided');
      return null;
    }
    
    // Handle string URLs (including data URLs)
    if (typeof url === 'string') {
      const trimmedUrl = url.trim();
      console.log('Processing string URL:', trimmedUrl.substring(0, 50) + (trimmedUrl.length > 50 ? '...' : ''));
      
      // Check if it's an invalid blob URL (starts with blob: but might be expired)
      if (trimmedUrl.startsWith('blob:')) {
        console.warn('Found blob URL which may be expired:', trimmedUrl);
        // Try to use it anyway, but it might fail
        return trimmedUrl;
      }
      
      // Check if it's a data URL
      if (trimmedUrl.startsWith('data:')) {
        console.log('Found data URL - this should persist across refreshes');
        return trimmedUrl;
      }
      
      // Regular HTTP/HTTPS URLs
      if (trimmedUrl.startsWith('http')) {
        console.log('Found HTTP URL');
        return trimmedUrl;
      }
      
      return trimmedUrl || null;
    }
    
    // Handle File/Blob objects (shouldn't happen with proper conversion)
    if (url instanceof File || url instanceof Blob) {
      console.warn('Found File/Blob object - this should have been converted to data URL');
      const objectUrl = URL.createObjectURL(url);
      console.log('Created temporary object URL:', objectUrl);
      return objectUrl;
    }
    
    // Handle object with url property
    if (typeof url === 'object' && url !== null) {
      console.log('Processing object URL, keys:', Object.keys(url));
      
      // Try common URL properties
      const urlProperties = ['url', 'src', 'href', 'link', 'image', 'path', 'profilePicture', 'bannerImage'];
      
      for (const prop of urlProperties) {
        if (url[prop] && typeof url[prop] === 'string') {
          const trimmedUrl = url[prop].trim();
          console.log(`Found URL in object property '${prop}':`, trimmedUrl.substring(0, 50) + (trimmedUrl.length > 50 ? '...' : ''));
          return trimmedUrl || null;
        }
      }
      
      // Check if it's a nested object with image data
      if (url.data && typeof url.data === 'string') {
        console.log('Found URL in data property:', url.data.substring(0, 50) + (url.data.length > 50 ? '...' : ''));
        return url.data.trim();
      }
    }
    
    console.warn('Invalid image URL format:', typeof url, 'Keys:', typeof url === 'object' ? Object.keys(url || {}) : 'N/A');
    return null;
  };

  // Get image URLs with proper fallback handling
  const getProfileUrl = () => {
    const url = getSafeImageUrl(safeChannel.profilePicture);
    if (url) {
      console.log('Profile picture URL:', url.substring(0, 50) + (url.length > 50 ? '...' : ''));
      return url;
    }
    console.log('Profile picture failed, using default URL');
    return DEFAULT_CHANNEL.profilePicture;
  };
  
  const getBannerUrl = () => {
    const url = getSafeImageUrl(safeChannel.bannerImage);
    if (url && url !== DEFAULT_CHANNEL.bannerImage) {
      // Check if it's a valid data URL or HTTP URL
      if (url.startsWith('data:image/') || url.startsWith('http')) {
        console.log('Banner image URL:', url.substring(0, 50) + (url.length > 50 ? '...' : ''));
        return url;
      }
      // If it's a blob URL, it might be expired but let's try it
      if (url.startsWith('blob:')) {
        console.warn('Using potentially expired blob URL:', url);
        return url;
      }
    }
    console.log('No valid banner image, returning null');
    return null;
  };
  
  const profileUrl = getProfileUrl();
  const bannerUrl = getBannerUrl();

  // Reset banner failure state when banner URL changes
  useEffect(() => {
    if (bannerUrl) {
      setBannerLoadFailed(false);
      setBannerLoaded(false);
    }
  }, [bannerUrl]);

  // Load user videos from localStorage
  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem('userVideos') || '[]');
    setUserVideos(savedVideos);
  }, []);

  // Debug logging after function declaration
  console.log('=== Creator Dashboard Debug ===');
  console.log('Input channel data:', channel);
  console.log('Merged safe channel:', safeChannel);
  console.log('Profile picture raw type:', typeof safeChannel.profilePicture);
  console.log('Profile picture raw value:', safeChannel.profilePicture);
  console.log('Banner image raw type:', typeof safeChannel.bannerImage);
  console.log('Banner image raw value:', safeChannel.bannerImage);
  console.log('Final profile URL:', profileUrl);
  console.log('Final banner URL:', bannerUrl);
  
  // Check for blob URLs which might be expired
  const profileIsBlob = profileUrl?.startsWith('blob:');
  const bannerIsBlob = bannerUrl?.startsWith('blob:');
  if (profileIsBlob || bannerIsBlob) {
    console.warn('⚠️ Detected expired blob URLs:', { profileIsBlob, bannerIsBlob });
    console.log('💡 Recommendation: Clear localStorage and re-create channel');
  }
  
  console.log('=== End Debug ===');

  // Check for invalid blob URLs and help with debugging
  if (bannerUrl && bannerUrl.startsWith('blob:')) {
    console.warn('⚠️ Found blob URL for banner - this may be expired:', bannerUrl);
    console.log('💡 To fix: Re-upload your banner image to convert it to a persistent data URL');
  }

  // Banner upload handler
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploadingBanner(true);
    toast.loading(`Uploading "${file.name}"...`);

    try {
      // Convert file to data URL for persistence
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          // Update preview
          setBannerPreview(dataUrl);
          
          // Update localStorage
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (currentUser.channel) {
            currentUser.channel.bannerImage = dataUrl;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users array
            const users = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
            const updatedUsers = users.map((u: any) => 
              u.id === currentUser.id ? currentUser : u
            );
            localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
            
            // Notify parent component
            onBannerUpdate(dataUrl);
            
            // Reset failure state
            setBannerLoadFailed(false);
            setBannerLoaded(false);
            
            toast.dismiss();
            toast.success('Banner uploaded successfully!');
            
            // Refresh page to show new banner
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        }
        setIsUploadingBanner(false);
      };
      reader.onerror = () => {
        toast.dismiss();
        toast.error('Failed to read the image file');
        setIsUploadingBanner(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Banner upload error:', error);
      toast.dismiss();
      toast.error('Failed to upload banner image');
      setIsUploadingBanner(false);
    }

    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  // Trigger file input
  const triggerBannerUpload = () => {
    if (isUploadingBanner) return;
    
    // Reset states when starting new upload
    setBannerLoadFailed(false);
    setBannerLoaded(false);
    
    const input = document.getElementById('bannerUploadInput') as HTMLInputElement;
    input?.click();
  };

  // Profile management functions
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const addSocialLink = () => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: 'Globe' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleVideoUploaded = (video: any) => {
    setUserVideos(prev => [video, ...prev]);
    toast.success(`Video '${video.title}' uploaded successfully!`);
  };

  const handleUploadVideo = () => {
    setShowUploadModal(true);
  };

  const handleSaveProfile = () => {
    try {
      // Update localStorage with profile data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.channel) {
        currentUser.channel = {
          ...currentUser.channel,
          displayName: profileData.displayName,
          handle: profileData.handle,
          bio: profileData.bio,
          contactEmail: profileData.contactEmail,
          socialLinks: profileData.socialLinks,
          profilePicture: avatarPreview || currentUser.channel.profilePicture
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
        const updatedUsers = users.map((u: any) => 
          u.id === currentUser.id ? currentUser : u
        );
        localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
      }
      
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
      
      // Refresh to show changes
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Failed to save profile changes');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Channel Branding Header */}
      <Card className="relative overflow-hidden">
        {/* Banner Section with Enhanced Error Handling */}
        <div className="relative h-56 sm:h-64 lg:h-72 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 overflow-hidden">
          {(bannerPreview || bannerUrl) && !bannerLoadFailed ? (
            <>
              <img 
                key={bannerPreview || bannerUrl || ''} // Force re-render when URL changes
                src={bannerPreview || bannerUrl || ''}
                alt={`${safeChannel.name} Channel Banner`}
                className="w-full h-full object-cover object-center transition-opacity duration-300 image-loading"
                onError={(e) => {
                  console.error('Banner image failed to load.');
                  console.error('Banner URL:', bannerUrl);
                  console.error('Banner URL type:', typeof bannerUrl);
                  console.error('Is blob URL:', bannerUrl?.startsWith('blob:'));
                  console.error('Is data URL:', bannerUrl?.startsWith('data:'));
                  
                  setBannerLoadFailed(true);
                  setBannerLoaded(false);
                  
                  const img = e.target as HTMLImageElement;
                  img.classList.add('image-hidden');
                }}
                onLoad={(e) => {
                  console.log('Banner image loaded successfully');
                  setBannerLoadFailed(false);
                  setBannerLoaded(true);
                  
                  const img = e.target as HTMLImageElement;
                  img.classList.remove('image-loading');
                  img.classList.add('image-loaded');
                }}
                loading="lazy"
              />
            </>
          ) : bannerLoadFailed ? (
            // Show fallback when banner failed to load
            <div 
              className="w-full h-full flex items-center justify-center text-white/80 cursor-pointer hover:bg-black/10 transition-colors group"
              onClick={triggerBannerUpload}
            >
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50 group-hover:opacity-70 transition-opacity" />
                <p className="text-xl font-medium mb-2 group-hover:text-white transition-colors">Banner Failed to Load</p>
                <p className="text-sm opacity-80 group-hover:opacity-90 transition-opacity">Click to upload a new banner</p>
                {isUploadingBanner && (
                  <div className="mt-4">
                    <div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white/80 cursor-pointer hover:bg-black/10 transition-colors group"
              onClick={triggerBannerUpload}
            >
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50 group-hover:opacity-70 transition-opacity" />
                <p className="text-xl font-medium mb-2 group-hover:text-white transition-colors">Click to Upload Banner</p>
                <p className="text-sm opacity-80 group-hover:opacity-90 transition-opacity">Recommended: 2560 × 1440 pixels • Max 10MB</p>
                {isUploadingBanner && (
                  <div className="mt-4">
                    <div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Banner Upload Button */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-6 right-6 bg-white/95 hover:bg-white text-black shadow-lg transition-all duration-200 hover:scale-105 z-20 backdrop-blur-sm"
            onClick={triggerBannerUpload}
            disabled={isUploadingBanner}
          >
            <Camera className="h-4 w-4 mr-2" />
            {isUploadingBanner ? 'Uploading...' : (() => {
              if (bannerLoadFailed) return 'Fix Banner';
              if (!bannerUrl) return 'Add Banner';
              if (bannerLoaded || bannerUrl.startsWith('data:image/')) return 'Change Banner';
              if (bannerUrl.startsWith('blob:')) return 'Fix Banner';
              return 'Change Banner';
            })()}
          </Button>
          
          {/* Hidden file input */}
          <input
            id="bannerUploadInput"
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
            aria-label="Upload banner image"
            title="Upload banner image"
          />
        </div>
        
        {/* Channel Info Section */}
        <CardContent className="pt-0">
          <div className="flex items-start justify-between -mt-12 relative z-10">
            <div className="flex items-end space-x-6">
              {/* Enhanced Profile Picture */}
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-purple-500/20 transition-all duration-200 group-hover:ring-purple-500/40">
                  {profileUrl ? (
                    <AvatarImage 
                      src={profileUrl}
                      alt={`${safeChannel.name} Profile Picture`}
                      className="object-cover transition-opacity duration-300 image-loading"
                      onError={(e) => {
                        console.error('Profile picture failed to load:', getSafeImageUrl(safeChannel.profilePicture));
                        const img = e.target as HTMLImageElement;
                        img.classList.add('image-hidden');
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.classList.remove('image-loading');
                        img.classList.add('image-loaded');
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {safeChannel.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Enhanced Edit Profile Photo Button */}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-xl border-3 border-white transition-all duration-200 hover:scale-110 group z-10"
                  onClick={openProfilePhotoEdit}
                  title="Edit Profile Photo"
                >
                  <Camera className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                </Button>
                
                {/* Loading indicator overlay (hidden by default) */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-200" id="profile-loading">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              
              {/* Channel Details */}
              <div className="pt-8">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <h1 className="text-3xl font-bold truncate">{safeChannel.name}</h1>
                    <Verified className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openChannelEdit}
                      className="gap-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 dark:hover:border-blue-600 transition-all duration-200 font-medium"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">Edit Channel</span>
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg mb-4">@{safeChannel.handle}</p>
                <p className="text-sm text-muted-foreground max-w-2xl mb-6 leading-relaxed">{safeChannel.description}</p>
                
                {/* Stats */}
                <div className="flex items-center flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatNumber(safeChannel.subscribers)}</span>
                    <span className="text-muted-foreground">subscribers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatNumber(safeChannel.totalViews)}</span>
                    <span className="text-muted-foreground">total views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{safeChannel.totalVideos}</span>
                    <span className="text-muted-foreground">videos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Creator Profile Setup Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 border-2 border-green-200/60 dark:border-green-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-700/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/20 dark:bg-emerald-700/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                Complete Your Profile
              </h3>
            </div>
            
            <p className="text-green-700 dark:text-green-300 mb-4 text-base leading-relaxed">
              Make your channel stand out! Upload a profile photo, add a compelling description, and connect your social media accounts to build a stronger community.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg">
                <Camera className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Profile Photo
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Description
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg">
                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Social Links
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg">
                <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Easy Setup
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-3 mt-4 sm:mt-0">
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-3 text-base font-semibold w-full sm:w-auto"
              onClick={openChannelEdit}
            >
              <User className="h-5 w-5 mr-2" />
              Setup Profile
            </Button>
            <div className="text-xs text-green-600 dark:text-green-400 text-center">
              ⚡ Quick & Easy Setup
            </div>
          </div>
        </div>
      </div>

      {/* Creator Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 p-6 sm:p-8 bg-card/50 rounded-lg border border-border/50 backdrop-blur-sm">
        <Button 
          onClick={() => setIsVideoSelectorOpen(true)} 
          variant="outline"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-8 py-3 min-w-[160px]"
        >
          <SquarePen className="h-4 w-4 mr-2" />
          Quick Edit
        </Button>
        <Button 
          onClick={handleUploadVideo} 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-11 px-8 py-3 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl min-w-[160px]"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
        <Button 
          onClick={onViewAnalytics} 
          variant="outline"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-8 py-3 min-w-[160px]"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button 
          onClick={onViewEarnings} 
          variant="outline"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-8 py-3 min-w-[160px]"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Earnings
        </Button>
        <Button 
          onClick={() => setIsScheduleModalOpen(true)} 
          variant="outline"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-8 py-3 min-w-[160px]"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.views)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.viewsChange}%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.subscribers)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.subscribersChange}%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.watchTime}h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.watchTimeChange}%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.revenueChange}%</span> from last {timeRange}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={onViewEarnings}
            >
              View earnings details →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Channel Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Views Growth</span>
                    <span className="font-medium">+{analytics.viewsChange}%</span>
                  </div>
                  <Progress value={analytics.viewsChange} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subscriber Growth</span>
                    <span className="font-medium">+{analytics.subscribersChange}%</span>
                  </div>
                  <Progress value={analytics.subscribersChange} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="font-medium">7.2%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleUploadVideo} className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Video
                </Button>
                <div className="w-full">
                  {isStreaming ? (
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => setShowLiveStreamManager(true)}
                    >
                      <div className="h-4 w-4 mr-2 bg-white rounded-full animate-pulse" />
                      Manage Live Stream
                    </Button>
                  ) : (
                    <GoLiveButton 
                      user={getCurrentUser()}
                      className="w-full"
                      onStreamStart={(mode, config) => {
                        console.log(`🎬 Starting ${mode} stream:`, config);
                        onStreamStart(mode, config);
                      }}
                    />
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    console.log('🔘 Create Community Post button clicked');
                    if (onNavigate) {
                      console.log('✅ Navigating to community page...');
                      toast.info('📝 Opening Community Post Creator...');
                      onNavigate('community');
                      
                      // Trigger create post modal after page renders
                      setTimeout(() => {
                        console.log('⏰ Timeout triggered, looking for create post button...');
                        const createPostButton = document.querySelector('[data-create-post-button]') as HTMLButtonElement;
                        console.log('🔍 Found button:', createPostButton);
                        if (createPostButton) {
                          console.log('🖱️ Clicking create post button programmatically');
                          createPostButton.click();
                        } else {
                          console.error('❌ Create post button not found in DOM');
                        }
                      }, 300);
                    } else {
                      console.error('❌ onNavigate is not defined');
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create Community Post
                </Button>
                
                {/* Debug buttons to test stream management */}
                {!isStreaming ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      // Simulate an active stream by storing it in localStorage
                      const mockStream = {
                        id: 'test-stream-123',
                        title: 'Test Live Stream',
                        status: 'live',
                        startTime: new Date().toISOString(),
                        creator: getCurrentUser()
                      };
                      localStorage.setItem('currentLiveStream', JSON.stringify(mockStream));
                      toast.success('🧪 Test stream started! Refresh page to see "Manage Live Stream" button.');
                      // Force a page refresh to update the useIsStreaming hook
                      setTimeout(() => window.location.reload(), 1000);
                    }}
                  >
                    <div className="h-4 w-4 mr-2 bg-orange-500 rounded-full" />
                    🧪 Start Test Stream
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      // Stop the test stream
                      localStorage.removeItem('currentLiveStream');
                      toast.success('🧪 Test stream stopped! Refresh page to see "Go Live" button.');
                      // Force a page refresh to update the useIsStreaming hook
                      setTimeout(() => window.location.reload(), 1000);
                    }}
                  >
                    <div className="h-4 w-4 mr-2 bg-gray-500 rounded-full" />
                    🧪 Stop Test Stream
                  </Button>
                )}
                
                {/* Live Preview Toggle - only show when streaming */}
                {isStreaming && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    className="w-full justify-start"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showLivePreview ? 'Hide' : 'Show'} Live Preview
                  </Button>
                )}
                
                <Button variant="outline" onClick={onViewAnalytics} className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Videos</span>
                <Button onClick={handleUploadVideo} size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userVideos.length > 0 ? (
                  userVideos.map((video) => (
                    <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {new Date(video.uploadedAt).toLocaleDateString()} • 
                          {(video.size / (1024 * 1024)).toFixed(1)}MB
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={video.status === 'ready' ? 'default' : 'secondary'}>
                            {video.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {video.visibility}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No videos uploaded yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start creating content by uploading your first video
                    </p>
                    <Button onClick={handleUploadVideo}>
                      Upload Your First Video
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Comments this week</span>
                  <Badge>324</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Likes this week</span>
                  <Badge>1,247</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shares this week</span>
                  <Badge>89</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>New subscribers</span>
                  <Badge variant="secondary">+{Math.floor(analytics.subscribersChange * 10)}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply to Comments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Subscribers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Channel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Channel Profile Settings
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Manage your channel's public profile and social presence
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    variant={isEditingProfile ? "outline" : "default"}
                    className="gap-2"
                  >
                    {isEditingProfile ? (
                      <>
                        <User className="h-4 w-4" />
                        Cancel Edit
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {!isEditingProfile ? (
              // Profile Display Mode
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Profile Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={profileUrl}
                          alt={safeChannel.displayName || safeChannel.name}
                        />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {getInitials(safeChannel.displayName || safeChannel.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{safeChannel.displayName || safeChannel.name}</h3>
                        <p className="text-muted-foreground">@{safeChannel.handle}</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(safeChannel.subscribers)} subscribers</p>
                      </div>
                    </div>
                    
                    {safeChannel.bio && (
                      <div>
                        <h4 className="font-medium mb-2">Bio</h4>
                        <p className="text-sm text-muted-foreground">{safeChannel.bio}</p>
                      </div>
                    )}
                    
                    {safeChannel.contactEmail && (
                      <div>
                        <h4 className="font-medium mb-2">Contact Email</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {safeChannel.contactEmail}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Links Display */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌐 Social Presence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safeChannel.socialLinks && safeChannel.socialLinks.length > 0 ? (
                      <div className="space-y-3">
                        {safeChannel.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            {link.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-500" />}
                            {link.platform === 'Twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                            {link.platform === 'Discord' && <MessageCircle className="h-5 w-5 text-indigo-500" />}
                            {!['Instagram', 'Twitter', 'Discord'].includes(link.platform) && <Globe className="h-5 w-5 text-gray-500" />}
                            <div>
                              <p className="font-medium">{link.platform}</p>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {link.url}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No social links added yet</p>
                        <p className="text-sm">Click "Edit Profile" to add your social media presence</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Profile Edit Mode
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          {(avatarPreview || profileUrl) ? (
                            <AvatarImage
                              src={avatarPreview || profileUrl}
                              alt={profileData.displayName || profileData.handle}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            {getInitials(profileData.displayName || profileData.handle)}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white hover:bg-gray-50 shadow-lg border transition-all duration-200 hover:scale-110"
                          title="Change profile picture"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <SquarePen className="h-3 w-3" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">Profile Picture</p>
                        <p className="text-sm text-muted-foreground">
                          Recommended size: 400 x 400 pixels
                        </p>
                      </div>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      aria-label="Upload profile picture"
                      title="Upload profile picture"
                    />
                  </CardContent>
                </Card>

                {/* Profile Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="Enter your display name"
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground mt-2">The name shown publicly on your channel</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="handle" className="text-sm font-medium">Username/Handle</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                          <Input
                            id="handle"
                            value={profileData.handle}
                            onChange={(e) => setProfileData(prev => ({ ...prev, handle: e.target.value.replace('@', '') }))}
                            placeholder="username"
                            className="pl-8 h-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Unique identifier (e.g., @hiteshStreams)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={profileData.contactEmail}
                        onChange={(e) => setProfileData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground mt-2">For business inquiries or collabs</p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio/Tagline</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Short description or vibe statement..."
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Brief description about your channel</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Presence */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>🌐 Social Presence</CardTitle>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addSocialLink}
                        className="gap-2 h-9 px-4"
                      >
                        <Plus className="h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profileData.socialLinks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No social links added yet</p>
                        <p className="text-sm">Click "Add Link" to connect your social profiles</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {profileData.socialLinks.map((link, index) => (
                          <div key={index} className="flex gap-4 items-end p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex-1 space-y-3">
                              <Label htmlFor={`platform-${index}`} className="text-sm font-medium">Platform</Label>
                              <select
                                id={`platform-${index}`}
                                value={link.platform}
                                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                title="Select social media platform"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select platform</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Twitter">Twitter/X</option>
                                <option value="Discord">Discord</option>
                                <option value="YouTube">YouTube</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Twitch">Twitch</option>
                                <option value="Website">Personal Website</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="flex-[2] space-y-3">
                              <Label htmlFor={`url-${index}`} className="text-sm font-medium">URL</Label>
                              <Input
                                id={`url-${index}`}
                                value={link.url}
                                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                className="h-10"
                                placeholder={
                                  link.platform === 'Instagram' ? 'https://instagram.com/username' :
                                  link.platform === 'Twitter' ? 'https://twitter.com/username' :
                                  link.platform === 'Discord' ? 'https://discord.gg/server' :
                                  link.platform === 'YouTube' ? 'https://youtube.com/@channel' :
                                  link.platform === 'TikTok' ? 'https://tiktok.com/@username' :
                                  link.platform === 'Twitch' ? 'https://twitch.tv/username' :
                                  'https://example.com'
                                }
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSocialLink(index)}
                              className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 self-end mb-0"
                              title="Remove this social link"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Add or update links to Instagram, Twitter, Discord, etc.
                    </p>
                  </CardContent>
                </Card>

                {/* Save Actions */}
                <Card>
                  <CardContent className="pt-8 pb-6">
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                        className="gap-2 h-10 px-6"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleSaveProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10 px-6"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Earnings Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>This month</span>
                  <span className="font-bold text-green-600">{formatCurrency(analytics.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last month</span>
                  <span className="font-medium">{formatCurrency(analytics.revenue * 0.8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total earnings</span>
                  <span className="font-bold">{formatCurrency(analytics.revenue * 12.5)}</span>
                </div>
                <Button onClick={onViewEarnings} className="w-full mt-4">
                  View Detailed Earnings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monetization Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Ad Revenue</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Channel Memberships</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Super Chat</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Merchandise</span>
                  <Badge variant="outline">Setup Required</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Development Debug Panel */}
      {process.env.NODE_ENV === 'development' && (profileUrl?.startsWith('blob:') || bannerUrl?.startsWith('blob:') || bannerLoadFailed) && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">🚨 Image Loading Issue Detected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-300">
              {bannerLoadFailed ? 'Banner failed to load. ' : ''}
              {(profileUrl?.startsWith('blob:') || bannerUrl?.startsWith('blob:')) ? 
                'Expired blob URLs detected that won\'t load after page refresh.' : ''}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('streamingUsers');
                  window.location.reload();
                }}
              >
                Clear Data & Refresh
              </Button>
              {bannerLoadFailed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setBannerLoadFailed(false);
                    setBannerLoaded(false);
                  }}
                >
                  Reset Banner State
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minimal Channel Edit Modal */}
      <MinimalChannelEdit
        isOpen={isMinimalEditOpen}
        onClose={() => setIsMinimalEditOpen(false)}
      />

      {/* Profile Photo Edit Modal */}
      <ProfilePhotoEdit
        isOpen={isProfilePhotoEditOpen}
        onClose={() => setIsProfilePhotoEditOpen(false)}
        currentPhoto={safeChannel.profilePicture || ''}
        onSave={handleProfilePhotoSave}
      />

      {/* Video Selector Modal */}
      <VideoSelector
        isOpen={isVideoSelectorOpen}
        onClose={() => setIsVideoSelectorOpen(false)}
        onSelectVideo={(video) => {
          setSelectedVideo(video);
          setIsVideoSelectorOpen(false);
          setIsQuickEditOpen(true);
        }}
      />

      {/* Quick Edit Studio Modal */}
      <QuickEditStudio
        isOpen={isQuickEditOpen}
        onClose={() => {
          setIsQuickEditOpen(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
        onSave={(changes) => {
          console.log('Video changes saved:', changes);
          toast.success('Video updated successfully!');
          setIsQuickEditOpen(false);
          setSelectedVideo(null);
        }}
        onBackToSelection={() => {
          setIsQuickEditOpen(false);
          setIsVideoSelectorOpen(true);
        }}
      />

      {/* Schedule Calendar Modal (placeholder) */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsScheduleModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Schedule Calendar
            </h2>
            <ScheduleCalendar />
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      <VideoUpload 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* Live Stream Manager Modal */}
      {showLiveStreamManager && isStreaming && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLiveStreamManager(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Live Stream Management
                </h2>
              </div>
              <button
                onClick={() => setShowLiveStreamManager(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close live stream manager"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Stream Status */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Your stream is currently live!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Viewers can watch and interact with your content
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(Math.random() * 100) + 50}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Viewers</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.floor((Date.now() - Date.now() + 1800000) / 60000)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Stream Duration</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
                </div>
              </div>

              {/* Stream Controls */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Stream Controls</h4>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Stream settings updated!')}
                  >
                    Update Title
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Chat moderation enabled!')}
                  >
                    Moderate Chat
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Stream quality optimized!')}
                  >
                    Stream Health
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setShowLiveStreamManager(false);
                      localStorage.removeItem('currentLiveStream');
                      toast.success('Stream ended successfully!');
                      // Force refresh to update the UI
                      setTimeout(() => window.location.reload(), 500);
                    }}
                  >
                    End Stream
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {[
                    { user: 'Alex', action: 'joined the stream', time: '2m ago' },
                    { user: 'Sarah', action: 'sent a super chat', time: '5m ago' },
                    { user: 'Mike', action: 'started following', time: '8m ago' },
                    { user: 'Emma', action: 'liked the stream', time: '12m ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>{activity.user}</strong> {activity.action}
                      </span>
                      <span className="text-gray-500 dark:text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Live Stream Preview Window */}
      <LiveStreamPreview
        isVisible={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        streamData={streamData}
      />
    </div>
  );
}