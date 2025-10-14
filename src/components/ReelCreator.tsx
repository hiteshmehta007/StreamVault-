import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Video,
  Scissors,
  Palette,
  Music,
  Type,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  X,
  Check,
  Wand2,
  Sparkles,
  Globe,
  Users,
  Lock,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface ReelCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onReelCreated?: (reel: any) => void;
  sourceVideo?: {
    url: string;
    duration: number;
    title?: string;
  };
}

interface Filter {
  id: string;
  name: string;
  preview: string;
  intensity: number;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview: string;
  thumbnail: string;
}

const FILTERS: Filter[] = [
  { id: 'none', name: 'Original', preview: '🎬', intensity: 0 },
  { id: 'vintage', name: 'Vintage', preview: '📸', intensity: 70 },
  { id: 'dramatic', name: 'Dramatic', preview: '🎭', intensity: 80 },
  { id: 'vibrant', name: 'Vibrant', preview: '🌈', intensity: 90 },
  { id: 'noir', name: 'Noir', preview: '🖤', intensity: 85 },
  { id: 'warm', name: 'Warm', preview: '🧡', intensity: 60 },
  { id: 'cool', name: 'Cool', preview: '💙', intensity: 65 },
  { id: 'dreamy', name: 'Dreamy', preview: '✨', intensity: 75 }
];

const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: '1',
    title: 'Upbeat Energy',
    artist: 'TrendyBeats',
    duration: 60,
    preview: 'audio-preview-1',
    thumbnail: 'https://picsum.photos/60/60?random=1'
  },
  {
    id: '2',
    title: 'Chill Vibes',
    artist: 'LofiSounds',
    duration: 45,
    preview: 'audio-preview-2',
    thumbnail: 'https://picsum.photos/60/60?random=2'
  },
  {
    id: '3',
    title: 'Epic Moments',
    artist: 'CinematicFX',
    duration: 30,
    preview: 'audio-preview-3',
    thumbnail: 'https://picsum.photos/60/60?random=3'
  }
];

const STICKERS = [
  '🔥', '💯', '✨', '❤️', '😂', '🎉', '👏', '💪', '🚀', '⭐',
  '💎', '🎯', '⚡', '🌟', '🎪', '🎨', '🎭', '🎵', '📸', '🎬'
];

