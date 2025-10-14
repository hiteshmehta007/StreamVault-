import React from 'react';

interface ProgressProps {
  progress: number; // Progress percentage (0 to 100)
  label?: string; // Optional label for the progress bar
}

export const Progress: React.FC<ProgressProps> = ({ progress, label }) => {
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded">
      <div
        className="absolute top-0 left-0 h-full bg-blue-600 rounded"
        style={{ width: `${progress}%` }}
      />
      {label && (
        <span className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-700">
          {label}
        </span>
      )}
    </div>
  );
};