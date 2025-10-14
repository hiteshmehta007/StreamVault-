import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  Mic, 
  MicOff, 
  CameraOff, 
  Zap, 
  Users, 
  Globe, 
  Lock, 
  Heart,
  MessageCircle,
  Settings,
  Eye,
  Play,
  Clock,
  Sparkles,
  Monitor,
  Smartphone,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface NewGoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamStart: (mode: 'quick' | 'studio', config: any) => void;
  user?: any;
  isLoading?: boolean;
}

export function NewGoLiveModal({ isOpen, onClose, onStreamStart, user, isLoading }: NewGoLiveModalProps) {
  const [currentStep, setCurrentStep] = useState<'mode' | 'setup' | 'preview'>('mode');
  const [selectedMode, setSelectedMode] = useState<'quick' | 'studio'>('quick');
  const [streamConfig, setStreamConfig] = useState({
    title: '',
    description: '',
    category: 'just-chatting',
    visibility: 'public',
    enableChat: true,
    notifyFollowers: true,
    camera: true,
    microphone: true
  });
  
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    loading: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Step navigation
  const goToNextStep = () => {
    if (currentStep === 'mode') setCurrentStep('setup');
    else if (currentStep === 'setup') setCurrentStep('preview');
  };

  const goToPreviousStep = () => {
    if (currentStep === 'preview') setCurrentStep('setup');
    else if (currentStep === 'setup') setCurrentStep('mode');
  };

  // Request device permissions
  const requestDevicePermissions = async () => {
    setDevicePermissions(prev => ({ ...prev, loading: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: streamConfig.camera,
        audio: streamConfig.microphone
      });

      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setDevicePermissions({
        camera: stream.getVideoTracks().length > 0,
        microphone: stream.getAudioTracks().length > 0,
        loading: false
      });

      toast.success('🎥 Camera and microphone ready!');
    } catch (error: any) {
      console.error('Device access error:', error);
      setDevicePermissions(prev => ({ ...prev, loading: false }));
      
      let message = 'Unable to access camera or microphone';
      if (error.name === 'NotAllowedError') {
        message = 'Permission denied. Please allow camera and microphone access.';
      } else if (error.name === 'NotFoundError') {
        message = 'No camera or microphone found. Please connect your devices.';
      }
      
      toast.error(message);
    }
  };

  // Handle stream start
  const handleStartStream = async () => {
    if (!streamConfig.title.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    if (!devicePermissions.camera && !devicePermissions.microphone) {
      toast.error('Please enable camera or microphone to start streaming');
      return;
    }

    try {
      console.log('🎬 Starting stream with media stream:', mediaStream);
      await onStreamStart(selectedMode, {
        ...streamConfig,
        mediaStream
      });
      
      // Don't stop the media stream when going live - it will be used by LiveStreamingView
      // Set a flag to prevent cleanup when modal closes for going live
      setMediaStream(null); // Remove from modal state but don't stop tracks
      onClose();
    } catch (error) {
      console.error('Failed to start stream:', error);
      toast.error('Failed to start stream. Please try again.');
    }
  };

  // Cleanup on close (but not when going live)
  useEffect(() => {
    if (!isOpen && mediaStream) {
      // Only stop tracks on modal close if we're not going live
      // The stream will be transferred to LiveStreamingView when going live
      console.log('🔄 Modal closed, cleaning up media stream if not transferred');
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [isOpen, mediaStream]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl h-full max-h-[95vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Progress */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 md:p-6 flex-shrink-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between text-white">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Go Live</h1>
                <p className="text-white/80 text-xs md:text-sm">
                  {currentStep === 'mode' && 'Choose your streaming style'}
                  {currentStep === 'setup' && 'Configure your stream'}
                  {currentStep === 'preview' && 'Review and go live'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Progress Steps */}
              <div className="flex items-center space-x-1 md:space-x-2">
                {['mode', 'setup', 'preview'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === step 
                        ? 'bg-white text-purple-600' 
                        : ['mode', 'setup', 'preview'].indexOf(currentStep) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {['mode', 'setup', 'preview'].indexOf(currentStep) > index ? (
                        <Check className="w-3 h-3 md:w-4 md:h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 ${
                        ['mode', 'setup', 'preview'].indexOf(currentStep) > index 
                          ? 'bg-green-500' 
                          : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 go-live-modal-content custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentStep === 'mode' && (
              <ModeSelectionStep 
                selectedMode={selectedMode}
                onModeSelect={setSelectedMode}
                onNext={goToNextStep}
              />
            )}
            
            {currentStep === 'setup' && (
              <SetupStep
                mode={selectedMode}
                config={streamConfig}
                onConfigChange={setStreamConfig}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}
            
            {currentStep === 'preview' && (
              <PreviewStep
                mode={selectedMode}
                config={streamConfig}
                mediaStream={mediaStream}
                devicePermissions={devicePermissions}
                onRequestPermissions={requestDevicePermissions}
                onStartStream={handleStartStream}
                onBack={goToPreviousStep}
                videoRef={videoRef}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mode Selection Step
function ModeSelectionStep({ 
  selectedMode, 
  onModeSelect, 
  onNext 
}: { 
  selectedMode: 'quick' | 'studio';
  onModeSelect: (mode: 'quick' | 'studio') => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 md:p-8"
    >
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
          Choose Your Streaming Style
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Select the perfect setup for your content and audience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Quick Live Card */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer group ${
            selectedMode === 'quick' ? 'ring-4 ring-pink-500/50' : ''
          }`}
          onClick={() => onModeSelect('quick')}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-2xl border-2 border-pink-200 dark:border-pink-700 hover:border-pink-300 transition-all duration-300 p-4 md:p-6">
            {/* Selected indicator */}
            {selectedMode === 'quick' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Live</h3>
                <p className="text-pink-600 dark:text-pink-400 font-semibold">Instant streaming</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Zap className="w-5 h-5 text-pink-500" />
                <span>Go live in under 30 seconds</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Heart className="w-5 h-5 text-pink-500" />
                <span>Interactive chat & reactions</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Eye className="w-5 h-5 text-pink-500" />
                <span>Real-time viewer engagement</span>
              </div>
            </div>

            <div className="pt-4 border-t border-pink-200 dark:border-pink-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Perfect for casual content</span>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                  Recommended
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Studio Live Card */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer group ${
            selectedMode === 'studio' ? 'ring-4 ring-blue-500/50' : ''
          }`}
          onClick={() => onModeSelect('studio')}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 transition-all duration-300 p-4 md:p-6">
            {/* Selected indicator */}
            {selectedMode === 'studio' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Studio Live</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Professional setup</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Settings className="w-5 h-5 text-blue-500" />
                <span>Advanced streaming controls</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Monitor className="w-5 h-5 text-blue-500" />
                <span>Screen sharing & overlays</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>Custom scenes & transitions</span>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">For professional content</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Pro Features
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

// Setup Step Component
function SetupStep({ 
  mode, 
  config, 
  onConfigChange, 
  onNext, 
  onBack 
}: {
  mode: 'quick' | 'studio';
  config: any;
  onConfigChange: (config: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const categories = [
    { value: 'just-chatting', label: '💬 Just Chatting', color: 'bg-pink-100 text-pink-700' },
    { value: 'gaming', label: '🎮 Gaming', color: 'bg-blue-100 text-blue-700' },
    { value: 'music', label: '🎵 Music', color: 'bg-purple-100 text-purple-700' },
    { value: 'art', label: '🎨 Art & Creative', color: 'bg-green-100 text-green-700' },
    { value: 'education', label: '📚 Education', color: 'bg-orange-100 text-orange-700' },
    { value: 'sports', label: '⚽ Sports', color: 'bg-red-100 text-red-700' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 md:p-8"
    >
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
          {mode === 'quick' ? '⚡ Quick Setup' : '🎥 Studio Configuration'}
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          {mode === 'quick' 
            ? 'Just the essentials to get you streaming fast'
            : 'Fine-tune your professional streaming setup'
          }
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Stream Title */}
        <div className="space-y-3">
          <Label htmlFor="title" className="text-lg font-semibold text-gray-900 dark:text-white">
            Stream Title *
          </Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => onConfigChange({ ...config, title: e.target.value })}
            placeholder="What's your stream about today?"
            className="text-lg p-4 rounded-xl border-2 focus:border-purple-500"
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-gray-900 dark:text-white">
            Category
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onConfigChange({ ...config, category: category.value })}
                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  config.category === category.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description (Studio mode only) */}
        {mode === 'studio' && (
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-900 dark:text-white">
              Description
            </Label>
            <textarea
              id="description"
              value={config.description}
              onChange={(e) => onConfigChange({ ...config, description: e.target.value })}
              placeholder="Tell viewers what to expect from your stream..."
              className="w-full p-4 rounded-xl border-2 focus:border-purple-500 resize-none h-24"
            />
          </div>
        )}

        {/* Stream Settings */}
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stream Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Public Stream</p>
                  <p className="text-sm text-gray-500">Anyone can discover and watch</p>
                </div>
              </div>
              <Switch
                checked={config.visibility === 'public'}
                onCheckedChange={(checked) => 
                  onConfigChange({ ...config, visibility: checked ? 'public' : 'private' })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Enable Chat</p>
                  <p className="text-sm text-gray-500">Allow viewers to send messages</p>
                </div>
              </div>
              <Switch
                checked={config.enableChat}
                onCheckedChange={(checked) => 
                  onConfigChange({ ...config, enableChat: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notify Followers</p>
                  <p className="text-sm text-gray-500">Send notification when you go live</p>
                </div>
              </div>
              <Switch
                checked={config.notifyFollowers}
                onCheckedChange={(checked) => 
                  onConfigChange({ ...config, notifyFollowers: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 py-3 rounded-xl"
          >
            Back
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={!config.title.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            Continue to Preview
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Preview Step Component
function PreviewStep({ 
  mode, 
  config, 
  mediaStream,
  devicePermissions,
  onRequestPermissions,
  onStartStream,
  onBack,
  videoRef,
  isLoading
}: {
  mode: 'quick' | 'studio';
  config: any;
  mediaStream: MediaStream | null;
  devicePermissions: any;
  onRequestPermissions: () => void;
  onStartStream: () => void;
  onBack: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 md:p-8"
    >
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
          🎬 Ready to Go Live?
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Review your settings and test your camera before going live
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Camera Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Camera Preview</h3>
            
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              {mediaStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Camera Preview</p>
                    <p className="text-sm">Click "Test Camera" to preview</p>
                  </div>
                </div>
              )}
              
              {/* Camera status overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    devicePermissions.camera ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-white text-sm font-medium">
                    Camera {devicePermissions.camera ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    devicePermissions.microphone ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-white text-sm font-medium">
                    Mic {devicePermissions.microphone ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Device Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={onRequestPermissions}
                disabled={devicePermissions.loading}
                variant="outline"
                className="px-6 py-3 rounded-xl"
              >
                {devicePermissions.loading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Test Camera & Mic
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stream Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Stream Details</h3>
            
            <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {config.title || 'Untitled Stream'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                <p className="text-gray-900 dark:text-white mt-1 capitalize">
                  {config.category.replace('-', ' ')}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode</label>
                <div className="mt-1">
                  <Badge className={`${
                    mode === 'quick' 
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {mode === 'quick' ? '⚡ Quick Live' : '🎥 Studio Live'}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {config.visibility === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  {config.enableChat && (
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Chat Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pre-flight checks */}
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Pre-flight Check
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className={`flex items-center space-x-2 ${
                  devicePermissions.camera || devicePermissions.microphone 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-orange-700 dark:text-orange-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    devicePermissions.camera || devicePermissions.microphone ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <span>
                    {devicePermissions.camera || devicePermissions.microphone 
                      ? 'Camera/Microphone access granted' 
                      : 'Test your camera and microphone'
                    }
                  </span>
                </div>
                
                <div className={`flex items-center space-x-2 ${
                  config.title.trim() ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${config.title.trim() ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span>Stream title set</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 py-3 rounded-xl"
          >
            Back to Setup
          </Button>
          
          <Button 
            onClick={onStartStream}
            disabled={isLoading || (!devicePermissions.camera && !devicePermissions.microphone) || !config.title.trim()}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>Starting Stream...</>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Go Live Now!
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}