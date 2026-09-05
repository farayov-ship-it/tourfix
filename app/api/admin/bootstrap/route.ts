import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

/**
 * Bir martalik: admin + (ixtiyoriy) seed.
 * Header: x-bootstrap-secret = AUTH_SECRET
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-bootstrap-secret");
  const expected = process.env.AUTH_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ADMIN_EMAIL = "admin@turkuztan.uz";
  const ADMIN_PASSWORD = "admin123";
  const wantSeed = new URL(req.url).searchParams.get("seed") === "1";

  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    let admin = users.find((u) => u.email === ADMIN_EMAIL) ?? null;
    let action = "already_ok";

    if (!admin) {
      const legacy = users.find((u) => u.email === "admin@tourfix.uz");
      if (legacy) {
        admin = await prisma.adminUser.update({
          where: { id: legacy.id },
          data: { email: ADMIN_EMAIL },
          select: { id: true, email: true, role: true, passwordHash: true },
        });
        action = "migrated";
      }
    }

    if (!admin) {
      await prisma.adminUser.create({
        data: {
          email: ADMIN_EMAIL,
          passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
          name: "Owner",
          role: "owner",
        },
      });
      action = "created";
    } else {
      const matches = await bcrypt.compare(ADMIN_PASSWORD, admin.passwordHash);
      if (!matches) {
        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) },
        });
        action = "password_reset";
      }
    }

    let seeded = false;
    if (wantSeed) {
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execFileAsync = promisify(execFile);
      try {
        await execFileAsync("npx", ["tsx", "prisma/seed.ts"], {
          cwd: process.cwd(),
          env: process.env,
          timeout: 120_000,
        });
        seeded = true;
      } catch (seedErr) {
        // Serverless’da tsx/seed ishlamasligi mumkin — oddiy fallback
        const localeCount = await prisma.locale.count();
        if (localeCount === 0) {
          await prisma.locale.create({
            data: {
              code: "uz",
              name: "Uzbek",
              nativeName: "O'zbek",
              flag: "🇺🇿",
              enabled: true,
              isDefault: true,
              sortOrder: 0,
              dir: "ltr",
            },
          });
          await prisma.locale.create({
            data: {
              code: "en",
              name: "English",
              nativeName: "English",
              flag: "🇬🇧",
              enabled: true,
              isDefault: false,
              sortOrder: 1,
              dir: "ltr",
            },
          });
          await prisma.locale.create({
            data: {
              code: "ru",
              name: "Russian",
              nativeName: "Русский",
              flag: "🇷🇺",
              enabled: true,
              isDefault: false,
              sortOrder: 2,
              dir: "ltr",
            },
          });
        }
        return NextResponse.json({
          ok: true,
          action,
          email: ADMIN_EMAIL,
          seeded,
          seedError: seedErr instanceof Error ? seedErr.message : String(seedErr),
          locales: await prisma.locale.count(),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      action,
      email: ADMIN_EMAIL,
      seeded,
      users: (await prisma.adminUser.findMany({ select: { email: true } })).map((u) => u.email),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
