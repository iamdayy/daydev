# Repository guidance

## Commands and verification

- Use Bun (`bun@1.3.14` in `package.json`) and `bun.lock`; install from the root with `bun install --frozen-lockfile`.
- `bun run dev` starts Astro on port **5000** and the API on **8000**. For one app: `bun run --filter @daydev/astro dev` or `bun run --filter @daydev/api dev`.
- Root checks: `bun run typecheck`, `bun run test`, `bun run build`. Build only covers Astro; the API and shared-types have no build scripts. No lint/formatter scripts are configured.
- Use `bun run test`, not root `bun test`: Turbo dispatches to Bun tests in the API and Vitest in Astro. Astro's Vitest uses the Node environment and discovers only `src/**/*.test.ts`.
- Focused tests, from the root:
  - API: `bun run --filter @daydev/api test ./src/lib/http-error.test.ts`
  - Astro: `bun run --filter @daydev/astro test src/lib/markdown.test.ts`
  - API integration: `bun run --filter @daydev/api test:integration`
- The API's `test:unit` script targets nonexistent `src/tests/unit`; the actual unit test is under `src/lib/`. Use the focused command above or the full test script.
- Current API integration tests use `app.request()` without querying a database, but importing the app initializes Neon and requires a syntactically valid `DATABASE_URL`.

## Environment and database

- Configure root `.env` from `.env.example`. Astro explicitly loads it via `vite.envDir`. The workspace `.env` symlinks mentioned in the example are not provided; when running inside `apps/api`, use `bun --env-file=../../.env run <script>` or export the variables.
- `PUBLIC_API_URL` is mandatory for production Astro; only development falls back to `http://localhost:8000`. Add new inherited environment variables to `turbo.json`'s `globalEnv` when needed by Turbo tasks.
- API queries and migrations use **Neon HTTP** (`src/db/client.ts`), not a generic local Postgres driver. `DATABASE_SSL` appears in configuration but is not consumed by the implementation.
- Schema source: `apps/api/src/db/schema.ts`. `bun run db:generate` writes SQL and metadata into `apps/api/drizzle`; `bun run db:migrate` applies those migrations.
- Root `bun run db:seed` also schedules **both** `db:migrate` and `db:push`, without ordering those prerequisites. For explicit migration-then-seed: run `bun run db:migrate`, then `bun run --filter @daydev/api db:seed` (bypasses Turbo's seed prerequisites).
- Seeding currently only creates an admin when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set; existing emails are skipped. Content-seeding calls are commented out, so it neither populates the CMS nor resets an existing password.

## App wiring

- `apps/astro` hosts both the public site and `/admin` using Astro SSR on Vercel with React islands. Service pages are prerendered from `src/lib/services.ts`; blog content comes from the Hono API and Neon.
- API route assembly is `apps/api/src/app.ts`. `src/server.ts` starts the standalone Bun server; `src/index.ts` is the Vercel entrypoint and must retain its default export object with a bound `fetch` handler.
- `shared-types/src/index.ts` is hand-maintained: API DTOs, brand/WhatsApp constants, and formatting helpers. Both apps import its TypeScript source directly; there is no generated client or compilation step for this package.
- Admin islands call `apps/astro/src/components/admin/adminClient.ts`, which invokes the proxy in `src/actions/index.ts`. The JWT stays in Astro's server-side session (currently in-memory `lruCache`); the API separately checks the bearer token and a DB session. New admin endpoints used by islands must also be allowed in `src/lib/admin-paths.ts`.
- Uploads use `/admin/uploads/presign`, then a browser PUT directly to R2. The standalone API caps request bodies at 1 MiB.
- For UI changes, read `DESIGN.md` for visual direction and `apps/astro/src/styles/global.css` for Tailwind v4 tokens. The document's **CMS blog** section is stale: there is no Keystatic, `content/posts/`, or static blog fallback in this implementation.
