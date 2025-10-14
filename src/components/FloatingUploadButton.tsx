import { useState } from 'react';
import { Button } from './ui/button';
import { VideoUpload } from './VideoUpload';
import { LiveStreamManager, useIsStreaming } from './LiveStreamManager';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Video, X, Play } from 'lucide-react';
import { toast } from 'sonner';

interface FloatingUploadButtonProps {
  user?: any;
  onNavigate?: (state: string) => void;
}

export function FloatingUploadButton({ user, onNavigate }: FloatingUploadButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLiveStreamManager, setShowLiveStreamManager] = useState(false);
  const { isStreaming } = useIsStreaming();

  const handleUploadClick = () => {
    if (!user?.channel) {
      toast.error('Please create a channel first to upload videos');
      return;
    }
    setShowUploadModal(true);
    setShowMenu(false);
  };

  const handleLiveStreamClick = () => {
    if (!user?.channel) {
      toast.error('Please create a channel first to start streaming');
      return;
    }
    
    if (isStreaming) {
      setShowLiveStreamManager(true);
      setShowMenu(false);
    } else {
      setShowLiveStreamManager(true);
      setShowMenu(false);
    }
  };

  const handleVideoUploaded = (video: any) => {
    toast.success(`Video \"${video.title}\" uploaded successfully! Processing will begin shortly.`);
    setShowUploadModal(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {/* Action Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 space-y-2 mb-2"
            >
              {/* Go Live Demo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  onClick={() => {
                    onNavigate?.('go-live-demo');
                    setShowMenu(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 pr-4"
                  size="lg"
                >
                  <Play className="h-5 w-5" />
                  <span className="whitespace-nowrap">Go Live Demo</span>
                </Button>
              </motion.div>

              {/* Upload Video */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={handleUploadClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 pr-4"
                  size="lg"
                >
                  <Video className="h-5 w-5" />
                  <span className="whitespace-nowrap">Upload Video</span>
                </Button>
              </motion.div>

              {/* Go Live */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleLiveStreamClick}
                  className={`${isStreaming ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 pr-4`}
                  size="lg"
                >
                  <div className={`h-5 w-5 bg-white rounded-full ${isStreaming ? '' : 'animate-pulse'}`} />
                  <span className="whitespace-nowrap">{isStreaming ? 'Manage Stream' : 'Go Live'}</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            onClick={() => setShowMenu(!showMenu)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 p-0"
            size="lg"
          >
            <motion.div
              animate={{ rotate: showMenu ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showMenu ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.div>
          </Button>

          {/* Notification Badge */}
          {user?.channel && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
              title="Channel ready - You can now upload!"
            />
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <VideoUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* Live Stream Manager */}
      {showLiveStreamManager && (
        <div className="fixed inset-0 z-50 bg-background">
          <LiveStreamManager 
            user={user}
            onStreamEnd={() => {
              setShowLiveStreamManager(false);
              toast.success('Stream ended successfully!');
            }}
          />
          
          {/* Close button */}
          <button
            onClick={() => setShowLiveStreamManager(false)}
            className="fixed top-4 left-4 z-50 bg-background/95 hover:bg-muted rounded-full p-2 border shadow-lg"
            title="Close Stream Manager"
            aria-label="Close Stream Manager"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}