import de from './de';
import en from './en';
import fr from './fr';
import { Locale, TranslationDictionary } from './types';

export type { Locale, TranslationDictionary };

export const SUPPORTED_LOCALES: Locale[] = ['en', 'de', 'fr'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'https://zone-assets-api.vercel.app/assets/icons/flags/ic_flag_en.svg',
  de: 'https://zone-assets-api.vercel.app/assets/icons/flags/ic_flag_de.svg',
  fr: 'https://zone-assets-api.vercel.app/assets/icons/flags/ic_flag_fr.svg',
};

const translations: Record<Locale, TranslationDictionary> = {
  en,
  de,
  fr,
};

export function getTranslations(locale: Locale): TranslationDictionary {
  return translations[locale] || translations.en;
}

const NAV_TITLE_KEYS: Record<string, keyof TranslationDictionary['nav']> = {
  Home: 'home',
  'About Us': 'aboutUs',
  Portfolio: 'portfolio',
  'Case Study': 'caseStudy',
  Jobs: 'jobs',
  Job: 'job',
  'Blog Posts': 'blogPosts',
  'Blog Post': 'blogPost',
  About: 'about',
  Contact: 'contact',
  Services: 'services',
  'Case Studies': 'caseStudies',
  Courses: 'courses',
  Course: 'course',
  Tours: 'tours',
  Tour: 'tour',
  Checkout: 'checkout',
  'Checkout Complete': 'checkoutComplete',
  Login: 'login',
  'Login Cover': 'loginCover',
  Register: 'register',
  'Register Cover': 'registerCover',
  'Reset Password': 'resetPassword',
  'Verify Code': 'verifyCode',
  '404 Error': 'error404',
  '500 Error': 'error500',
  Maintenance: 'maintenance',
  'Pricing 01': 'pricing01',
  'Pricing 02': 'pricing02',
  Common: 'common',
};

export function translateNavTitle(title: string, locale: Locale): string {
  const key = NAV_TITLE_KEYS[title];
  if (!key) return title;
  return getTranslations(locale).nav[key];
}
