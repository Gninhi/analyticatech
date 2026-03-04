
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from '../../types/index';
import { UI_TRANSLATIONS } from '../../data/translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof UI_TRANSLATIONS['fr']) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Safe locale detection that works in all environments
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      // 1. Try localStorage first
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('analytica_locale');
        if (saved === 'fr' || saved === 'en') return saved as Locale;
      }
      
      // 2. Fallback to navigator language
      if (typeof navigator !== 'undefined') {
        const lang = navigator.language || 'en';
        const browserLang = lang.split('-')[0];
        return (browserLang === 'fr' ? 'fr' : 'en') as Locale;
      }
      
      // 3. Default fallback
      return 'fr';
    } catch (error) {
      console.warn('[I18nProvider] Fallback to default locale due to error:', error);
      return 'fr';
    }
  });

  useEffect(() => {
    localStorage.setItem('analytica_locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: keyof typeof UI_TRANSLATIONS['fr']): string => {
    const translation = UI_TRANSLATIONS[locale][key];
    return translation || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
