import React, { useState } from 'react';
import Button from '../ui/button';
import Badge from '../ui/badge';

const qualityOptions = [
  { label: '144p', value: '144p' },
  { label: '240p', value: '240p' },
  { label: '360p', value: '360p' },
  { label: '480p', value: '480p' },
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
  { label: '1440p', value: '1440p' },
  { label: '2160p', value: '2160p' },
];

export function QualitySettings() {
  const [selectedQuality, setSelectedQuality] = useState(qualityOptions[0].value);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuality(event.target.value);
  };

  const applyQualitySettings = () => {
    // Logic to apply quality settings
    console.log(`Quality set to: ${selectedQuality}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Video Quality</h2>
      <select
        value={selectedQuality}
        onChange={handleQualityChange}
        className="border rounded p-2"
        title="Select video quality"
      >
        {qualityOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button onClick={applyQualitySettings}>Apply Quality Settings</Button>
      <Badge variant="secondary">{selectedQuality} selected</Badge>
    </div>
  );
}