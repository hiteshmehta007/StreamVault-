import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QuickEditModal } from './QuickEditModal';
import { InteractiveCardCreator } from './cards/InteractiveCardCreator';
import { CreditCard, Plus } from 'lucide-react';
import { 
  Edit3, 
  Video, 
  Eye, 
  Clock, 
  Users, 
  DollarSign,
  Scissors,
  Globe,
  Shield,
  Star,
  PlayCircle,
  FileText,
  Image,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface QuickEditLandingPageProps {
  user?: any;
}

const QuickEditLandingPage: React.FC<QuickEditLandingPageProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // Check if user is a creator (has a channel)
  const isCreator = user && user.channel;

  // Sample video data for demonstration
  const demoVideos = [
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      description: 'A comprehensive tutorial covering useState, useEffect, and custom hooks with practical examples.',
      tags: 'react, hooks, tutorial, javascript, programming',
      thumbnail: 'https://picsum.photos/400/225?random=1',
      category: 'Education',
      language: 'English',
      visibility: 'public',
      views: 12500,
      likes: 890,
      duration: '15:32'
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced TypeScript patterns including generics, conditional types, and mapped types.',
      tags: 'typescript, programming, advanced, patterns',
      thumbnail: 'https://picsum.photos/400/225?random=2',
      category: 'Technology',
      language: 'English',
      visibility: 'public',
      views: 8200,
      likes: 654,
      duration: '22:18'
    },
    {
      id: '3',
      title: 'Building Modern UIs with Tailwind CSS',
      description: 'Learn how to create beautiful, responsive user interfaces using Tailwind CSS utilities and components.',
      tags: 'tailwind, css, ui, design, responsive',
      thumbnail: 'https://picsum.photos/400/225?random=3',
      category: 'Education',
      language: 'English',
      visibility: 'unlisted',
      views: 5600,
      likes: 423,
      duration: '18:45'
    }
  ];

  const [selectedVideo, setSelectedVideo] = useState(demoVideos[0]);

  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Metadata Editing",
      description: "Update titles, descriptions, and tags instantly",
      color: "bg-blue-500"
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: "Thumbnail Management",
      description: "Change video thumbnails and preview images",
      color: "bg-green-500"
    },
    {
      icon: <Scissors className="h-5 w-5" />,
      title: "Video Editing",
      description: "Set start/end cuts and highlight timestamps",
      color: "bg-purple-500"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Publishing Controls",
      description: "Manage visibility, scheduling, and audience settings",
      color: "bg-orange-500"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Interactive Cards",
      description: "Create clickable overlay cards that link to videos, playlists, channels, or external URLs with custom timing and styling",
      color: "bg-indigo-500"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Monetization",
      description: "Configure ads, affiliate links, and revenue settings",
      color: "bg-emerald-500"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Content Protection",
      description: "Handle copyright claims and content security",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Edit3 className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Quick Edit Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional video editing made simple. Edit metadata, manage content, and optimize your videos with our comprehensive editing suite.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1">✨ Instant Updates</Badge>
            <Badge variant="secondary" className="px-3 py-1">🚀 Fast Workflow</Badge>
            <Badge variant="secondary" className="px-3 py-1">💰 Monetization Ready</Badge>
            <Badge variant="secondary" className="px-3 py-1">🎯 Creator Focused</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Section */}
        <Card className="mb-12 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PlayCircle className="h-6 w-6 text-blue-600" />
              Try Quick Edit Demo
            </CardTitle>
            <p className="text-muted-foreground">
              Select a sample video below and experience the Quick Edit functionality
            </p>
          </CardHeader>
          <CardContent>
            {/* Video Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {demoVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedVideo.id === video.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant={video.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                        {video.visibility}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {video.likes}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Video Details */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{selectedVideo.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedVideo.tags.split(', ').map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedVideo.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedVideo.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedVideo.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Button 
                      size="lg" 
                      onClick={() => setIsModalOpen(true)}
                      className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6"
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                      Open Quick Edit
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Experience all editing features in action
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Boost Performance</h4>
              <p className="text-sm text-muted-foreground">Optimize your content for better engagement and reach</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Save Time</h4>
              <p className="text-sm text-muted-foreground">Quick edits without complex video editing software</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Audience Control</h4>
              <p className="text-sm text-muted-foreground">Manage visibility and audience restrictions easily</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardContent className="p-6">
              <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Monetize Better</h4>
              <p className="text-sm text-muted-foreground">Advanced monetization and affiliate link management</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Cards Showcase */}
        {isCreator && (
          <Card className="mb-12 border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-indigo-900 dark:text-indigo-100">
                <CreditCard className="h-6 w-6" />
                Interactive Cards Studio
                <Badge className="bg-indigo-600 text-white">Creator Only</Badge>
              </CardTitle>
              <p className="text-indigo-700 dark:text-indigo-300">
                Boost viewer engagement with clickable overlay cards that appear at specific times in your videos
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Video Cards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Link to other videos in your channel</p>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Playlist Cards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Promote your curated playlists</p>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Channel Cards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Drive subscriptions and channel growth</p>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">URL Cards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Link to external websites and resources</p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Custom timing control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Multiple positioning options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Customizable colors & styling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Real-time preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Timeline management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Click analytics tracking</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowAddCard(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  <Plus className="h-4 w-4 mr-2" />
                  Create Interactive Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-800 dark:to-slate-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Video Editing Workflow?</h2>
            <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who have streamlined their video management with Quick Edit Studio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Try Quick Edit Now
              </Button>
              {isCreator && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowAddCard(true)}
                  className="border-white text-white hover:bg-white hover:text-slate-900 relative"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <Plus className="h-3 w-3" />
                    Add Interactive Cards
                  </div>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                <Video className="h-5 w-5 mr-2" />
                Watch Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Modal */}
      <QuickEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={selectedVideo}
        onSave={(changes: any) => {
          console.log('Video changes saved:', changes);
          // Here you would typically save the changes to your backend
          // For demo purposes, we'll just close the modal and show a success message
          setIsModalOpen(false);
        }}
      />

      {/* Interactive Card Creator */}
      <InteractiveCardCreator
        open={showAddCard}
        onClose={() => setShowAddCard(false)}
        onSave={(cards) => {
          console.log('Interactive cards saved:', cards);
          // Save cards using context
          setShowAddCard(false);
        }}
        videoId={selectedVideo.id}
        videoDuration={300} // 5 minutes demo duration
      />
    </div>
  );
};

export default QuickEditLandingPage;