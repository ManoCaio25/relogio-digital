import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en';
import pt from './pt';

const STORAGE_KEY = 'language';
const translations = { en, pt };

function getNestedTranslation(language, key) {
  const source = translations[language] || translations.en;
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), source);
}

function interpolate(template, values) {
  if (!template || !values) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, token) => {
    const valueKey = token.trim();
    return Object.prototype.hasOwnProperty.call(values, valueKey)
      ? values[valueKey]
      : `{{${valueKey}}}`;
  });
}

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback, values) => interpolate(fallback ?? key, values),
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const changeLanguage = React.useCallback((next) => {
    setLanguage((prev) => {
      const nextLanguage = translations[next] ? next : prev;
      localStorage.setItem(STORAGE_KEY, nextLanguage);
      return nextLanguage;
    });
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage: changeLanguage,
    t: (key, fallback, values) => {
      const message = getNestedTranslation(language, key) ?? fallback ?? key;
      if (typeof message === 'string') {
        return interpolate(message, values);
      }
      return message;
    },
  }), [language, changeLanguage]);

  return React.createElement(LanguageContext.Provider, { value }, children);
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}

export { translations };
