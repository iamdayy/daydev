# daydev

Website resmi **DayDev Studio** — https://daydev.studio

Monorepo situs perusahaan + panel admin + API, dibangun dengan Bun workspaces dan Turborepo.

## Fitur

- Situs perusahaan DayDev Studio (layanan, proyek, dan profil studio)
- Panel admin untuk manajemen konten, foto tim (TeamManager), dan guestbook
- API untuk kebutuhan situs dan admin
- Upload dan penyimpanan file ke Cloudflare R2
- Integrasi aktivitas GitHub

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | Astro |
| API | Hono |
| Database | Neon Postgres + Drizzle ORM |
| Storage | Cloudflare R2 |
| Bahasa | TypeScript |
| Monorepo | Bun workspaces, Turborepo |

## Struktur

```
apps/
  api/           # API Hono
  astro/         # Frontend Astro (+ panel admin)
shared-types/    # Tipe bersama
DESIGN.md        # Panduan desain situs
AGENTS.md        # Panduan pengembangan
```

## Cara Menjalankan

```bash
bun install
cp .env.example .env   # isi kredensial Neon dan R2
bun run dev            # menjalankan semua aplikasi (turbo run dev)
```

Perintah lain:

```bash
bun run build       # Build semua aplikasi
bun run typecheck   # Typecheck
bun run test        # Menjalankan test
bun run db:generate # Generate migrasi Drizzle
bun run db:push     # Push skema ke database
bun run db:migrate  # Jalankan migrasi
bun run db:seed     # Isi data awal
bun run db:studio   # Buka Drizzle Studio
```

## Demo Live

- https://daydev.studio

## Lisensi

MIT
