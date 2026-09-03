import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTranslateConfig, translateToMany, translateText } from "@/lib/translate";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    text?: string;
    from?: string;
    to?: string;
    targets?: string[];
    fillEmptyOnly?: boolean;
    existing?: Record<string, string>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = String(body.text || "").trim();
  const from = String(body.from || "").trim();
  if (!text || !from) {
    return NextResponse.json({ error: "text va from majburiy" }, { status: 400 });
  }

  try {
    const config = await getTranslateConfig();

    // Single target
    if (body.to && !body.targets?.length) {
      const translated = await translateText(text, from, String(body.to), config);
      return NextResponse.json({ translated, provider: config.provider });
    }

    const targets = (body.targets || []).map(String).filter(Boolean);
    if (!targets.length) {
      return NextResponse.json({ error: "targets yoki to kerak" }, { status: 400 });
    }

    let list = targets.filter((t) => t !== from);
    if (body.fillEmptyOnly && body.existing) {
      list = list.filter((t) => !String(body.existing?.[t] || "").trim());
    }

    if (!list.length) {
      return NextResponse.json({ translations: {}, provider: config.provider, skipped: true });
    }

    const translations = await translateToMany(text, from, list, config);
    return NextResponse.json({ translations, provider: config.provider });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Tarjima xatosi";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
