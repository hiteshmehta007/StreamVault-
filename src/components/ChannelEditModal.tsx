import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { 
  Edit3, 
  Image, 
  User,
  Link,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Mail,
  Upload,
  X,
  Save,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

export interface ChannelEditModalProps {
  open: boolean;
  onClose: () => void;
  channelData: {
    name: string;
    handle: string;
    description: string;
    profilePicture?: string;
    bannerImage?: string;
    socialLinks: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
      website?: string;
      email?: string;
    };
  };
  onSave: (updatedData: any) => void;
}

export const ChannelEditModal: React.FC<ChannelEditModalProps> = ({ 
  open, 
  onClose, 
  channelData, 
  onSave 
}) => {
  // Form state
  const [form, setForm] = useState({
    description: '',
    profilePicture: '',
    bannerImage: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      youtube: '',
      website: '',
      email: '',
    }
  });

  // File upload states
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Initialize form when modal opens
  useEffect(() => {
    if (open && channelData) {
      setForm({
        description: channelData.description || '',
        profilePicture: channelData.profilePicture || '',
        bannerImage: channelData.bannerImage || '',
        socialLinks: {
          instagram: channelData.socialLinks?.instagram || '',
          twitter: channelData.socialLinks?.twitter || '',
          youtube: channelData.socialLinks?.youtube || '',
          website: channelData.socialLinks?.website || '',
          email: channelData.socialLinks?.email || '',
        }
      });
      setProfilePreview(channelData.profilePicture || '');
      setBannerPreview(channelData.bannerImage || '');
    }
  }, [open, channelData]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [profilePreview, bannerPreview]);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.replace('socialLinks.', '');
      setForm(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setProfileFile(file);
      const objectUrl = URL.createObjectURL(file);
      setProfilePreview(objectUrl);
      handleChange('profilePicture', objectUrl);
      toast.success('Profile picture selected');
    }
  };

  const handleBannerImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setBannerFile(file);
      const objectUrl = URL.createObjectURL(file);
      setBannerPreview(objectUrl);
      handleChange('bannerImage', objectUrl);
      toast.success('Banner image selected');
    }
  };

  const clearProfilePicture = () => {
    setProfileFile(null);
    setProfilePreview('');
    handleChange('profilePicture', '');
    toast.success('Profile picture removed');
  };

  const clearBannerImage = () => {
    setBannerFile(null);
    setBannerPreview('');
    handleChange('bannerImage', '');
    toast.success('Banner image removed');
  };

  const handleSave = () => {
    // Basic validation
    if (form.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    // Validate social links format
    const urlPattern = /^https?:\/\/.+/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (form.socialLinks.website && !urlPattern.test(form.socialLinks.website)) {
      toast.error('Website URL must start with http:// or https://');
      return;
    }

    if (form.socialLinks.email && !emailPattern.test(form.socialLinks.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const updatedData = {
      ...form,
      profileFile,
      bannerFile,
    };

    onSave(updatedData);
    toast.success('Channel updated successfully!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden !w-[800px] !h-[700px] !max-w-none !max-h-none">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Edit3 className="w-6 h-6" />
            <span>Edit Channel</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[550px] py-2 scrollbar-visible overflow-y-auto">
          <div className="px-6 py-4 space-y-8">
            
            {/* Channel Identity (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Channel Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Channel Name (Cannot be changed)
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="font-medium text-foreground">{channelData.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Handle (Cannot be changed)
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="font-medium text-foreground">@{channelData.handle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Channel Description</h3>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Describe your channel and content
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                  placeholder="Tell viewers what your channel is about, what type of content you create, and what they can expect..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Minimum 10 characters</span>
                  <span>{form.description.length}/1000</span>
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Picture
              </h3>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted/50">
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="profileUpload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                      </label>
                    </Button>
                    {profilePreview && (
                      <Button variant="outline" size="sm" onClick={clearProfilePicture}>
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG up to 5MB • Square format works best
                  </p>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Image className="w-5 h-5" />
                Banner Image
              </h3>
              <div className="space-y-3">
                <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-border bg-muted/50">
                  {bannerPreview ? (
                    <img 
                      src={bannerPreview} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="bannerUpload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New
                    </label>
                  </Button>
                  {bannerPreview && (
                    <Button variant="outline" size="sm" onClick={clearBannerImage}>
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="bannerUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG up to 10MB • Wide format recommended (1920x480px)
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Link className="w-5 h-5" />
                Social Media & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-medium flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/username"
                    value={form.socialLinks.instagram}
                    onChange={(e) => handleChange('socialLinks.instagram', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-500" />
                    Twitter/X
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    value={form.socialLinks.twitter}
                    onChange={(e) => handleChange('socialLinks.twitter', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-sm font-medium flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/@username"
                    value={form.socialLinks.youtube}
                    onChange={(e) => handleChange('socialLinks.youtube', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={form.socialLinks.website}
                    onChange={(e) => handleChange('socialLinks.website', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yourname.com"
                    value={form.socialLinks.email}
                    onChange={(e) => handleChange('socialLinks.email', e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};