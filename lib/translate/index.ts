import { prisma } from "@/lib/db/prisma";

export type TranslateProvider = "google" | "mymemory" | "deepl" | "libre";

export type TranslateConfig = {
  provider: TranslateProvider;
  apiKey: string;
  apiUrl: string;
};

/** Map our locale codes → provider language codes */
export function toProviderLang(code: string, provider: TranslateProvider): string {
  const c = code.toLowerCase();
  if (provider === "deepl") {
    const deepl: Record<string, string> = {
      en: "EN",
      ru: "RU",
      de: "DE",
      fr: "FR",
      it: "IT",
      ja: "JA",
      zh: "ZH",
      ko: "KO",
      ar: "AR",
      tr: "TR",
      uk: "UK",
      pt: "PT",
      es: "ES",
      pl: "PL",
    };
    return deepl[c] || c.toUpperCase();
  }
  if (c === "zh") return "zh-CN";
  return c;
}

export async function getTranslateConfig(): Promise<TranslateConfig> {
  const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const provider = (s?.translationProvider || "google") as TranslateProvider;
  return {
    provider: ["google", "mymemory", "deepl", "libre"].includes(provider) ? provider : "google",
    apiKey: s?.translationApiKey || "",
    apiUrl: s?.translationApiUrl || "",
  };
}

async function translateGoogle(text: string, from: string, to: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", from);
  url.searchParams.set("tl", to);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Mozilla/5.0 TourFixAdmin/1.0" },
  });
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const data = (await res.json()) as unknown;
  // [[ ["translated", "source", ...], ...], ...]
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Google translate: unexpected response");
  }
  return (data[0] as unknown[])
    .map((chunk) => (Array.isArray(chunk) ? String(chunk[0] ?? "") : ""))
    .join("");
}

async function translateMyMemory(text: string, from: string, to: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 500));
  url.searchParams.set("langpair", `${from}|${to}`);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error("MyMemory: translation failed");
  }
  return data.responseData.translatedText;
}

async function translateDeepL(
  text: string,
  from: string,
  to: string,
  apiKey: string,
): Promise<string> {
  if (!apiKey) throw new Error("DeepL API kaliti Sozlamalarda yo‘q");
  const free = apiKey.endsWith(":fx");
  const endpoint = free
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
  const body = new URLSearchParams();
  body.set("text", text);
  body.set("target_lang", to);
  if (from && from !== "auto") body.set("source_lang", from);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL HTTP ${res.status}: ${err.slice(0, 120)}`);
  }
  const data = (await res.json()) as { translations?: { text: string }[] };
  const out = data.translations?.[0]?.text;
  if (!out) throw new Error("DeepL: empty result");
  return out;
}

async function translateLibre(
  text: string,
  from: string,
  to: string,
  apiUrl: string,
  apiKey: string,
): Promise<string> {
  const base = (apiUrl || "https://libretranslate.com").replace(/\/$/, "");
  const res = await fetch(`${base}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: "text",
      api_key: apiKey || undefined,
    }),
  });
  if (!res.ok) throw new Error(`LibreTranslate HTTP ${res.status}`);
  const data = (await res.json()) as { translatedText?: string };
  if (!data.translatedText) throw new Error("LibreTranslate: empty result");
  return data.translatedText;
}

export async function translateText(
  text: string,
  fromCode: string,
  toCode: string,
  config?: TranslateConfig,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (fromCode === toCode) return text;

  const cfg = config ?? (await getTranslateConfig());
  const from = toProviderLang(fromCode, cfg.provider);
  const to = toProviderLang(toCode, cfg.provider);

  switch (cfg.provider) {
    case "deepl":
      return translateDeepL(trimmed, from, to, cfg.apiKey);
    case "libre":
      return translateLibre(trimmed, from, to, cfg.apiUrl, cfg.apiKey);
    case "mymemory":
      return translateMyMemory(trimmed, from, to);
    case "google":
    default:
      return translateGoogle(trimmed, from, to);
  }
}

export async function translateToMany(
  text: string,
  fromCode: string,
  targets: string[],
  config?: TranslateConfig,
): Promise<Record<string, string>> {
  const cfg = config ?? (await getTranslateConfig());
  const out: Record<string, string> = {};
  for (const to of targets) {
    if (!to || to === fromCode) continue;
    try {
      out[to] = await translateText(text, fromCode, to, cfg);
      // soft rate-limit
      await new Promise((r) => setTimeout(r, 120));
    } catch (e) {
      out[to] = "";
      console.error(`[translate] ${fromCode}→${to}:`, e);
    }
  }
  return out;
}
