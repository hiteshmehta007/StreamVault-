import React, { useState } from 'react';
import Button from '../ui/button';
import { FileDropzone } from './FileDropzone';
import { UploadProgress } from './UploadProgress';
import { VideoPreview } from './VideoPreview';
import { MetadataForm } from './MetadataForm';
import { uploadVideo } from '../../services/uploadService';
import { toast } from 'sonner';

export function VideoUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metadata, setMetadata] = useState<{ title: string; description: string; tags: string[] }>({ title: '', description: '', tags: [] });

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleMetadataSubmit = (newMetadata: { title: string; description: string; tags: string[] }) => {
    setMetadata(newMetadata);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a video file to upload.');
      return;
    }

    try {
      const response = await uploadVideo(file, setUploadProgress);
      toast.success('Video uploaded successfully!');
      // Handle response (e.g., navigate to processing page)
    } catch (error) {
      toast.error('Error uploading video. Please try again.');
    }
  };

  const handleClosePreview = () => {
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <FileDropzone onFileDrop={handleFileDrop} />
      {file && <VideoPreview videoSrc={URL.createObjectURL(file)} onClose={handleClosePreview} />}
      <MetadataForm onSubmit={handleMetadataSubmit} />
      <UploadProgress progress={uploadProgress} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload Video
      </Button>
    </div>
  );
}