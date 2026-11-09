# AGENTS.md — Repository Guidance

These instructions apply to coding agents working in this repository. Read DESIGN.md before changing public-facing UI. DESIGN.md governs visual direction; this file governs engineering workflow and repository safety.

## Project overview

Daydev Studio is a Bun/Turborepo monorepo:
- apps/astro: Astro 5 public website and /admin, with React islands and Tailwind CSS v4.
- apps/api: Hono API.
- shared-types: hand-maintained TypeScript contracts, DTOs, constants, and helpers.
- Database: Neon Postgres, accessed through Neon HTTP.
- Object storage: Cloudflare R2.
- Deployment: Vercel.

Do not assume this is a Next.js application. Do not introduce Next.js routing, app router conventions, or a framework migration as part of a visual redesign.

## Source of truth

Before implementation:
1. Read DESIGN.md.
2. Inspect the relevant route, layout, component, styles, data model, and API.
3. Check current package scripts and dependencies.
4. Treat actual code and tests as authoritative for implementation behavior.
5. If documentation is stale, update it only when the task includes documentation changes; otherwise report the discrepancy.

Do not assume that a planned page or feature already exists.

## Commands and verification

- Use Bun (packageManager is bun@1.3.14) and bun.lock.
- Install from the repository root with: bun install --frozen-lockfile
- Root development: bun run dev.
- Astro only: bun run --filter @daydev/astro dev.
- API only: bun run --filter @daydev/api dev.
- Root checks: bun run typecheck, bun run test, bun run build.
- Build currently covers Astro; API and shared-types do not have build scripts.
- No root lint or formatter scripts are currently configured. Do not claim lint passed unless a real lint script/tool was run.
- Use bun run test, not root bun test. Turbo dispatches to Bun tests in API and Vitest in Astro.
- Astro Vitest uses Node environment and discovers src/**/*.test.ts.
- Focused tests:
  - API: bun run --filter @daydev/api test ./src/lib/http-error.test.ts
  - Astro: bun run --filter @daydev/astro test src/lib/markdown.test.ts
  - API integration: bun run --filter @daydev/api test:integration
- The API test:unit script currently targets a nonexistent src/tests/unit directory. Prefer the focused test path or full root test command.
- API integration tests import the app, which initializes Neon and requires a syntactically valid DATABASE_URL even when app.request() does not query the database.

## Environment and database

- Configure root .env from .env.example.
- Astro explicitly loads the root environment through vite.envDir.
- PUBLIC_API_URL is mandatory for production Astro; only development falls back to http://localhost:8000.
- Add newly inherited environment variables to turbo.json globalEnv when needed by Turbo tasks.
- API queries and migrations use Neon HTTP in apps/api/src/db/client.ts, not a generic local Postgres driver.
- Schema source: apps/api/src/db/schema.ts.
- bun run db:generate writes SQL and metadata into apps/api/drizzle.
- Root bun run db:seed schedules both db:migrate and db:push without ordering those prerequisites. For explicit migration then seed: run bun run db:migrate, then bun run --filter @daydev/api db:seed.
- Seeding creates an admin only when ADMIN_EMAIL and ADMIN_PASSWORD are set; existing emails are skipped. Content-seeding calls are currently commented out.

## App wiring and data flow

- apps/astro hosts both the public site and /admin using Astro SSR on Vercel with React islands.
- Service pages are prerendered from apps/astro/src/lib/services.ts.
- Blog content is loaded from the Hono API and Neon. Do not replace this with Keystatic or a static content directory without explicit approval.
- API route assembly is apps/api/src/app.ts.
- apps/api/src/server.ts starts the standalone Bun server.
- apps/api/src/index.ts is the Vercel entrypoint and must retain its default export object with a bound fetch handler.
- shared-types/src/index.ts is hand-maintained and includes API DTOs, brand/WhatsApp constants, and formatting helpers. Both apps import this TypeScript source directly.
- Admin islands use apps/astro/src/components/admin/adminClient.ts and the proxy in apps/astro/src/actions/index.ts.
- The JWT remains in Astro's server-side session (currently in-memory lruCache); the API separately checks the bearer token and a DB session.
- New admin endpoints used by islands must also be allowed in apps/astro/src/lib/admin-paths.ts.
- Uploads use /admin/uploads/presign, followed by a browser PUT directly to R2.
- The standalone API caps request bodies at 1 MiB.

