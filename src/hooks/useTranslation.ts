import { useLanguageContext } from '../components/LanguageProvider';
import { translations, Translations } from '../translations';

export function useTranslation() {
  const { currentLanguage } = useLanguageContext();
  
  const t = (key: keyof Translations): string => {
    const languageTranslations = translations[currentLanguage.code];
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

  return { t, currentLanguage };
}

// Helper function for pluralization
export function useTranslationPlural() {
  const { t } = useTranslation();
  
  const tp = (key: keyof Translations, count: number): string => {
    const translation = t(key);
    
    // Simple pluralization for now - can be enhanced later
    if (count === 1) {
      return `1 ${translation.replace(/s$/, '')}`;
    }
    
    return `${count} ${translation}`;
  };

  return { tp };
}