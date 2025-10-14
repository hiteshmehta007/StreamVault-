import { VideoCard } from '../../types/cards';
import { ExternalLink, Play, List, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardOverlayProps {
  cards: VideoCard[];
  onCardClick: (card: VideoCard) => void;
}

export function CardOverlay({ cards, onCardClick }: CardOverlayProps) {
  const getCardIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-3 w-3" />;
      case 'playlist':
        return <List className="h-3 w-3" />;
      case 'channel':
        return <UserCheck className="h-3 w-3" />;
      case 'url':
        return <ExternalLink className="h-3 w-3" />;
      default:
        return <Play className="h-3 w-3" />;
    }
  };

  const getCardStyle = (card: VideoCard) => ({
    left: `${card.position.x}%`,
    top: `${card.position.y}%`,
    transform: 'translate(-50%, -50%)',
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-auto"
            style={getCardStyle(card)}
          >
            <div
              className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 max-w-xs group"
              onClick={() => onCardClick(card)}
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 p-3 pb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  {getCardIcon(card.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {card.type}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              {card.thumbnail && (
                <div className="px-3 pb-2">
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="w-full h-20 object-cover rounded border"
                  />
                </div>
              )}

              {card.description && (
                <div className="px-3 pb-2">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              )}

              {/* Card Footer */}
              <div className="px-3 py-2 bg-gray-50/80 rounded-b-lg border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary group-hover:text-primary/80">
                    {card.type === 'url' ? 'Visit Link' : `View ${card.type}`}
                  </span>
                  <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {/* Connection Line (Optional) */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-4 bg-white/60 rounded-full"></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}