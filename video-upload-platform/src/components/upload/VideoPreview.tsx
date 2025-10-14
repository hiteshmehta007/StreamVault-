import React from 'react';

interface VideoPreviewProps {
  videoSrc: string;
  onClose: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoSrc, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative w-full max-w-2xl">
        <button
          className="absolute top-2 right-2 text-white"
          onClick={onClose}
        >
          X
        </button>
        <video
          src={videoSrc}
          controls
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};