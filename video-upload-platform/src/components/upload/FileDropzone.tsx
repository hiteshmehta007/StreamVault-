import React, { useCallback, useState, useRef } from 'react';
import { toast } from 'sonner';

interface FileDropzoneProps {
  onFileDrop: (files: File[]) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileDrop }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length > 0) {
      onFileDrop(validFiles);
      toast.success(`${validFiles.length} video file(s) added`);
    } else {
      toast.error('Please select video files only');
    }
  }, [onFileDrop]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Select video files to upload"
      />
      {isDragActive ? (
        <p className="text-blue-500 text-lg">Drop the video files here...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700 text-lg">Drag & drop video files here</p>
          <p className="text-gray-500 text-sm">or click to select files</p>
          <p className="text-gray-400 text-xs">Supports all video formats</p>
        </div>
      )}
    </div>
  );
};