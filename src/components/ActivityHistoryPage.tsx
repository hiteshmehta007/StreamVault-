import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Play, 
  Download, 
  Heart, 
  MessageSquare, 
  Settings, 
  Eye,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface Activity {
  id: string;
  type: 'video_watch' | 'download' | 'like' | 'comment' | 'playlist_create' | 'subscription' | 'search' | 'setting_change';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityHistoryPageProps {
  user?: any;
}

export function ActivityHistoryPage({ user: _user }: ActivityHistoryPageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock activity data
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'video_watch',
        title: 'Watched "Epic Mountain Adventure"',
        description: 'Completed full video (24:35)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { duration: 1475, channel: 'Adventure Zone' }
      },
      {
        id: '2',
        type: 'like',
        title: 'Liked "Cooking Masterclass: Italian Pasta"',
        description: 'Added to liked videos',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        metadata: { channel: 'Chef\'s Corner' }
      },
      {
        id: '3',
        type: 'subscription',
        title: 'Subscribed to Tech Reviews Daily',
        description: 'New subscription added',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        metadata: { subscribers: '2.4M' }
      },
      {
        id: '4',
        type: 'download',
        title: 'Downloaded "Productivity Tips 2024"',
        description: 'Video saved for offline viewing',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { size: '245MB', quality: '1080p' }
      },
      {
        id: '5',
        type: 'playlist_create',
        title: 'Created playlist "Weekend Learning"',
        description: 'New playlist with 0 videos',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { privacy: 'private' }
      },
      {
        id: '6',
        type: 'comment',
        title: 'Commented on "JavaScript Tutorial #5"',
        description: 'Left a comment: "Great explanation, thank you!"',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { channel: 'Code Academy' }
      },
      {
        id: '7',
        type: 'search',
        title: 'Searched for "react hooks tutorial"',
        description: 'Found 1,245 results',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { results: 1245 }
      },
      {
        id: '8',
        type: 'setting_change',
        title: 'Changed video quality preference',
        description: 'Updated default quality to 1080p',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { previous: '720p', new: '1080p' }
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter activities based on search and type
  useEffect(() => {
    let filtered = activities;

    if (searchQuery.trim()) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    setFilteredActivities(filtered);
  }, [activities, searchQuery, filterType]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'video_watch': return Play;
      case 'download': return Download;
      case 'like': return Heart;
      case 'comment': return MessageSquare;
      case 'playlist_create': return FileText;
      case 'subscription': return User;
      case 'search': return Search;
      case 'setting_change': return Settings;
      default: return Eye;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'video_watch': return 'text-blue-500';
      case 'download': return 'text-green-500';
      case 'like': return 'text-red-500';
      case 'comment': return 'text-purple-500';
      case 'playlist_create': return 'text-yellow-500';
      case 'subscription': return 'text-orange-500';
      case 'search': return 'text-gray-500';
      case 'setting_change': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'video_watch': return { label: 'Watched', color: 'bg-blue-100 text-blue-800' };
      case 'download': return { label: 'Downloaded', color: 'bg-green-100 text-green-800' };
      case 'like': return { label: 'Liked', color: 'bg-red-100 text-red-800' };
      case 'comment': return { label: 'Commented', color: 'bg-purple-100 text-purple-800' };
      case 'playlist_create': return { label: 'Created', color: 'bg-yellow-100 text-yellow-800' };
      case 'subscription': return { label: 'Subscribed', color: 'bg-orange-100 text-orange-800' };
      case 'search': return { label: 'Searched', color: 'bg-gray-100 text-gray-800' };
      case 'setting_change': return { label: 'Settings', color: 'bg-indigo-100 text-indigo-800' };
      default: return { label: 'Activity', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'video_watch', label: 'Watched Videos' },
    { value: 'like', label: 'Liked Content' },
    { value: 'download', label: 'Downloads' },
    { value: 'subscription', label: 'Subscriptions' },
    { value: 'comment', label: 'Comments' },
    { value: 'playlist_create', label: 'Playlists' },
    { value: 'search', label: 'Searches' },
    { value: 'setting_change', label: 'Settings' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold">Activity History</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your activity and interactions on StreamVault
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your activity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-foreground"
                  title="Filter activity type"
                  aria-label="Filter activity by type"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredActivities.length} of {activities.length} activities
              </p>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start watching videos to see your activity here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  const badge = getActivityBadge(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm truncate mb-1">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            
                            <div className="flex items-center space-x-3">
                              <Badge className={`text-xs ${badge.color}`}>
                                {badge.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                              
                              {activity.metadata && (
                                <span className="text-xs text-muted-foreground">
                                  {activity.type === 'video_watch' && activity.metadata.channel && (
                                    <>• {activity.metadata.channel}</>
                                  )}
                                  {activity.type === 'download' && activity.metadata.size && (
                                    <>• {activity.metadata.size}</>
                                  )}
                                  {activity.type === 'search' && activity.metadata.results && (
                                    <>• {activity.metadata.results.toLocaleString()} results</>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your activity history is private and only visible to you. You can delete specific activities or clear your entire history at any time.{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                Learn more about privacy
              </Button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

