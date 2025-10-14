import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Sparkles, Zap } from 'lucide-react';
import { QuickLiveSetup } from './QuickLiveSetup';
import { StudioLiveSetup } from './StudioLiveSetup';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamStart: (mode: 'quick' | 'studio', config: any) => void;
  user?: any;
  isLoading?: boolean;
}

export function GoLiveModal({ isOpen, onClose, onStreamStart, user, isLoading }: GoLiveModalProps) {
  const [selectedMode, setSelectedMode] = useState<'selection' | 'quick' | 'studio'>('selection');

  const handleModeSelect = (mode: 'quick' | 'studio') => {
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedMode('selection');
  };

  const handleStreamStart = async (config: any) => {
    try {
      if (selectedMode === 'quick' || selectedMode === 'studio') {
        console.log(`🎬 Starting ${selectedMode} live with config:`, config);
        
        if (typeof onStreamStart === 'function') {
          await onStreamStart(selectedMode, config);
        } else {
          console.error('onStreamStart is not a function:', onStreamStart);
          throw new Error('Stream start handler is not available');
        }
      } else {
        throw new Error('Invalid streaming mode selected');
      }
    } catch (error) {
      console.error('Failed to start stream in modal:', error);
      // Re-throw to let the component handle it
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl live-modal-container bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedMode !== 'selection' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-2"
                >
                  ←
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedMode === 'selection' && 'Choose Your Live Experience'}
                  {selectedMode === 'quick' && '📱 Quick Live Setup'}
                  {selectedMode === 'studio' && '🎥 Studio Live Setup'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMode === 'selection' && 'Pick the perfect streaming mode for your content'}
                  {selectedMode === 'quick' && 'Fast setup for casual, engaging live sessions'}
                  {selectedMode === 'studio' && 'Professional streaming with full control'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative overflow-y-auto flex-1 custom-scrollbar modal-content-height">
          <AnimatePresence mode="wait">
            {selectedMode === 'selection' && (
              <ModeSelection onModeSelect={handleModeSelect} />
            )}
            {selectedMode === 'quick' && (
              <QuickLiveSetup
                onStreamStart={handleStreamStart}
                user={user}
                isLoading={isLoading}
              />
            )}
            {selectedMode === 'studio' && (
              <StudioLiveSetup
                onStreamStart={handleStreamStart}
                user={user}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModeSelection({ onModeSelect }: { onModeSelect: (mode: 'quick' | 'studio') => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Live Option */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="relative cursor-pointer group"
          onClick={() => onModeSelect('quick')}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border-2 border-pink-200 dark:border-pink-700 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Live</h3>
                  <p className="text-pink-600 dark:text-pink-400 font-medium">Instagram-style streaming</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Zap className="w-5 h-5 text-pink-500" />
                  <span>Start streaming in seconds</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Smartphone className="w-5 h-5 text-pink-500" />
                  <span>Mobile-optimized vertical layout</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <span>Live chat & emoji reactions</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Perfect for: Casual updates, Q&As, behind-the-scenes content
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">⏱️ Up to 60 minutes</span>
                <div className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                  Recommended for beginners
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Studio Live Option */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="relative cursor-pointer group"
          onClick={() => onModeSelect('studio')}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Studio Live</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Professional streaming</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <span>RTMP support for OBS/Streamlabs</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>Screen share & custom overlays</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span>Live analytics & monetization</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Perfect for: Gaming, tutorials, professional broadcasts, workshops
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">⏱️ Unlimited duration</span>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  Pro features
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Note */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Not sure which to choose?</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start with <strong>Quick Live</strong> for spontaneous content and casual interactions. 
          Upgrade to <strong>Studio Live</strong> when you need professional features like screen sharing, 
          custom overlays, and detailed analytics.
        </p>
      </div>
    </motion.div>
  );
}