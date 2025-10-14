import { useState } from 'react';
import { Button } from './ui/button';
import { useLanguageContext } from './LanguageProvider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'other', name: 'Other', nativeName: 'Other', flag: '🌍' }
];

interface LanguageSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'select' | 'dropdown' | 'button';
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  showNativeName?: boolean;
  placeholder?: string;
  className?: string;
}

export function LanguageSelector({
  value,
  onValueChange,
  variant = 'select',
  size = 'md',
  showFlag = true,
  showNativeName = false,

  className
}: LanguageSelectorProps) {
  // Try to use context first, fallback to props/state
  let contextLanguage: Language | undefined;
  let contextSetLanguage: ((code: string) => void) | undefined;
  try {
    const context = useLanguageContext();
    contextLanguage = context.currentLanguage;
    contextSetLanguage = context.setLanguage;
  } catch {
    // Context not available, use local state
  }

  const [localLanguage, setLocalLanguage] = useState(value || 'en');
  
  const selectedLanguage = contextLanguage?.code || localLanguage;
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    if (contextSetLanguage) {
      contextSetLanguage(languageCode);
    } else {
      setLocalLanguage(languageCode);
      localStorage.setItem('streamvault-language', languageCode);
    }
    onValueChange?.(languageCode);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 text-xs';
      case 'lg': return 'h-12 text-base';
      default: return 'h-9 text-sm';
    }
  };

  const formatLanguageDisplay = (language: Language, compact = false) => {
    if (compact) {
      return showFlag ? `${language.flag} ${language.name}` : language.name;
    }
    
    return (
      <div className="flex items-center space-x-2">
        {showFlag && <span className="text-base">{language.flag}</span>}
        <div className="flex flex-col">
          <span className="font-medium">{language.name}</span>
          {showNativeName && language.nativeName !== language.name && (
            <span className="text-xs text-muted-foreground">{language.nativeName}</span>
          )}
        </div>
      </div>
    );
  };

  if (variant === 'select') {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`${getSizeClasses()} ${className || ''}`}>
          <SelectValue>
            {formatLanguageDisplay(currentLanguage, true)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {formatLanguageDisplay(language, true)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`justify-between ${getSizeClasses()} ${className || ''}`}
          >
            {formatLanguageDisplay(currentLanguage, true)}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-1 max-h-[200px] overflow-y-auto custom-scrollbar">
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`${selectedLanguage === language.code ? 'bg-accent' : ''} min-h-9 py-2`}
            >
              {formatLanguageDisplay(language)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Button variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size === 'sm' ? 'sm' : 'default'}
          className={`h-8 w-8 px-0 ${className || ''}`}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 p-1 max-h-[200px] overflow-y-auto custom-scrollbar" 
        align="end"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`${selectedLanguage === language.code ? 'bg-accent' : ''} min-h-9 py-2`}
          >
            {formatLanguageDisplay(language)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for using language context
export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('streamvault-language') || 'en';
  });

  const changeLanguage = (languageCode: string) => {
    setLanguage(languageCode);
    localStorage.setItem('streamvault-language', languageCode);
  };

  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];
  };

  return {
    language,
    changeLanguage,
    getCurrentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}