import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Settings, 
  Camera, 
  Mic, 
  Monitor, 
  Volume2, 
  VolumeX,
  Eye,
  Users,
  Clock,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  Lock,
  UserCheck,
  X,
  Play,
  Square,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamStarted: (streamData: any) => void;
}

interface StreamSettings {
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'unlisted' | 'private' | 'subscribers';
  chatEnabled: boolean;
  ageRestricted: boolean;
  recordStream: boolean;
  quality: string;
  tags: string[];
}

const STREAM_CATEGORIES = [
  'Gaming', 'Just Chatting', 'Music', 'Art', 'Technology', 'Education', 
  'Sports', 'Travel', 'Cooking', 'Fitness', 'News', 'Entertainment'
];

const QUALITY_OPTIONS = [
  { value: '1080p60', label: '1080p 60fps (High Quality)', bitrate: '6000 Kbps' },
  { value: '1080p30', label: '1080p 30fps (Good Quality)', bitrate: '4500 Kbps' },
  { value: '720p60', label: '720p 60fps (Medium Quality)', bitrate: '3000 Kbps' },
  { value: '720p30', label: '720p 30fps (Standard)', bitrate: '2500 Kbps' },
  { value: '480p30', label: '480p 30fps (Low Bandwidth)', bitrate: '1000 Kbps' }
];

