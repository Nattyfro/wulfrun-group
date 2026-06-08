import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
// config
import { defaultLocale } from '../config';
// locales
import {
  getTranslations,
  Locale,
  SUPPORTED_LOCALES,
  translateNavTitle,
  TranslationDictionary,
} from '../locales';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'wulfrun-locale';

type LocaleContextValue = {
  locale: Locale;
  translations: TranslationDictionary;
  setLocale: (locale: Locale) => void;
  t: <K extends keyof TranslationDictionary, S extends keyof TranslationDictionary[K]>(
    section: K,
    key: S
  ) => TranslationDictionary[K][S];
  translateNav: (title: string) => string;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  children: ReactNode;
};

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale as Locale;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  return defaultLocale as Locale;
}

export function LocaleProvider({ children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale as Locale);

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }
  }, []);

  const translations = useMemo(() => getTranslations(locale), [locale]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      translations,
      setLocale,
      t: (section, key) => translations[section][key],
      translateNav: (title) => translateNavTitle(title, locale),
    }),
    [locale, setLocale, translations]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
