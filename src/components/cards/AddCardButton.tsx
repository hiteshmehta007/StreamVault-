import { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { useCards } from '../../contexts/CardContext';

interface AddCardButtonProps {
  isCreator: boolean;
  currentTime: number;
  onAddCard: () => void;
}

export function AddCardButton({ isCreator, currentTime, onAddCard }: AddCardButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { setCurrentTime, setIsAddingCard } = useCards();

  if (!isCreator) return null;

  const handleAddCard = () => {
    setCurrentTime(currentTime);
    setIsAddingCard(true);
    onAddCard();
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Button
        onClick={handleAddCard}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 group"
        aria-label="Add interactive card"
      >
        <div className="relative">
          <CreditCard className="h-6 w-6" />
          <Plus 
            className={`h-3 w-3 absolute -top-1 -right-1 transition-transform duration-200 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`} 
          />
        </div>
      </Button>
      
      {/* Tooltip */}
      <div 
        className={`absolute bottom-16 right-0 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        Add interactive card
        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
}