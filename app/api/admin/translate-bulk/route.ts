import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { parseLocaleMap, stringifyLocaleMap } from "@/lib/locale-map";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "en";
  const to = searchParams.get("to") || "";
  const mode = searchParams.get("mode") || "empty";
  if (!to) return NextResponse.json({ error: "to kerak" }, { status: 400 });

  const rows = await prisma.uiCopy.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  const items = rows
    .map((row) => {
      const value = parseLocaleMap(row.value);
      return { id: row.id, key: row.key, value };
    })
    .filter((row) => {
      const src = (row.value[from] || "").trim();
      if (!src) return false;
      if (mode === "empty") return !(row.value[to] || "").trim();
      return true;
    });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; locale?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = String(body.id || "");
  const locale = String(body.locale || "");
  const text = String(body.text || "");
  if (!id || !locale || !text.trim()) {
    return NextResponse.json({ error: "id, locale, text majburiy" }, { status: 400 });
  }

  const row = await prisma.uiCopy.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const map = parseLocaleMap(row.value);
  map[locale] = text.trim();
  await prisma.uiCopy.update({
    where: { id },
    data: { value: stringifyLocaleMap(map) },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "translate",
      entity: "UiCopy",
      entityId: id,
      diff: JSON.stringify({ locale }),
    },
  });

  revalidatePath("/", "layout");
  revalidateTag("content");

  return NextResponse.json({ ok: true });
}
