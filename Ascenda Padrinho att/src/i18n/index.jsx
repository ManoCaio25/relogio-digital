import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n from 'i18next';
import {
  I18nextProvider,
  initReactI18next,
  useTranslation as useI18nextTranslation,
} from 'react-i18next';
import en from './en.json';
import pt from './pt.json';

const STORAGE_KEY = 'language';

const resources = {
  en: { common: en },
  pt: { common: pt },
};

const defaultLanguage = getStoredLanguage();

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnObjects: true,
  });
}

const LanguageContext = createContext(null);

function getStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'pt';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && Object.prototype.hasOwnProperty.call(resources, stored)
    ? stored
    : 'pt';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => i18n.language || defaultLanguage);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(resources, stored)) {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState((prev) =>
      Object.prototype.hasOwnProperty.call(resources, nextLanguage) ? nextLanguage : prev,
    );
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  const contextValue = useMemo(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation(namespace, options) {
  return useI18nextTranslation(namespace, options);
}

export { i18n };
