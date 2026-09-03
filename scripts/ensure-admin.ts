import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();
const ADMIN_EMAIL = "admin@turkuztan.uz";

async function main() {
  const users = await p.adminUser.findMany();
  console.log(
    "users:",
    users.map((x) => ({ email: x.email, role: x.role }))
  );

  // Migrate eski email
  const legacy = await p.adminUser.findUnique({ where: { email: "admin@tourfix.uz" } });
  if (legacy) {
    await p.adminUser.update({
      where: { id: legacy.id },
      data: { email: ADMIN_EMAIL },
    });
    console.log("migrated admin@tourfix.uz →", ADMIN_EMAIL);
  }
  const legacyEditor = await p.adminUser.findUnique({ where: { email: "editor@tourfix.uz" } });
  if (legacyEditor) {
    await p.adminUser.update({
      where: { id: legacyEditor.id },
      data: { email: "editor@turkuztan.uz" },
    });
    console.log("migrated editor@tourfix.uz → editor@turkuztan.uz");
  }

  const a = await p.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!a) {
    console.log("NO ADMIN — creating");
    const passwordHash = await bcrypt.hash("admin123", 10);
    await p.adminUser.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash,
        name: "Owner",
        role: "owner",
      },
    });
    console.log("created", ADMIN_EMAIL, "/ admin123");
  } else {
    const ok = await bcrypt.compare("admin123", a.passwordHash);
    console.log("password admin123 matches:", ok);
    if (!ok) {
      await p.adminUser.update({
        where: { id: a.id },
        data: { passwordHash: await bcrypt.hash("admin123", 10) },
      });
      console.log("password reset to admin123");
    }
  }

  await p.siteSettings.updateMany({
    data: {
      email: "hello@turkuztan.uz",
      telegram: "turkuztan_uz",
      instagram: "turkuztan_uz",
    },
  });
  console.log("site contacts → turkuztan.uz");
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
