import { createContext, useContext, useState, ReactNode } from 'react';

interface InteractiveCard {
  id: string;
  type: 'video' | 'playlist' | 'channel' | 'url';
  title: string;
  description: string;
  targetUrl?: string;
  targetId?: string;
  thumbnail?: string;
  startTime: number;
  endTime: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  style: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
}

interface InteractiveCardContextType {
  cards: InteractiveCard[];
  addCard: (card: InteractiveCard) => void;
  updateCard: (cardId: string, updates: Partial<InteractiveCard>) => void;
  deleteCard: (cardId: string) => void;
  getCardsByVideo: (videoId: string) => InteractiveCard[];
  getActiveCards: (videoId: string, currentTime: number) => InteractiveCard[];
  saveCards: (videoId: string, cards: InteractiveCard[]) => void;
}

const InteractiveCardContext = createContext<InteractiveCardContextType | undefined>(undefined);

interface InteractiveCardProviderProps {
  children: ReactNode;
}

export function InteractiveCardProvider({ children }: InteractiveCardProviderProps) {
  const [cardsByVideo, setCardsByVideo] = useState<Record<string, InteractiveCard[]>>({});

  const cards = Object.values(cardsByVideo).flat();

  const addCard = (card: InteractiveCard) => {
    // This would typically be associated with a specific video
    // For now, we'll use a default video ID
    const videoId = 'current-video';
    setCardsByVideo(prev => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), card]
    }));
  };

  const updateCard = (cardId: string, updates: Partial<InteractiveCard>) => {
    setCardsByVideo(prev => {
      const newCardsByVideo = { ...prev };
      Object.keys(newCardsByVideo).forEach(videoId => {
        newCardsByVideo[videoId] = newCardsByVideo[videoId].map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        );
      });
      return newCardsByVideo;
    });
  };

  const deleteCard = (cardId: string) => {
    setCardsByVideo(prev => {
      const newCardsByVideo = { ...prev };
      Object.keys(newCardsByVideo).forEach(videoId => {
        newCardsByVideo[videoId] = newCardsByVideo[videoId].filter(card => card.id !== cardId);
      });
      return newCardsByVideo;
    });
  };

  const getCardsByVideo = (videoId: string): InteractiveCard[] => {
    return cardsByVideo[videoId] || [];
  };

  const getActiveCards = (videoId: string, currentTime: number): InteractiveCard[] => {
    const videoCards = getCardsByVideo(videoId);
    return videoCards.filter(card => 
      currentTime >= card.startTime && currentTime <= card.endTime
    );
  };

  const saveCards = (videoId: string, cards: InteractiveCard[]) => {
    setCardsByVideo(prev => ({
      ...prev,
      [videoId]: cards
    }));
    
    // Here you would typically save to your backend
    console.log(`Saved ${cards.length} cards for video ${videoId}:`, cards);
  };

  const value: InteractiveCardContextType = {
    cards,
    addCard,
    updateCard,
    deleteCard,
    getCardsByVideo,
    getActiveCards,
    saveCards
  };

  return (
    <InteractiveCardContext.Provider value={value}>
      {children}
    </InteractiveCardContext.Provider>
  );
}

export function useInteractiveCards() {
  const context = useContext(InteractiveCardContext);
  if (context === undefined) {
    throw new Error('useInteractiveCards must be used within an InteractiveCardProvider');
  }
  return context;
}

export type { InteractiveCard };