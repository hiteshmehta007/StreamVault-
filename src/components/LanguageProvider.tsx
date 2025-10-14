import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SUPPORTED_LANGUAGES, Language } from './LanguageSelector';
import { translations, Translations } from '../translations';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (languageCode: string) => void;
  supportedLanguages: Language[];
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguageCode, setCurrentLanguageCode] = useState(() => {
    return localStorage.getItem('streamvault-language') || 'en';
  });

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0];

  const setLanguage = (languageCode: string) => {
    setCurrentLanguageCode(languageCode);
    localStorage.setItem('streamvault-language', languageCode);
  };

  // Translation function
  const t = (key: keyof Translations): string => {
    const languageTranslations = translations[currentLanguageCode];
    if (languageTranslations && languageTranslations[key]) {
      return languageTranslations[key];
    }
    
    // Fallback to English if translation not found
    const fallback = translations.en[key];
    if (fallback) {
      return fallback;
    }
    
    // Return key as fallback if no translation found
    return key as string;
  };

  useEffect(() => {
    // Apply language to document
    document.documentElement.lang = currentLanguageCode;
    
    // Apply text direction for RTL languages
    const rtlLanguages = ['ar', 'ur'];
    if (rtlLanguages.includes(currentLanguageCode)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [currentLanguageCode]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}