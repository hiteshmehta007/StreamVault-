import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Image, 
  Eye, 
  EyeOff, 
  Globe, 
  Users, 
  Lock,
  FileVideo,
  CheckCircle,
  AlertCircle,
  VideoIcon,
  Settings,
  Tag,
  Clock,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { videoService, VideoUploadData } from '../services/videoService';
import { ReelCreator } from './ReelCreator';

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded?: (video: UploadedVideo) => void;
}

interface VideoMetadata {
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'unlisted' | 'private';
  thumbnail?: File;
  customThumbnail?: string;
  scheduledDate?: string;
  monetization: boolean;
  ageRestricted: boolean;
  commentsEnabled: boolean;
  language: string;
}

interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  size: number;
  status: 'processing' | 'ready' | 'failed';
  uploadedAt: string;
  visibility: string;
}

const VIDEO_CATEGORIES = [
  'Gaming', 'Education', 'Entertainment', 'Music', 'News & Politics',
  'Science & Technology', 'Sports', 'Travel & Events', 'Howto & Style',
  'Comedy', 'Film & Animation', 'Autos & Vehicles', 'Pets & Animals'
];

import { SUPPORTED_LANGUAGES } from './LanguageSelector';

const LANGUAGES = SUPPORTED_LANGUAGES;

export function VideoUpload({ isOpen, onClose, onVideoUploaded }: VideoUploadProps) {
  const [currentStep, setCurrentStep] = useState<'upload' | 'details' | 'processing' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [showReelCreator, setShowReelCreator] = useState(false);
  const [reelSourceVideo, setReelSourceVideo] = useState<{
    url: string;
    duration: number;
    title?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    description: '',
    category: '',
    tags: [],
    visibility: 'public',
    scheduledDate: '',
    monetization: false,
    ageRestricted: false,
    commentsEnabled: true,
    language: 'en'
  });

  // File validation
  const validateFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

    if (file.size > maxSize) {
      toast.error('File size must be less than 2GB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, OGG, AVI, MOV)');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploadError('');
    
    // Success feedback
    toast.success(`📹 ${file.name} selected successfully!`, {
      duration: 3000,
      description: `Ready to add details for your ${(file.size / (1024 * 1024)).toFixed(1)}MB video`
    });
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    
    // Auto-generate title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setMetadata(prev => ({
      ...prev,
      title: prev.title || fileName
    }));

    // Small delay to show success message before transitioning
    setTimeout(() => {
      setCurrentStep('details');
    }, 1500);
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      // Only set inactive if we're leaving the drop zone completely
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setDragActive(false);
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      toast.info('Processing your video file...', { duration: 2000 });
      handleFileSelect(files[0]);
    } else {
      toast.error('No valid files found. Please try again.');
    }
  }, [handleFileSelect]);

  // File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  // Tag management
  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim()) && metadata.tags.length < 10) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Thumbnail handling
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Thumbnail size must be less than 2MB');
        return;
      }
      
      setMetadata(prev => ({ ...prev, thumbnail: file }));
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  // Real video upload with backend integration
  const handleUpload = async () => {
    if (!selectedFile || !metadata.title.trim()) {
      toast.error('Please provide a title and select a video file');
      return;
    }

    setIsUploading(true);
    setCurrentStep('processing');
    setUploadError('');

    try {
      // Prepare upload data
      const uploadData: VideoUploadData = {
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags,
        visibility: metadata.visibility,
        language: metadata.language,
        scheduledDate: metadata.scheduledDate,
        monetization: metadata.monetization,
        ageRestricted: metadata.ageRestricted,
        commentsEnabled: metadata.commentsEnabled
      };

      // Upload video with progress tracking
      const response = await videoService.uploadVideo(
        selectedFile,
        uploadData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Upload custom thumbnail if provided
      if (metadata.thumbnail) {
        try {
          await videoService.uploadThumbnail(response.video.id, metadata.thumbnail);
        } catch (thumbnailError) {
          console.error('Thumbnail upload failed:', thumbnailError);
          // Continue without thumbnail
        }
      }

      // Simulate processing progress
      setIsProcessing(true);
      let processingProgress = 0;
      const processingInterval = setInterval(() => {
        processingProgress += 5;
        setProcessingProgress(processingProgress);
        
        if (processingProgress >= 100) {
          clearInterval(processingInterval);
          
          // Create uploaded video object for local storage
          const uploadedVideo: UploadedVideo = {
            id: response.video.id,
            title: metadata.title,
            description: metadata.description,
            thumbnail: thumbnailPreview || 'https://picsum.photos/320/180?random=1',
            duration: 0, // Would be extracted from video during processing
            size: selectedFile.size,
            status: 'ready',
            uploadedAt: response.video.uploadedAt,
            visibility: metadata.visibility
          };

          // Add to local storage
          const existingVideos = JSON.parse(localStorage.getItem('userVideos') || '[]');
          existingVideos.push(uploadedVideo);
          localStorage.setItem('userVideos', JSON.stringify(existingVideos));

          setCurrentStep('complete');
          toast.success('Video uploaded successfully!');
          
          if (onVideoUploaded) {
            onVideoUploaded(uploadedVideo);
          }
        }
      }, 200);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
      toast.error(error.message || 'Upload failed. Please try again.');
      setCurrentStep('details');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // Handle reel creation
  const handleCreateReel = () => {
    if (videoPreviewUrl && selectedFile) {
      setReelSourceVideo({
        url: videoPreviewUrl,
        duration: 0, // Would be extracted from video
        title: metadata.title
      });
      setShowReelCreator(true);
    }
  };

  const handleReelCreated = (reel: any) => {
    console.log('Reel created from upload:', reel);
    setShowReelCreator(false);
    toast.success('🎉 Reel created successfully!');
  };

  // Reset form
  const handleReset = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setVideoPreviewUrl('');
    setThumbnailPreview('');
    setUploadProgress(0);
    setProcessingProgress(0);
    setIsUploading(false);
    setIsProcessing(false);
    setUploadError('');
    setMetadata({
      title: '',
      description: '',
      category: '',
      tags: [],
      visibility: 'public',
      scheduledDate: '',
      monetization: false,
      ageRestricted: false,
      commentsEnabled: true,
      language: 'en'
    });
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      // Cleanup object URLs
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      // Reset after animation
      setTimeout(handleReset, 300);
    }
  }, [isOpen, videoPreviewUrl, thumbnailPreview]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Video
          </DialogTitle>
        </DialogHeader>

        {/* Enhanced Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-4">
            {[
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'details', label: 'Details', icon: Settings },
              { key: 'processing', label: 'Processing', icon: Zap },
              { key: 'complete', label: 'Complete', icon: CheckCircle }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = index < ['upload', 'details', 'processing', 'complete'].indexOf(currentStep);
              const IconComponent = step.icon;
              
              return (
                <div key={step.key} className="flex items-center">
                  <motion.div 
                    className="flex flex-col items-center"
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      opacity: isActive || isCompleted ? 1 : 0.6
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20' 
                        : isCompleted
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </motion.div>
                  {index < 3 && (
                    <div className="flex-1 mx-4 h-0.5 relative">
                      <div className="absolute inset-0 bg-muted rounded-full" />
                      <motion.div 
                        className="absolute inset-0 bg-green-500 rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: isCompleted ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Enhanced File Upload */}
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Share Your Story</h2>
                <p className="text-muted-foreground">
                  Upload your video to reach your audience and grow your channel
                </p>
              </div>
              
              <motion.div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  selectedFile
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    : dragActive
                      ? 'border-primary bg-primary/10 scale-105 shadow-lg'
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                whileHover={{ scale: dragActive ? 1.05 : 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-xl" />
                </div>
                
                <motion.div
                  animate={{
                    scale: dragActive ? 1.1 : 1,
                    rotate: dragActive ? 5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <FileVideo className={`h-20 w-20 mx-auto mb-6 transition-colors ${
                    dragActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </motion.div>
                
                <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                  selectedFile 
                    ? 'text-green-600' 
                    : dragActive 
                      ? 'text-primary' 
                      : 'text-foreground'
                }`}>
                  {selectedFile 
                    ? '✅ Perfect! File Selected'
                    : dragActive 
                      ? '✨ Drop it like it\'s hot!' 
                      : '🎬 Ready to Upload?'}
                </h3>
                
                <p className={`text-lg mb-8 transition-colors ${
                  selectedFile
                    ? 'text-green-600/80'
                    : dragActive 
                      ? 'text-primary/80' 
                      : 'text-muted-foreground'
                }`}>
                  {selectedFile
                    ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) - Moving to details...`
                    : dragActive 
                      ? 'Release to start uploading your masterpiece'
                      : 'Drag your video here or click to browse your files'
                  }
                </p>
                
                <Button 
                  size="lg"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (fileInputRef.current) {
                      try {
                        fileInputRef.current.click();
                        toast.info('📁 Opening file picker...', { duration: 2000 });
                      } catch (error) {
                        console.error('Error clicking file input:', error);
                        toast.error('Unable to open file picker. Please try the alternative button below or refresh the page.');
                      }
                    } else {
                      toast.error('File picker not available. Please refresh the page.');
                    }
                  }}
                  className={`mb-6 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 ${
                    selectedFile ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  disabled={false}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {selectedFile ? '✅ File Selected - Click to change' : 'Choose Video File'}
                </Button>
                
                {/* Alternative file picker button */}
                <div className="mt-4">
                  <label 
                    htmlFor="video-file-input"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Alternative: Browse Files
                  </label>
                </div>
                
                <input
                  ref={fileInputRef}
                  id="video-file-input"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/*"
                  onChange={handleFileChange}
                  className="absolute -left-96 opacity-0 pointer-events-none"
                  aria-label="Select video file"
                  tabIndex={-1}
                />
              </motion.div>
              
              {/* Enhanced File Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-400">Formats</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    MP4, WebM, MOV, AVI
                  </p>
                </Card>
                
                <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-400">Max Size</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Up to 2GB per file
                  </p>
                </Card>
                
                <Card className="p-4 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-400">Processing</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    HD quality ready
                  </p>
                </Card>
              </div>
              
              {/* Pro Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <VideoIcon className="h-4 w-4 mr-2" />
                  💡 Pro Tips for Better Videos
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use good lighting and clear audio for better engagement</li>
                  <li>• Keep your intro under 15 seconds to retain viewers</li>
                  <li>• Add captions to make your content accessible</li>
                </ul>
              </div>
              
              {/* Debug Info - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <p><strong>Debug Info:</strong></p>
                  <p>File Input Ref: {fileInputRef.current ? '✅ Available' : '❌ Not Available'}</p>
                  <p>Selected File: {selectedFile ? selectedFile.name : 'None'}</p>
                  <p>Current Step: {currentStep}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Video Details */}
          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  {videoPreviewUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        src={videoPreviewUrl}
                        className="w-full h-full object-contain"
                        controls={false}
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="rounded-full bg-black/50 hover:bg-black/70"
                          onClick={() => {
                            if (videoRef.current) {
                              if (isPlaying) {
                                videoRef.current.pause();
                              } else {
                                videoRef.current.play();
                              }
                              setIsPlaying(!isPlaying);
                            }
                          }}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* File Info */}
                  {selectedFile && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">File name:</span>
                            <span className="font-medium">{selectedFile.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">File size:</span>
                            <span className="font-medium">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{selectedFile.type}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Video Details Form */}
                <div className="space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      {/* Title */}
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={metadata.title}
                          onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter video title..."
                          maxLength={100}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {metadata.title.length}/100 characters
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={metadata.description}
                          onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Tell viewers about your video..."
                          rows={4}
                          maxLength={5000}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {metadata.description.length}/5000 characters
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={metadata.category} onValueChange={(value) => 
                          setMetadata(prev => ({ ...prev, category: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {VIDEO_CATEGORIES.map(category => (
                              <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tags */}
                      <div>
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag..."
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          />
                          <Button type="button" onClick={handleAddTag} disabled={metadata.tags.length >= 10}>
                            <Tag className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {metadata.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => handleRemoveTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {metadata.tags.length}/10 tags
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      {/* Visibility */}
                      <div>
                        <Label>Visibility</Label>
                        <Select value={metadata.visibility} onValueChange={(value: any) => 
                          setMetadata(prev => ({ ...prev, visibility: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="unlisted">
                              <div className="flex items-center gap-2">
                                <EyeOff className="h-4 w-4" />
                                Unlisted
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Language */}
                      <div>
                        <Label>Video Language</Label>
                        <Select value={metadata.language} onValueChange={(value) => 
                          setMetadata(prev => ({ ...prev, language: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map(lang => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Settings Toggles */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Enable Comments</Label>
                            <p className="text-sm text-muted-foreground">Allow viewers to comment on your video</p>
                          </div>
                          <Switch
                            checked={metadata.commentsEnabled}
                            onCheckedChange={(checked) => 
                              setMetadata(prev => ({ ...prev, commentsEnabled: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Age Restricted</Label>
                            <p className="text-sm text-muted-foreground">Mark if content is not suitable for minors</p>
                          </div>
                          <Switch
                            checked={metadata.ageRestricted}
                            onCheckedChange={(checked) => 
                              setMetadata(prev => ({ ...prev, ageRestricted: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Monetization</Label>
                            <p className="text-sm text-muted-foreground">Enable ads on your video</p>
                          </div>
                          <Switch
                            checked={metadata.monetization}
                            onCheckedChange={(checked) => 
                              setMetadata(prev => ({ ...prev, monetization: checked }))
                            }
                          />
                        </div>
                      </div>

                      {/* Scheduled Publishing */}
                      <div>
                        <Label htmlFor="scheduledDate">Schedule Publishing (Optional)</Label>
                        <Input
                          id="scheduledDate"
                          type="datetime-local"
                          value={metadata.scheduledDate}
                          onChange={(e) => setMetadata(prev => ({ ...prev, scheduledDate: e.target.value }))}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="thumbnail" className="space-y-4">
                      <div>
                        <Label>Custom Thumbnail</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a custom thumbnail or we'll generate one automatically
                        </p>
                        
                        {thumbnailPreview ? (
                          <div className="relative inline-block">
                            <img 
                              src={thumbnailPreview} 
                              alt="Thumbnail preview" 
                              className="w-40 h-24 object-cover rounded-lg"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                setThumbnailPreview('');
                                setMetadata(prev => ({ ...prev, thumbnail: undefined }));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-4">
                              Upload a custom thumbnail (JPG, PNG, max 2MB)
                            </p>
                            <Button variant="outline" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                              Upload Thumbnail
                            </Button>
                            <input
                              id="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              aria-label="Upload thumbnail image"
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <Button onClick={handleUpload} disabled={!metadata.title.trim()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Enhanced Processing */}
          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8"
            >
              <div className="flex flex-col items-center space-y-6">
                {/* Animated Processing Icon */}
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center shadow-2xl"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <VideoIcon className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  {/* Pulsing Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 0.3, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <motion.h3 
                    className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isUploading && !isProcessing ? '🚀 Uploading Magic...' : '⚡ Creating Your Masterpiece...'}
                  </motion.h3>
                  
                  <p className="text-muted-foreground max-w-lg text-lg">
                    {isUploading && !isProcessing 
                      ? 'Your video is traveling through the internet at light speed! ⚡'
                      : 'We\'re optimizing your video for the best viewing experience across all devices 🎬'
                    }
                  </p>
                </div>
              </div>

              {/* Enhanced Progress Section */}
              <div className="space-y-6 max-w-lg mx-auto">
                {/* Upload Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Progress
                    </span>
                    <span className="text-primary font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={uploadProgress} className="h-3" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-3 rounded-full"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                {/* Processing Progress */}
                {isProcessing && (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Processing Progress
                      </span>
                      <span className="text-primary font-bold">{processingProgress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={processingProgress} className="h-3" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-3 rounded-full"
                        animate={{ x: [-100, 300] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Estimated Time */}
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Estimated time: {isProcessing ? '2-3 minutes' : '1-2 minutes'} remaining
                  </span>
                </div>
              </div>
              
              {/* Fun Facts While Waiting */}
              <motion.div 
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">✨ Did You Know?</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  We're creating multiple quality versions of your video so viewers can enjoy it on any device, from phones to 4K TVs!
                </p>
              </motion.div>

              {/* Error Display */}
              {uploadError && (
                <motion.div 
                  className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 max-w-md mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Upload Failed</span>
                  </div>
                  <p className="text-sm mt-1">{uploadError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setCurrentStep('details')}
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Enhanced Complete */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-8"
            >
              {/* Celebration Animation */}
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  
                  {/* Celebration particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{ 
                        scale: 0,
                        x: 0,
                        y: 0
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos(i * 45 * Math.PI / 180) * 60,
                        y: Math.sin(i * 45 * Math.PI / 180) * 60
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
                
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    🎉 Awesome! You're Live!
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Your video <strong>"{metadata.title}"</strong> has been uploaded successfully! 
                    {metadata.visibility === 'private' 
                      ? ' It\'s safely stored as private.' 
                      : ' It\'s now ready for the world to see.'}
                  </p>
                  {metadata.scheduledDate && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      📅 Scheduled to publish: {new Date(metadata.scheduledDate).toLocaleString()}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Video Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Card className="max-w-lg mx-auto border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      Video Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Visibility:</span>
                        </div>
                        <Badge variant={metadata.visibility === 'public' ? 'default' : 'secondary'} className="capitalize">
                          {metadata.visibility === 'public' ? '🌍 Public' : 
                           metadata.visibility === 'unlisted' ? '🔗 Unlisted' : '🔒 Private'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Category:</span>
                        </div>
                        <Badge variant="outline">
                          {metadata.category || 'General'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Tags:</span>
                        </div>
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {metadata.tags.length} tags added
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Comments:</span>
                        </div>
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {metadata.commentsEnabled ? '✅ Enabled' : '❌ Disabled'}
                        </span>
                      </div>
                    </div>
                    
                    {metadata.tags.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Your Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {metadata.tags.slice(0, 5).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {metadata.tags.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{metadata.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1 max-w-48"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Another Video
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCreateReel}
                  className="flex-1 max-w-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Create Reel
                </Button>
                <Button 
                  onClick={onClose}
                  className="flex-1 max-w-48 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>                {/* Quick Tips */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 max-w-lg mx-auto">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    🚀 What's Next?
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Share your video link to start getting views</li>
                    <li>• Check your analytics to track performance</li>
                    <li>• Engage with comments to build community</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
      
      {/* Reel Creator Modal */}
      {showReelCreator && reelSourceVideo && (
        <ReelCreator
          isOpen={showReelCreator}
          onClose={() => setShowReelCreator(false)}
          onReelCreated={handleReelCreated}
          sourceVideo={reelSourceVideo}
        />
      )}
    </Dialog>
  );
}