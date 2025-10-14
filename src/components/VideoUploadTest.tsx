import React from 'react';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';

const VideoUploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    console.log('Test file selected:', file.name, file.type, file.size);
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Video Upload Test</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Button 
          onClick={() => {
            console.log('Test button clicked');
            fileInputRef.current?.click();
          }}
          className="mb-4"
        >
          <Upload className="mr-2 h-4 w-4" />
          Test File Selection
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select video file for upload test"
        />
        
        {selectedFile && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="font-medium">File Selected:</p>
            <p>Name: {selectedFile.name}</p>
            <p>Type: {selectedFile.type}</p>
            <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadTest;