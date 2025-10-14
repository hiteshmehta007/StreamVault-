
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Clock, Download, LogOut, Settings, User } from 'lucide-react';
import { ProfileCard } from './ProfileCard';

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

interface UserProfileProps {
  user: UserData;
  onLogout: () => void;
  onCreateChannel?: () => void;
  onChannelClick?: (channelId: string) => void;
}

export function UserProfile({ user, onLogout, onCreateChannel, onChannelClick }: UserProfileProps) {

  const [daysRemaining, setDaysRemaining] = useState(0);
  const [downloadHistory] = useState([
    { id: 1, title: 'Sample Video 1', quality: '1080p', downloadDate: '2024-01-15', size: '2.1 GB' },
    { id: 2, title: 'Documentary Nature', quality: '4K', downloadDate: '2024-01-14', size: '8.5 GB' },
    { id: 3, title: 'Tech Review', quality: '720p', downloadDate: '2024-01-13', size: '1.2 GB' },
  ]);

  useEffect(() => {
    if (user.recoveryCode) {
      const registrationDate = new Date(user.registrationDate);
      const now = new Date();
      const daysPassed = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(0, 7 - daysPassed);
      setDaysRemaining(remaining);
    }
  }, [user]);



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ProfileCard user={user} />
            
            {/* Quick Actions */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button onClick={onLogout} variant="outline" className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Profile Content */}
        <div className="lg:col-span-2">{/* Recovery Code Alert for Large Display */}
      {user.recoveryCode && daysRemaining > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <Shield className="h-5 w-5" />
              <span>Recovery Code Active</span>
              <Badge variant="secondary" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Your 16-digit recovery code is visible in your profile card. Make sure to save it securely before it expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="downloads" className="w-full">
                <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-full min-w-fit">
            <TabsTrigger value="videos" className="flex-1 min-w-0">
              <span className="truncate">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex-1 min-w-0">
              <span className="truncate">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex-1 min-w-0">
              <span className="truncate">Community</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex-1 min-w-0">
              <span className="truncate">About</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Offline Downloads</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {downloadHistory.map((download) => (
                  <div key={download.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4>{download.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Downloaded on {new Date(download.downloadDate).toLocaleDateString()} • {download.quality} • {download.size}
                      </p>
                    </div>
                    <Badge variant={download.quality === '4K' ? 'default' : 'secondary'}>
                      {download.quality}
                    </Badge>
                  </div>
                ))}
                {downloadHistory.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No downloads yet. Start downloading videos for offline viewing!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channel" className="space-y-4">
          {user.channel ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Your Channel</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onChannelClick?.(user.channel!.id)}
                  >
                    View Channel
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {user.channel.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user.channel.name}</h3>
                    <p className="text-muted-foreground">@{user.channel.handle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{user.channel.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.channel.subscribers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.channel.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.channel.totalVideos}</div>
                    <div className="text-sm text-muted-foreground">Videos</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">Content Creator</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Channel created on {new Date(user.channel.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Create Your Channel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <div className="text-muted-foreground">
                    You haven't created a channel yet. Start sharing your content with the world!
                  </div>
                  <Button 
                    onClick={onCreateChannel}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Create Channel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Streaming Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4>Auto-select quality</h4>
                  <p className="text-sm text-muted-foreground">Automatically choose the best quality for your device</p>
                </div>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4>Download Quality</h4>
                  <p className="text-sm text-muted-foreground">Default quality for offline downloads</p>
                </div>
                <Badge>1080p</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4>Two-factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4>Login Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Badge>Enabled</Badge>
              </div>
              {user.recoveryCode && daysRemaining > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Recovery Code Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Active for {daysRemaining} more day{daysRemaining !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}

