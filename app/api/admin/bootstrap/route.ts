import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

/**
 * Bir martalik admin tiklash.
 * Header: x-bootstrap-secret = AUTH_SECRET
 * Keyin o‘chiriladi.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-bootstrap-secret");
  const expected = process.env.AUTH_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ADMIN_EMAIL = "admin@turkuztan.uz";
  const ADMIN_PASSWORD = "admin123";

  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    let admin = users.find((u) => u.email === ADMIN_EMAIL) ?? null;

    if (!admin) {
      const legacy = users.find((u) => u.email === "admin@tourfix.uz");
      if (legacy) {
        admin = await prisma.adminUser.update({
          where: { id: legacy.id },
          data: { email: ADMIN_EMAIL },
          select: { id: true, email: true, role: true, passwordHash: true },
        });
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
      return NextResponse.json({
        ok: true,
        action: "created",
        email: ADMIN_EMAIL,
        users: users.map((u) => u.email),
      });
    }

    const matches = await bcrypt.compare(ADMIN_PASSWORD, admin.passwordHash);
    if (!matches) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) },
      });
      return NextResponse.json({
        ok: true,
        action: "password_reset",
        email: ADMIN_EMAIL,
        users: users.map((u) => u.email),
      });
    }

    return NextResponse.json({
      ok: true,
      action: "already_ok",
      email: ADMIN_EMAIL,
      users: users.map((u) => u.email),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
