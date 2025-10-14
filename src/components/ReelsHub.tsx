import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Zap, TrendingUp, Play, Plus } from 'lucide-react';
import { ReelsPage } from './ReelsPage';
import { ReelCreator } from './ReelCreator';
import { ReelDiscovery } from './ReelDiscovery';
import { ReelVideo } from '../types/reels';

interface ReelsHubProps {
  onNavigate?: (page: string) => void;
}

export function ReelsHub({ onNavigate }: ReelsHubProps) {
  const [activeTab, setActiveTab] = useState('fyp');
  const [showCreator, setShowCreator] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [selectedReel, setSelectedReel] = useState<ReelVideo | null>(null);

  const handleCreateReel = () => {
    setShowCreator(true);
  };

  const handleReelCreated = (reel: any) => {
    console.log('New reel created:', reel);
    setShowCreator(false);
    // Refresh the feed or add the new reel
  };

  const handleReelSelect = (reel: ReelVideo) => {
    setSelectedReel(reel);
    setShowDiscovery(false);
    setActiveTab('fyp');
  };

  if (showCreator) {
    return (
      <ReelCreator
        isOpen={true}
        onClose={() => setShowCreator(false)}
        onReelCreated={handleReelCreated}
      />
    );
  }

  if (showDiscovery) {
    return (
      <ReelDiscovery
        onReelSelect={handleReelSelect}
        onCreateReel={handleCreateReel}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Reels</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDiscovery(true)}
              className="text-white hover:bg-white/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Discover
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateReel}
              className="text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent border-0 rounded-none h-12">
            <TabsTrigger 
              value="fyp" 
              className="flex-1 text-white data-[state=active]:bg-white/10 data-[state=active]:text-white border-0 rounded-none"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="flex-1 text-white data-[state=active]:bg-white/10 data-[state=active]:text-white border-0 rounded-none"
            >
              Following
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="flex-1 text-white data-[state=active]:bg-white/10 data-[state=active]:text-white border-0 rounded-none"
            >
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="fyp" className="h-full m-0">
            <ReelsPage onNavigate={onNavigate || (() => {})} />
          </TabsContent>
          <TabsContent value="following" className="h-full m-0">
            <ReelsPage onNavigate={onNavigate || (() => {})} />
          </TabsContent>
          <TabsContent value="trending" className="h-full m-0">
            <ReelsPage onNavigate={onNavigate || (() => {})} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}