export function ReelCreator({ isOpen, onClose, onReelCreated, sourceVideo }: ReelCreatorProps) {
  const [step, setStep] = useState<'upload' | 'trim' | 'edit' | 'publish'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(FILTERS[0]);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  const [musicVolume, setMusicVolume] = useState(50);
  const [originalVolume, setOriginalVolume] = useState(100);
  const [captions, setCaptions] = useState('');
  const [stickers, setStickers] = useState<{ emoji: string; x: number; y: number; id: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Publishing settings
  const [reelData, setReelData] = useState({
    title: '',
    description: '',
    hashtags: '',
    visibility: 'public',
    allowComments: true,
    allowDuets: true,
    crossPost: {
      tiktok: false,
      instagram: false,
      youtube: false
    },
    scheduledDate: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with source video if provided
  useEffect(() => {
    if (sourceVideo && isOpen) {
      setVideoUrl(sourceVideo.url);
      setDuration(sourceVideo.duration);
      setTrimEnd(Math.min(60, sourceVideo.duration));
      setStep('trim');
      if (sourceVideo.title) {
        setReelData(prev => ({ ...prev, title: sourceVideo.title! }));
      }
    }
  }, [sourceVideo, isOpen]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('Video file must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setStep('trim');
    toast.success('Video uploaded successfully!');
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimEnd(Math.min(60, videoDuration));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const handlePublish = async () => {
    if (!reelData.title.trim()) {
      toast.error('Please add a title for your reel');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newReel = {
        id: Date.now().toString(),
        videoUrl: videoUrl,
        title: reelData.title,
        description: reelData.description,
        hashtags: reelData.hashtags.split(' ').filter(tag => tag.startsWith('#')),
        duration: trimEnd - trimStart,
        filter: selectedFilter.id,
        music: selectedMusic,
        captions,
        stickers,
        visibility: reelData.visibility,
        createdAt: new Date().toISOString()
      };

      onReelCreated?.(newReel);
      toast.success('🎉 Reel published successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to publish reel. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    // Cleanup
    if (videoUrl && selectedFile) {
      URL.revokeObjectURL(videoUrl);
    }
    
    // Reset state
    setStep('upload');
    setSelectedFile(null);
    setVideoUrl('');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setTrimStart(0);
    setTrimEnd(60);
    setSelectedFilter(FILTERS[0]);
    setSelectedMusic(null);
    setCaptions('');
    setStickers([]);
    setReelData({
      title: '',
      description: '',
      hashtags: '',
      visibility: 'public',
      allowComments: true,
      allowDuets: true,
      crossPost: {
        tiktok: false,
        instagram: false,
        youtube: false
      },
      scheduledDate: ''
    });
    
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        <div className="flex h-[90vh]">
          {/* Left Side - Video Preview */}
          <div className="flex-1 bg-black relative overflow-hidden">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  onLoadedMetadata={handleVideoLoad}
                  onTimeUpdate={handleTimeUpdate}
                  muted={isMuted}
                  style={{
                    filter: selectedFilter.id !== 'none' ? `
                      ${selectedFilter.id === 'vintage' ? 'sepia(0.8) contrast(1.2)' : ''}
                      ${selectedFilter.id === 'dramatic' ? 'contrast(1.5) brightness(0.9)' : ''}
                      ${selectedFilter.id === 'vibrant' ? 'saturate(1.5) contrast(1.2)' : ''}
                      ${selectedFilter.id === 'noir' ? 'grayscale(1) contrast(1.3)' : ''}
                      ${selectedFilter.id === 'warm' ? 'sepia(0.3) saturate(1.2)' : ''}
                      ${selectedFilter.id === 'cool' ? 'hue-rotate(200deg) saturate(1.1)' : ''}
                      ${selectedFilter.id === 'dreamy' ? 'blur(0.5px) brightness(1.1)' : ''}
                    ` : 'none'
                  }}
                />

                {/* Stickers Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {stickers.map((sticker) => (
                    <motion.div
                      key={sticker.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute text-4xl cursor-pointer pointer-events-auto"
                      style={{ left: `${sticker.x}px`, top: `${sticker.y}px` }}
                      onClick={() => removeSticker(sticker.id)}
                      drag
                      dragMomentum={false}
                    >
                      {sticker.emoji}
                    </motion.div>
                  ))}
                </div>

                {/* Captions Overlay */}
                {captions && (
                  <div className="absolute bottom-20 left-0 right-0 text-center">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-lg inline-block backdrop-blur-sm">
                      {captions}
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="range"
                          min={0}
                          max={duration}
                          value={currentTime}
                          onChange={(e) => seekTo(Number(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          aria-label="Video progress"
                        />
                        {/* Trim indicators */}
                        {step === 'trim' && (
                          <>
                            <div
                              className="absolute top-0 bottom-0 bg-green-500/50"
                              style={{
                                left: `${(trimStart / duration) * 100}%`,
                                width: `${((trimEnd - trimStart) / duration) * 100}%`
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No video selected</p>
                  <p className="text-sm opacity-70">Upload a video to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Controls */}
          <div className="w-96 bg-white dark:bg-gray-900 flex flex-col">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="flex items-center justify-between">
                Create Reel
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs value={step} onValueChange={(value) => setStep(value as any)} className="h-full">
                <TabsList className="grid w-full grid-cols-4 m-4">
                  <TabsTrigger value="upload" disabled={step !== 'upload' && !videoUrl}>
                    <Upload className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="trim" disabled={!videoUrl}>
                    <Scissors className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="edit" disabled={!videoUrl}>
                    <Wand2 className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="publish" disabled={!videoUrl}>
                    <Share2 className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <div className="p-6 pt-0">
                  <TabsContent value="upload" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Video</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">Upload your video</p>
                          <p className="text-sm text-gray-500 mb-4">
                            MP4, WebM, MOV up to 100MB
                          </p>
                          <Button>Choose File</Button>
                        </div>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                          aria-label="Upload video file"
                        />

                        <div className="text-center">
                          <p className="text-sm text-gray-500">or</p>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => toast.info('Record feature coming soon!')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Record New Video
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="trim" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Trim Video</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Start Time</Label>
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[trimStart]}
                              onValueChange={([value]) => setTrimStart(value)}
                              max={duration}
                              step={0.1}
                              className="flex-1"
                            />
                            <span className="text-sm w-16">{formatTime(trimStart)}</span>
                          </div>
                        </div>

                        <div>
                          <Label>End Time</Label>
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[trimEnd]}
                              onValueChange={([value]) => setTrimEnd(Math.min(value, trimStart + 60))}
                              max={duration}
                              step={0.1}
                              className="flex-1"
                            />
                            <span className="text-sm w-16">{formatTime(trimEnd)}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Duration: {formatTime(trimEnd - trimStart)} (Max: 60s)
                          </p>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => {
                            seekTo(trimStart);
                            setStep('edit');
                          }}
                        >
                          Apply Trim
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="edit" className="space-y-6">
                    <Tabs defaultValue="filters" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="filters">
                          <Palette className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="music">
                          <Music className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="text">
                          <Type className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="stickers">
                          <Sparkles className="w-4 h-4" />
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="filters" className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {FILTERS.map((filter) => (
                            <motion.button
                              key={filter.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedFilter(filter)}
                              className={`p-4 rounded-lg border text-center transition-colors ${
                                selectedFilter.id === filter.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-2xl mb-2">{filter.preview}</div>
                              <div className="text-sm font-medium">{filter.name}</div>
                            </motion.button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="music" className="space-y-4">
                        <div className="space-y-3">
                          {MUSIC_TRACKS.map((track) => (
                            <motion.div
                              key={track.id}
                              whileHover={{ scale: 1.02 }}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedMusic?.id === track.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedMusic(track)}
                            >
                              <img 
                                src={track.thumbnail} 
                                alt={track.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{track.title}</h4>
                                <p className="text-sm text-gray-500">{track.artist}</p>
                              </div>
                              {selectedMusic?.id === track.id && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {selectedMusic && (
                          <div className="space-y-4 pt-4 border-t">
                            <div>
                              <Label>Music Volume</Label>
                              <Slider
                                value={[musicVolume]}
                                onValueChange={([value]) => setMusicVolume(value)}
                                max={100}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Original Audio</Label>
                              <Slider
                                value={[originalVolume]}
                                onValueChange={([value]) => setOriginalVolume(value)}
                                max={100}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="text" className="space-y-4">
                        <div>
                          <Label htmlFor="captions">Add Captions</Label>
                          <Textarea
                            id="captions"
                            value={captions}
                            onChange={(e) => setCaptions(e.target.value)}
                            placeholder="Add captions to your reel..."
                            className="mt-2"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="stickers" className="space-y-4">
                        <div className="grid grid-cols-5 gap-3">
                          {STICKERS.map((sticker, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => addSticker(sticker)}
                              className="w-12 h-12 rounded-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center text-xl transition-colors"
                            >
                              {sticker}
                            </motion.button>
                          ))}
                        </div>
                        
                        {stickers.length > 0 && (
                          <div className="pt-4 border-t">
                            <Label>Added Stickers (click to remove)</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {stickers.map((sticker) => (
                                <Badge
                                  key={sticker.id}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => removeSticker(sticker.id)}
                                >
                                  {sticker.emoji} ×
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="publish" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Publish Reel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={reelData.title}
                            onChange={(e) => setReelData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Add a catchy title..."
                            maxLength={100}
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={reelData.description}
                            onChange={(e) => setReelData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your reel..."
                            maxLength={500}
                          />
                        </div>

                        <div>
                          <Label htmlFor="hashtags">Hashtags</Label>
                          <Input
                            id="hashtags"
                            value={reelData.hashtags}
                            onChange={(e) => setReelData(prev => ({ ...prev, hashtags: e.target.value }))}
                            placeholder="#trending #viral #fyp"
                          />
                        </div>

                        <div>
                          <Label>Visibility</Label>
                          <Select 
                            value={reelData.visibility} 
                            onValueChange={(value) => setReelData(prev => ({ ...prev, visibility: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Public
                                </div>
                              </SelectItem>
                              <SelectItem value="followers">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Followers Only
                                </div>
                              </SelectItem>
                              <SelectItem value="private">
                                <div className="flex items-center gap-2">
                                  <Lock className="w-4 h-4" />
                                  Private
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Allow Comments</Label>
                            <Switch
                              checked={reelData.allowComments}
                              onCheckedChange={(checked) => 
                                setReelData(prev => ({ ...prev, allowComments: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Allow Duets</Label>
                            <Switch
                              checked={reelData.allowDuets}
                              onCheckedChange={(checked) => 
                                setReelData(prev => ({ ...prev, allowDuets: checked }))
                              }
                            />
                          </div>
                        </div>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Cross-Post</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">T</span>
                                </div>
                                <Label>TikTok</Label>
                              </div>
                              <Switch
                                checked={reelData.crossPost.tiktok}
                                onCheckedChange={(checked) => 
                                  setReelData(prev => ({ 
                                    ...prev, 
                                    crossPost: { ...prev.crossPost, tiktok: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">I</span>
                                </div>
                                <Label>Instagram</Label>
                              </div>
                              <Switch
                                checked={reelData.crossPost.instagram}
                                onCheckedChange={(checked) => 
                                  setReelData(prev => ({ 
                                    ...prev, 
                                    crossPost: { ...prev.crossPost, instagram: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">Y</span>
                                </div>
                                <Label>YouTube Shorts</Label>
                              </div>
                              <Switch
                                checked={reelData.crossPost.youtube}
                                onCheckedChange={(checked) => 
                                  setReelData(prev => ({ 
                                    ...prev, 
                                    crossPost: { ...prev.crossPost, youtube: checked }
                                  }))
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                
                {step === 'publish' ? (
                  <Button 
                    onClick={handlePublish} 
                    disabled={isProcessing || !reelData.title.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Publish Reel
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      const nextStep = step === 'upload' ? 'trim' : step === 'trim' ? 'edit' : 'publish';
                      setStep(nextStep);
                    }}
                    disabled={!videoUrl}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}