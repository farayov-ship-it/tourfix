# TurkUztan Admin Panel

## Tezkor start

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run prod
```

- Sayt (local): http://localhost:3001/uz
- Admin (local): http://localhost:3001/admin/login
- Production domen: **http://turkuztan.uz/**

**Default login**
- Owner: `admin@turkuztan.uz` / `admin123`
- Editor: `editor@turkuztan.uz` / `editor123`

Parol ishlamasa: `npx tsx scripts/ensure-admin.ts`

## Sozlamalar qayerda?

| Nima | Qayerda |
|------|---------|
| WhatsApp / Telegram / Email / Instagram | Admin → Sozlamalar |
| Telegram Bot token + webhook secret | Admin → Sozlamalar |
| Media driver (local/s3) | Admin → Sozlamalar |
| Admin/editor email & parol | Admin → Users |
| `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` | faqat `.env` (server) |

`.env` da:

```
AUTH_URL=http://turkuztan.uz
NEXT_PUBLIC_SITE_URL=http://turkuztan.uz
```

## Stack

- SQLite + Prisma (local). Production uchun `DATABASE_URL` ni PostgreSQL ga o‘zgartiring va `schema.prisma` da `provider = "postgresql"` qiling.
- Auth.js (Credentials) — owner / editor
- Media: local → `public/uploads/`
- Telegram webhook: `http://turkuztan.uz/api/telegram/webhook` (HTTPS tavsiya)

## Scriptlar

- `npm run db:push` — schema sync
- `npm run db:seed` — seed
- `npm run db:studio` — Prisma Studio
- `npm run prod` — production build + start
