import { useState } from 'react';
import { uploadFile } from '../services/uploadService';
import { toast } from 'sonner';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await uploadFile(file, (progress: number) => {
        setUploadProgress(progress);
      });
      toast.success('Upload successful');
    } catch (err) {
      setError('Upload failed');
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setFile(null);
    }
  };

  return {
    file,
    isUploading,
    uploadProgress,
    error,
    handleFileChange,
    handleUpload,
  };
}