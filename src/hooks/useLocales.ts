import { useContext } from 'react';
// config
import { defaultLocale } from '../config';
// contexts
import { LocaleContext } from '../contexts/LocaleContext';
// locales
import { getTranslations, Locale, translateNavTitle } from '../locales';

// ----------------------------------------------------------------------

const fallbackLocale = defaultLocale as Locale;

const fallbackContext = {
  locale: fallbackLocale,
  translations: getTranslations(fallbackLocale),
  setLocale: () => undefined,
  t: <K extends keyof ReturnType<typeof getTranslations>, S extends keyof ReturnType<typeof getTranslations>[K]>(
    section: K,
    key: S
  ) => getTranslations(fallbackLocale)[section][key],
  translateNav: (title: string) => translateNavTitle(title, fallbackLocale),
};

export default function useLocales() {
  const context = useContext(LocaleContext);
  return context || fallbackContext;
}
