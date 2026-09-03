import { getUiCopyMap } from "@/lib/db/queries";
import { pickLocale } from "@/lib/locale-map";
import { getDictionary } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

/** Merge file fallback + DB UiCopy for a locale */
export async function buildLocaleDict(locale: Locale): Promise<Record<string, string>> {
  const fallback = getDictionary(locale);
  const dict: Record<string, string> = { ...fallback };
  try {
    const map = await getUiCopyMap();
    for (const [key, raw] of Object.entries(map)) {
      const v = pickLocale(raw, locale);
      if (v) dict[key] = v;
    }
  } catch {
    /* DB unavailable — file fallback */
  }
  return dict;
}
