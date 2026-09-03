/**
 * Sync all file dictionaries into UiCopy so DB overrides match uz/ru/en 100%.
 * Usage: npx tsx scripts/sync-ui-copy.ts
 */
import { PrismaClient } from "@prisma/client";
import { getDictionary } from "../lib/translations";

const prisma = new PrismaClient();

async function main() {
  const en = getDictionary("en");
  const ru = getDictionary("ru");
  const uz = getDictionary("uz");
  const keys = Object.keys(en);
  let upserted = 0;

  for (const key of keys) {
    const group = key.split(".")[0] || "general";
    const value = JSON.stringify({
      en: en[key] ?? "",
      ru: ru[key] ?? "",
      uz: uz[key] ?? "",
    });
    await prisma.uiCopy.upsert({
      where: { key },
      create: { key, group, value },
      update: { group, value },
    });
    upserted += 1;
  }

  console.log(`Synced ${upserted} UiCopy keys (en/ru/uz).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
