import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  MicOff, 
  CameraOff, 
  Users, 
  MessageCircle, 
  Heart,
  Settings,
  Clock,
  Globe,
  Lock,
  Bell
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface QuickLiveSetupProps {
  onStreamStart: (config: any) => void;
  user?: any;
  isLoading?: boolean;
}

export function QuickLiveSetup({ onStreamStart, user, isLoading }: QuickLiveSetupProps) {
  const [config, setConfig] = useState({
    title: '',
    visibility: 'public' as 'public' | 'private',
    enableComments: true,
    notifyFollowers: true,
    autoSave: true,
    camera: true,
    microphone: true
  });

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false
  });

  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    setIsRequestingPermissions(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: config.camera,
        audio: config.microphone
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
      setPermissions({
        camera: stream.getVideoTracks().length > 0,
        microphone: stream.getAudioTracks().length > 0
      });

      toast.success('Camera and microphone access granted!');
    } catch (error) {
      console.error('Failed to get media permissions:', error);
      toast.error('Failed to access camera or microphone. Please check your permissions.');
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  // Stop media stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartStream = async () => {
    try {
      if (!config.title.trim()) {
        toast.error('Please enter a title for your live stream');
        return;
      }

      if (!permissions.camera && !permissions.microphone) {
        toast.error('Please grant camera or microphone access to start streaming');
        return;
      }

      const streamConfig = {
        ...config,
        type: 'quick_live',
        permissions,
        duration_limit: 60 * 60, // 60 minutes in seconds
        created_at: new Date().toISOString(),
        stream: streamRef.current
      };

      console.log('📱 Starting Quick Live with config:', streamConfig);
      
      // Call the onStreamStart function safely
      if (typeof onStreamStart === 'function') {
        await onStreamStart(streamConfig);
      } else {
        console.warn('onStreamStart is not a function:', onStreamStart);
        toast.error('Stream start handler is not available');
        return;
      }
      
      toast.success('📱 Quick Live started successfully!');
      
    } catch (error) {
      console.error('Failed to start Quick Live stream:', error);
      toast.error('Failed to start live stream. Please try again.');
    }
  };

  const togglePermission = (type: 'camera' | 'microphone') => {
    setConfig(prev => ({
      ...prev,
      [type]: !prev[type]
    }));

    if (streamRef.current) {
      // Stop current stream and request new permissions
      streamRef.current.getTracks().forEach(track => track.stop());
      setPermissions({ camera: false, microphone: false });
      
      // Auto-request permissions after state update
      setTimeout(() => {
        if (config.camera || config.microphone) {
          requestPermissions();
        }
      }, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col p-4 sm:p-6"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Camera Preview */}
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-pink-500" />
                <span>Camera Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[9/16] max-h-[400px] bg-gray-900 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {!permissions.camera && !permissions.microphone && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-pink-400" />
                      </div>
                      <p className="text-white text-sm mb-4">Preview your stream</p>
                      <Button
                        onClick={requestPermissions}
                        disabled={isRequestingPermissions}
                        className="bg-pink-500 hover:bg-pink-600"
                      >
                        {isRequestingPermissions ? 'Requesting...' : 'Enable Camera'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Badge variant={permissions.camera ? "default" : "secondary"} className="bg-black/50">
                    <Camera className="w-3 h-3 mr-1" />
                    {permissions.camera ? 'Camera On' : 'Camera Off'}
                  </Badge>
                  <Badge variant={permissions.microphone ? "default" : "secondary"} className="bg-black/50">
                    {permissions.microphone ? <Mic className="w-3 h-3 mr-1" /> : <MicOff className="w-3 h-3 mr-1" />}
                    {permissions.microphone ? 'Mic On' : 'Mic Off'}
                  </Badge>
                </div>

                {/* Duration limit indicator */}
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/50 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    60 min max
                  </Badge>
                </div>
              </div>

              {/* Media Controls */}
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant={config.camera ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePermission('camera')}
                  className={config.camera ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  {config.camera ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={config.microphone ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePermission('microphone')}
                  className={config.microphone ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  {config.microphone ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-pink-500" />
                <span>Stream Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="title">Stream Title *</Label>
                <Input
                  id="title"
                  placeholder="What's happening? 👋"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{config.title.length}/100 characters</p>
              </div>

              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={config.visibility} 
                  onValueChange={(value: 'public' | 'private') => 
                    setConfig(prev => ({ ...prev, visibility: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Public - Anyone can watch</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Private - Only followers</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Interaction Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-pink-500" />
                  <Label htmlFor="comments">Enable Comments</Label>
                </div>
                <Switch
                  id="comments"
                  checked={config.enableComments}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, enableComments: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-pink-500" />
                  <Label htmlFor="notifications">Notify Followers</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={config.notifyFollowers}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, notifyFollowers: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <Label htmlFor="autosave">Auto-save to Channel</Label>
                </div>
                <Switch
                  id="autosave"
                  checked={config.autoSave}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{user?.followers || 0} followers will be notified</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Quick Live streams typically get 2-5x more engagement than regular posts
              </p>
            </CardContent>
          </Card>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t bg-white dark:bg-gray-900 px-4 sm:px-6 pb-4 sm:pb-6">
        <Button variant="outline" disabled={isLoading} className="w-full sm:w-auto">
          Save as Draft
        </Button>
        <Button
          onClick={handleStartStream}
          disabled={isLoading || !config.title.trim()}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 sm:px-8 w-full sm:w-auto"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
              <span>Starting Live...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Go Live Now</span>
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
}