import { useState, useEffect, useRef } from 'react';
import { CardProvider } from '../contexts/CardContext';
import { CardCreationModal } from './cards/CardCreationModal';
import { VideoCard as InteractiveCard } from '../types/cards';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { VideoPlayer } from './VideoPlayer';
import { VideoCard } from './VideoCard';
import { ThemeToggle } from './ThemeToggle';
import { ColorSelector } from './ColorSelector';
import { useColor } from './ColorProvider';
import { useFloatingPlayerManager, createAccessControl } from './FloatingPlayerManager';
import { ArrowLeft, Share, Download, Bell, Play, MessageCircle, Flag, Bookmark, DollarSign, Settings, ThumbsUp, ThumbsDown, ListPlus, Plus, Upload, Radio, Users, X, Edit3, Trash2, MoreHorizontal, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/queue.css';

interface Comment {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  userLiked: boolean;
  userDisliked: boolean;
  creatorReaction: string | null;
  replies: Reply[];
  isCreator?: boolean;
}

interface Reply {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  userLiked: boolean;
  userDisliked: boolean;
  creatorReaction: string | null;
  isCreator?: boolean;
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

interface VideoWatchPageProps {
  video: Video;
  onBack: () => void;
  onVideoClick: (video: Video) => void;
  onChannelClick?: (channelName: string) => void;
  onCreateChannel?: () => void;
  onNavigateToHome?: () => void;
  globalFloatingPlayer?: any;
  onMiniPlayerActivated?: (videoRef: React.RefObject<HTMLVideoElement | null>, playbackState: any) => void;
}

export function VideoWatchPage({ video, onBack, onVideoClick, onChannelClick, onCreateChannel, onNavigateToHome, globalFloatingPlayer, onMiniPlayerActivated }: VideoWatchPageProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(true); // Changed to true to show comments by default
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showSuperChatDialog, setShowSuperChatDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [superChatAmount, setSuperChatAmount] = useState('');
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(video.likes || '12847'));
  const [dislikeCount, setDislikeCount] = useState(234);
  const [showCardModal, setShowCardModal] = useState(false);

  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [theaterVariant, setTheaterVariant] = useState<'standard' | 'cinema' | 'ultrawide'>('standard');
  
  // Video ref for MultiPlayer functionality
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Playback state for floating player
  const [playbackState, setPlaybackState] = useState({
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isPlaying: false,
    playbackRate: 1,
    quality: '1080p'
  });
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'John Doe', avatar: 'JD' },
      content: 'Great video! Very informative and well explained.',
      timestamp: '2 hours ago',
      likes: 12,
      dislikes: 1,
      userLiked: false,
      userDisliked: false,
      creatorReaction: null,
      replies: []
    },
    {
      id: '2', 
      user: { name: 'Alice Smith', avatar: 'AS' },
      content: 'Thanks for sharing this! Looking forward to more content like this.',
      timestamp: '5 hours ago',
      likes: 8,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
      creatorReaction: '❤️',
      replies: [
        {
          id: '2-1',
          user: { name: 'Bob Wilson', avatar: 'BW' },
          content: 'I agree! This creator always delivers quality content.',
          timestamp: '3 hours ago',
          likes: 3,
          dislikes: 0,
          userLiked: false,
          userDisliked: false,
          creatorReaction: null
        }
      ]
    },
    {
      id: '3',
      user: { name: 'Mike Johnson', avatar: 'MJ' },
      content: 'Could you make a follow-up video about the advanced techniques mentioned at 5:32?',
      timestamp: '1 day ago',
      likes: 25,
      dislikes: 2,
      userLiked: false,
      userDisliked: false,
      creatorReaction: '👍',
      replies: []
    },
    {
      id: '4',
      user: { name: 'Sarah Davis', avatar: 'SD' },
      content: 'The quality of this video is amazing! What camera equipment do you use?',
      timestamp: '2 days ago',
      likes: 15,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
      creatorReaction: null,
      replies: [
        {
          id: '4-1',
          user: { name: video.channel.name, avatar: video.channel.name.charAt(0).toUpperCase() },
          content: 'Thanks! I use a Sony A7S III with a 24-70mm lens. Glad you enjoyed the video!',
          timestamp: '1 day ago',
          likes: 45,
          dislikes: 1,
          userLiked: false,
          userDisliked: false,
          creatorReaction: null,
          isCreator: true
        }
      ]
    }
  ]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('popular');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isCreatorMode, setIsCreatorMode] = useState(false); // Toggle for creator interactions
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  // Color context
  const { colorScheme } = useColor();

  // Add current video to watch history when component mounts or video changes
  const addToWatchHistory = (videoToAdd: Video) => {
    setWatchHistory(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(v => v.id !== videoToAdd.id);
      // Add to beginning of history (most recent first)
      const newHistory = [videoToAdd, ...filtered].slice(0, 50); // Keep only last 50 videos
      return newHistory;
    });
  };

  // Track current video in history when component mounts
  useEffect(() => {
    addToWatchHistory(video);
  }, [video.id]);

  // Synchronize playback state with video element for MiniPlayer
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updatePlaybackState = () => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime,
        duration: videoElement.duration || 0,
        volume: videoElement.volume,
        isMuted: videoElement.muted,
        isPlaying: !videoElement.paused
      }));
    };

    const handleLoadedMetadata = () => {
      updatePlaybackState();
    };

    const handleTimeUpdate = () => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime
      }));
    };

    const handlePlay = () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleVolumeChange = () => {
      setPlaybackState(prev => ({
        ...prev,
        volume: videoElement.volume,
        isMuted: videoElement.muted
      }));
    };

    // Add event listeners
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('volumechange', handleVolumeChange);

    // Initial update
    updatePlaybackState();

    // Cleanup
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Function to check if a queue video is currently playing
  const isCurrentlyPlaying = (queueVideo: Video) => {
    return queueVideo.id === video.id;
  };

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedItem(videoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', videoId);
    
    // Add drag visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('drag-start');
      const draggedVideoTitle = queueVideos.find(v => v.id === videoId)?.title || 'Video';
      const currentPosition = queueVideos.findIndex(v => v.id === videoId) + 1;
      toast.info(`Dragging "${draggedVideoTitle}" (Position ${currentPosition})`);
    }
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('drag-start');
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, videoId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(videoId);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  // Handle drop and reorder
  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === dropTargetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = queueVideos.findIndex(v => v.id === draggedId);
    const dropIndex = queueVideos.findIndex(v => v.id === dropTargetId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    // Create new array with reordered items
    const newQueue = [...queueVideos];
    const [draggedVideo] = newQueue.splice(draggedIndex, 1);
    newQueue.splice(dropIndex, 0, draggedVideo);

    setQueueVideos(newQueue);
    
    // Update current video index if needed
    if (draggedIndex === currentVideoIndex) {
      setCurrentVideoIndex(dropIndex);
    } else if (draggedIndex < currentVideoIndex && dropIndex >= currentVideoIndex) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (draggedIndex > currentVideoIndex && dropIndex <= currentVideoIndex) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }

    setDraggedItem(null);
    setDragOverItem(null);
    
    const draggedVideoTitle = queueVideos.find(v => v.id === draggedId)?.title || 'Video';
    const oldPosition = draggedIndex + 1;
    const newPosition = dropIndex + 1;
    
    if (oldPosition !== newPosition) {
      toast.success(`Moved "${draggedVideoTitle}" from position ${oldPosition} to ${newPosition}`);
    }
  };
  
  // Queue state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);
  

  
  // Suggested videos for next video functionality
  const [suggestedVideos] = useState<Video[]>([
    {
      id: 'suggested1',
      title: 'React Performance Optimization Tips',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '12:30',
      views: '45,123',
      uploadDate: '1 day ago',
      channel: { name: 'React Mastery', subscribers: '180K' },
      quality: ['1080p', '720p', '480p']
    },
    {
      id: 'suggested2',
      title: 'Advanced TypeScript Patterns',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '15:45',
      views: '67,890',
      uploadDate: '3 days ago',
      channel: { name: 'TypeScript Pro', subscribers: '210K' },
      quality: ['1080p', '720p', '480p']
    }
  ]);
  
  const [queueVideos, setQueueVideos] = useState<Video[]>([
    {
      id: 'queue1',
      title: 'How to Master Advanced JavaScript Concepts',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '18:45',
      views: '89,432',
      uploadDate: '2 days ago',
      channel: { name: 'CodeMaster Pro', subscribers: '245K' },
      quality: ['1080p', '720p', '480p']
    },
    {
      id: 'queue2',
      title: 'React Performance Optimization Techniques',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '25:12',
      views: '156,789',
      uploadDate: '4 days ago',
      channel: { name: 'React Mastery', subscribers: '189K' },
      quality: ['1440p', '1080p', '720p']
    },
    {
      id: 'queue3',
      title: 'Building Scalable Node.js Applications',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '32:18',
      views: '67,234',
      uploadDate: '1 week ago',
      channel: { name: 'Backend Guru', subscribers: '98K' },
      quality: ['1080p', '720p', '480p']
    },
    {
      id: 'queue4',
      title: 'CSS Grid and Flexbox Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '41:33',
      views: '234,567',
      uploadDate: '5 days ago',
      channel: { name: 'CSS Wizard', subscribers: '312K' },
      quality: ['1080p', '720p', '480p']
    },
    {
      id: 'queue5',
      title: 'TypeScript Best Practices and Patterns',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '28:07',
      views: '123,456',
      uploadDate: '3 days ago',
      channel: { name: 'TypeScript Pro', subscribers: '167K' },
      quality: ['1440p', '1080p', '720p']
    },
    {
      id: 'queue6',
      title: 'Database Design Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      duration: '37:22',
      views: '78,901',
      uploadDate: '1 week ago',
      channel: { name: 'DB Expert', subscribers: '87K' },
      quality: ['1080p', '720p', '480p']
    }
  ]);
  

  
  // Upload Content modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Live streaming state
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);


  // Mock related videos
  const relatedVideos: Video[] = [
    {
      id: 'related1',
      title: 'Similar Content: Advanced Techniques Explained',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      duration: '15:30',
      views: '234,567',
      uploadDate: '1 day ago',
      channel: { name: 'RelatedChannel' },
      quality: ['1080p', '720p', '480p']
    },
    {
      id: 'related2',
      title: 'Next Episode: Continuing the Journey',
      thumbnail: 'https://images.unsplash.com/photo-1616469829526-7057a1427626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3ODUyMzI2fDA&ixlib=rb-4.1.0&q=80&w=400',
      duration: '22:15',
      views: '145,890',
      uploadDate: '3 days ago',
      channel: { name: video.channel.name },
      quality: ['1440p', '1080p', '720p']
    }
  ];

  const handleDownload = () => {
    toast.success(`Started downloading "${video.title}" for offline viewing`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Video link copied to clipboard');
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved videos' : 'Video saved to Watch Later');
  };

  const handleComments = () => {
    setShowComments(!showComments);
  };

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const handleSubmitReport = () => {
    if (reportReason && reportDetails) {
      toast.success('Report submitted successfully. We will review it shortly.');
      setShowReportDialog(false);
      setReportReason('');
      setReportDetails('');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleSuperChat = () => {
    setShowSuperChatDialog(true);
  };

  const handleSubmitSuperChat = () => {
    if (superChatAmount && superChatMessage) {
      toast.success(`Super Chat of $${superChatAmount} sent! Thank you for supporting ${video.channel.name}!`);
      setShowSuperChatDialog(false);
      setSuperChatAmount('');
      setSuperChatMessage('');
    } else {
      toast.error('Please enter an amount and message');
    }
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: { name: isCreatorMode ? video.channel.name : 'You', avatar: isCreatorMode ? video.channel.name.charAt(0).toUpperCase() : 'Y' },
        content: commentText.trim(),
        timestamp: 'Just now',
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        creatorReaction: null,
        replies: [],
        isCreator: isCreatorMode
      };
      setComments([newComment, ...comments]);
      toast.success('Comment posted successfully!');
      setCommentText('');
    } else {
      toast.error('Please enter a comment');
    }
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          const wasLiked = comment.userLiked;
          const wasDisliked = comment.userDisliked;
          return { 
            ...comment, 
            likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
            dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes,
            userLiked: !wasLiked,
            userDisliked: false
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const wasLiked = reply.userLiked;
                const wasDisliked = reply.userDisliked;
                return { 
                  ...reply, 
                  likes: wasLiked ? reply.likes - 1 : reply.likes + 1,
                  dislikes: wasDisliked ? reply.dislikes - 1 : reply.dislikes,
                  userLiked: !wasLiked,
                  userDisliked: false
                };
              }
              return reply;
            })
          };
        }
        return comment;
      });
    });
  };

  const handleDislikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          const wasLiked = comment.userLiked;
          const wasDisliked = comment.userDisliked;
          return { 
            ...comment, 
            likes: wasLiked ? comment.likes - 1 : comment.likes,
            dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
            userLiked: false,
            userDisliked: !wasDisliked
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const wasLiked = reply.userLiked;
                const wasDisliked = reply.userDisliked;
                return { 
                  ...reply, 
                  likes: wasLiked ? reply.likes - 1 : reply.likes,
                  dislikes: wasDisliked ? reply.dislikes - 1 : reply.dislikes + 1,
                  userLiked: false,
                  userDisliked: !wasDisliked
                };
              }
              return reply;
            })
          };
        }
        return comment;
      });
    });
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyText.trim()) {
      const newReply = {
        id: `${parentId}-${Date.now()}`,
        user: { name: isCreatorMode ? video.channel.name : 'You', avatar: isCreatorMode ? video.channel.name.charAt(0).toUpperCase() : 'Y' },
        content: replyText.trim(),
        timestamp: 'Just now',
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        creatorReaction: null,
        isCreator: isCreatorMode
      };
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === parentId 
            ? {...comment, replies: [...comment.replies, newReply]}
            : comment
        )
      );
      
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted successfully!');
    }
  };

  const handleCreatorReaction = (commentId: string, reaction: string, isReply: boolean = false, parentId?: string) => {
    if (!isCreatorMode) {
      toast.error('Only the video creator can add reactions');
      return;
    }
    
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          return { 
            ...comment, 
            creatorReaction: comment.creatorReaction === reaction ? null : reaction
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, creatorReaction: reply.creatorReaction === reaction ? null : reaction }
                : reply
            )
          };
        }
        return comment;
      });
    });
    
    toast.success('Creator reaction added!');
  };

  const handleDeleteComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === parentId 
            ? {
                ...comment, 
                replies: comment.replies.filter(reply => reply.id !== commentId)
              }
            : comment
        )
      );
      toast.success('Reply deleted successfully!');
    } else {
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
      toast.success('Comment deleted successfully!');
    }
  };

  const handleEditComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply) {
      setEditingReply(commentId);
      const comment = comments.find(c => c.id === parentId);
      const reply = comment?.replies.find(r => r.id === commentId);
      setEditText(reply?.content || '');
    } else {
      setEditingComment(commentId);
      const comment = comments.find(c => c.id === commentId);
      setEditText(comment?.content || '');
    }
  };

  const handleSaveEdit = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (isReply && parentId) {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === parentId 
            ? {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === commentId 
                    ? { ...reply, content: editText.trim(), timestamp: 'Just now (edited)' }
                    : reply
                )
              }
            : comment
        )
      );
      setEditingReply(null);
      toast.success('Reply updated successfully!');
    } else {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: editText.trim(), timestamp: 'Just now (edited)' }
            : comment
        )
      );
      setEditingComment(null);
      toast.success('Comment updated successfully!');
    }
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditingReply(null);
    setEditText('');
  };

  const canEditOrDelete = (comment: Comment | Reply) => {
    return comment.user.name === 'You' || (isCreatorMode && comment.isCreator);
  };

  // Queue management functions
  const handleAddToQueue = (video: Video) => {
    if (!queueVideos.find(v => v.id === video.id)) {
      setQueueVideos([...queueVideos, video]);
      toast.success(`"${video.title}" added to queue`);
    } else {
      toast.info('Video is already in queue');
    }
  };

  const handleRemoveFromQueue = (videoId: string) => {
    const videoToRemove = queueVideos.find(v => v.id === videoId);
    const newQueue = queueVideos.filter(v => v.id !== videoId);
    setQueueVideos(newQueue);
    
    // Adjust current index if necessary
    const removedIndex = queueVideos.findIndex(v => v.id === videoId);
    if (removedIndex !== -1 && removedIndex <= currentVideoIndex && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
    
    if (videoToRemove) {
      toast.success(`"${videoToRemove.title}" removed from queue`);
    }
  };

  // Navigation functions for previous/next video
  const handlePreviousVideo = () => {
    // First check watch history for previous video
    if (watchHistory.length > 1) {
      // Find current video in history
      const currentIndex = watchHistory.findIndex(v => v.id === video.id);
      if (currentIndex > 0) {
        const previousVideo = watchHistory[currentIndex - 1];
        // History index management removed for now
        onVideoClick(previousVideo);
        toast.success(`Playing from history: ${previousVideo.title}`);
        return;
      } else if (currentIndex === 0 && watchHistory.length > 1) {
        // If current video is first in history, go to second video
        const previousVideo = watchHistory[1];
        // History index management removed for now
        onVideoClick(previousVideo);
        toast.success(`Playing from history: ${previousVideo.title}`);
        return;
      }
    }
    
    // Fallback to queue navigation
    if (queueVideos.length > 0) {
      const previousIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : queueVideos.length - 1;
      const previousVideo = queueVideos[previousIndex];
      
      if (previousVideo) {
        setCurrentVideoIndex(previousIndex);
        onVideoClick(previousVideo);
        toast.success(`Playing from queue: ${previousVideo.title}`);
        return;
      }
    }
    
    toast.info('No previous video available');
  };

  const handleNextVideo = () => {
    // First try queue videos
    if (queueVideos.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % queueVideos.length;
      const nextVideo = queueVideos[nextIndex];
      
      if (nextVideo) {
        setCurrentVideoIndex(nextIndex);
        addToWatchHistory(nextVideo);
        onVideoClick(nextVideo);
        toast.success(`Playing from queue: ${nextVideo.title}`);
        return;
      }
    }
    
    // Fallback to random suggested video
    if (suggestedVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * suggestedVideos.length);
      const suggestedVideo = suggestedVideos[randomIndex];
      
      addToWatchHistory(suggestedVideo);
      onVideoClick(suggestedVideo);
      toast.success(`Playing suggested video: ${suggestedVideo.title}`, {
        description: 'Based on your viewing preferences'
      });
      return;
    }
    
    toast.info('No next video available');
  };

  // Auto-play next video when current video ends
  const handleVideoEnd = () => {
    // Mark current video as fully watched in history
    addToWatchHistory(video);
    handleNextVideo();
  };

  const handleClearQueue = () => {
    setQueueVideos([]);
    toast.success('Queue cleared');
  };

  // Access control for floating player
  const accessControl = createAccessControl(
    showCardModal, // Has overlays
    false, // Is creator content
    false  // Has secure content
  );
  
  // Floating player manager
  const floatingPlayer = useFloatingPlayerManager({
    video,
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    playbackState,
    accessControl,
    queuePosition: { current: currentVideoIndex + 1, total: queueVideos.length },
    hasNext: currentVideoIndex < queueVideos.length - 1,
    hasPrevious: currentVideoIndex > 0,
    onPlaybackChange: (state) => {
      setPlaybackState(prev => ({ ...prev, ...state }));
      if (state.isPlaying !== undefined) {
        // Playing state managed by video element
      }
    },
    onPrevious: handlePreviousVideo,
    onNext: handleNextVideo,
    onToggleTheater: () => {
      setIsTheaterMode(true);
    },
    onShowComments: () => setShowComments(true),
    onShowQueue: () => {},
    onClose: () => floatingPlayer.exitMiniPlayer(),
    onNavigateToHome
  });

  // Keyboard shortcut for MiniPlayer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'i') {
        // Use global MiniPlayer if available, otherwise use local
        if (globalFloatingPlayer && onMiniPlayerActivated) {
          onMiniPlayerActivated(videoRef, playbackState);
          globalFloatingPlayer.toggleMiniPlayer();
        } else {
          floatingPlayer.toggleMiniPlayer();
          // Navigation is now handled automatically in the FloatingPlayerManager
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [floatingPlayer, globalFloatingPlayer, onMiniPlayerActivated, videoRef, playbackState]);

  const handleLike = () => {
    console.log('🔥 Like button clicked! Current state:', { isLiked, likeCount });
    if (isLiked) {
      // Unlike
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      toast.success('Like removed');
    } else {
      // Like
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      // Remove dislike if it was disliked
      if (isDisliked) {
        setIsDisliked(false);
        setDislikeCount(prev => prev - 1);
      }
      toast.success('Video liked!');
    }
  };

  const handleDislike = () => {
    console.log('👎 Dislike button clicked! Current state:', { isDisliked, dislikeCount });
    if (isDisliked) {
      // Remove dislike
      setIsDisliked(false);
      setDislikeCount(prev => prev - 1);
      toast.success('Dislike removed');
    } else {
      // Dislike
      setIsDisliked(true);
      setDislikeCount(prev => prev + 1);
      // Remove like if it was liked
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
      toast.success('Feedback recorded');
    }
  };

  const handleAddCard = () => {
    setShowCardModal(true);
  };

  const handleCardClick = (card: InteractiveCard) => {
    // Handle card clicks based on card type
    switch (card.type) {
      case 'video':
        toast.info(`Opening video: ${card.title}`);
        // Navigate to video
        break;
      case 'playlist':
        toast.info(`Opening playlist: ${card.title}`);
        // Navigate to playlist
        break;
      case 'channel':
        toast.info(`Opening channel: ${card.title}`);
        // Navigate to channel
        break;
      case 'url':
        if (card.targetUrl) {
          window.open(card.targetUrl, '_blank');
          toast.success('Opening external link');
        }
        break;
    }
  };



  // Play/pause functionality handled by VideoPlayer component

  const handleTheaterMode = () => {
    if (!isTheaterMode) {
      // Cycle through theater variants when enabling
      const variants: ('standard' | 'cinema' | 'ultrawide')[] = ['standard', 'cinema', 'ultrawide'];
      const currentIndex = variants.indexOf(theaterVariant);
      const nextVariant = variants[(currentIndex + 1) % variants.length];
      setTheaterVariant(nextVariant);
      setIsTheaterMode(true);
      
      const variantNames = {
        standard: 'Standard Theater',
        cinema: 'Cinema Mode',
        ultrawide: 'Ultrawide Mode'
      };
      toast.success(`${variantNames[nextVariant]} enabled`);
    } else {
      setIsTheaterMode(false);
      toast.success('Theater mode disabled');
    }
  };

  const handleCreateChannel = () => {
    console.log('Navigating to Create Channel page...');
    if (onCreateChannel) {
      onCreateChannel();
    }
  };



  const handleUploadContent = () => {
    setShowUploadModal(true);
  };

  const handleSubmitUpload = () => {
    if (uploadTitle && uploadDescription && uploadFile) {
      toast.success(`Video "${uploadTitle}" uploaded successfully! It will be processed and available shortly.`);
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
    } else {
      toast.error('Please fill in all fields and select a video file');
    }
  };

  const handleGoLive = () => {
    if (!isLiveStreaming) {
      setIsLiveStreaming(true);
      toast.success('🔴 Going live! Your stream is now broadcasting.');
    } else {
      setIsLiveStreaming(false);
      toast.success('Stream ended. Thank you for broadcasting!');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadFile(file);
        toast.success(`File "${file.name}" selected for upload`);
      } else {
        toast.error('Please select a valid video file');
      }
    }
  };



  return (
    <CardProvider>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold">StreamVault</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Creator Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Creator Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 mb-1"
                      onClick={handleCreateChannel}
                    >
                      <Users className="h-4 w-4" />
                      Create Channel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 mb-1"
                      onClick={handleUploadContent}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-2 ${isLiveStreaming ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : ''}`}
                      onClick={handleGoLive}
                    >
                      <Radio className={`h-4 w-4 ${isLiveStreaming ? 'text-red-600' : ''}`} />
                      {isLiveStreaming ? 'End Stream' : 'Go Live'}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Color</span>
                      <ColorSelector />
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Dark overlay for theater mode */}
      {isTheaterMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-in-out z-0" />
      )}
      
      <div className={`relative z-10 transition-all duration-500 ease-in-out ${isTheaterMode ? 'max-w-none px-3 py-1' : 'container mx-auto px-4 py-6'}`}>
        <div className={isTheaterMode ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
          {isTheaterMode ? (
            <>
              <VideoPlayer
                videoUrl="/api/placeholder/video.mp4"
                title={video.title}
                videoId={video.id}
                isCreator={true}
                onDownload={handleDownload}
                onShare={handleShare}
                onTheaterMode={handleTheaterMode}
                onToggleMiniPlayer={() => {
                  // Use global MiniPlayer if available, otherwise use local
                  if (globalFloatingPlayer && onMiniPlayerActivated) {
                    onMiniPlayerActivated(videoRef, playbackState);
                    globalFloatingPlayer.toggleMiniPlayer();
                  } else {
                    floatingPlayer.toggleMiniPlayer();
                  }
                }}
                isTheaterMode={isTheaterMode}
                theaterVariant={theaterVariant}
                onCardClick={handleCardClick}
                onAddCard={handleAddCard}
                onPreviousVideo={handlePreviousVideo}
                onNextVideo={handleNextVideo}
                onVideoEnd={handleVideoEnd}
                hasNextVideo={queueVideos.length > 0 || suggestedVideos.length > 0}
                hasPreviousVideo={watchHistory.length > 1 || queueVideos.length > 0}
                currentVideoIndex={currentVideoIndex + 1}
                totalVideos={Math.max(queueVideos.length, watchHistory.length)}
              />
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl mb-4">{video.title}</h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {video.channel.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3>{video.channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{video.views} views</p>
                    </div>
                  </div>
                  <Button onClick={handleSubscribe} variant={isSubscribed ? "outline" : "default"}>
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <VideoPlayer
                    videoUrl="/api/placeholder/video.mp4"
                    title={video.title}
                    videoId={video.id}
                    isCreator={true}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onTheaterMode={handleTheaterMode}
                    onToggleMiniPlayer={() => {
                      // Use global MiniPlayer if available, otherwise use local
                      if (globalFloatingPlayer && onMiniPlayerActivated) {
                        onMiniPlayerActivated(videoRef, playbackState);
                        globalFloatingPlayer.toggleMiniPlayer();
                      } else {
                        floatingPlayer.toggleMiniPlayer();
                      }
                    }}
                    isTheaterMode={isTheaterMode}
                    theaterVariant={theaterVariant}
                    onCardClick={handleCardClick}
                    onAddCard={handleAddCard}
                    onPreviousVideo={handlePreviousVideo}
                    onNextVideo={handleNextVideo}
                    onVideoEnd={handleVideoEnd}
                    hasNextVideo={queueVideos.length > 0 || suggestedVideos.length > 0}
                    hasPreviousVideo={watchHistory.length > 1 || queueVideos.length > 0}
                    currentVideoIndex={currentVideoIndex + 1}
                    totalVideos={Math.max(queueVideos.length, watchHistory.length)}
                  />
                </div>

                {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl mb-2">{video.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                  <div className="ml-auto flex items-center space-x-1">
                    {video.quality.includes('2160p') && (
                      <Badge variant="secondary">4K Available</Badge>
                    )}
                    {video.quality.includes('1080p') && (
                      <Badge variant="outline">HD</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={isLiked ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleLike}
                    className={`cursor-pointer relative z-10 ${isLiked ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    disabled={false}
                    type="button"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {likeCount.toLocaleString()}
                  </Button>
                  <Button 
                    variant={isDisliked ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleDislike}
                    className={`cursor-pointer relative z-10 ${isDisliked ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                    disabled={false}
                    type="button"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    {dislikeCount.toLocaleString()}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleComments}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comments ({comments.length})
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant={isSaved ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleSave}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReport}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                  
                  {/* Mini Player Toggle */}
                  <Button
                    variant={floatingPlayer.currentMode === 'miniplayer' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      floatingPlayer.toggleMiniPlayer();
                      window.location.href = '/';
                    }}
                    disabled={!floatingPlayer.canUseMiniPlayer}
                    className={floatingPlayer.currentMode === 'miniplayer' ? 'bg-blue-600 text-white' : ''}
                  >
                    <Minimize2 className="h-4 w-4 mr-2" />
                    {floatingPlayer.currentMode === 'miniplayer' ? 'Exit Mini Player' : 'Mini Player'}
                  </Button>
                  
                  {/* MultiPlayer Toggle */}
                  {/* MultiPlayer Toggle removed, MiniPlayer now handles MultiPlayer features */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSuperChat}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-none"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Thanks
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Channel Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {video.channel.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{video.channel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {video.channel.subscribers || '1.2M'} subscribers
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSubscribe}
                  variant={isSubscribed ? "outline" : "default"}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <span>{video.views} views</span>
                        <span>{video.uploadDate}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDescription(!showDescription)}
                      >
                        {showDescription ? 'Show less' : 'Show more'}
                      </Button>
                    </div>
                    <div className={`${showDescription ? '' : 'line-clamp-3'}`}>
                      <p>
                        {video.description || 
                        "Experience this amazing content in stunning quality up to 4K! This video showcases the incredible capabilities of modern streaming technology. Available in multiple quality options to suit your device and connection: 4K (2160p) - Ultra HD quality, 1440p - High definition, 1080p - Full HD, 720p - HD Ready, 480p - Standard definition. Perfect for offline viewing - download now and watch anywhere, anytime. Our advanced streaming platform automatically adapts to your device capabilities and network conditions for the best possible viewing experience. Don't forget to like and subscribe for more high-quality content!"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              {showComments && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Comments Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{comments.length} Comments</h3>
                        <Select value={sortBy} onValueChange={(value: 'newest' | 'popular') => setSortBy(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="popular">Top comments</SelectItem>
                            <SelectItem value="newest">Newest first</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Creator Mode Toggle */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="creatorMode"
                            checked={isCreatorMode}
                            onChange={(e) => setIsCreatorMode(e.target.checked)}
                            className="rounded"
                            aria-label={`Comment as ${video.channel.name} (Creator)`}
                          />
                          <Label htmlFor="creatorMode" className="text-sm">
                            Comment as {video.channel.name} (Creator)
                          </Label>
                        </div>
                      </div>

                      {/* Add Comment */}
                      <div className="flex space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {isCreatorMode ? video.channel.name.charAt(0).toUpperCase() : 'Y'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            placeholder={isCreatorMode ? `Comment as ${video.channel.name}...` : "Add a public comment..."}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={2}
                            className="resize-none"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setCommentText('')}
                              disabled={!commentText.trim()}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSubmitComment} 
                              disabled={!commentText.trim()}
                              className={isCreatorMode ? "bg-red-600 hover:bg-red-700" : ""}
                            >
                              Comment{isCreatorMode ? ' as Creator' : ''}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Comments List */}
                      <div className="space-y-6">
                        {comments
                          .sort((a, b) => {
                            if (sortBy === 'popular') {
                              return b.likes - a.likes;
                            }
                            return a.timestamp === 'Just now' ? -1 : b.timestamp === 'Just now' ? 1 : 0;
                          })
                          .map((comment) => (
                          <div key={comment.id} className="space-y-3">
                            {/* Main Comment */}
                            <div className="flex space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">
                                    {comment.user.name}
                                    {comment.isCreator && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        Creator
                                      </Badge>
                                    )}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                  {comment.creatorReaction && (
                                    <span className="text-sm">{comment.creatorReaction}</span>
                                  )}
                                </div>
                                {editingComment === comment.id ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      rows={3}
                                      className="resize-none"
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleCancelEdit}
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleSaveEdit(comment.id)}
                                        disabled={!editText.trim()}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm">{comment.content}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleLikeComment(comment.id)}
                                      className={`h-auto p-1 text-xs ${comment.userLiked ? 'text-blue-600' : ''}`}
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {comment.likes > 0 && comment.likes}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDislikeComment(comment.id)}
                                      className={`h-auto p-1 text-xs ${comment.userDisliked ? 'text-red-600' : ''}`}
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      {comment.dislikes > 0 && comment.dislikes}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReply(comment.id)}
                                      className="h-auto p-1 text-xs"
                                    >
                                      Reply
                                    </Button>
                                    {isCreatorMode && (
                                      <div className="flex items-center space-x-1">
                                        {['❤️', '👍', '😄', '😮', '😢', '😡'].map((reaction) => (
                                          <Button
                                            key={reaction}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCreatorReaction(comment.id, reaction)}
                                            className={`h-auto p-1 text-xs ${comment.creatorReaction === reaction ? 'bg-accent' : ''}`}
                                          >
                                            {reaction}
                                          </Button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {canEditOrDelete(comment) && editingComment !== comment.id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-auto p-1">
                                          <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <button
                                          className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent rounded"
                                          onClick={() => handleEditComment(comment.id)}
                                        >
                                          <Edit3 className="h-3 w-3 mr-2" />
                                          Edit
                                        </button>
                                        <button
                                          className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent rounded text-red-600"
                                          onClick={() => handleDeleteComment(comment.id)}
                                        >
                                          <Trash2 className="h-3 w-3 mr-2" />
                                          Delete
                                        </button>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                                
                                {/* Reply Input */}
                                {replyingTo === comment.id && (
                                  <div className="flex space-x-3 mt-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback>
                                        {isCreatorMode ? video.channel.name.charAt(0).toUpperCase() : 'Y'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                      <Textarea
                                        placeholder={isCreatorMode ? `Reply as ${video.channel.name}...` : "Add a reply..."}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={2}
                                        className="resize-none"
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => setReplyingTo(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleSubmitReply(comment.id)}
                                          disabled={!replyText.trim()}
                                          className={isCreatorMode ? "bg-red-600 hover:bg-red-700" : ""}
                                        >
                                          Reply{isCreatorMode ? ' as Creator' : ''}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                              <div className="ml-13 space-y-3">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex space-x-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback>{reply.user.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-sm">
                                          {reply.user.name}
                                          {reply.isCreator && (
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                              Creator
                                            </Badge>
                                          )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                        {reply.creatorReaction && (
                                          <span className="text-sm">{reply.creatorReaction}</span>
                                        )}
                                      </div>
                                      {editingReply === reply.id ? (
                                        <div className="space-y-2">
                                          <Textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={2}
                                            className="resize-none"
                                          />
                                          <div className="flex justify-end space-x-2">
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              onClick={handleCancelEdit}
                                            >
                                              Cancel
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              onClick={() => handleSaveEdit(reply.id, true, comment.id)}
                                              disabled={!editText.trim()}
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-sm">{reply.content}</p>
                                      )}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                            className={`h-auto p-1 text-xs ${reply.userLiked ? 'text-blue-600' : ''}`}
                                          >
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            {reply.likes > 0 && reply.likes}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDislikeComment(reply.id, true, comment.id)}
                                            className={`h-auto p-1 text-xs ${reply.userDisliked ? 'text-red-600' : ''}`}
                                          >
                                            <ThumbsDown className="h-3 w-3 mr-1" />
                                            {reply.dislikes > 0 && reply.dislikes}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReply(comment.id)}
                                            className="h-auto p-1 text-xs"
                                          >
                                            Reply
                                          </Button>
                                          {isCreatorMode && (
                                            <div className="flex items-center space-x-1">
                                              {['❤️', '👍', '😄', '😮', '😢', '😡'].map((reaction) => (
                                                <Button
                                                  key={reaction}
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleCreatorReaction(reply.id, reaction, true, comment.id)}
                                                  className={`h-auto p-1 text-xs ${reply.creatorReaction === reaction ? 'bg-accent' : ''}`}
                                                >
                                                  {reaction}
                                                </Button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        {canEditOrDelete(reply) && editingReply !== reply.id && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm" className="h-auto p-1">
                                                <MoreHorizontal className="h-3 w-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <button
                                                className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent rounded"
                                                onClick={() => handleEditComment(reply.id, true, comment.id)}
                                              >
                                                <Edit3 className="h-3 w-3 mr-2" />
                                                Edit
                                              </button>
                                              <button
                                                className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent rounded text-red-600"
                                                onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                              >
                                                <Trash2 className="h-3 w-3 mr-2" />
                                                Delete
                                              </button>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="space-y-4">
            {/* Video Queue Section */}
            <div 
              className="rounded-lg border border-border shadow-sm queue-main-container"
              style={{
                '--queue-main-bg': `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.accent}05)`,
                '--queue-main-border': `${colorScheme.primary}20`
              } as React.CSSProperties}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between queue-header">
                  <h3 className="text-lg font-semibold">Queue</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{queueVideos.length} videos</span>
                    {queueVideos.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearQueue}
                        className="h-6 px-2 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {queueVideos.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <ListPlus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Your queue is empty</p>
                  <p className="text-xs text-muted-foreground/70">Add videos to watch them later</p>
                </div>
              ) : (
                <div 
                  className={`overflow-y-auto scrollbar-hide queue-container ${draggedItem ? 'drag-active' : ''}`}
                  style={{
                    '--queue-container-bg': `linear-gradient(145deg, ${colorScheme.primary}06, ${colorScheme.accent}04)`,
                    '--queue-container-border': `${colorScheme.primary}12`
                  } as React.CSSProperties}
                >
                  <div className="p-3 space-y-3">
                    {queueVideos.map((queueVideo, index) => {
                      const isPlaying = isCurrentlyPlaying(queueVideo);
                      return (
                      <div 
                        key={queueVideo.id} 
                        className={`group relative flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 cursor-pointer queue-item ${
                          isPlaying 
                            ? 'ring-2 shadow-lg transform scale-[1.02]' 
                            : 'hover:scale-[1.01]'
                        } ${draggedItem === queueVideo.id ? 'dragging' : ''} ${
                          dragOverItem === queueVideo.id ? 'drag-over' : ''
                        }`}
                        style={{
                          '--queue-hover-bg': isPlaying ? `${colorScheme.primary}20` : `${colorScheme.primary}10`,
                          '--queue-border-hover': isPlaying ? `${colorScheme.primary}40` : `${colorScheme.primary}20`,
                          '--ring-color': colorScheme.primary,
                          backgroundColor: isPlaying ? `${colorScheme.primary}08` : 'transparent',
                          borderColor: isPlaying ? colorScheme.primary : 'transparent',
                          borderWidth: isPlaying ? '1px' : '0px'
                        } as React.CSSProperties & { '--ring-color': string }}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, queueVideo.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, queueVideo.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, queueVideo.id)}
                      >
                        {/* Drag Handle */}
                        <div 
                          className={`drag-handle flex-shrink-0 flex flex-col items-center justify-center w-6 h-12 rounded-md cursor-move ${
                            draggedItem === queueVideo.id 
                              ? 'opacity-100 bg-blue-100 dark:bg-blue-900/30' 
                              : ''
                          }`}
                          title="Drag to reorder videos in queue"
                          onMouseDown={() => {
                            if (!draggedItem) {
                              toast.info('Drag to reorder videos in queue');
                            }
                          }}
                        >
                          <div className="flex flex-col space-y-1">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Queue Number / Now Playing Indicator */}
                        <div 
                          className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center queue-number transition-all duration-300 ${
                            isPlaying ? 'animate-pulse' : ''
                          }`}
                          style={{
                            '--queue-number-bg': isPlaying ? colorScheme.primary : `${colorScheme.primary}15`,
                            '--queue-number-color': isPlaying ? 'white' : colorScheme.primary,
                            '--queue-number-border': isPlaying ? colorScheme.primary : `${colorScheme.primary}30`,
                            '--queue-number-hover-bg': isPlaying ? colorScheme.primary : `${colorScheme.primary}20`,
                            '--queue-number-hover-color': isPlaying ? 'white' : colorScheme.primary,
                            '--queue-number-hover-border': isPlaying ? colorScheme.primary : `${colorScheme.primary}40`,
                            backgroundColor: isPlaying ? colorScheme.primary : `${colorScheme.primary}15`,
                            color: isPlaying ? 'white' : colorScheme.primary
                          } as React.CSSProperties}
                        >
                          {isPlaying ? <Play className="h-3 w-3" fill="currentColor" /> : index + 1}
                        </div>
                        
                        {/* Video Thumbnail */}
                        <div 
                          className="relative flex-shrink-0"
                          onClick={() => onVideoClick(queueVideo)}
                        >
                          <img 
                            src={queueVideo.thumbnail} 
                            alt={queueVideo.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white px-1 py-0.5 rounded text-xs font-medium">
                            {queueVideo.duration}
                          </div>
                          {/* Playing Indicator Overlay */}
                          {isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded transition-opacity">
                              <div className="text-white text-xs font-semibold px-2 py-1 bg-black/70 rounded-full flex items-center gap-1">
                                <Play className="h-2 w-2" fill="currentColor" />
                                Now Playing
                              </div>
                            </div>
                          )}
                          {/* Hover Play Button */}
                          {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Video Info */}
                        <div 
                          className="flex-1 min-w-0 py-1 cursor-pointer"
                          onClick={(e) => {
                            // Prevent click during drag
                            if (draggedItem) {
                              e.preventDefault();
                              return;
                            }
                            onVideoClick(queueVideo);
                          }}
                        >
                          <h4 className={`text-sm font-medium line-clamp-2 mb-2 leading-tight transition-colors duration-300 ${
                            isPlaying ? 'font-semibold' : ''
                          }`} style={{
                            color: isPlaying ? colorScheme.primary : 'inherit'
                          }}>
                            {queueVideo.title}
                            {isPlaying && (
                              <span className="ml-2 inline-flex items-center">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colorScheme.primary }}></div>
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">{queueVideo.channel.name}</p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromQueue(queueVideo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive remove-button flex-shrink-0 mt-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}
            </div>

            <h2>Up Next</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div 
                  key={relatedVideo.id} 
                  className="group relative flex space-x-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
                >
                  <div 
                    className="relative flex-shrink-0"
                    onClick={() => onVideoClick(relatedVideo)}
                  >
                    <img 
                      src={relatedVideo.thumbnail} 
                      alt={relatedVideo.title}
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                      {relatedVideo.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div 
                    className="flex-1 space-y-1" 
                    onClick={() => onVideoClick(relatedVideo)}
                  >
                    <h3 className="line-clamp-2 text-sm">{relatedVideo.title}</h3>
                    <p className="text-xs text-muted-foreground">{relatedVideo.channel.name}</p>
                    <div className="text-xs text-muted-foreground">
                      {relatedVideo.views} views • {relatedVideo.uploadDate}
                    </div>
                  </div>
                  
                  {/* Add to Queue Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQueue(relatedVideo);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    title="Add to queue"
                  >
                    <ListPlus className="h-4 w-4" />
                  </Button>

                </div>
              ))}
            </div>

            {/* More from Channel */}
            <Separator />
            <div>
              <h3 className="mb-4">More from {video.channel.name}</h3>
              <div className="grid grid-cols-1 gap-4">
                {relatedVideos.slice(0, 2).map((channelVideo) => (
                  <VideoCard
                    key={`channel-${channelVideo.id}`}
                    video={channelVideo}
                    onClick={() => onVideoClick(channelVideo)}
                    onDownload={() => toast.success(`Started downloading "${channelVideo.title}"`)}
                    onChannelClick={onChannelClick}
                    isTheaterMode={false}
                  />
                ))}
              </div>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
      </div>



      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for reporting</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam or misleading</SelectItem>
                  <SelectItem value="violence">Violent or repulsive content</SelectItem>
                  <SelectItem value="hate">Hateful or abusive content</SelectItem>
                  <SelectItem value="harassment">Harassment or bullying</SelectItem>
                  <SelectItem value="copyright">Copyright infringement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Additional details</Label>
              <Textarea
                id="details"
                placeholder="Please provide more details about your report..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReport}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Super Chat Dialog */}
      <Dialog open={showSuperChatDialog} onOpenChange={setShowSuperChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Super Chat to {video.channel.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Select value={superChatAmount} onValueChange={setSuperChatAmount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">$1.00</SelectItem>
                  <SelectItem value="2">$2.00</SelectItem>
                  <SelectItem value="5">$5.00</SelectItem>
                  <SelectItem value="10">$10.00</SelectItem>
                  <SelectItem value="20">$20.00</SelectItem>
                  <SelectItem value="50">$50.00</SelectItem>
                  <SelectItem value="100">$100.00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                placeholder="Write a message to support your favorite creator..."
                value={superChatMessage}
                onChange={(e) => setSuperChatMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <p className="text-sm">
                <strong>Super Chat Highlight:</strong> Your message will be highlighted and pinned 
                in the chat for everyone to see. This helps support {video.channel.name} directly!
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSuperChatDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitSuperChat}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                Send ${superChatAmount} Super Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Creation Modal */}
      <CardCreationModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        videoId={video.id}
        currentTime={0} // This will be updated by the card context
      />

      {/* Upload Content Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Video Content
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uploadTitle">Video Title *</Label>
              <Input
                id="uploadTitle"
                placeholder="Enter video title..."
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadDescription">Video Description *</Label>
              <Textarea
                id="uploadDescription"
                placeholder="Describe your video content..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoFile">Select Video File *</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="videoFile" className="cursor-pointer">
                      <span className="mt-1 block text-xs text-gray-500">
                        MP4, MOV, AVI up to 2GB
                      </span>
                    </label>
                    <Input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Upload Process:</strong> Your video will be processed after upload. 
                Processing time depends on video length and quality. You'll receive a notification 
                when your video is ready and published to your channel.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Local MiniPlayer removed - using global MiniPlayer in App.tsx */}

    </CardProvider>
  );
}
