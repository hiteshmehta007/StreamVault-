import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoLiveButton } from './live/GoLiveButton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Smartphone, 
  Monitor, 
  Users, 
  Heart, 
  MessageCircle,
  DollarSign,
  BarChart3,
  Zap,
  Play,
  Settings
} from 'lucide-react';

interface GoLiveDemoProps {
  user?: any;
  onStreamStart?: (mode: 'quick' | 'studio', config: any) => void;
}

export function GoLiveDemo({ user, onStreamStart }: GoLiveDemoProps) {
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<'overview' | 'quick' | 'studio'>('overview');

  const handleStreamStart = (mode: 'quick' | 'studio', config: any) => {
    const newStream = {
      id: Date.now(),
      mode,
      config,
      startTime: new Date(),
      viewers: Math.floor(Math.random() * 100) + 10,
      likes: Math.floor(Math.random() * 50) + 5,
      messages: Math.floor(Math.random() * 200) + 20
    };
    
    setActiveStreams(prev => [...prev, newStream]);
    
    // Call the parent's onStreamStart if provided
    if (onStreamStart) {
      onStreamStart(mode, config);
    }
  };

  const mockUser = {
    name: 'Demo Creator',
    channel: {
      name: 'Demo Channel',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      verified: true,
      subscribers: 15420
    },
    followers: 8750
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
          >
            Creator-First Live Streaming
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Dual-mode streaming platform designed for creators who want flexibility and power
          </motion.p>
        </div>

        {/* Demo Navigation */}
        <div className="flex justify-center space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Play },
            { id: 'quick', label: 'Quick Live Demo', icon: Smartphone },
            { id: 'studio', label: 'Studio Live Demo', icon: Monitor }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={selectedDemo === id ? 'default' : 'outline'}
              onClick={() => setSelectedDemo(id as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Content */}
        {selectedDemo === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Quick Live Preview */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Quick Live</h3>
                    <p className="text-pink-600 font-medium">Instagram-style streaming</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-pink-500" />
                    <span>Start in seconds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-pink-500" />
                    <span>Mobile optimized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-pink-500" />
                    <span>Live chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Emoji reactions</span>
                  </div>
                </div>
                
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Perfect for:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Casual updates & behind-the-scenes</li>
                    <li>Q&A sessions with your audience</li>
                    <li>Quick announcements</li>
                    <li>Mobile-first content creation</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge className="bg-pink-100 text-pink-700">⏱️ 60 min limit</Badge>
                  <Badge className="bg-green-100 text-green-700">📱 Beginner friendly</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Studio Live Preview */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Studio Live</h3>
                    <p className="text-blue-600 font-medium">Professional streaming</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    <span>RTMP support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-blue-500" />
                    <span>Custom overlays</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span>Live analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span>Monetization</span>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Perfect for:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Gaming & esports streaming</li>
                    <li>Educational content & tutorials</li>
                    <li>Professional broadcasts</li>
                    <li>Multi-hour streaming sessions</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge className="bg-blue-100 text-blue-700">⏱️ Unlimited</Badge>
                  <Badge className="bg-purple-100 text-purple-700">🎯 Pro features</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Try the Go Live Button</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Click below to experience both streaming modes
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-4">
                <GoLiveButton 
                  user={user || mockUser}
                  onStreamStart={handleStreamStart}
                  className="px-8 py-4 text-lg"
                />
                <GoLiveButton 
                  user={user || mockUser}
                  variant="floating"
                  onStreamStart={handleStreamStart}
                />
                <GoLiveButton 
                  user={user || mockUser}
                  variant="compact"
                  onStreamStart={handleStreamStart}
                />
              </div>

              <div className="text-sm text-gray-500">
                Three button variants: Default, Floating, and Compact
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Streams */}
        {activeStreams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-center">Active Demo Streams</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeStreams.map(stream => (
                <Card key={stream.id} className="relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="animate-pulse">
                      🔴 LIVE
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {stream.mode === 'quick' ? (
                        <Smartphone className="w-5 h-5 text-pink-500" />
                      ) : (
                        <Monitor className="w-5 h-5 text-blue-500" />
                      )}
                      <span>{stream.mode === 'quick' ? 'Quick Live' : 'Studio Live'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <h4 className="font-semibold">{stream.config.title || 'Demo Stream'}</h4>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{stream.viewers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{stream.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{stream.messages}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Started {new Date(stream.startTime).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Smartphone className="w-4 h-4 text-pink-500" />
                        <span>Quick Live</span>
                      </div>
                    </th>
                    <th className="text-center p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Monitor className="w-4 h-4 text-blue-500" />
                        <span>Studio Live</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Setup Time', quick: '< 30 seconds', studio: '2-5 minutes' },
                    { feature: 'Duration Limit', quick: '60 minutes', studio: 'Unlimited' },
                    { feature: 'Camera Access', quick: '✅', studio: '✅' },
                    { feature: 'Screen Share', quick: '❌', studio: '✅' },
                    { feature: 'RTMP Support', quick: '❌', studio: '✅' },
                    { feature: 'Custom Overlays', quick: '❌', studio: '✅' },
                    { feature: 'Live Analytics', quick: 'Basic', studio: 'Advanced' },
                    { feature: 'Monetization', quick: 'Tips only', studio: 'Full suite' },
                    { feature: 'Mobile Optimized', quick: '✅', studio: 'Desktop focused' },
                    { feature: 'Best For', quick: 'Casual creators', studio: 'Professional streamers' }
                  ].map(({ feature, quick, studio }) => (
                    <tr key={feature} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">{feature}</td>
                      <td className="p-4 text-center">{quick}</td>
                      <td className="p-4 text-center">{studio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to start streaming?</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Choose the mode that fits your content style and start connecting with your audience today.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Try Quick Live
            </Button>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Try Studio Live
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}