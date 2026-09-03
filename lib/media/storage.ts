import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db/prisma";

export type UploadedMedia = { url: string; key: string; mime?: string };

export interface MediaStorage {
  upload(file: {
    buffer: Buffer;
    filename: string;
    mime?: string;
  }): Promise<UploadedMedia>;
  delete(key: string): Promise<void>;
}

class LocalMediaStorage implements MediaStorage {
  private dir = path.join(process.cwd(), "public", "uploads");

  async upload(file: {
    buffer: Buffer;
    filename: string;
    mime?: string;
  }): Promise<UploadedMedia> {
    await mkdir(this.dir, { recursive: true });
    const ext = path.extname(file.filename) || ".jpg";
    const key = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    await writeFile(path.join(this.dir, key), file.buffer);
    return { url: `/uploads/${key}`, key, mime: file.mime };
  }

  async delete(key: string): Promise<void> {
    const safe = path.basename(key);
    try {
      await unlink(path.join(this.dir, safe));
    } catch {
      /* ignore missing */
    }
  }
}

class S3MediaStorage implements MediaStorage {
  async upload(): Promise<UploadedMedia> {
    throw new Error(
      "S3 media adapter hali sozlanmagan. Admin → Sozlamalar → mediaDriver = local qiling."
    );
  }
  async delete(): Promise<void> {
    /* no-op until configured */
  }
}

export async function getMediaStorage(): Promise<MediaStorage> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (s?.mediaDriver === "s3") return new S3MediaStorage();
  } catch {
    /* fall through */
  }
  const envDriver = process.env.MEDIA_DRIVER ?? "local";
  if (envDriver === "s3") return new S3MediaStorage();
  return new LocalMediaStorage();
}
