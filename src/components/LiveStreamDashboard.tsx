import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Users,
  MessageSquare,
  Heart,
  Gift,
  Eye,
  Clock,
  TrendingUp,
  DollarSign,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Crown,
  Star,
  Zap,
  Camera,
  Mic,
  Monitor,
  Volume2,
  Share,
  Copy,
  ExternalLink,
  Download,
  Calendar,
  Hash,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveStreamDashboardProps {
  streamData: {
    id: string;
    title: string;
    description: string;
    category: string;
    startTime: Date;
    streamKey: string;
    streamUrl: string;
  };
  onEndStream: () => void;
}

interface StreamStats {
  currentViewers: number;
  totalViews: number;
  peakViewers: number;
  duration: number;
  messages: number;
  likes: number;
  superChats: number;
  superChatRevenue: number;
  followers: number;
  avgWatchTime: number;
}

interface RecentActivity {
  id: string;
  type: 'follow' | 'superchat' | 'like' | 'share' | 'milestone';
  user?: string;
  message?: string;
  amount?: number;
  timestamp: Date;
}

export function LiveStreamDashboard({ streamData, onEndStream }: LiveStreamDashboardProps) {
  const [stats, setStats] = useState<StreamStats>({
    currentViewers: 0,
    totalViews: 0,
    peakViewers: 0,
    duration: 0,
    messages: 0,
    likes: 0,
    superChats: 0,
    superChatRevenue: 0,
    followers: 0,
    avgWatchTime: 120
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'excellent' | 'good' | 'poor' | 'offline'>('excellent');
  const [streamHealth, setStreamHealth] = useState({
    bitrate: 4500,
    fps: 30,
    droppedFrames: 0,
    cpuUsage: 45,
    memoryUsage: 62
  });

  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showStatsDetails, setShowStatsDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentViewers: Math.max(0, prev.currentViewers + Math.floor(Math.random() * 10) - 4),
        totalViews: prev.totalViews + Math.floor(Math.random() * 3),
        duration: prev.duration + 1,
        messages: prev.messages + Math.floor(Math.random() * 5),
        likes: prev.likes + Math.floor(Math.random() * 2),
        peakViewers: Math.max(prev.peakViewers, prev.currentViewers)
      }));

      // Update stream health
      setStreamHealth(prev => ({
        ...prev,
        bitrate: 4500 + Math.random() * 500 - 250,
        droppedFrames: prev.droppedFrames + Math.floor(Math.random() * 2),
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + Math.random() * 10 - 5)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + Math.random() * 8 - 4))
      }));

      // Simulate activities
      if (Math.random() > 0.7) {
        const activities: RecentActivity[] = [
          {
            id: Date.now().toString(),
            type: 'follow',
            user: `User${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date()
          },
          {
            id: Date.now().toString(),
            type: 'superchat',
            user: `Supporter${Math.floor(Math.random() * 100)}`,
            message: 'Great stream!',
            amount: Math.floor(Math.random() * 50) + 5,
            timestamp: new Date()
          },
          {
            id: Date.now().toString(),
            type: 'like',
            user: `Fan${Math.floor(Math.random() * 500)}`,
            timestamp: new Date()
          }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setRecentActivity(prev => [randomActivity, ...prev.slice(0, 9)]);

        if (randomActivity.type === 'superchat') {
          setStats(prev => ({
            ...prev,
            superChats: prev.superChats + 1,
            superChatRevenue: prev.superChatRevenue + (randomActivity.amount || 0)
          }));
        } else if (randomActivity.type === 'follow') {
          setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-orange-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    return connectionStatus === 'offline' ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />;
  };

  const handleCopyStreamKey = () => {
    navigator.clipboard.writeText(streamData.streamKey);
    toast.success('Stream key copied to clipboard!');
  };

  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${streamData.id}`);
    toast.success('Stream URL copied to clipboard!');
  };

  const handleEndStream = () => {
    onEndStream();
    toast.success('Stream ended successfully!');
    setShowEndStreamDialog(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-red-600 hover:bg-red-600 text-white animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
              <h1 className="text-2xl font-bold">{streamData.title}</h1>
            </div>
            <p className="text-muted-foreground">
              Streaming for {formatDuration(stats.duration)} • {stats.currentViewers} viewers
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowEndStreamDialog(true)}
            >
              End Stream
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Viewers</p>
                  <p className="text-2xl font-bold">{stats.currentViewers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peak Viewers</p>
                  <p className="text-2xl font-bold">{stats.peakViewers.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Super Chat Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${stats.superChatRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Followers</p>
                  <p className="text-2xl font-bold">{stats.followers.toLocaleString()}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stream Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Stream Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection</span>
                <div className={`flex items-center gap-2 ${getConnectionStatusColor()}`}>
                  {getConnectionStatusIcon()}
                  <span className="text-sm font-medium capitalize">{connectionStatus}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bitrate</span>
                  <span>{Math.round(streamHealth.bitrate)} Kbps</span>
                </div>
                <Progress value={(streamHealth.bitrate / 6000) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{Math.round(streamHealth.cpuUsage)}%</span>
                </div>
                <Progress value={streamHealth.cpuUsage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>{Math.round(streamHealth.memoryUsage)}%</span>
                </div>
                <Progress value={streamHealth.memoryUsage} className="h-2" />
              </div>

              <div className="flex justify-between text-sm">
                <span>Dropped Frames</span>
                <span className={streamHealth.droppedFrames > 50 ? 'text-red-500' : 'text-green-500'}>
                  {streamHealth.droppedFrames}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {activity.type === 'follow' && <Heart className="h-4 w-4 text-red-500" />}
                        {activity.type === 'superchat' && <Gift className="h-4 w-4 text-yellow-500" />}
                        {activity.type === 'like' && <Star className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'share' && <Share className="h-4 w-4 text-green-500" />}
                        {activity.type === 'milestone' && <Crown className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.type === 'follow' && 'started following'}
                          {activity.type === 'superchat' && `sent $${activity.amount} Super Chat`}
                          {activity.type === 'like' && 'liked the stream'}
                          {activity.type === 'share' && 'shared the stream'}
                          {activity.type === 'milestone' && 'milestone reached'}
                        </p>
                        {activity.message && (
                          <p className="text-xs text-muted-foreground mt-1">"{activity.message}"</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Chat Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Messages</span>
                <span className="font-semibold">{stats.messages.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Super Chats</span>
                <span className="font-semibold text-yellow-600">{stats.superChats}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Likes</span>
                <span className="font-semibold text-red-500">{stats.likes}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-semibold text-green-600">
                    {((stats.messages + stats.likes) / Math.max(stats.totalViews, 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={((stats.messages + stats.likes) / Math.max(stats.totalViews, 1) * 100)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Viewer Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span>{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Watch Time</span>
                    <span>{Math.round(stats.avgWatchTime / 60)}m {stats.avgWatchTime % 60}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stream Duration</span>
                    <span>{formatDuration(stats.duration)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Revenue</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Super Chat Total</span>
                    <span className="text-green-600 font-medium">${stats.superChatRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Super Chat</span>
                    <span className="text-green-600">
                      ${stats.superChats > 0 ? (stats.superChatRevenue / stats.superChats).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue/Hour</span>
                    <span className="text-green-600">
                      ${stats.duration > 0 ? ((stats.superChatRevenue / stats.duration) * 3600).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Growth</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">New Followers</span>
                    <span className="text-blue-600 font-medium">+{stats.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Follow Rate</span>
                    <span className="text-blue-600">
                      {stats.totalViews > 0 ? ((stats.followers / stats.totalViews) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary">{streamData.category}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* End Stream Dialog */}
      <Dialog open={showEndStreamDialog} onOpenChange={setShowEndStreamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Live Stream</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to end your live stream? This action cannot be undone.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Stream Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{formatDuration(stats.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Viewers:</span>
                  <span>{stats.peakViewers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Messages:</span>
                  <span>{stats.messages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Super Chat Revenue:</span>
                  <span className="text-green-600">${stats.superChatRevenue}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEndStreamDialog(false)}>
                Continue Streaming
              </Button>
              <Button variant="destructive" onClick={handleEndStream}>
                End Stream
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Live Stream</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Stream URL</label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/live/${streamData.id}`}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleCopyStreamUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Embed Code</label>
              <div className="flex gap-2">
                <Input
                  value={`<iframe src="${window.location.origin}/embed/live/${streamData.id}" width="560" height="315"></iframe>`}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(`<iframe src="${window.location.origin}/embed/live/${streamData.id}" width="560" height="315"></iframe>`);
                  toast.success('Embed code copied!');
                }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => {
                const text = `🔴 Live now: ${streamData.title} ${window.location.origin}/live/${streamData.id}`;
                navigator.clipboard.writeText(text);
                toast.success('Share text copied!');
              }}>
                <Hash className="h-4 w-4 mr-2" />
                Copy Share Text
              </Button>
              <Button variant="outline" onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔴 Live now: ${streamData.title}`)}&url=${encodeURIComponent(`${window.location.origin}/live/${streamData.id}`)}`);
              }}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Tweet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}