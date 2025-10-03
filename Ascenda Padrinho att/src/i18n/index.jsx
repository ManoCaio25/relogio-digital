import React from "react";
import en from "./translations/en";
import pt from "./translations/pt";

const STORAGE_KEY = "ascenda-language";
const resources = { en, pt };
const fallbackLanguage = "en";

const LanguageContext = React.createContext({
  language: fallbackLanguage,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, options) => options?.defaultValue ?? key,
});

function resolvePath(dictionary, key) {
  return key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), dictionary);
}

function formatValue(value, options = {}) {
  if (typeof value === "function") {
    return value(options);
  }

  if (typeof value === "string") {
    return value.replace(/{{(.*?)}}/g, (_, token) => {
      const trimmed = token.trim();
      if (trimmed === "suffix") {
        const count = Number(options.count ?? options.value ?? 0);
        return count === 1 ? "" : options.suffix ?? "s";
      }
      if (trimmed === "value" && options.value !== undefined) {
        return String(options.value);
      }
      if (options[trimmed] !== undefined) {
        return String(options[trimmed]);
      }
      return "";
    });
  }

  if (value == null) {
    return undefined;
  }

  return value;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && resources[stored]) {
        return stored;
      }
    }
    return fallbackLanguage;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const changeLanguage = React.useCallback((next) => {
    if (resources[next]) {
      setLanguage(next);
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "pt" : "en"));
  }, []);

  const translate = React.useCallback(
    (key, options = {}) => {
      const langs = [language, fallbackLanguage];

      for (const lang of langs) {
        const dictionary = resources[lang];
        const value = resolvePath(dictionary, key);
        if (value !== undefined) {
          const formatted = formatValue(value, options);
          if (formatted !== undefined) {
            return formatted;
          }
        }
      }

      return options.defaultValue ?? key;
    },
    [language]
  );

  const contextValue = React.useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      toggleLanguage,
      t: translate,
    }),
    [language, changeLanguage, toggleLanguage, translate]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
