import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Link, Video, List, UserCheck, ExternalLink } from 'lucide-react';
import { useCards } from '../../contexts/CardContext';
import { CardFormData } from '../../types/cards';
import { CardService } from '../../services/cardService';
import { toast } from 'sonner';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  currentTime: number;
}

export function CardCreationModal({ isOpen, onClose, videoId, currentTime }: CardCreationModalProps) {
  const { addCard } = useCards();
  const [activeTab, setActiveTab] = useState<'video' | 'playlist' | 'channel' | 'url'>('video');
  const [formData, setFormData] = useState<Partial<CardFormData>>({
    type: 'video',
    startTime: currentTime,
    position: { x: 50, y: 50 }, // Default center position
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: activeTab,
        startTime: currentTime,
        position: { x: 50, y: 50 },
      });
    }
  }, [isOpen, currentTime, activeTab]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await CardService.searchContent(query, activeTab as 'video' | 'playlist' | 'channel');
      setSearchResults(results);
    } catch (error) {
      toast.error('Failed to search content');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectContent = (content: any) => {
    setFormData(prev => ({
      ...prev,
      title: content.title,
      description: content.description,
      thumbnail: content.thumbnail,
      targetId: content.id,
    }));
  };

  const handleUrlValidation = async (url: string) => {
    if (!url) return;

    try {
      const validation = await CardService.validateUrl(url);
      if (validation.isValid) {
        setFormData(prev => ({
          ...prev,
          title: validation.title || 'External Link',
          thumbnail: validation.thumbnail,
          targetUrl: url,
        }));
        toast.success('URL validated successfully');
      } else {
        toast.error('Invalid URL');
      }
    } catch (error) {
      toast.error('Failed to validate URL');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.startTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (activeTab !== 'url' && !formData.targetId) {
      toast.error('Please select a target content');
      return;
    }

    if (activeTab === 'url' && !formData.targetUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await addCard(videoId, formData as CardFormData);
      onClose();
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Add Interactive Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Type Selection */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="w-full overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-fit">
                <TabsTrigger value="video" className="flex-1 min-w-0 flex items-center gap-2">
                  <Video className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Video</span>
                </TabsTrigger>
                <TabsTrigger value="playlist" className="flex-1 min-w-0 flex items-center gap-2">
                  <List className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Playlist</span>
                </TabsTrigger>
                <TabsTrigger value="channel" className="flex-1 min-w-0 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Channel</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1 min-w-0 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">URL</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Video Tab */}
            <TabsContent value="video" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-search">Search Videos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="video-search"
                    placeholder="Search for videos to link..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => handleSelectContent(video)}
                    >
                      <img src={video.thumbnail} alt={video.title} className="w-16 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{video.title}</h4>
                        <p className="text-xs text-muted-foreground">{video.channel?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Playlist Tab */}
            <TabsContent value="playlist" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-search">Search Playlists</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="playlist-search"
                    placeholder="Search for playlists to link..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
              </div>

              {/* Search Results for Playlists */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => handleSelectContent(playlist)}
                    >
                      <img src={playlist.thumbnail} alt={playlist.title} className="w-16 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{playlist.title}</h4>
                        <p className="text-xs text-muted-foreground">{playlist.videoCount} videos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Channel Tab */}
            <TabsContent value="channel" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channel-search">Search Channels</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="channel-search"
                    placeholder="Search for channels to link..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
              </div>

              {/* Search Results for Channels */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => handleSelectContent(channel)}
                    >
                      <img src={channel.avatar} alt={channel.name} className="w-12 h-12 object-cover rounded-full" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{channel.name}</h4>
                        <p className="text-xs text-muted-foreground">{channel.subscribers} subscribers</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="external-url">External URL</Label>
                <Input
                  id="external-url"
                  placeholder="https://example.com"
                  value={formData.targetUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData(prev => ({ ...prev, targetUrl: url }));
                    if (url && url.startsWith('http')) {
                      handleUrlValidation(url);
                    }
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Card Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-title">Card Title *</Label>
              <Input
                id="card-title"
                placeholder="Enter card title..."
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-description">Description (Optional)</Label>
              <Textarea
                id="card-description"
                placeholder="Enter card description..."
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.startTime || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {formatTime(currentTime)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time (Optional)</Label>
                <Input
                  id="end-time"
                  type="number"
                  min="0"
                  placeholder="Leave empty for no end time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: parseInt(e.target.value) || undefined }))}
                />
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Card Position on Video</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position-x">X Position (%)</Label>
                  <Input
                    id="position-x"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.position?.x || 50}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, x: parseInt(e.target.value) || 50 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-y">Y Position (%)</Label>
                  <Input
                    id="position-y"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.position?.y || 50}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, y: parseInt(e.target.value) || 50 }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Content Preview */}
          {formData.title && (
            <div className="p-4 border rounded-lg bg-accent/50">
              <h4 className="font-medium mb-2">Card Preview</h4>
              <div className="flex items-center gap-3">
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Preview" className="w-16 h-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{formData.title}</p>
                  {formData.description && (
                    <p className="text-xs text-muted-foreground">{formData.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Appears at {formatTime(formData.startTime || 0)}
                    {formData.endTime && ` - ${formatTime(formData.endTime)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding Card...' : 'Add Card'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}