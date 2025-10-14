import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Save, 
  X, 
  Eye, 
  Settings, 
  Tag,
  Users,
  Edit3,
  ImageIcon,
  FileText
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadDate: string;
  status: 'published' | 'draft' | 'scheduled' | 'private';
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  scheduledTime?: string;
}

interface QuickEditStudioProps {
  isOpen: boolean;
  onClose: () => void;
  video?: VideoData | null;
  onSave: (changes: VideoData) => void;
  onBackToSelection?: () => void;
}

export function QuickEditStudio({ 
  isOpen, 
  onClose, 
  video, 
  onSave,
  onBackToSelection
}: QuickEditStudioProps) {
  const [videoData, setVideoData] = useState<VideoData>({
    id: '',
    title: '',
    description: '',
    tags: [],
    category: 'Entertainment',
    visibility: 'public',
    thumbnail: '',
    scheduledTime: '',
    views: 0,
    likes: 0,
    duration: '0:00',
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with video data or demo data
  useEffect(() => {
    if (isOpen) {
      if (video) {
        setVideoData({
          ...video,
          visibility: video.status === 'private' ? 'private' : 
                     video.status === 'draft' ? 'unlisted' : 'public',
          scheduledTime: video.status === 'scheduled' ? 
                        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''
        });
      } else {
        // Demo video data when no video is selected
        setVideoData({
          id: 'demo-video-1',
          title: 'Select a video to edit',
          description: 'Please select a video from your content library to start editing.',
          tags: [],
          category: 'Entertainment',
          visibility: 'public',
          thumbnail: 'https://picsum.photos/320/180?random=demo',
          views: 0,
          likes: 0,
          duration: '0:00',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'draft'
        });
      }
    }
  }, [isOpen, video]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(videoData);
      toast.success('Video updated successfully!');
    } catch (error) {
      toast.error('Failed to update video');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !videoData.tags?.includes(newTag.trim())) {
      setVideoData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setVideoData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Quick Edit Studio
                {video && (
                  <span className="text-sm font-normal text-muted-foreground">
                    - {video.title}
                  </span>
                )}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Creator Dashboard → Quick Edit → Video Selection → Edit Video
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {videoData.thumbnail ? (
                      <img 
                        src={videoData.thumbnail} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                      {videoData.duration}
                    </div>
                  </div>

                  {/* Video Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{videoData.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{videoData.likes?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {/* Status and Visibility Badges */}
                  <div className="flex gap-2">
                    <Badge 
                      variant={videoData.status === 'published' ? 'default' : 'secondary'}
                      className={
                        videoData.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        videoData.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        videoData.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }
                    >
                      {videoData.status}
                    </Badge>
                    <Badge variant={videoData.visibility === 'public' ? 'outline' : 'secondary'}>
                      {videoData.visibility}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={videoData.title || ''}
                      onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter video title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={videoData.description || ''}
                      onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter video description..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tags">Add Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a tag..."
                        className="flex-1"
                      />
                      <Button onClick={addTag} size="sm">
                        Add
                      </Button>
                    </div>
                  </div>

                  {videoData.tags && videoData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {videoData.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                            title={`Remove ${tag} tag`}
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={videoData.category || ''}
                        onChange={(e) => setVideoData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        title="Select video category"
                        aria-label="Select video category"
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Music">Music</option>
                        <option value="Technology">Technology</option>
                        <option value="Sports">Sports</option>
                        <option value="News">News</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                      <select
                        id="visibility"
                        value={videoData.visibility || 'public'}
                        onChange={(e) => setVideoData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'unlisted' | 'private' }))}
                        className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        title="Select video visibility"
                        aria-label="Select video visibility"
                      >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={videoData.status || 'draft'}
                        onChange={(e) => setVideoData(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' | 'scheduled' | 'private' }))}
                        className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        title="Select video status"
                        aria-label="Select video status"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            {onBackToSelection && (
              <Button 
                variant="outline" 
                onClick={onBackToSelection}
                disabled={isSaving}
              >
                ← Back to Videos
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </div>
            )}
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
