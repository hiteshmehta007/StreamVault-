import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { QuickEditModal } from './QuickEditModal';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;
  tags: string;
  category: string;
  language: string;
  visibility: string;
  [key: string]: any;
}

interface QuickEditButtonProps {
  video: Video;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const QuickEditButton: React.FC<QuickEditButtonProps> = ({ 
  video, 
  variant = 'default',
  size = 'default',
  className = '',
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    console.log('Saving video data:', updatedData);
    // Here you would typically call an API to save the changes
    setIsModalOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className={`
          inline-flex items-center justify-center gap-2 
          transition-all duration-200 ease-in-out
          hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 focus-visible:outline-none
          ${className}
        `}
        onClick={() => setIsModalOpen(true)}
      >
        <Edit3 className="w-4 h-4" />
        {children || <span className="hidden sm:inline font-medium">Quick Edit</span>}
      </Button>

      <QuickEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={video}
        onSave={handleSave}
      />
    </>
  );
};

export default QuickEditButton;