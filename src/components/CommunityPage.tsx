import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MessageCircle,
  Send,
  Heart,
  Bookmark,
  MoreHorizontal,
  Image,
  Video,
  Smile,
  X,
  Check,
  Trash2,
  Edit,
  Flag,
  Pin,
  TrendingUp,
  Clock,
  Eye,
  Filter,
  Search,
  Plus,
  Camera,
  Upload,
  Link as LinkIcon,
  Globe,
  Lock,
  Users,
  Sparkles,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  isCreator?: boolean;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  likes: number;
  dislikes: number;
  timestamp: Date;
  replies: Comment[];
  isCreatorReply?: boolean;
  userLiked?: boolean;
  userDisliked?: boolean;
}

interface CommunityPost {
  id: string;
  creator: User;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  likes: number;
  dislikes: number;
  shares: number;
  comments: Comment[];
  timestamp: Date;
  isPinned?: boolean;
  visibility: 'public' | 'followers' | 'members';
  userLiked?: boolean;
  userDisliked?: boolean;
  userBookmarked?: boolean;
}

interface CommunityPageProps {
  user?: User;
  onNavigate?: (page: string) => void;
}

export function CommunityPage({ user, onNavigate }: CommunityPageProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      creator: {
        id: 'creator1',
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        verified: true,
        isCreator: true
      },
      content: 'Just hit 100K subscribers! 🎉 Thank you all for the incredible support. Got some amazing content coming your way next week! What would you like to see? Drop your suggestions below! 👇',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60'
        }
      ],
      likes: 2847,
      dislikes: 12,
      shares: 156,
      comments: [
        {
          id: 'c1',
          user: {
            id: 'u1',
            name: 'Mike Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
            verified: false
          },
          content: 'Congratulations! You deserve it! Your content is always top-notch! 🔥',
          likes: 234,
          dislikes: 2,
          timestamp: new Date(Date.now() - 3600000),
          replies: [
            {
              id: 'r1',
              user: {
                id: 'creator1',
                name: 'Sarah Johnson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
                verified: true,
                isCreator: true
              },
              content: 'Thank you so much Mike! Really appreciate your support! ❤️',
              likes: 89,
              dislikes: 0,
              timestamp: new Date(Date.now() - 3000000),
              replies: [],
              isCreatorReply: true
            }
          ]
        },
        {
          id: 'c2',
          user: {
            id: 'u2',
            name: 'Emily Davis',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
            verified: true
          },
          content: 'Would love to see more behind-the-scenes content! 🎬',
          likes: 156,
          dislikes: 1,
          timestamp: new Date(Date.now() - 7200000),
          replies: []
        }
      ],
      timestamp: new Date(Date.now() - 86400000),
      isPinned: true,
      visibility: 'public',
      userLiked: false,
      userDisliked: false,
      userBookmarked: false
    },
    {
      id: '2',
      creator: {
        id: 'creator2',
        name: 'Alex Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        verified: true,
        isCreator: true
      },
      content: 'New tutorial series starting tomorrow! 🚀 We\'ll be covering advanced techniques that will take your skills to the next level. Who\'s ready? 💪',
      media: [
        {
          type: 'video',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60'
        }
      ],
      likes: 1543,
      dislikes: 8,
      shares: 89,
      comments: [],
      timestamp: new Date(Date.now() - 172800000),
      visibility: 'public',
      userLiked: false,
      userDisliked: false,
      userBookmarked: false
    }
  ]);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<File[]>([]);
  const [newPostVisibility, setNewPostVisibility] = useState<'public' | 'followers' | 'members'>('public');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const [filterType, setFilterType] = useState<'all' | 'following' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Handle like post
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasLiked = post.userLiked;
        const wasDisliked = post.userDisliked;
        
        return {
          ...post,
          likes: wasLiked ? post.likes - 1 : post.likes + 1,
          dislikes: wasDisliked ? post.dislikes - 1 : post.dislikes,
          userLiked: !wasLiked,
          userDisliked: false
        };
      }
      return post;
    }));
    toast.success('Post liked!');
  };

  // Handle dislike post
  const handleDislikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasLiked = post.userLiked;
        const wasDisliked = post.userDisliked;
        
        return {
          ...post,
          likes: wasLiked ? post.likes - 1 : post.likes,
          dislikes: wasDisliked ? post.dislikes - 1 : post.dislikes + 1,
          userLiked: false,
          userDisliked: !wasDisliked
        };
      }
      return post;
    }));
    toast.info('Post disliked');
  };

  // Handle share post
  const handleSharePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
    
    // Copy link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast.success('Link copied to clipboard!');
  };

  // Handle bookmark post
  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, userBookmarked: !post.userBookmarked };
      }
      return post;
    }));
    toast.success('Post bookmarked!');
  };

  // Handle like comment
  const handleLikeComment = (postId: string, commentId: string, isReply: boolean = false, parentCommentId?: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updateComment = (comment: Comment): Comment => {
          if (comment.id === commentId) {
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
          
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(updateComment)
            };
          }
          
          return comment;
        };
        
        return {
          ...post,
          comments: post.comments.map(updateComment)
        };
      }
      return post;
    }));
  };

  // Handle dislike comment
  const handleDislikeComment = (postId: string, commentId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updateComment = (comment: Comment): Comment => {
          if (comment.id === commentId) {
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
          
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(updateComment)
            };
          }
          
          return comment;
        };
        
        return {
          ...post,
          comments: post.comments.map(updateComment)
        };
      }
      return post;
    }));
  };

  // Handle add comment
  const handleAddComment = (postId: string) => {
    if (!commentContent[postId]?.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: user || {
        id: 'currentUser',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'
      },
      content: commentContent[postId],
      likes: 0,
      dislikes: 0,
      timestamp: new Date(),
      replies: [],
      userLiked: false,
      userDisliked: false
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentContent({ ...commentContent, [postId]: '' });
    toast.success('Comment added!');
  };

  // Handle add reply
  const handleAddReply = (postId: string, commentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Comment = {
      id: `r${Date.now()}`,
      user: user || {
        id: 'currentUser',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'
      },
      content: replyContent,
      likes: 0,
      dislikes: 0,
      timestamp: new Date(),
      replies: [],
      userLiked: false,
      userDisliked: false
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updateComment = (comment: Comment): Comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(updateComment)
            };
          }
          
          return comment;
        };
        
        return {
          ...post,
          comments: post.comments.map(updateComment)
        };
      }
      return post;
    }));

    setReplyContent('');
    setReplyingTo(null);
    toast.success('Reply added!');
  };

  // Handle create post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error('Please add some content to your post');
      return;
    }

    const newPost: CommunityPost = {
      id: `p${Date.now()}`,
      creator: user || {
        id: 'currentUser',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        isCreator: true
      },
      content: newPostContent,
      media: newPostMedia.length > 0 ? newPostMedia.map((file, index) => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      })) : undefined,
      likes: 0,
      dislikes: 0,
      shares: 0,
      comments: [],
      timestamp: new Date(),
      visibility: newPostVisibility,
      userLiked: false,
      userDisliked: false,
      userBookmarked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostMedia([]);
    setShowCreatePost(false);
    toast.success('Post created successfully!');
  };

  // Handle delete post
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast.success('Post deleted');
  };

  // Toggle comments
  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  // Render comment component
  const renderComment = (post: CommunityPost, comment: Comment, depth: number = 0) => {
    const isReplying = replyingTo?.postId === post.id && replyingTo?.commentId === comment.id;
    const isCreatorPost = post.creator.id === comment.user.id;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${depth > 0 ? 'ml-12 mt-3' : 'mt-4'}`}
      >
        <div className={`p-4 rounded-xl transition-all ${
          comment.isCreatorReply 
            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500' 
            : 'bg-white/5 hover:bg-white/10'
        }`}>
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8 ring-2 ring-white/20">
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                {comment.user.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-white text-sm">
                  {comment.user.name}
                </span>
                
                {comment.user.verified && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs px-1.5 py-0">
                    ✓
                  </Badge>
                )}
                
                {comment.isCreatorReply && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs px-1.5 py-0">
                    Creator
                  </Badge>
                )}
                
                <span className="text-xs text-gray-400">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>

              <p className="text-gray-200 text-sm mb-3 break-words leading-relaxed">
                {comment.content}
              </p>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handleLikeComment(post.id, comment.id)}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 text-xs ${
                    comment.userLiked 
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 mr-1 ${comment.userLiked ? 'fill-current' : ''}`} />
                  {formatNumber(comment.likes)}
                </Button>

                <Button
                  onClick={() => handleDislikeComment(post.id, comment.id)}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 text-xs ${
                    comment.userDisliked 
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <ThumbsDown className={`w-3 h-3 mr-1 ${comment.userDisliked ? 'fill-current' : ''}`} />
                  {comment.dislikes > 0 ? formatNumber(comment.dislikes) : ''}
                </Button>

                <Button
                  onClick={() => setReplyingTo({ postId: post.id, commentId: comment.id })}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Reply
                </Button>

                {comment.user.id === user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Reply Input */}
              {isReplying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="flex space-x-2">
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddReply(post.id, comment.id)}
                    />
                    <Button
                      onClick={() => handleAddReply(post.id, comment.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setReplyingTo(null)}
                      size="sm"
                      variant="ghost"
                      className="bg-white/5 hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Nested Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-2">
                  {comment.replies.map(reply => renderComment(post, reply, depth + 1))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900/5 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
                  <Users className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Community
                  </h1>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Connect, share, and engage with creators
                  </p>
                </div>
              </div>
            </div>

            {(user?.isCreator || (user as any)?.channel) && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  data-create-post-button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 border-0 px-6 py-6 text-base font-semibold transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Post
                </Button>
              </motion.div>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, creators, or topics..."
                  className="pl-12 pr-4 py-6 bg-gray-900/50 backdrop-blur-xl border border-white/10 text-white placeholder-gray-500 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Filter Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2 bg-gray-900/30 backdrop-blur-sm p-1.5 rounded-2xl border border-white/5">
              <Button
                onClick={() => setFilterType('all')}
                variant="ghost"
                className={`${
                  filterType === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                onClick={() => setFilterType('following')}
                variant="ghost"
                className={`${
                  filterType === 'following'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Following
              </Button>
              <Button
                onClick={() => setFilterType('trending')}
                variant="ghost"
                className={`${
                  filterType === 'trending'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreatePost(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Post</h2>
                  <Button
                    onClick={() => setShowCreatePost(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-gray-300"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Image
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-gray-300"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-gray-300"
                      >
                        <Smile className="w-4 h-4 mr-2" />
                        Emoji
                      </Button>
                    </div>

                    <select
                      value={newPostVisibility}
                      onChange={(e) => setNewPostVisibility(e.target.value as any)}
                      className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                      aria-label="Post visibility"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers Only</option>
                      <option value="members">Members Only</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowCreatePost(false)}
                      variant="ghost"
                      className="bg-white/5 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-white/20">
                      <AvatarImage src={post.creator.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {post.creator.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">
                          {post.creator.name}
                        </span>
                        {post.creator.verified && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                        {post.isPinned && (
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(post.timestamp)}</span>
                        {post.visibility === 'followers' && (
                          <Badge variant="secondary" className="bg-white/5 text-gray-300 text-xs">
                            <Lock className="w-2 h-2 mr-1" />
                            Followers
                          </Badge>
                        )}
                        {post.visibility === 'members' && (
                          <Badge variant="secondary" className="bg-white/5 text-gray-300 text-xs">
                            <Users className="w-2 h-2 mr-1" />
                            Members
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {post.creator.id === user?.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePost(post.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-white text-base mb-4 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.media && post.media.length > 0 && (
                  <div className={`grid gap-3 mb-6 ${
                    post.media.length === 1 ? 'grid-cols-1' :
                    post.media.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {post.media.map((media, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.02 }}
                        className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Post media"
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <video
                            src={media.url}
                            poster={media.thumbnail}
                            controls
                            className="w-full h-72 object-cover"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between py-3 border-t border-b border-white/10 mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments.length}
                    </span>
                    <span className="flex items-center">
                      <Share2 className="w-4 h-4 mr-1" />
                      {formatNumber(post.shares)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(Math.floor(Math.random() * 10000) + 1000)} views</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleLikePost(post.id)}
                      variant="ghost"
                      className={`flex-1 ${
                        post.userLiked
                          ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-2 ${post.userLiked ? 'fill-current' : ''}`} />
                      Like
                    </Button>

                    <Button
                      onClick={() => handleDislikePost(post.id)}
                      variant="ghost"
                      className={`flex-1 ${
                        post.userDisliked
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 mr-2 ${post.userDisliked ? 'fill-current' : ''}`} />
                      Dislike
                    </Button>

                    <Button
                      onClick={() => toggleComments(post.id)}
                      variant="ghost"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comment
                    </Button>

                    <Button
                      onClick={() => handleSharePost(post.id)}
                      variant="ghost"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <Button
                      onClick={() => handleBookmarkPost(post.id)}
                      variant="ghost"
                      size="sm"
                      className={`${
                        post.userBookmarked
                          ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${post.userBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {expandedComments.has(post.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Add Comment */}
                      <div className="flex space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-white/20">
                          <AvatarImage src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {user?.name?.[0] || 'Y'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            value={commentContent[post.id] || ''}
                            onChange={(e) => setCommentContent({ ...commentContent, [post.id]: e.target.value })}
                            placeholder="Write a comment..."
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <Button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Comments List */}
                      {post.comments.length > 0 ? (
                        <div className="space-y-2">
                          {post.comments.map(comment => renderComment(post, comment))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}