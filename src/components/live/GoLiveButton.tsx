import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Settings } from 'lucide-react';
import { NewGoLiveModal } from './NewGoLiveModal';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface GoLiveButtonProps {
  user?: any;
  className?: string;
  variant?: 'default' | 'floating' | 'compact';
  onStreamStart?: (mode: 'quick' | 'studio', config: any) => void;
}

export function GoLiveButton({ 
  user, 
  className = '', 
  variant = 'default',
  onStreamStart 
}: GoLiveButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPreparingStream, setIsPreparingStream] = useState(false);

  const handleStreamStart = async (mode: 'quick' | 'studio', config: any) => {
    setIsPreparingStream(true);
    
    try {
      // Simulate stream preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock stream data
      const streamData = {
        id: `stream-${Date.now()}`,
        mode,
        config,
        creator: user || { name: 'Creator', avatar: '/api/placeholder/avatar' },
        startTime: new Date(),
        status: 'preparing'
      };

      console.log('🎬 Starting stream:', streamData);
      
      if (onStreamStart) {
        onStreamStart(mode, streamData);
      }

      toast.success(`${mode === 'quick' ? '📱 Quick Live' : '🎥 Studio Live'} is starting!`);
      setShowModal(false);
      
    } catch (error) {
      console.error('Failed to start stream:', error);
      toast.error('Failed to start live stream. Please try again.');
    } finally {
      setIsPreparingStream(false);
    }
  };

  const getButtonContent = () => {
    switch (variant) {
      case 'floating':
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-full shadow-xl"
          >
            <Radio className="w-7 h-7 text-white" />
          </motion.div>
        );
      
      case 'compact':
        return (
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-semibold">Go Live</span>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Radio className="w-5 h-5" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full shadow-lg"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Go Live</div>
              <div className="text-xs opacity-90">Start streaming now</div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={`
          relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95
          ${variant === 'default' ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl' : ''}
          ${variant === 'floating' ? 'p-0 bg-transparent hover:bg-transparent' : ''}
          ${variant === 'compact' ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg' : ''}
          ${className}
        `}
        disabled={isPreparingStream}
      >
        {isPreparingStream ? (
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-4 h-4" />
            </motion.div>
            <span>Preparing...</span>
          </div>
        ) : (
          getButtonContent()
        )}
        
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      </Button>

      <AnimatePresence>
        {showModal && (
          <NewGoLiveModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onStreamStart={handleStreamStart}
            user={user}
            isLoading={isPreparingStream}
          />
        )}
      </AnimatePresence>
    </>
  );
}