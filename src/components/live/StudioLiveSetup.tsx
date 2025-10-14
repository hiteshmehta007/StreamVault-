import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Settings,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  Calendar,
  Tag,
  Image,
  Shield,
  Zap,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

interface StudioLiveSetupProps {
  onStreamStart: (config: any) => void;
  user?: any;
  isLoading?: boolean;
}

export function StudioLiveSetup({ onStreamStart, user, isLoading }: StudioLiveSetupProps) {
  const [config, setConfig] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    thumbnail: null as File | null,
    visibility: 'public' as 'public' | 'unlisted' | 'private',
    ageRestriction: false,
    enableMonetization: true,
    enableAds: true,
    enableDonations: true,
    enableMemberships: true,
    scheduledStart: null as Date | null,
    goLiveNow: true
  });

  const [streamKey, setStreamKey] = useState(`live_${Math.random().toString(36).substr(2, 9)}`);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [rtmpSettings, setRtmpSettings] = useState({
    server: 'rtmp://live.platform.com/live/',
    key: streamKey
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Gaming', 'Just Chatting', 'Music', 'Art', 'Science & Technology',
    'Sports', 'Travel & Outdoors', 'Food & Cooking', 'Beauty & Fashion',
    'Education', 'ASMR', 'Fitness', 'Business', 'Entertainment'
  ];

  const handleAddTag = () => {
    if (currentTag.trim() && config.tags.length < 10 && !config.tags.includes(currentTag.trim())) {
      setConfig(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setConfig(prev => ({ ...prev, thumbnail: file }));
      toast.success('Thumbnail uploaded successfully!');
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    toast.success('Stream key copied to clipboard!');
  };

  const regenerateStreamKey = () => {
    const newKey = `live_${Math.random().toString(36).substr(2, 9)}`;
    setStreamKey(newKey);
    setRtmpSettings(prev => ({ ...prev, key: newKey }));
    toast.success('New stream key generated!');
  };

  const handleStartStream = () => {
    if (!config.title.trim()) {
      toast.error('Please enter a title for your stream');
      return;
    }

    if (!config.category) {
      toast.error('Please select a category');
      return;
    }

    const streamConfig = {
      ...config,
      type: 'studio_live',
      rtmp_settings: rtmpSettings,
      stream_key: streamKey,
      created_at: new Date().toISOString(),
      estimated_viewers: Math.floor(Math.random() * 100) + 50
    };

    onStreamStart(streamConfig);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stream Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Stream Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter your stream title..."
                      value={config.title}
                      onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">{config.title.length}/100</p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell viewers what your stream is about..."
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 min-h-[100px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{config.description.length}/500</p>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={config.category} 
                      onValueChange={(value) => setConfig(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags & Discovery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tags (helps viewers find your stream)</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        placeholder="Add a tag..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        maxLength={20}
                      />
                      <Button onClick={handleAddTag} size="sm" disabled={config.tags.length >= 10}>
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{config.tags.length}/10 tags</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    {config.thumbnail ? (
                      <div className="space-y-2">
                        <Image className="w-12 h-12 mx-auto text-green-500" />
                        <p className="text-sm text-green-600">Thumbnail uploaded!</p>
                        <p className="text-xs text-gray-500">{config.thumbnail.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                        <p className="text-xs text-gray-500">Recommended: 1920x1080, under 2MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="now"
                      name="schedule"
                      checked={config.goLiveNow}
                      onChange={() => setConfig(prev => ({ ...prev, goLiveNow: true, scheduledStart: null }))}
                    />
                    <Label htmlFor="now" className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Go live now</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="schedule"
                      name="schedule"
                      checked={!config.goLiveNow}
                      onChange={() => setConfig(prev => ({ ...prev, goLiveNow: false }))}
                    />
                    <Label htmlFor="schedule" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Schedule for later</span>
                    </Label>
                  </div>
                  {!config.goLiveNow && (
                    <Input
                      type="datetime-local"
                      className="mt-2"
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        scheduledStart: new Date(e.target.value) 
                      }))}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Streaming Setup Tab */}
        <TabsContent value="streaming" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <span>RTMP Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Stream Server URL</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={rtmpSettings.server}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(rtmpSettings.server)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Stream Key</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={showStreamKey ? streamKey : '••••••••••••••••'}
                      readOnly
                      className="bg-gray-50 font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowStreamKey(!showStreamKey)}>
                      {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyStreamKey}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Keep your stream key private!</p>
                    <Button variant="ghost" size="sm" onClick={regenerateStreamKey}>
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100">OBS/Streamlabs Setup:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1 text-blue-700 dark:text-blue-200">
                        <li>Copy the Server URL and Stream Key</li>
                        <li>Open OBS and go to Settings → Stream</li>
                        <li>Select "Custom" as service</li>
                        <li>Paste Server URL and Stream Key</li>
                        <li>Click "Start Streaming" in OBS</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stream Quality Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Recommended Settings for OBS:</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolution:</span>
                      <span className="font-mono">1920x1080</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FPS:</span>
                      <span className="font-mono">30 or 60</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bitrate:</span>
                      <span className="font-mono">3000-6000 kbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Encoder:</span>
                      <span className="font-mono">x264</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Stream Health Monitor
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    We'll monitor your stream quality and notify you of any issues in real-time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Monetization Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Advertisements</h4>
                    <Switch
                      checked={config.enableAds}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableAds: checked }))}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Display pre-roll and mid-roll ads</p>
                  <p className="text-xs text-green-600 mt-1">Est. $2-5 per 1K views</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Donations/Tips</h4>
                    <Switch
                      checked={config.enableDonations}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableDonations: checked }))}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Accept viewer donations</p>
                  <p className="text-xs text-green-600 mt-1">You keep 95%</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Channel Memberships</h4>
                    <Switch
                      checked={config.enableMemberships}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableMemberships: checked }))}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Offer exclusive perks</p>
                  <p className="text-xs text-green-600 mt-1">$4.99-$24.99/month</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Estimated Earnings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected viewers:</span>
                    <span className="ml-2 font-mono">{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Potential revenue/hour:</span>
                    <span className="ml-2 font-mono text-green-600">$15-40</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={config.visibility} 
                    onValueChange={(value: 'public' | 'unlisted' | 'private') => 
                      setConfig(prev => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can watch</SelectItem>
                      <SelectItem value="unlisted">Unlisted - Only with link</SelectItem>
                      <SelectItem value="private">Private - Only followers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <Label htmlFor="age-restriction">Age Restriction (18+)</Label>
                  </div>
                  <Switch
                    id="age-restriction"
                    checked={config.ageRestriction}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, ageRestriction: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Estimated concurrent viewers</span>
                    </span>
                    <span className="font-mono">50-150</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      <span>Engagement rate</span>
                    </span>
                    <span className="font-mono">8-12%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>Optimal stream duration</span>
                    </span>
                    <span className="font-mono">2-4 hours</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Based on your channel history and similar streamers
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" disabled={isLoading}>
          Save as Draft
        </Button>
        <Button
          onClick={handleStartStream}
          disabled={isLoading || !config.title.trim() || !config.category}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
              <span>Setting Up Stream...</span>
            </div>
          ) : config.goLiveNow ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Start Studio Stream</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Stream</span>
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
}