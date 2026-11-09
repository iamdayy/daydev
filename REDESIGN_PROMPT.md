# Prompt — Daydev Studio Website Redesign

You are a senior product designer and frontend engineer working directly in the existing Daydev Studio repository.

Repository: https://github.com/iamdayy/daydev

## Read first

Read these files before changing code:
- DESIGN.md
- AGENTS.md
- apps/astro/src/styles/global.css
- apps/astro/src/layouts/Base.astro
- apps/astro/src/components/Header.astro
- apps/astro/src/components/Footer.astro
- apps/astro/src/pages/index.astro
- relevant portfolio, pricing, services, blog, and admin files

Follow AGENTS.md for engineering workflow and DESIGN.md for visual decisions.

## Objective

Redesign the existing Daydev Studio public website into a personal-led digital product studio experience.

Approved direction:
- Hybrid desktop layout: sidebar + main content canvas.
- Studio-personal identity: credible studio brand with a visible founder identity.
- Light theme as default.
- Orange as the primary brand accent.
- Preserve dark mode if currently supported.
- Keep the three capabilities together: web development, mobile development, and AI / machine learning.
- Primary business goal: qualified freelance project inquiries.
- Primary proof: real projects and honest case studies.

## Important repository constraints

This repository is a Bun/Turborepo monorepo. The public site is Astro 5 with React islands and Tailwind CSS v4. The backend is a separate Hono API. Do not migrate to Next.js or replace the stack.

Preserve:
- Existing public routes and useful page content.
- API-backed portfolio, testimonials, and blog data.
- WhatsApp constants and existing inquiry integrations.
- Theme initialization and toggle behavior.
- Existing pricing route and calculator behavior unless audit proves a change is necessary.
- The separate /admin layout, authentication, and data workflows.
- Existing SEO and deployment configuration.

Do not introduce Keystatic or another CMS. Blog content currently uses the API and Neon.

## Phase 1 — Audit, no code changes yet

Inspect the repository and report:
1. Existing route map.
2. Current public shell and admin shell.
3. Reusable components and React islands.
4. Existing CSS tokens and theme behavior.
5. Existing data/API integrations.
6. Current pricing behavior.
7. Gaps between current implementation and DESIGN.md.

Do not assume planned pages exist. Do not invent project detail routes or data fields.

## Phase 2 — Implementation plan

Create a short file-by-file plan. Separate:
- Shared layout and navigation.
- Design tokens.
- Homepage.
- Portfolio and case studies.
- Services and pricing.
- About and development activity.
- Blog and contact.
- Regression testing.

Identify risks and any missing content that requires owner input.

## Phase 3 — Build the foundation

Implement the design tokens in apps/astro/src/styles/global.css and the public site shell.

Desktop:
- Persistent sidebar.
- Clear grouped navigation.
- Main content area with readable max width.
- Compact utility controls.
- Primary consultation CTA.

Tablet:
- Collapsible sidebar or accessible drawer.

Mobile:
- Compact header and accessible navigation drawer.
- Single-column content.
- Touch-friendly controls.

Do not change /admin to use the public sidebar. Check Base.astro and Admin.astro before changing shared styles.

## Phase 4 — Redesign pages incrementally

Prioritize:
1. Homepage.
2. Portfolio.
3. Project detail only if supported by current data model and route design.
4. Services.
5. Pricing / consultation.
6. Contact.
7. About / founder.
8. Development activity only when real data integration exists.
9. Blog improvements using the current API-backed content flow.

Use real Daydev Studio content. SISKU may be presented as a case study only to the extent that project details and current status are verified. Never invent metrics, testimonials, clients, usage counts, or outcomes.

Do not expose fixed public pricing before consultation. Preserve the existing /pricing route and make its purpose consistent with the consultation-led sales process.

## Phase 5 — Quality

Run:
- bun run typecheck
- bun run test
- bun run build

Also test affected routes, responsive layouts, navigation, theme toggle, forms, CTA links, API loading/error/empty states, and /admin regression if shared CSS/layout changed.

Do not claim a check passed unless it was actually run. Do not claim lint passed if no lint script exists.

## Working rules

- Inspect git status and current branch first.
- Do not overwrite unrelated changes.
- Keep changes incremental.
- Avoid unnecessary dependencies.
- Prefer Astro components for static UI and React islands only for real client-side interaction.
- Keep design tokens centralized.
- Preserve accessibility and prefers-reduced-motion.
- Do not replace real data with fake live-looking data.
- Do not commit, push, or deploy unless explicitly asked.

## Final response

Summarize:
- What changed.
- Files changed.
- Routes completed.
- Features preserved.
- Commands and tests run.
- Remaining issues.
- Any content or decisions needed from the owner.
