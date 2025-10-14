import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import {
  User,
  Settings,
  Instagram,
  Twitter,
  Globe,
  MessageCircle,
  Plus,
  Trash2,
  SquarePen,
  Save,
  Mail,
  ArrowLeft,
  Camera,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface CreatorProfile {
  displayName: string;
  handle: string;
  bio: string;
  contactEmail: string;
  profilePicture?: string;
  socialLinks: SocialLink[];
}

interface CreatorProfileLandingProps {
  onBack?: () => void;
  onSaveComplete?: (profile: CreatorProfile) => void;
}

export function CreatorProfileLanding({ onBack, onSaveComplete }: CreatorProfileLandingProps) {
  // Initialize with default or existing data
  const [profileData, setProfileData] = useState<CreatorProfile>({
    displayName: 'Your Channel Name',
    handle: 'yourchannel',
    bio: '',
    contactEmail: '',
    socialLinks: []
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'preview'>('basic');

  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username', color: 'text-pink-500' },
    { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username', color: 'text-blue-400' },
    { name: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/server', color: 'text-indigo-500' },
    { name: 'YouTube', icon: Globe, placeholder: 'https://youtube.com/@channel', color: 'text-red-500' },
    { name: 'TikTok', icon: Globe, placeholder: 'https://tiktok.com/@username', color: 'text-black' },
    { name: 'Twitch', icon: Globe, placeholder: 'https://twitch.tv/username', color: 'text-purple-500' },
    { name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com', color: 'text-gray-500' },
    { name: 'Other', icon: Globe, placeholder: 'https://example.com', color: 'text-gray-500' }
  ];

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

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setAvatarPreview(dataUrl);
        setProfileData(prev => ({ ...prev, profilePicture: dataUrl }));
      };
      reader.readAsDataURL(file);
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!profileData.displayName.trim()) {
        toast.error('Display name is required');
        return;
      }
      
      if (!profileData.handle.trim()) {
        toast.error('Username/Handle is required');
        return;
      }

      // Simulate save process (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo
      const userData = {
        profile: profileData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('creatorProfile', JSON.stringify(userData));
      
      toast.success('Profile updated successfully!');
      
      if (onSaveComplete) {
        onSaveComplete(profileData);
      }
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = socialPlatforms.find(p => p.name === platform);
    return platformConfig ? platformConfig.icon : Globe;
  };

  const getPlatformColor = (platform: string) => {
    const platformConfig = socialPlatforms.find(p => p.name === platform);
    return platformConfig ? platformConfig.color : 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Creator Profile Setup
              </h1>
              <p className="text-muted-foreground">
                Build your professional creator presence and connect with your audience
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-8 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm"
        >
          {[
            { id: 'basic', label: 'Basic Info', icon: User },
            { id: 'social', label: 'Social Links', icon: Globe },
            { id: 'preview', label: 'Preview', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Profile Picture Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-blue-100">
                        <AvatarImage
                          src={avatarPreview || profileData.profilePicture}
                          alt={profileData.displayName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(profileData.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-2 transition-all duration-200 hover:scale-110"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Upload Your Avatar</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose a professional photo that represents your brand. 
                        Square images work best (400x400px recommended).
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </CardContent>
              </Card>

              {/* Basic Info Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Channel Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">
                        Display Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Enter your display name"
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        The name shown publicly on your channel
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="handle">
                        Username/Handle <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">@</span>
                        <Input
                          id="handle"
                          value={profileData.handle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, handle: e.target.value.replace('@', '') }))}
                          placeholder="username"
                          className="pl-8 text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unique identifier (e.g., @hiteshStreams)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={profileData.contactEmail}
                      onChange={(e) => setProfileData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      For business inquiries or collaborations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio/Tagline</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell your audience about your channel, your passion, and what they can expect from your content..."
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Short description or vibe statement about your channel
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {profileData.bio.length}/500
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        🌐 Social Presence
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Connect your social media accounts to build your online presence
                      </p>
                    </div>
                    <Button 
                      onClick={addSocialLink}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profileData.socialLinks.length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">No social links yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Add your social media profiles to help fans connect with you across platforms
                      </p>
                      <Button onClick={addSocialLink} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Your First Link
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData.socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-4 items-end p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`platform-${index}`}>Platform</Label>
                            <select
                              id={`platform-${index}`}
                              value={link.platform}
                              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                              title="Select social media platform"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select platform</option>
                              {socialPlatforms.map(platform => (
                                <option key={platform.name} value={platform.name}>
                                  {platform.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-[2] space-y-2">
                            <Label htmlFor={`url-${index}`}>URL</Label>
                            <Input
                              id={`url-${index}`}
                              value={link.url}
                              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                              placeholder={
                                socialPlatforms.find(p => p.name === link.platform)?.placeholder || 
                                'https://example.com'
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(index)}
                            className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Profile Preview
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Here's how your profile will appear to your audience
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-lg border">
                    <div className="flex items-start space-x-6">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={avatarPreview || profileData.profilePicture}
                          alt={profileData.displayName}
                        />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(profileData.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{profileData.displayName}</h2>
                        <p className="text-lg text-muted-foreground mb-3">@{profileData.handle}</p>
                        
                        {profileData.bio && (
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {profileData.bio}
                          </p>
                        )}
                        
                        {profileData.contactEmail && (
                          <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {profileData.contactEmail}
                            </span>
                          </div>
                        )}
                        
                        {profileData.socialLinks.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">SOCIAL LINKS</h4>
                            <div className="flex flex-wrap gap-3">
                              {profileData.socialLinks
                                .filter(link => link.platform && link.url)
                                .map((link, index) => {
                                  const Icon = getPlatformIcon(link.platform);
                                  const colorClass = getPlatformColor(link.platform);
                                  return (
                                    <a
                                      key={index}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                      <Icon className={`h-4 w-4 ${colorClass}`} />
                                      <span className="text-sm font-medium">{link.platform}</span>
                                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </a>
                                  );
                                })
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Confirmation */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">
                        Ready to Save Your Profile?
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Your profile looks great! Click "Save Profile" to make it live.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}