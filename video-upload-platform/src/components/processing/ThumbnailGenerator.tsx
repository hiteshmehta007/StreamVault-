import React, { useState } from 'react';
import Button from '../ui/button';
import { Video } from '../../types/video';
import { toast } from 'sonner';

interface ThumbnailGeneratorProps {
  video: Video;
  onThumbnailGenerated: (thumbnail: string) => void;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ video, onThumbnailGenerated }) => {
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);

  const handleFrameSelection = (frame: string) => {
    setCustomThumbnail(frame);
    toast.success('Thumbnail frame selected');
  };

  const handleUploadThumbnail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomThumbnail(reader.result as string);
        toast.success('Custom thumbnail uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateThumbnail = () => {
    if (customThumbnail) {
      onThumbnailGenerated(customThumbnail);
      toast.success('Thumbnail generated successfully');
    } else {
      toast.error('Please select a frame or upload a custom thumbnail');
    }
  };

  return (
    <div className="thumbnail-generator">
      <h2>Generate Thumbnail</h2>
      <div className="video-preview">
        <video src={`/api/video/${video.id}`} controls />
      </div>
      <div className="frame-selection">
        {/* Placeholder for frame selection logic */}
        <Button onClick={() => handleFrameSelection('frame1.jpg')}>Select Frame 1</Button>
        <Button onClick={() => handleFrameSelection('frame2.jpg')}>Select Frame 2</Button>
      </div>
      <div className="custom-thumbnail-upload">
        <input type="file" accept="image/*" onChange={handleUploadThumbnail} aria-label="Upload custom thumbnail image" />
      </div>
      <Button onClick={handleGenerateThumbnail}>Generate Thumbnail</Button>
      {customThumbnail && <img src={customThumbnail} alt="Selected Thumbnail" className="thumbnail-preview" />}
    </div>
  );
};