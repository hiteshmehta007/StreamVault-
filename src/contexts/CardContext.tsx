import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VideoCard, CardFormData } from '../types/cards';
import { CardService } from '../services/cardService';
import { toast } from 'sonner';

interface CardContextValue {
  cards: VideoCard[];
  isAddingCard: boolean;
  selectedCard: VideoCard | null;
  currentTime: number;
  
  // Actions
  loadCards: (videoId: string) => Promise<void>;
  addCard: (videoId: string, cardData: CardFormData) => Promise<void>;
  updateCard: (videoId: string, cardId: string, updates: Partial<CardFormData>) => Promise<void>;
  deleteCard: (videoId: string, cardId: string) => Promise<void>;
  setIsAddingCard: (adding: boolean) => void;
  setSelectedCard: (card: VideoCard | null) => void;
  setCurrentTime: (time: number) => void;
  getActiveCards: (currentTime: number) => VideoCard[];
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function useCards() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}

interface CardProviderProps {
  children: ReactNode;
}

export function CardProvider({ children }: CardProviderProps) {
  const [cards, setCards] = useState<VideoCard[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<VideoCard | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const loadCards = useCallback(async (videoId: string) => {
    try {
      const videoCards = await CardService.getVideoCards(videoId);
      setCards(videoCards);
    } catch (error) {
      toast.error('Failed to load video cards');
    }
  }, []);

  const addCard = useCallback(async (videoId: string, cardData: CardFormData) => {
    try {
      const newCard = await CardService.createCard(videoId, cardData);
      setCards(prev => [...prev, newCard]);
      toast.success('Card added successfully!');
      setIsAddingCard(false);
    } catch (error) {
      toast.error('Failed to add card');
      throw error;
    }
  }, []);

  const updateCard = useCallback(async (videoId: string, cardId: string, updates: Partial<CardFormData>) => {
    try {
      const updatedCard = await CardService.updateCard(videoId, cardId, updates);
      setCards(prev => prev.map(card => card.id === cardId ? updatedCard : card));
      toast.success('Card updated successfully!');
    } catch (error) {
      toast.error('Failed to update card');
      throw error;
    }
  }, []);

  const deleteCard = useCallback(async (videoId: string, cardId: string) => {
    try {
      await CardService.deleteCard(videoId, cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
      toast.success('Card deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete card');
      throw error;
    }
  }, []);

  const getActiveCards = useCallback((currentTime: number) => {
    return cards.filter(card => {
      const isAfterStart = currentTime >= card.startTime;
      const isBeforeEnd = card.endTime ? currentTime <= card.endTime : true;
      return card.isActive && isAfterStart && isBeforeEnd;
    });
  }, [cards]);

  const value: CardContextValue = {
    cards,
    isAddingCard,
    selectedCard,
    currentTime,
    loadCards,
    addCard,
    updateCard,
    deleteCard,
    setIsAddingCard,
    setSelectedCard,
    setCurrentTime,
    getActiveCards,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
}