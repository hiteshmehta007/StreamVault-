import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { X, Save } from 'lucide-react';

interface SimpleChannelEditProps {
  open: boolean;
  onClose: () => void;
  channelData: {
    name: string;
    handle: string;
    description: string;
    profilePicture?: string;
    bannerImage?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
      website?: string;
      email?: string;
    };
  };
  onSave: (data: any) => void;
}

export const SimpleChannelEdit: React.FC<SimpleChannelEditProps> = ({
  open,
  onClose,
  channelData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    description: channelData.description || '',
    instagram: channelData.socialLinks?.instagram || '',
    twitter: channelData.socialLinks?.twitter || '',
    youtube: channelData.socialLinks?.youtube || '',
    website: channelData.socialLinks?.website || '',
    email: channelData.socialLinks?.email || ''
  });

  const handleSave = () => {
    try {
      const updatedData = {
        name: channelData.name, // Keep existing name
        handle: channelData.handle, // Keep existing handle
        description: formData.description,
        socialLinks: [
          ...(formData.instagram ? [{ platform: 'instagram', url: formData.instagram }] : []),
          ...(formData.twitter ? [{ platform: 'twitter', url: formData.twitter }] : []),
          ...(formData.youtube ? [{ platform: 'youtube', url: formData.youtube }] : []),
          ...(formData.website ? [{ platform: 'website', url: formData.website }] : [])
        ],
        contactEmail: formData.email
      };

      onSave(updatedData);
      toast.success('Channel updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving channel:', error);
      toast.error('Failed to update channel. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Channel Details
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Channel Info (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Channel Name (Protected)</Label>
            <Input value={channelData.name} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Handle (Protected)</Label>
            <Input value={`@${channelData.handle}`} disabled className="bg-muted" />
          </div>

          {/* Editable Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Channel Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your channel..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Media Links</Label>
            
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-xs text-muted-foreground">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/username"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-xs text-muted-foreground">Twitter</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/username"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="text-xs text-muted-foreground">YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/@username"
                value={formData.youtube}
                onChange={(e) => handleInputChange('youtube', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};