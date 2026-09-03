import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getMediaStorage } from "@/lib/media/storage";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type && !allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid mime" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = await getMediaStorage();
  const uploaded = await storage.upload({
    buffer,
    filename: file.name || "upload.jpg",
    mime: file.type,
  });

  const asset = await prisma.mediaAsset.create({
    data: {
      url: uploaded.url,
      key: uploaded.key,
      mime: uploaded.mime,
      alt: "{}",
    },
  });

  return NextResponse.json(asset);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(items);
}
