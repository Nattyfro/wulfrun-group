import { Locale } from './types';

export type LocaleOption = {
  code: Locale;
  label: string;
  native: string;
  emoji: string;
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'en', label: 'English', native: 'English', emoji: '🇬🇧' },
  { code: 'de', label: 'German', native: 'Deutsch', emoji: '🇩🇪' },
  { code: 'fr', label: 'French', native: 'Français', emoji: '🇫🇷' },
  { code: 'es', label: 'Spanish', native: 'Español', emoji: '🇪🇸' },
  { code: 'it', label: 'Italian', native: 'Italiano', emoji: '🇮🇹' },
  { code: 'pl', label: 'Polish', native: 'Polski', emoji: '🇵🇱' },
  { code: 'pt', label: 'Portuguese', native: 'Português', emoji: '🇵🇹' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands', emoji: '🇳🇱' },
  { code: 'ro', label: 'Romanian', native: 'Română', emoji: '🇷🇴' },
  { code: 'ua', label: 'Ukrainian', native: 'Українська', emoji: '🇺🇦' },
  { code: 'ru', label: 'Russian', native: 'Русский', emoji: '🇷🇺' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', emoji: '🇹🇷' },
  { code: 'ar', label: 'Arabic', native: 'العربية', emoji: '🇸🇦' },
  { code: 'ur', label: 'Urdu', native: 'اردو', emoji: '🇵🇰' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', emoji: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', emoji: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', emoji: '🇧🇩' },
  { code: 'zh', label: 'Chinese', native: '中文', emoji: '🇨🇳' },
  { code: 'ja', label: 'Japanese', native: '日本語', emoji: '🇯🇵' },
  { code: 'ko', label: 'Korean', native: '한국어', emoji: '🇰🇷' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', emoji: '🇻🇳' },
  { code: 'th', label: 'Thai', native: 'ไทย', emoji: '🇹🇭' },
  { code: 'lt', label: 'Lithuanian', native: 'Lietuvių', emoji: '🇱🇹' },
  { code: 'lv', label: 'Latvian', native: 'Latviešu', emoji: '🇱🇻' },
  { code: 'cs', label: 'Czech', native: 'Čeština', emoji: '🇨🇿' },
  { code: 'sk', label: 'Slovak', native: 'Slovenčina', emoji: '🇸🇰' },
  { code: 'hu', label: 'Hungarian', native: 'Magyar', emoji: '🇭🇺' },
  { code: 'bg', label: 'Bulgarian', native: 'Български', emoji: '🇧🇬' },
  { code: 'el', label: 'Greek', native: 'Ελληνικά', emoji: '🇬🇷' },
  { code: 'sv', label: 'Swedish', native: 'Svenska', emoji: '🇸🇪' },
  { code: 'da', label: 'Danish', native: 'Dansk', emoji: '🇩🇰' },
  { code: 'no', label: 'Norwegian', native: 'Norsk', emoji: '🇳🇴' },
  { code: 'fi', label: 'Finnish', native: 'Suomi', emoji: '🇫🇮' },
  { code: 'he', label: 'Hebrew', native: 'עברית', emoji: '🇮🇱' },
  { code: 'hr', label: 'Croatian', native: 'Hrvatski', emoji: '🇭🇷' },
  { code: 'bs', label: 'Bosnian', native: 'Bosanski', emoji: '🇧🇦' },
];

export const SUPPORTED_LOCALES: Locale[] = LOCALE_OPTIONS.map((option) => option.code);

export const TRANSLATED_LOCALES: Locale[] = SUPPORTED_LOCALES;

export const RTL_LOCALES: Locale[] = ['ar', 'ur', 'he'];

export const LOCALE_LABELS = Object.fromEntries(
  LOCALE_OPTIONS.map((option) => [option.code, option.label])
) as Record<Locale, string>;

export const LOCALE_NATIVE_LABELS = Object.fromEntries(
  LOCALE_OPTIONS.map((option) => [option.code, option.native])
) as Record<Locale, string>;

export const LOCALE_EMOJIS = Object.fromEntries(
  LOCALE_OPTIONS.map((option) => [option.code, option.emoji])
) as Record<Locale, string>;

export function filterLocales(query: string): Locale[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return SUPPORTED_LOCALES;

  return LOCALE_OPTIONS.filter((option) => {
    const searchTerms = [option.code, option.label, option.native].map((term) =>
      term.toLowerCase()
    );

    return searchTerms.some((term) => term.includes(normalized));
  }).map((option) => option.code);
}
