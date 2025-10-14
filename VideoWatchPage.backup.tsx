import { useState } from 'react';
import { CardProvider } from './src/contexts/CardContext';
import { CardCreationModal } from './src/components/cards/CardCreationModal';
import { VideoCard as InteractiveCard } from './src/types/cards';
import { useQueue } from './src/components/QueueProvider';
import { FloatingQueue } from './src/components/FloatingQueue';
import { Button } from './src/components/ui/button';
import { Card, CardContent } from './src/components/ui/card';
import { Badge } from './src/components/ui/badge';
import { Avatar, AvatarFallback } from './src/components/ui/avatar';
import { Separator } from './src/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './src/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './src/components/ui/dropdown-menu';
import { Textarea } from './src/components/ui/textarea';
import { Label } from './src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './src/components/ui/select';

import { VideoPlayer } from './src/components/VideoPlayer';
import { VideoCard } from './src/components/VideoCard';
import { ThemeToggle } from './src/components/ThemeToggle';
import { ColorSelector } from './src/components/ColorSelector';
import { ArrowLeft, Share, Download, Bell, Play, MessageCircle, Flag, Bookmark, DollarSign, Settings, ThumbsUp, ThumbsDown, ListPlus, List } from 'lucide-react';
import { toast } from 'sonner';

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
}

export function VideoWatchPage({ video, onBack, onVideoClick, onChannelClick }: VideoWatchPageProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
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
  const [showQueue, setShowQueue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [theaterVariant, setTheaterVariant] = useState<'standard' | 'cinema' | 'ultrawide'>('standard');

  // Queue functionality
  const { addToQueue, videoQueue } = useQueue();


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
      toast.success('Comment posted successfully!');
      setCommentText('');
    } else {
      toast.error('Please enter a comment');
    }
  };

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

  const handleAddToQueue = () => {
    addToQueue(video);
  };

  const handleShowQueue = () => {
    setShowQueue(true);
  };

  const handleCloseQueue = () => {
    setShowQueue(false);
  };

  const handleVideoFromQueue = (queuedVideo: Video) => {
    onVideoClick(queuedVideo);
    toast.success(`Now playing: ${queuedVideo.title}`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Video paused' : 'Video playing');
  };

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
      
      <div className={`relative z-10 transition-all duration-500 ease-in-out ${
        isTheaterMode ? 'max-w-none px-3 py-4' : 'container mx-auto px-4 py-6'
      }`}>
        {isTheaterMode ? (
          // Theater Mode Layout - Simplified
          <div className="space-y-6">
            <VideoPlayer
              videoUrl="/api/placeholder/video.mp4"
              title={video.title}
              videoId={video.id}
              isCreator={true}
              onDownload={handleDownload}
              onShare={handleShare}
              onTheaterMode={handleTheaterMode}
              isTheaterMode={isTheaterMode}
              theaterVariant={theaterVariant}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
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
          </div>
        ) : (
          // Regular Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  isTheaterMode={isTheaterMode}
                  theaterVariant={theaterVariant}
                  onCardClick={handleCardClick}
                  onAddCard={handleAddCard}
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
                    Comments
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
                  <Button variant="outline" size="sm" onClick={handleAddToQueue}>
                    <ListPlus className="h-4 w-4 mr-2" />
                    Add to Queue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShowQueue}
                    className={`relative transition-all duration-300 ${
                      videoQueue.length > 0 
                        ? 'ring-2 ring-primary/20 shadow-lg' 
                        : ''
                    }`}
                    title={`View Queue (${videoQueue.length} videos)`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Queue
                    {videoQueue.length > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-pulse"
                      >
                        {videoQueue.length}
                      </Badge>
                    )}
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
                        `Experience this amazing content in stunning quality up to 4K! This video showcases the incredible capabilities of modern streaming technology. 
                        
Available in multiple quality options to suit your device and connection:
• 4K (2160p) - Ultra HD quality
• 1440p - High definition
• 1080p - Full HD
• 720p - HD Ready
• 480p - Standard definition

Perfect for offline viewing - download now and watch anywhere, anytime. Our advanced streaming platform automatically adapts to your device capabilities and network conditions for the best possible viewing experience.

Don't forget to like and subscribe for more high-quality content!`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="space-y-4">
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
                  {/* Add to Queue button for related videos */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(relatedVideo);
                      }}
                      title="Add to Queue"
                    >
                      <ListPlus className="h-3 w-3" />
                    </Button>
                  </div>
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
        )}
      </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Add a comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
            <Separator />
            {/* Mock Comments */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">John Doe</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm mt-1">Great video! Very informative and well explained.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Alice Smith</span>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <p className="text-sm mt-1">Thanks for sharing this! Looking forward to more content like this.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReportDetails(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSuperChatMessage(e.target.value)}
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

      {/* Floating Queue Window */}
      <FloatingQueue
        isOpen={showQueue}
        onClose={handleCloseQueue}
        onVideoSelect={handleVideoFromQueue}
        currentVideoId={video.id}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
      
      </div>
    </CardProvider>
  );
}