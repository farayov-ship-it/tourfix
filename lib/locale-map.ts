/** LocaleMap: { [localeCode]: string } stored as JSON in DB */

export type LocaleMap = Record<string, string>;

export function parseLocaleMap(raw: string | null | undefined): LocaleMap {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as LocaleMap) : {};
  } catch {
    return {};
  }
}

export function stringifyLocaleMap(map: LocaleMap): string {
  return JSON.stringify(map ?? {});
}

export function pickLocale(
  map: LocaleMap | string | null | undefined,
  code: string,
  fallback = "en"
): string {
  const m = typeof map === "string" ? parseLocaleMap(map) : map ?? {};
  if (m[code]?.trim()) return m[code];
  if (m[fallback]?.trim()) return m[fallback];
  const first = Object.values(m).find((v) => v?.trim());
  return first ?? "";
}

export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function parseLocaleStringArrays(
  raw: string | null | undefined
): Record<string, string[]> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object") return {};
    const out: Record<string, string[]> = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = Array.isArray(val) ? val.map(String) : [];
    }
    return out;
  } catch {
    return {};
  }
}

export function pickLocaleList(
  map: Record<string, string[]> | string | null | undefined,
  code: string,
  fallback = "en"
): string[] {
  const m =
    typeof map === "string" ? parseLocaleStringArrays(map) : map ?? {};
  if (m[code]?.length) return m[code];
  if (m[fallback]?.length) return m[fallback];
  const first = Object.values(m).find((v) => v?.length);
  return first ?? [];
}

export const MAX_ENABLED_LOCALES = 15;
