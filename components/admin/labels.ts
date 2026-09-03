/** Admin UI — o‘zbekcha yorliqlar */

export const STATUS_OPTIONS = [
  { value: "draft", label: "Qoralama" },
  { value: "published", label: "Nashr qilingan" },
  { value: "archived", label: "Arxiv" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "economy", label: "Ekonom" },
  { value: "comfort", label: "Komfort" },
  { value: "premium", label: "Premium" },
  { value: "suv", label: "SUV" },
  { value: "minivan", label: "Minivan" },
  { value: "van", label: "Mikroavtobus" },
] as const;

export const LOCALE_LABELS: Record<string, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
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

/** Asosiy tillar tabda birinchi */
export const PRIMARY_LOCALES = ["uz", "ru", "en"];

export function statusLabel(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export function categoryLabel(value: string) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
