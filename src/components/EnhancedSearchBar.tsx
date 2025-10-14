
import { useState, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, MicOff, X, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search videos, channels...",
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search suggestions
  const trendingSearches = [
    "4K nature documentary",
    "gaming laptop review 2024",
    "cooking masterclass",
    "travel vlog japan",
    "music production tutorial",
    "fitness transformation"
  ];

  const recentSearches = [
    "tech reviews",
    "cooking videos",
    "travel vlogs"
  ];

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      toast.success(`Voice search: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Voice search error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Search Icon */}
        <motion.div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          animate={{ 
            rotate: value ? 360 : 0,
            scale: value ? 1.1 : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </motion.div>

        {/* Input Field */}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className={`pl-10 pr-20 transition-all duration-300 focus:shadow-lg ${
            isFocused ? 'ring-2 ring-primary/20' : ''
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Right side buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Clear button */}
          <AnimatePresence>
            {value && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice search button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 ${isListening ? 'text-red-500' : ''}`}
              onClick={handleVoiceSearch}
              disabled={isListening}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Mic className="h-3 w-3" />
                </motion.div>
              ) : (
                <MicOff className="h-3 w-3" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Active indicator */}
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full"
          />
        )}

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && !value && (
              <div className="p-3 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Recent</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={search}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        {search}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {value ? 'Suggestions' : 'Trending'}
                </span>
              </div>
              <div className="space-y-1">
                {trendingSearches
                  .filter(search => !value || search.toLowerCase().includes(value.toLowerCase()))
                  .slice(0, 6)
                  .map((search, index) => (
                    <motion.div
                      key={search}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer group transition-colors"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <Search className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                      <span className="text-sm group-hover:text-foreground">{search}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