## UI implementation rules

- Read DESIGN.md and apps/astro/src/styles/global.css before public UI changes.
- Keep the public website shell separate from the /admin shell. Do not accidentally apply public navigation or theme assumptions to admin pages.
- Preserve Astro file-based routing and existing route URLs.
- Reuse Base.astro, Header.astro, Footer.astro, ThemeScript.astro, ThemeToggle.astro, existing sections, and project/service components when appropriate. Audit them before replacing them.
- The approved redesign uses a hybrid sidebar + main content layout on desktop, responsive navigation on tablet/mobile, studio-personal identity, and light-first theme with orange brand accent.
- Keep dark mode functional if it already exists; do not remove theme persistence or initialization behavior.
- Use Astro components for static/server-rendered UI by default. Use React islands only when client-side interaction or an existing React integration requires them.
- Avoid adding client JavaScript to static content.
- Use existing lucide-react dependency for icons. Do not add another icon package without a concrete reason.
- Use existing local fonts unless a deliberate font change is approved.
- Centralize design tokens in global.css; avoid scattered arbitrary hex values.
- Prefer semantic HTML, accessible labels, keyboard operation, visible focus, and reduced-motion support.
- Preserve loading, empty, and error states for API-backed content.
- Do not fabricate testimonials, metrics, GitHub activity, project status, client names, or project outcomes.
- Use Indonesian as the default public language. Do not invent a localization framework; inspect the current route and content setup first.
- Pricing: preserve the existing /pricing route and inspect its calculator/data. Do not publish fixed prices or guarantee a quote before consultation unless the user explicitly changes this policy.

## Data integrity and security

- Never expose secrets, environment values, session tokens, or private admin data in client-side code.
- Do not bypass existing server-side validation or admin authorization.
- Do not call the database directly from browser components.
- Preserve API DTO contracts in shared-types unless a coordinated API change is required.
- Validate untrusted form input on the server.
- Preserve R2 presign flow and upload constraints.
- Avoid destructive database migrations or content deletion without explicit approval.
- Never replace real API-backed data with hardcoded demo data while presenting it as live.

## Change management

- Inspect git status and current branch before editing.
- Do not overwrite unrelated user changes.
- Keep changes scoped to the requested task.
- Do not add dependencies unless necessary; explain why if added.
- Preserve existing route compatibility. If a route must change, add redirects and explain the migration.
- Make incremental, reviewable changes.
- Do not commit, push, or deploy unless explicitly requested.
- When changing design tokens, check components that depend on those tokens, including theme toggle and contrast states.

## Redesign workflow

For a website redesign:
1. Audit the existing public routes, layouts, navigation, global styles, and key components.
2. Map existing routes to the approved information architecture.
3. Identify reusable components and behavior that must be preserved.
4. Propose the smallest safe implementation plan.
5. Implement the shared shell and design tokens first.
6. Implement pages in this order: homepage, portfolio, project detail only if supported by data/routing, services, pricing, contact, about, activity, blog enhancements.
7. Keep /admin separate and regression-test its layout and authentication flow.
8. Validate responsive behavior and accessibility.
9. Run relevant tests and production build.
10. Report completed work, tests, remaining gaps, and any assumptions.

## Verification checklist

Before declaring completion:
- Run bun run typecheck.
- Run bun run test.
- Run bun run build.
- Test all affected public routes.
- Test /admin separately if shared layout or global CSS changed.
- Verify desktop, tablet, and mobile navigation.
- Verify theme initialization and toggle behavior.
- Verify CTA destinations, forms, and API-backed loading/error/empty states.
- Check browser console and network errors where browser testing is available.
- Check for horizontal overflow and keyboard traps.
- State exactly which checks passed, failed, or could not be run.

## Final report format

Provide:
1. Summary of changes.
2. Files created, modified, and deleted.
3. Routes affected.
4. Existing functionality preserved or changed.
5. Tests and commands executed with outcomes.
6. Known issues and unimplemented items.
7. Any assumptions requiring owner confirmation.
