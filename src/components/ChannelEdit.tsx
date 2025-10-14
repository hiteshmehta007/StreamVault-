import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Save,
  X 
} from 'lucide-react';

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

interface ChannelEditProps {
  channel: UserChannel;
  onSave: (updatedChannel: Partial<UserChannel>) => void;
  onCancel: () => void;
}

export function ChannelEdit({ channel, onSave, onCancel }: ChannelEditProps) {
  const [editData, setEditData] = useState({
    name: channel.name,
    handle: channel.handle,
    description: channel.description,
    profilePicture: channel.profilePicture,
    bannerImage: channel.bannerImage
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, profilePicture: url }));
      setProfilePreview(url);
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, bannerImage: url }));
      setBannerPreview(url);
    }
  };

  const handleSave = () => {
    onSave({
      name: editData.name,
      handle: editData.handle,
      description: editData.description,
      profilePicture: editData.profilePicture,
      bannerImage: editData.bannerImage
    });
  };

  const getImageSrc = (image?: File | string) => {
    if (!image) return undefined;
    return typeof image === 'string' ? image : URL.createObjectURL(image);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Channel</h1>
            <p className="text-muted-foreground">Customize your channel branding</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Banner Section */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="h-56 sm:h-64 lg:h-72 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-lg overflow-hidden">
              {(bannerPreview || getImageSrc(channel.bannerImage)) ? (
                <img 
                  src={bannerPreview || getImageSrc(channel.bannerImage)}
                  alt="Channel Banner"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/80">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">Upload Channel Banner</p>
                    <p className="text-sm opacity-75">2560 x 1440 recommended</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <label className="cursor-pointer" htmlFor="banner-upload">
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  aria-label="Upload channel banner image"
                  title="Upload channel banner image"
                />
                <Button 
                  type="button"
                  variant="secondary" 
                  className="bg-white/90 hover:bg-white text-black"
                  aria-describedby="banner-help-text"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Banner
                </Button>
              </label>
            </div>
          </div>
          <p id="banner-help-text" className="text-sm text-muted-foreground">
            Recommended size: 2560 x 1440 pixels. Maximum file size: 6MB.
          </p>
        </CardContent>
      </Card>

      {/* Profile & Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {(profilePreview || getImageSrc(channel.profilePicture)) ? (
                    <AvatarImage 
                      src={profilePreview || getImageSrc(channel.profilePicture)}
                      alt={channel.name}
                      className="object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {editData.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-2 -right-2 cursor-pointer" htmlFor="profile-upload">
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    aria-label="Upload channel profile picture"
                    title="Upload channel profile picture"
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm" 
                    className="h-8 w-8 rounded-full p-0 bg-white hover:bg-gray-50 shadow-md"
                    aria-describedby="profile-help-text"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </label>
              </div>
              <div>
                <p className="font-medium">Channel Profile Picture</p>
                <p id="profile-help-text" className="text-sm text-muted-foreground">
                  Recommended size: 800 x 800 pixels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Stats (Read Only) */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{channel.subscribers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{channel.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{channel.totalVideos}</div>
                <div className="text-sm text-muted-foreground">Videos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Information */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter channel name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelHandle">Channel Handle</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="channelHandle"
                  value={editData.handle}
                  onChange={(e) => setEditData(prev => ({ ...prev, handle: e.target.value.replace('@', '') }))}
                  placeholder="channelhandle"
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelDescription">Channel Description</Label>
            <Textarea
              id="channelDescription"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what your channel is about..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Here's how your channel will appear to viewers:
            </p>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={profilePreview || getImageSrc(channel.profilePicture)}
                    alt={editData.name}
                  />
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {editData.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{editData.name}</h3>
                  <p className="text-muted-foreground">@{editData.handle}</p>
                  <p className="text-sm text-muted-foreground mt-1">{editData.description}</p>
                  <div className="flex items-center space-x-4 text-sm mt-2">
                    <span>{channel.subscribers.toLocaleString()} subscribers</span>
                    <span>{channel.totalViews.toLocaleString()} views</span>
                    <span>{channel.totalVideos} videos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}