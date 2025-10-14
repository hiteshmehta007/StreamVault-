import { useState } from 'react';
import { Button } from './ui/button';
import { VideoUpload } from './VideoUpload';
import { LiveStreamModal } from './LiveStreamModal';
import { motion } from 'motion/react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UploadButtonProps {
  user?: any;
  variant?: 'default' | 'hero';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function UploadButton({ user, variant = 'default', size = 'default', className = '' }: UploadButtonProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleUploadClick = () => {
    if (!user?.channel) {
      toast.error('Please create a channel first to upload videos');
      return;
    }
    setShowUploadModal(true);
  };

  const handleLiveStreamClick = () => {
    if (!user?.channel) {
      toast.error('Please create a channel first to start streaming');
      return;
    }
    setShowLiveStreamModal(true);
  };

  const handleVideoUploaded = (video: any) => {
    toast.success(`Video \"${video.title}\" uploaded successfully! Processing will begin shortly.`);
    setShowUploadModal(false);
  };

  const handleLiveStreamStarted = (streamData: any) => {
    toast.success(`🔴 Live stream \"${streamData.title}\" started successfully!`);
    setShowLiveStreamModal(false);
  };

  if (variant === 'hero') {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Main Upload Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleUploadClick}
              className={`bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl min-w-[160px] h-11 px-8 py-3 transition-all duration-200 ${className}`}
              size={size}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </motion.div>

          {/* Go Live Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleLiveStreamClick}
              variant="outline"
              className={`border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-w-[160px] h-11 px-8 py-3 transition-all duration-200 ${className}`}
              size={size}
            >
              <div className="h-4 w-4 mr-2 bg-red-500 rounded-full animate-pulse" />
              Go Live
            </Button>
          </motion.div>
        </div>

        {/* Modals */}
        <VideoUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onVideoUploaded={handleVideoUploaded}
        />

        <LiveStreamModal
          isOpen={showLiveStreamModal}
          onClose={() => setShowLiveStreamModal(false)}
          onStreamStarted={handleLiveStreamStarted}
        />
      </>
    );
  }

  // Default variant - single button with dropdown menu
  return (
    <>
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowMenu(!showMenu)}
            className={`bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
            size={size}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </motion.div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                onClick={handleUploadClick}
                className="w-full justify-start"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
              <Button
                variant="ghost"
                onClick={handleLiveStreamClick}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <div className="h-4 w-4 mr-2 bg-red-500 rounded-full animate-pulse" />
                Go Live
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <VideoUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      <LiveStreamModal
        isOpen={showLiveStreamModal}
        onClose={() => setShowLiveStreamModal(false)}
        onStreamStarted={handleLiveStreamStarted}
      />
    </>
  );
}