import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Save, Camera, Upload, User, RotateCcw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProfilePhotoEditProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onSave: (photoData: string | File) => void;
}

export const ProfilePhotoEdit: React.FC<ProfilePhotoEditProps> = ({ 
  isOpen, 
  onClose, 
  currentPhoto,
  onSave 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentPhoto || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      if (imageFile) {
        onSave(imageFile);
        toast.success('Profile photo updated successfully!');
      } else if (selectedImage) {
        onSave(selectedImage);
        toast.success('Profile photo updated successfully!');
      } else {
        toast.error('Please select a photo first');
        return;
      }
      onClose();
    } catch (error) {
      console.error('Error saving profile photo:', error);
      toast.error('Failed to update profile photo');
    }
  };

  const handleReset = () => {
    setSelectedImage(currentPhoto || null);
    setImageFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Profile Photo</CardTitle>
                <p className="text-white/80 text-sm mt-1">Update your profile picture</p>
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

        <CardContent className="p-6 space-y-6">
          {/* Photo Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-purple-200 dark:border-purple-700 shadow-lg">
                {selectedImage ? (
                  <AvatarImage src={selectedImage} alt="Profile preview" className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Upload Overlay */}
              <label 
                htmlFor="photo-upload" 
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
              >
                <Upload className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload profile photo"
                title="Upload profile photo"
              />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                {selectedImage ? 'Photo Selected' : 'Choose Your Photo'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the avatar above or use the button below
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="space-y-4">
            <label htmlFor="photo-upload">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 py-3"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                  {selectedImage ? 'Choose Different Photo' : 'Upload Photo'}
                </span>
              </Button>
            </label>

            {/* File Requirements */}
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                📸 Photo Requirements
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                  Max 5MB
                </span>
                <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                  JPG, PNG, GIF
                </span>
                <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                  Square format recommended
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              {selectedImage && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  className="gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              )}
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={!selectedImage}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg gap-2"
            >
              <Save className="h-4 w-4" />
              Save Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};