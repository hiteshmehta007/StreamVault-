import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Settings } from 'lucide-react';

// Simple button test component
interface ButtonTestProps {
  onNavigate?: (page: string) => void;
}

export const ButtonTest = ({ onNavigate }: ButtonTestProps) => {
  const testClick = (buttonName: string) => {
    console.log(`✅ ${buttonName} button clicked successfully!`);
    alert(`${buttonName} button is working!`);
  };

  const handleProfileDemo = () => {
    if (onNavigate) {
      onNavigate('profile-update-demo');
    } else {
      console.log('🎯 Navigate to Profile Update Demo');
      alert('Profile Update Demo - Navigation handler not provided');
    }
  };

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Button Functionality Test</h3>
      
      <div className="flex space-x-2">
        <Button 
          onClick={() => testClick('Like')}
          variant="outline"
          size="sm"
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Test Like
        </Button>
        
        <Button 
          onClick={() => testClick('Dislike')}
          variant="outline"
          size="sm"
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Test Dislike
        </Button>
        
        <Button 
          onClick={() => testClick('Share')}
          variant="outline"
          size="sm"
        >
          Test Share
        </Button>
        
        <Button 
          onClick={handleProfileDemo}
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Settings className="h-4 w-4 mr-2" />
          Profile Update Demo
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Click these test buttons to verify functionality. The "Profile Update Demo" button showcases the profile update form with all your requested features.
      </p>
    </div>
  );
};