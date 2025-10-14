import React, { useState } from 'react';
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
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Edit3, 
  FileText, 
  Image, 
  Globe, 
  Clock, 
  DollarSign, 
  Tag,
  X
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from './LanguageSelector';

// Dummy categories for demo
const categories = ['Education', 'Entertainment', 'Technology', 'Music', 'Gaming'];
const languages = SUPPORTED_LANGUAGES.map((lang: Language) => lang.name);

export interface QuickEditModalProps {
  open: boolean;
  onClose: () => void;
  video: any; // Replace with your video type
  onSave: (changes: any) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({ open, onClose, video, onSave }) => {
  // Initialize form with video data when modal opens
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    thumbnail: '',
    category: categories[0],
    language: languages[0],
    startCut: '',
    endCut: '',
    highlights: '',
    visibility: 'public',
    schedule: '',
    audience: '',
    pinnedComment: '',
    adSettings: false,
    copyrightClaims: '',
    affiliateLinks: '',
    editLock: false,
    ageRating: 'all-ages',
    membersOnly: false,
    premiumOnly: false,
    subscribersOnly: false,
    regionRestricted: false,
    blockedRegions: '',
    blockedRegionsText: '',
  });

  // Tag management state
  const [tagList, setTagList] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Thumbnail upload state
  const [thumbnailMethod, setThumbnailMethod] = useState<'url' | 'upload'>('url');
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(null);

  // Update form when video data changes
  React.useEffect(() => {
    if (video && open) {
      const initialTags = video.tags ? video.tags.split(',').map((tag: string) => tag.trim()) : ['react', 'tutorial', 'programming'];
      setTagList(initialTags);
      setForm({
        title: video.title || '',
        description: video.description || '',
        tags: video.tags || '',
        thumbnail: video.thumbnail || '',
        category: video.category || categories[0],
        language: video.language || languages[0],
        startCut: '',
        endCut: '',
        highlights: '1:30, 3:45, 7:20',
        visibility: video.visibility || 'public',
        schedule: '',
        audience: '',
        pinnedComment: 'Thanks for watching! Don\'t forget to like and subscribe!',
        adSettings: true,
        copyrightClaims: '',
        affiliateLinks: '',
        editLock: false,
        ageRating: 'everyone',
        membersOnly: false,
        premiumOnly: false,
        subscribersOnly: false,
        regionRestricted: false,
        blockedRegions: '',
        blockedRegionsText: '',
      });
    }
  }, [video, open]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !tagList.includes(newTag.trim())) {
      setTagList([...tagList, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedThumbnail(file.name);
      handleChange('thumbnail', objectUrl);
    }
  };

  const clearUploadedThumbnail = () => {
    setUploadedThumbnail(null);
    handleChange('thumbnail', '');
    setThumbnailMethod('url');
  };

  const handleSave = () => {
    const updatedForm = { ...form, tags: tagList.join(', ') };
    onSave(updatedForm);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="overflow-hidden !w-[756.991px] !h-[582.312px] !max-w-none !max-h-none"
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="truncate">Quick Edit Video</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[450px] py-2 scrollbar-visible overflow-y-auto">
          <div className="px-6 sm:px-8 lg:px-10 py-4 min-h-[800px]">
            <Tabs defaultValue="content" className="w-full">
              <div className="relative mb-6">
                <TabsList className="flex w-full h-auto p-1 overflow-x-auto bg-muted rounded-lg tabs-overflow-scroll tabs-list-scroll">
                <TabsTrigger 
                  value="content" 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap min-w-0 flex-shrink-0 tab-trigger-mobile"
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap min-w-0 flex-shrink-0 tab-trigger-mobile"
                >
                  <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Media</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="visibility" 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap min-w-0 flex-shrink-0 tab-trigger-mobile"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="timing" 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap min-w-0 flex-shrink-0 tab-trigger-mobile"
                >
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Schedule</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="monetization" 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap min-w-0 flex-shrink-0 tab-trigger-mobile"
                >
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Money</span>
                </TabsTrigger>
              </TabsList>
                {/* Scroll indicator for mobile - right side */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted to-transparent pointer-events-none rounded-r-lg sm:hidden" />
              </div>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-8 mt-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm font-medium text-foreground">
                      Video Title
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="h-11 text-base"
                      placeholder="Enter your video title..."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-medium text-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="min-h-[120px] text-base resize-none"
                      placeholder="Describe your video content..."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg min-h-[50px] border">
                      {tagList.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive transition-colors"
                            title={`Remove ${tag} tag`}
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {tagList.length === 0 && (
                        <span className="text-muted-foreground text-sm">No tags added yet</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Type a tag and press Enter"
                        className="h-10"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} variant="outline" className="h-10 px-6">
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-sm font-medium text-foreground">
                        Category
                      </Label>
                      <Select value={form.category} onValueChange={(value: string) => handleChange('category', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="language" className="text-sm font-medium text-foreground">
                        Language
                      </Label>
                      <Select value={form.language} onValueChange={(value: string) => handleChange('language', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang: string) => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-8 mt-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      Thumbnail
                    </Label>
                    
                    {/* Upload Method Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                      <button
                        type="button"
                        onClick={() => setThumbnailMethod('url')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          thumbnailMethod === 'url' 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnailMethod('upload')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          thumbnailMethod === 'upload' 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Upload
                      </button>
                    </div>

                    {/* URL Input */}
                    {thumbnailMethod === 'url' && (
                      <Input
                        id="thumbnail-url"
                        value={form.thumbnail}
                        onChange={(e) => handleChange('thumbnail', e.target.value)}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="h-11 text-base"
                      />
                    )}

                    {/* File Upload */}
                    {thumbnailMethod === 'upload' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="file"
                            id="thumbnail-upload"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Upload thumbnail image"
                            aria-label="Upload thumbnail image file"
                          />
                          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                            <div className="text-center">
                              <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {uploadedThumbnail && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                              Thumbnail uploaded successfully
                            </span>
                            <button
                              type="button"
                              onClick={clearUploadedThumbnail}
                              className="ml-auto text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                              title="Remove uploaded thumbnail"
                              aria-label="Remove uploaded thumbnail"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Thumbnail Preview */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground">
                        Current Thumbnail
                      </Label>
                      <div className="relative aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 overflow-hidden">
                        {video?.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt="Current thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No thumbnail</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* New Thumbnail Preview */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground">
                        New Thumbnail Preview
                      </Label>
                      <div className="relative aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 overflow-hidden">
                        {form.thumbnail ? (
                          <img 
                            src={form.thumbnail} 
                            alt="New thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center text-muted-foreground ${form.thumbnail ? 'hidden' : ''}`}>
                          <div className="text-center">
                            <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Enter URL to preview</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="highlights" className="text-sm font-medium text-foreground">
                      Key Moments
                    </Label>
                    <Input
                      id="highlights"
                      value={form.highlights}
                      onChange={(e) => handleChange('highlights', e.target.value)}
                      placeholder="1:30, 5:45, 10:20"
                      className="h-11 text-base"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Add timestamps for key moments in your video (format: MM:SS)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="startCut" className="text-sm font-medium text-foreground">
                        Start Cut (seconds)
                      </Label>
                      <Input
                        id="startCut"
                        type="number"
                        value={form.startCut}
                        onChange={(e) => handleChange('startCut', e.target.value)}
                        placeholder="0"
                        className="h-11 text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="endCut" className="text-sm font-medium text-foreground">
                        End Cut (seconds)
                      </Label>
                      <Input
                        id="endCut"
                        type="number"
                        value={form.endCut}
                        onChange={(e) => handleChange('endCut', e.target.value)}
                        placeholder="0"
                        className="h-11 text-base"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="visibility" className="space-y-8 mt-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Visibility
                    </Label>
                    <Select value={form.visibility} onValueChange={(value: string) => handleChange('visibility', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">🌍 Public</SelectItem>
                        <SelectItem value="private">� Private</SelectItem>
                        <SelectItem value="unlisted">📎 Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      Audience Restrictions
                    </Label>
                    
                    {/* Age Restrictions */}
                    <div className="space-y-3">
                      <Label htmlFor="ageRating" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Age Rating
                      </Label>
                      <Select value={form.ageRating || 'all-ages'} onValueChange={(value: string) => handleChange('ageRating', value)}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-ages">👶 All Ages</SelectItem>
                          <SelectItem value="13+">🧒 13+ Teen</SelectItem>
                          <SelectItem value="16+">🧑 16+ Young Adult</SelectItem>
                          <SelectItem value="18+">🔞 18+ Adult Only</SelectItem>
                          <SelectItem value="mature">⚠️ Mature Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Access Controls */}
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Access Controls
                      </Label>
                      <div className="space-y-3">
                        {/* Members Only */}
                        <div className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                          form.membersOnly 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-muted/10 border-border'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                              form.membersOnly 
                                ? 'bg-primary/15 text-primary' 
                                : 'bg-muted/20 text-muted-foreground'
                            }`}>
                              {form.membersOnly ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {form.membersOnly ? 'Members Only' : 'Everyone'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {form.membersOnly 
                                  ? 'Only channel members can view' 
                                  : 'Available to all viewers'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors px-2 py-1 rounded-md ${
                              form.membersOnly 
                                ? 'text-white bg-primary shadow-sm' 
                                : 'text-muted-foreground bg-muted/50'
                            }`}>
                              {form.membersOnly ? 'ON' : 'OFF'}
                            </span>
                            <Switch
                              checked={form.membersOnly || false}
                              onCheckedChange={(val: boolean) => handleChange('membersOnly', val)}
                              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-400 data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/50 data-[state=checked]:ring-2 data-[state=checked]:ring-primary/30 data-[state=unchecked]:ring-2 data-[state=unchecked]:ring-gray-300 scale-150 transition-all duration-200 border-2 data-[state=checked]:border-primary/60 data-[state=unchecked]:border-gray-300"
                            />
                          </div>
                        </div>

                        {/* Premium Content */}
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Premium Content</p>
                              <p className="text-xs text-muted-foreground">Requires premium subscription</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors px-2 py-1 rounded-md ${
                              form.premiumOnly 
                                ? 'text-white bg-yellow-600 shadow-sm' 
                                : 'text-muted-foreground bg-muted/50'
                            }`}>
                              {form.premiumOnly ? 'ON' : 'OFF'}
                            </span>
                            <Switch
                              checked={form.premiumOnly || false}
                              onCheckedChange={(val: boolean) => handleChange('premiumOnly', val)}
                              className="data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-gray-400 data-[state=checked]:shadow-lg data-[state=checked]:shadow-yellow-500/50 data-[state=checked]:ring-2 data-[state=checked]:ring-yellow-400/30 data-[state=unchecked]:ring-2 data-[state=unchecked]:ring-gray-300 scale-150 transition-all duration-200 border-2 data-[state=checked]:border-yellow-500/60 data-[state=unchecked]:border-gray-300"
                            />
                          </div>
                        </div>

                        {/* Subscriber Only */}
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Subscribers Only</p>
                              <p className="text-xs text-muted-foreground">Only subscribers can view</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors px-2 py-1 rounded-md ${
                              form.subscribersOnly 
                                ? 'text-white bg-red-600 shadow-sm' 
                                : 'text-muted-foreground bg-muted/50'
                            }`}>
                              {form.subscribersOnly ? 'ON' : 'OFF'}
                            </span>
                            <Switch
                              checked={form.subscribersOnly || false}
                              onCheckedChange={(val: boolean) => handleChange('subscribersOnly', val)}
                              className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-400 data-[state=checked]:shadow-lg data-[state=checked]:shadow-red-500/50 data-[state=checked]:ring-2 data-[state=checked]:ring-red-400/30 data-[state=unchecked]:ring-2 data-[state=unchecked]:ring-gray-300 scale-150 transition-all duration-200 border-2 data-[state=checked]:border-red-500/60 data-[state=unchecked]:border-gray-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Region Restrictions */}
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Geographic Restrictions
                      </Label>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Globe className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Enable Region Blocking</p>
                            <p className="text-xs text-muted-foreground">Restrict access by country/region</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold transition-colors px-2 py-1 rounded-md ${
                            form.regionRestricted 
                              ? 'text-white bg-blue-600 shadow-sm' 
                              : 'text-muted-foreground bg-muted/50'
                          }`}>
                            {form.regionRestricted ? 'ON' : 'OFF'}
                          </span>
                          <Switch
                            checked={form.regionRestricted || false}
                            onCheckedChange={(val: boolean) => handleChange('regionRestricted', val)}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400 data-[state=checked]:shadow-lg data-[state=checked]:shadow-blue-500/50 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-400/30 data-[state=unchecked]:ring-2 data-[state=unchecked]:ring-gray-300 scale-150 transition-all duration-200 border-2 data-[state=checked]:border-blue-500/60 data-[state=unchecked]:border-gray-300"
                          />
                        </div>
                      </div>
                      
                      {form.regionRestricted && (
                        <div className="pl-4 space-y-2">
                          <Label htmlFor="blockedRegions" className="text-xs text-muted-foreground">
                            Blocked Regions (comma-separated)
                          </Label>
                          <Input
                            id="blockedRegions"
                            value={form.blockedRegions || ''}
                            onChange={(e) => handleChange('blockedRegions', e.target.value)}
                            placeholder="US, CA, GB, AU..."
                            className="h-9 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-5 border rounded-lg bg-muted/20">
                    <Checkbox
                      id="editLock"
                      checked={form.editLock}
                      onCheckedChange={(val: boolean) => handleChange('editLock', val)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="editLock" className="text-sm font-medium text-foreground">
                        Edit Lock
                      </Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Prevent accidental changes once finalized
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="timing" className="space-y-8 mt-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="schedule" className="text-sm font-medium text-foreground">
                      Schedule Publication
                    </Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={form.schedule}
                      onChange={(e) => handleChange('schedule', e.target.value)}
                      className="h-11 text-base"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Leave empty to publish immediately
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="pinnedComment" className="text-sm font-medium text-foreground">
                      Pinned Comment
                    </Label>
                    <Textarea
                      id="pinnedComment"
                      value={form.pinnedComment}
                      onChange={(e) => handleChange('pinnedComment', e.target.value)}
                      placeholder="Thanks for watching! Don't forget to like and subscribe!"
                      className="min-h-[100px] text-base resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      This comment will be pinned at the top of your video's comment section
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Monetization Tab */}
              <TabsContent value="monetization" className="space-y-8 mt-2">
                <div className="space-y-6">
                  <div className="flex items-start justify-between p-5 border rounded-lg bg-muted/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">
                        Ad Settings
                      </Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Enable mid-rolls and sponsorship tags
                      </p>
                    </div>
                    <Switch
                      checked={form.adSettings}
                      onCheckedChange={(val: boolean) => handleChange('adSettings', val)}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="affiliateLinks" className="text-sm font-medium text-foreground">
                      Affiliate Links
                    </Label>
                    <Input
                      id="affiliateLinks"
                      value={form.affiliateLinks}
                      onChange={(e) => handleChange('affiliateLinks', e.target.value)}
                      placeholder="Add or update affiliate links"
                      className="h-11 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="copyrightClaims" className="text-sm font-medium text-foreground">
                      Copyright Claims
                    </Label>
                    <Textarea
                      id="copyrightClaims"
                      value={form.copyrightClaims}
                      onChange={(e) => handleChange('copyrightClaims', e.target.value)}
                      placeholder="Review flagged segments and actions taken"
                      className="min-h-[100px] text-base resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Document any copyright issues and resolutions
                    </p>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 mt-4 border-t bg-background">
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 w-full px-6 sm:px-8 lg:px-10">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-11 px-6 sm:px-8 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700 h-11 px-6 sm:px-8 order-1 sm:order-2"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};