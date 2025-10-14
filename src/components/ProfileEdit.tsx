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
  Save,
  X,
  SquarePen,
  Instagram,
  Twitter,
  Globe,
  MessageCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  socialLinks?: SocialLink[];
}

interface ProfileEditProps {
  user: UserData;
  onSave: (updatedUser: Partial<UserData>) => void;
  onCancel: () => void;
}

export function ProfileEdit({ user, onSave, onCancel }: ProfileEditProps) {
  const [editData, setEditData] = useState({
    displayName: user.displayName || '',
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    website: user.website || '',
    avatar: user.avatar,
    socialLinks: user.socialLinks || []
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { name: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/server' },
    { name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' }
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, avatar: url }));
      setAvatarPreview(url);
    }
  };

  const addSocialLink = () => {
    setEditData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: 'Globe' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setEditData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setEditData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleSave = () => {
    onSave({
      displayName: editData.displayName,
      username: editData.username,
      email: editData.email,
      bio: editData.bio,
      website: editData.website,
      avatar: editData.avatar,
      socialLinks: editData.socialLinks
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
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
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Customize your profile information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {(avatarPreview || editData.avatar) ? (
                  <AvatarImage
                    src={avatarPreview || editData.avatar}
                    alt={editData.displayName || editData.username}
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  {getInitials(editData.displayName || editData.username)}
                </AvatarFallback>
              </Avatar>
              {/* Profile Picture Change Button */}
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editData.displayName}
                onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter your display name"
              />
              <p className="text-xs text-muted-foreground">The name shown publicly on your channel</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username/Handle</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value.replace('@', '') }))}
                  placeholder="username"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">Unique identifier (e.g., @hiteshStreams)</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-muted-foreground">For business inquiries or collabs</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio/Tagline</Label>
            <Textarea
              id="bio"
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Short description or vibe statement..."
              rows={3}
            />
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
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editData.socialLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No social links added yet</p>
              <p className="text-sm">Click "Add Link" to connect your social profiles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {editData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <select
                      id={`platform-${index}`}
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      title="Select social media platform"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="flex-[2] space-y-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
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
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Here's how your profile will appear:
            </p>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={avatarPreview || editData.avatar}
                    alt={editData.displayName || editData.username}
                  />
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {getInitials(editData.displayName || editData.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{editData.displayName || editData.username}</h3>
                  <p className="text-muted-foreground">@{editData.username}</p>
                  {editData.bio && <p className="text-sm text-muted-foreground mt-2">{editData.bio}</p>}
                  {editData.email && (
                    <p className="text-sm text-muted-foreground mt-1">
                      📧 {editData.email}
                    </p>
                  )}
                  {editData.socialLinks.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Social Links:</p>
                      <div className="flex flex-wrap gap-2">
                        {editData.socialLinks
                          .filter(link => link.platform && link.url)
                          .map((link, index) => (
                            <div key={index} className="flex items-center gap-1 px-2 py-1 bg-background rounded-md border text-xs">
                              {link.platform === 'Instagram' && <Instagram className="h-3 w-3" />}
                              {link.platform === 'Twitter' && <Twitter className="h-3 w-3" />}
                              {link.platform === 'Discord' && <MessageCircle className="h-3 w-3" />}
                              {!['Instagram', 'Twitter', 'Discord'].includes(link.platform) && <Globe className="h-3 w-3" />}
                              <span>{link.platform}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
