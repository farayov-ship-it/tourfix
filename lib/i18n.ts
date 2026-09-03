/** Dynamic locales — codes come from DB; type is string for up to 15 languages */

export type Locale = string;

/** Seed / fallback codes when DB unavailable at build */
export const fallbackLocaleCodes: Locale[] = [
  "en",
  "ru",
  "uz",
  "de",
  "fr",
  "it",
  "ko",
  "ja",
  "zh",
  "ar",
  "tr",
  "kk",
  "ky",
  "tg",
  "tk",
];

export const locales = fallbackLocaleCodes;
export const defaultLocale: Locale = "en";

export function isValidLocale(locale: string): boolean {
  return fallbackLocaleCodes.includes(locale) || /^[a-z]{2,5}$/.test(locale);
}

export const localeNames: Record<string, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbek",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
  ar: "العربية",
  tr: "Türkçe",
  kk: "Қазақша",
  ky: "Кыргызча",
  tg: "Тоҷикӣ",
  tk: "Türkmençe",
};

export const localeFlags: Record<string, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  uz: "🇺🇿",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  ko: "🇰🇷",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ar: "🇸🇦",
  tr: "🇹🇷",
  kk: "🇰🇿",
  ky: "🇰🇬",
  tg: "🇹🇯",
  tk: "🇹🇲",
};
