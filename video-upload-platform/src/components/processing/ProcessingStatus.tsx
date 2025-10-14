import React from 'react';
import { Card } from '../ui/card';
import Badge from '../ui/badge';

interface ProcessingStatusProps {
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, errorMessage }) => {
  const renderStatusMessage = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-yellow-600">
            <Badge variant="secondary">Processing...</Badge>
          </div>
        );
      case 'completed':
        return (
          <div className="text-green-600">
            <Badge variant="outline">Processing Completed</Badge>
          </div>
        );
      case 'error':
        return (
          <div className="text-red-600">
            <Badge variant="outline">Error: {errorMessage}</Badge>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card title="Video Processing Status">
      <div className="p-4">
        {renderStatusMessage()}
      </div>
    </Card>
  );
};