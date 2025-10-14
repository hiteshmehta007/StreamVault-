import React from 'react';
import { Progress } from '../ui/progress';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Upload Progress</h3>
      <Progress value={progress} />
      <div className="text-right mt-1">
        <span className="text-sm font-medium">{progress}%</span>
      </div>
    </div>
  );
};