export function LiveStreamModal({ isOpen, onClose, onStreamStarted }: LiveStreamModalProps) {
  const [currentStep, setCurrentStep] = useState<'setup' | 'settings' | 'preview' | 'live'>('setup');
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: '',
    description: '',
    category: '',
    visibility: 'public',
    chatEnabled: true,
    ageRestricted: false,
    recordStream: true,
    quality: '1080p30',
    tags: []
  });
  
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    screen: false
  });
  
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [streamKey, setStreamKey] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [viewers, setViewers] = useState(0);
  const [duration, setDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [tagInput, setTagInput] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamSource, setStreamSource] = useState<'camera' | 'screen' | 'both'>('camera');

  // Initialize stream key and URL on open
  useEffect(() => {
    if (isOpen) {
      setStreamKey(`sk_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`);
      setStreamUrl(`rtmp://live.streamvault.com/live/${streamKey}`);
    }
  }, [isOpen, streamKey]);

  // Request device permissions
  const requestPermissions = async () => {
    try {
      // Request camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setMediaStream(stream);
      setDevicePermissions(prev => ({ ...prev, camera: true, microphone: true }));
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast.success('Camera and microphone access granted!');
      setCurrentStep('settings');
    } catch (error) {
      console.error('Permission denied:', error);
      toast.error('Camera/microphone access required to start streaming');
    }
  };

  // Request screen sharing
  const requestScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      
      if (streamSource === 'screen') {
        setMediaStream(screenStream);
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
      } else if (streamSource === 'both' && mediaStream) {
        // Combine camera and screen (advanced feature)
        const combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...mediaStream.getAudioTracks()
        ]);
        setMediaStream(combinedStream);
        if (videoRef.current) {
          videoRef.current.srcObject = combinedStream;
        }
      }
      
      setDevicePermissions(prev => ({ ...prev, screen: true }));
      toast.success('Screen sharing enabled!');
    } catch (error) {
      console.error('Screen share denied:', error);
      toast.error('Screen sharing permission required');
    }
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && streamSettings.tags.length < 10) {
      setStreamSettings(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStreamSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Start live stream
  const handleStartStream = async () => {
    if (!streamSettings.title.trim()) {
      toast.error('Please provide a stream title');
      return;
    }

    setConnectionStatus('connecting');
    setCurrentStep('live');

    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
      // Streaming started - handled by modal state
      
      // Simulate viewer count
      const viewerInterval = setInterval(() => {
        setViewers(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);

      // Simulate duration timer
      const durationInterval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Store intervals for cleanup
      (window as any).streamIntervals = { viewerInterval, durationInterval };

      const streamData = {
        id: `stream_${Date.now()}`,
        title: streamSettings.title,
        description: streamSettings.description,
        category: streamSettings.category,
        streamKey,
        streamUrl,
        quality: streamSettings.quality,
        recordStream: streamSettings.recordStream
      };

      onStreamStarted(streamData);
      toast.success('🔴 You are now live!');
    }, 2000);
  };

  // Stop live stream
  const handleStopStream = () => {
    // Stream stopped - handled by connection status
    setConnectionStatus('disconnected');
    
    // Cleanup intervals
    if ((window as any).streamIntervals) {
      clearInterval((window as any).streamIntervals.viewerInterval);
      clearInterval((window as any).streamIntervals.durationInterval);
    }
    
    // Stop media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    
    toast.success('Stream ended successfully');
    onClose();
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy stream key
  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    toast.success('Stream key copied to clipboard');
  };

  // Copy stream URL
  const copyStreamUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    toast.success('Stream URL copied to clipboard');
  };

  // Reset modal state on close
  const handleClose = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    
    if ((window as any).streamIntervals) {
      clearInterval((window as any).streamIntervals.viewerInterval);
      clearInterval((window as any).streamIntervals.durationInterval);
    }
    
    setCurrentStep('setup');
    setMediaStream(null);
    // Stream state reset - handled by connection status
    setViewers(0);
    setDuration(0);
    setConnectionStatus('disconnected');
    setDevicePermissions({ camera: false, microphone: false, screen: false });
    setStreamSettings({
      title: '',
      description: '',
      category: '',
      visibility: 'public',
      chatEnabled: true,
      ageRestricted: false,
      recordStream: true,
      quality: '1080p30',
      tags: []
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-red-500 rounded-full animate-pulse" />
            Go Live
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 mb-4">
            {[
              { key: 'setup', label: 'Setup', icon: Camera },
              { key: 'settings', label: 'Settings', icon: Settings },
              { key: 'preview', label: 'Preview', icon: Eye },
              { key: 'live', label: 'Live', icon: Radio }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = index < ['setup', 'settings', 'preview', 'live'].indexOf(currentStep);
              const IconComponent = step.icon;
              
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'bg-red-500 border-red-500 text-white' :
                    isCompleted ? 'bg-red-100 border-red-300 text-red-600' :
                    'bg-gray-100 border-gray-300 text-gray-500'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress 
            value={(['setup', 'settings', 'preview', 'live'].indexOf(currentStep) + 1) * 25} 
            className="h-2" 
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Device Setup */}
          {currentStep === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Setup Your Stream</h3>
                <p className="text-muted-foreground">
                  Choose your streaming source and grant necessary permissions
                </p>
              </div>

              {/* Stream Source Selection */}
              <div className="space-y-4">
                <Label>Stream Source</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'camera', label: 'Camera', icon: Camera, desc: 'Stream from webcam' },
                    { key: 'screen', label: 'Screen', icon: Monitor, desc: 'Share your screen' },
                    { key: 'both', label: 'Both', icon: Zap, desc: 'Camera + Screen' }
                  ].map((source) => (
                    <div
                      key={source.key}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        streamSource === source.key 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setStreamSource(source.key as any)}
                    >
                      <source.icon className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <h4 className="font-medium text-center">{source.label}</h4>
                      <p className="text-xs text-muted-foreground text-center mt-1">{source.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Status */}
              <div className="space-y-4">
                <Label>Required Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Camera Access</span>
                    </div>
                    {devicePermissions.camera ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <span>Microphone Access</span>
                    </div>
                    {devicePermissions.microphone ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  {(streamSource === 'screen' || streamSource === 'both') && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Screen Sharing</span>
                      </div>
                      {devicePermissions.screen ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  {(streamSource === 'screen' || streamSource === 'both') && (
                    <Button variant="outline" onClick={requestScreenShare}>
                      <Monitor className="h-4 w-4 mr-2" />
                      Enable Screen Share
                    </Button>
                  )}
                  <Button onClick={requestPermissions}>
                    <Camera className="h-4 w-4 mr-2" />
                    Grant Permissions
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Stream Settings */}
          {currentStep === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="streamTitle">Stream Title *</Label>
                    <Input
                      id="streamTitle"
                      placeholder="What are you streaming today?"
                      value={streamSettings.title}
                      onChange={(e) => setStreamSettings(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streamDescription">Description</Label>
                    <Textarea
                      id="streamDescription"
                      placeholder="Tell viewers what your stream is about..."
                      value={streamSettings.description}
                      onChange={(e) => setStreamSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={streamSettings.category} 
                      onValueChange={(value) => setStreamSettings(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream category" />
                      </SelectTrigger>
                      <SelectContent>
                        {STREAM_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button type="button" onClick={handleAddTag} disabled={!tagInput.trim() || streamSettings.tags.length >= 10}>
                        Add
                      </Button>
                    </div>
                    {streamSettings.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {streamSettings.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select 
                      value={streamSettings.visibility} 
                      onValueChange={(value) => setStreamSettings(prev => ({ ...prev, visibility: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public - Anyone can watch
                          </div>
                        </SelectItem>
                        <SelectItem value="unlisted">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Unlisted - Only with link
                          </div>
                        </SelectItem>
                        <SelectItem value="subscribers">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Subscribers only
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private - Only you
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Chat</Label>
                        <p className="text-sm text-muted-foreground">Allow viewers to chat during the stream</p>
                      </div>
                      <Switch
                        checked={streamSettings.chatEnabled}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, chatEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Record Stream</Label>
                        <p className="text-sm text-muted-foreground">Save a copy of your stream for later</p>
                      </div>
                      <Switch
                        checked={streamSettings.recordStream}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, recordStream: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Age Restricted</Label>
                        <p className="text-sm text-muted-foreground">Restrict to 18+ audience</p>
                      </div>
                      <Switch
                        checked={streamSettings.ageRestricted}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, ageRestricted: checked }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stream Quality</Label>
                    <Select 
                      value={streamSettings.quality} 
                      onValueChange={(value) => setStreamSettings(prev => ({ ...prev, quality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.bitrate}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Stream Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={streamKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" onClick={copyStreamKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Stream URL (RTMP)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={streamUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" onClick={copyStreamUrl}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>External Software:</strong> Use these credentials with OBS Studio, 
                      XSplit, or other streaming software for advanced setups.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('setup')}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep('preview')}>
                  Continue to Preview
                  <Eye className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Stream Preview</h3>
                <p className="text-muted-foreground">
                  Check your setup before going live
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Preview */}
                <div className="space-y-4">
                  <Label>Video Preview</Label>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      PREVIEW
                    </div>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="space-y-4">
                  <Label>Stream Information</Label>
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Title:</span>
                      <p className="text-sm text-muted-foreground mt-1">{streamSettings.title || 'Untitled Stream'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Category:</span>
                      <p className="text-sm text-muted-foreground mt-1">{streamSettings.category || 'No category'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Quality:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {QUALITY_OPTIONS.find(q => q.value === streamSettings.quality)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Visibility:</span>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">{streamSettings.visibility}</p>
                    </div>
                    {streamSettings.tags.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {streamSettings.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Settings Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Chat Enabled:</span>
                      <span className={streamSettings.chatEnabled ? 'text-green-600' : 'text-gray-500'}>
                        {streamSettings.chatEnabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Recording:</span>
                      <span className={streamSettings.recordStream ? 'text-green-600' : 'text-gray-500'}>
                        {streamSettings.recordStream ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Age Restricted:</span>
                      <span className={streamSettings.ageRestricted ? 'text-yellow-600' : 'text-green-600'}>
                        {streamSettings.ageRestricted ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('settings')}>
                  Back to Settings
                </Button>
                <Button 
                  onClick={handleStartStream} 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={!streamSettings.title.trim()}
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Go Live Now!
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Live Stream */}
          {currentStep === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Connection Status */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {connectionStatus === 'connecting' && (
                    <>
                      <div className="h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg font-semibold">Connecting...</span>
                    </>
                  )}
                  {connectionStatus === 'connected' && (
                    <>
                      <div className="h-6 w-6 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-lg font-semibold text-red-600">🔴 LIVE</span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold">{streamSettings.title}</h3>
              </div>

              {/* Stream Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Viewers</span>
                  </div>
                  <span className="text-2xl font-bold">{viewers}</span>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Duration</span>
                  </div>
                  <span className="text-2xl font-bold">{formatDuration(duration)}</span>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Connection</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Excellent</span>
                </div>
              </div>

              {/* Live Video */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {viewers} watching
                </div>
              </div>

              {/* Stream Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4 mr-2" />
                  Mute
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Video Off
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* End Stream */}
              <div className="text-center">
                <Button 
                  onClick={handleStopStream}
                  variant="destructive"
                  size="lg"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Stream
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}