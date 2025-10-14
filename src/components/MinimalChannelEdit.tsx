import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { X, Save, FileText, Instagram, Twitter, Globe, Sparkles, Camera, Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MinimalChannelEditProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MinimalChannelEdit: React.FC<MinimalChannelEditProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Load existing channel data when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.channel) {
          const channel = currentUser.channel;
          
          // Load existing data
          setDescription(channel.description || '');
          setProfileImage(channel.profilePicture || null);
          
          // Load social links
          if (channel.socialLinks && Array.isArray(channel.socialLinks)) {
            const instagramLink = channel.socialLinks.find((link: any) => link.platform === 'Instagram');
            const twitterLink = channel.socialLinks.find((link: any) => link.platform === 'Twitter');
            const websiteLink = channel.socialLinks.find((link: any) => link.platform === 'Website');
            
            setInstagram(instagramLink?.url || '');
            setTwitter(twitterLink?.url || '');
            setWebsite(websiteLink?.url || '');
          }
        }
      } catch (error) {
        console.error('Error loading channel data:', error);
      }
    } else {
      // Reset form when modal closes
      setDescription('');
      setInstagram('');
      setTwitter('');
      setWebsite('');
      setProfileImage(null);
      setProfileImageFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      // Get current user data from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (currentUser.channel) {
        // Update channel data
        const updatedChannel = {
          ...currentUser.channel,
          description: description || currentUser.channel.description,
          // Only update profile picture if a new one was uploaded
          ...(profileImage && { profilePicture: profileImage }),
        };

        // Update social links if provided
        const socialLinks = [];
        if (instagram) socialLinks.push({ platform: 'Instagram', url: instagram, icon: 'Instagram' });
        if (twitter) socialLinks.push({ platform: 'Twitter', url: twitter, icon: 'Twitter' });
        if (website) socialLinks.push({ platform: 'Website', url: website, icon: 'Globe' });
        
        if (socialLinks.length > 0) {
          updatedChannel.socialLinks = socialLinks;
        }

        currentUser.channel = updatedChannel;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('streamingUsers') || '[]');
        const updatedUsers = users.map((u: any) => 
          u.id === currentUser.id ? currentUser : u
        );
        localStorage.setItem('streamingUsers', JSON.stringify(updatedUsers));
        
        console.log('Channel data saved successfully:', updatedChannel);
        toast.success('Channel updated successfully!');
        onClose();
        
        // Refresh page to show changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('No channel data found. Please try again.');
      }
    } catch (error) {
      console.error('Error saving channel data:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card 
        className="bg-white dark:bg-gray-900 shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-300" 
        style={{width: '756.991px', height: '582.312px'}}
      >
        {/* Header with gradient background */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Edit Channel Profile</CardTitle>
                <p className="text-white/80 text-sm mt-1">Customize your channel appearance</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 h-full overflow-y-auto" style={{maxHeight: 'calc(582.312px - 100px)'}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column - Profile Photo & Description */}
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="h-4 w-4 text-purple-500" />
                  <Label className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Profile Photo
                  </Label>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  {/* Current Profile Photo */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-gray-200 dark:border-gray-700">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile preview" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {/* Upload Button Overlay */}
                    <label 
                      htmlFor="profile-upload" 
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                      <Upload className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload profile photo"
                      title="Upload profile photo"
                    />
                  </div>
                  
                  {/* Upload Instructions */}
                  <div className="text-center">
                    <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Upload Profile Picture
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Choose a clear photo that represents you
                    </p>
                    
                    <label htmlFor="profile-upload" className="mt-3 block">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4" />
                          Choose Photo
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Channel Description Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="desc" className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Channel Description
                  </Label>
                </div>
                <Textarea
                  id="desc"
                  placeholder="Tell your audience what your channel is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 A good description helps viewers understand your content
                </p>
              </div>
            </div>

            {/* Right Column - Social Media Links */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-green-500" />
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Social Media Links
                </Label>
              </div>
              
              <div className="space-y-4">
                {/* Instagram */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <Label htmlFor="insta" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Instagram
                    </Label>
                  </div>
                  <Input
                    id="insta"
                    placeholder="https://instagram.com/yourusername"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="border-2 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400 transition-colors pl-4"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <Label htmlFor="twit" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Twitter / X
                    </Label>
                  </div>
                  <Input
                    id="twit"
                    placeholder="https://twitter.com/yourusername"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-300 transition-colors pl-4"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <Label htmlFor="web" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Personal Website
                    </Label>
                  </div>
                  <Input
                    id="web"
                    placeholder="https://yourawesome-website.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 transition-colors pl-4"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500">ℹ️</span>
                    <span>Social links help your audience connect with you across platforms and build a stronger community.</span>
                  </p>
                </div>

                {/* Action Buttons - Moved below info box */}
                <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="px-6 py-2 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};