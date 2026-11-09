# DESIGN.md — Daydev Studio

This document is the source of truth for the public website's visual design and user experience. Repository-level engineering rules live in AGENTS.md. Existing anti-slop guidance and project-specific skills remain applicable unless they conflict with the approved decisions below.

## 1. Product and brand direction

**Brand:** Daydev Studio  
**Positioning:** Personal-led Digital Product Studio  
**Primary objective:** Acquire qualified freelance clients through credible proof of work.  
**Audience:** Businesses, UMKM, founders, startups, and organizations that need digital products.

Daydev Studio combines three capabilities as one coherent product-development practice:
- Web application development.
- Mobile application development.
- AI and machine-learning integration.

Do not present these as unrelated businesses or imply that every project uses all three.

**Brand character:** professional, technical, approachable, founder-led, clear, and evidence-based.

**Core message:** We design and build digital products that solve real problems.

Avoid generic agency claims, exaggerated outcomes, invented client logos, fake testimonials, and unsupported metrics. Prefer real project evidence, concrete capabilities, and transparent project status.

## 2. Approved design decisions

| Decision | Specification |
|---|---|
| Layout | Hybrid: persistent desktop sidebar + main content canvas |
| Identity | Studio-personal: studio brand with visible founder identity |
| Default theme | Light |
| Theme support | Preserve dark mode if the current theme system supports it |
| Brand accent | Orange |
| Visual style | Minimal, editorial, modular, technical, human |
| Navigation | Sidebar on desktop; drawer/header navigation on smaller screens |
| Primary conversion | Project consultation / inquiry |
| Primary proof | Real projects and detailed case studies |

This direction supersedes conflicting visual decisions in older design notes, including a cyan-primary palette and a one-page-only navigation assumption. Existing useful components and content should be preserved where compatible.

## 3. Color system

Use CSS custom properties in apps/astro/src/styles/global.css as the implementation source of truth. Do not scatter raw color values through components.

### Light theme tokens

| Token | Value | Usage |
|---|---|---|
| Canvas | #F8F8F6 | Main page background |
| Surface | #FFFFFF | Cards, sidebar, panels |
| Surface muted | #F1F2F0 | Subtle section contrast |
| Foreground | #171717 | Primary text |
| Muted foreground | #686868 | Secondary text |
| Border | #E5E7EB | Dividers and card borders |
| Brand | #F59E0B | Primary brand accent |
| Brand hover | #D97706 | Hover / pressed accent |
| Brand soft | #FFF1D6 | Soft brand surface |
| Success | #0D9488 | Success states only |
| Info | #0284C7 | Informational states only |
| Danger | #DC2626 | Error / destructive states |

Orange is the brand accent, not a semantic warning color in this design system. Keep warning semantics distinct if a warning state is needed.

### Dark theme

If dark mode remains available, provide equivalent contrast-safe tokens. Dark mode is secondary to the approved light-first experience. Do not remove the existing theme toggle or ThemeScript without checking all dependent behavior.

### Contrast

- Meet WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries.
- Never use low-contrast gray text on white surfaces.
- Focus indicators must remain visible in both themes.
- Do not rely on color alone to communicate status.

## 4. Typography

Reuse the fonts already shipped by the project unless there is a clear reason to change them:
- Space Grotesk: display headings and prominent titles.
- Inter: body copy, navigation, controls, and UI.
- JetBrains Mono: technical metadata, code, and compact technical labels.

Do not introduce Plus Jakarta Sans unless the font asset and loading strategy are intentionally added. Existing local font files are preferred to avoid unnecessary external font requests.

Suggested responsive scale:
- Hero title: clamp(2.75rem, 6vw, 5rem).
- Page title: clamp(2.5rem, 5vw, 4.5rem).
- Section title: clamp(1.875rem, 4vw, 3rem).
- Card title: 1.125rem–1.5rem.
- Body: 1rem, line-height 1.6–1.75.
- Caption: 0.75rem–0.875rem.
- Technical metadata: 0.75rem–0.875rem, mono where appropriate.

Use readable line lengths and balanced heading wraps. Avoid oversized headings that push meaningful content below the fold on common laptop screens.

## 5. Layout and navigation

### Desktop

- Use a hybrid shell with a persistent sidebar and a flexible main content area.
- Sidebar should contain the Daydev brand, grouped navigation, founder identity/status where useful, and compact utility controls.
- Main content should have a clear page title / breadcrumb area where appropriate.
- Keep the content width readable; do not stretch long-form text across ultra-wide screens.
- Sidebar width should be stable and content should never be obscured by it.
- The sidebar must not compete visually with the page's primary content.

### Tablet

- Collapse the sidebar into an accessible drawer or compact rail based on available width.
- Keep the page content readable and avoid cramped multi-column layouts.
- Maintain visible access to the primary inquiry action.

### Mobile

- Use a compact header with brand and menu control.
- Use an accessible drawer or compact navigation pattern.
- Single-column content by default.
- Touch targets should be at least 44 by 44 CSS pixels where practical.
- Do not force desktop dashboard density onto a phone screen.
- Keep the consultation action easy to find without covering content.

### Navigation groups

Recommended public navigation:
- Overview: Beranda, Tentang.
- Explore: Proyek, Layanan, Blog / Insights.
- Studio: Aktivitas Development (only when backed by real data).
- Connect: Kontak / Konsultasi.

Keep existing public routes working during the redesign. Existing routes include /, /portfolio, /pricing, /blog, /services and nested service pages. Do not rename or remove routes without an explicit migration plan and redirects.

The admin experience under /admin is a separate product surface. Do not apply the public sidebar shell to admin pages unless explicitly requested.

## 6. Page architecture and content hierarchy

The target information architecture is:

1. Home (/)
   - Hero: clear value proposition and one primary inquiry CTA.
   - Service summary: web, mobile, AI/ML.
   - Featured real projects.
   - Why work with Daydev Studio / working approach.
   - Founder introduction.
   - Process overview.
   - Selected insights.
   - Final consultation CTA.

2. Projects (/portfolio)
   - Real project listing.
   - Category filters only when categories are supported by actual project data.
   - Project cards show name, problem/domain, role or scope, technology, and verified status.
   - Do not label a project Live unless it is publicly usable.

3. Project detail / case study
   - Add a detail route only after checking the current portfolio data model and route conventions.
   - Structure: context/problem, constraints, approach, implementation, screenshots, verified outcomes, lessons, related work, CTA.
   - Never invent metrics or client quotes.

4. Services (/services and existing nested service routes)
   - Explain client problems and deliverables, not just technology names.
   - Keep web, mobile, and AI/ML as integrated capabilities.
   - Show relevant project evidence and consultation CTA.

5. Pricing (/pricing)
   - Preserve the route and existing calculator or pricing functionality after auditing it.
   - Public copy must not promise fixed prices before consultation.
   - If the current calculator remains, label its output as an indicative estimate and validate its assumptions; otherwise prioritize consultation.
   - Do not publish unapproved price lists.

6. About
   - Introduce the studio and founder honestly.
   - Explain working principles, ownership, and collaboration model.
   - Do not imply a large team or organizational scale that is not verified.

7. Development activity
   - Optional page or section.
   - Only display GitHub or project activity from a real source with clear update timestamps.
   - Never fabricate contribution counts, repository statistics, or live status.
   - Activity is supporting proof, not the primary portfolio.

8. Blog / Insights (/blog)
   - Preserve the current API-backed blog implementation and admin content workflow.
   - Do not introduce Keystatic or a file-based CMS unless explicitly approved.
   - Content should derive from real engineering work and project decisions.

9. Contact / consultation
   - Clear WhatsApp and email routes using existing shared constants where available.
   - Inquiry form should ask for useful project context without excessive friction.
   - Preserve server-side validation and existing API boundaries.

## 7. Components and visual language

Prefer the project's existing Astro components and React islands. Build reusable components only when repeated UI or behavior justifies them.

Core patterns:
- Sidebar / mobile navigation.
- Page heading and breadcrumb.
- Project card and project metadata.
- Service card.
- Technology badge.
- Founder profile block.
- Case-study section navigation.
- Activity item / timeline.
- Article preview.
- Testimonial card (only for verified testimonials).
- Consultation CTA.
- Contact form.
- Footer.

Cards:
- Use white or muted surfaces with a subtle 1px border.
- Typical radius: 12–16px.
- Use restrained shadows; border and spacing should establish hierarchy first.
- Hover lift should be subtle and must not be required to understand interactivity.

Icons:
- Continue using lucide-react already installed.
- Use consistent stroke weight and meaningful icons.
- Do not use emoji as interface icons.
- Provide accessible labels for icon-only controls.

Glassmorphism:
- Do not use as the default card treatment.
- A restrained translucent effect may be used for a floating utility surface only when it improves readability and layering.
- Avoid blur-heavy panels that reduce contrast or performance.

## 8. Motion and interaction

- Motion level: restrained.
- Prefer short transitions for hover, focus, drawer, and theme changes.
- Scroll reveal is optional and must not hide content when JavaScript fails.
- Respect prefers-reduced-motion.
- No perpetual decorative animation.
- Do not delay navigation or content access for animation.
- Every interactive control must have visible hover, focus, active, and disabled states where relevant.

## 9. Responsive behavior

Test at minimum:
- 360px mobile.
- 390px mobile.
- 768px tablet.
- 1024px compact desktop.
- 1280px desktop.
- 1440px wide desktop.

Avoid horizontal overflow, clipped headings, overlapping sticky elements, and inaccessible drawers. Use fluid spacing and grid columns that collapse naturally.

## 10. Accessibility and content quality

- Use semantic landmarks and heading order.
- Provide visible keyboard focus.
- Ensure navigation works by keyboard and screen reader.
- Use meaningful image alt text; decorative images should have empty alt text.
- Ensure form fields have labels, errors, and helpful status messages.
- Maintain sufficient contrast.
- Preserve reduced-motion support.
- Write concise, specific copy in Indonesian by default; support English only where the current localization architecture allows it.
- Do not claim outcomes, client counts, years of experience, testimonials, or availability unless verified.

## 11. Existing implementation constraints

The current public frontend is Astro 5 with React islands and Tailwind CSS v4. It is part of a Bun/Turborepo monorepo. The global design tokens live in apps/astro/src/styles/global.css.

The current project already has:
- Base.astro layout.
- Header.astro and Footer.astro.
- ThemeScript.astro and ThemeToggle.astro.
- HeroComputer.tsx and HeroMonitor.tsx.
- Portfolio and service components.
- API-backed blog, testimonials, and portfolio data.
- A separate /admin experience.

Audit these before creating replacements. Preserve useful functionality and data flow.

## 12. Decision rule

When a design choice conflicts with this document, follow this document unless the user explicitly approves a change. When this document conflicts with actual application constraints, inspect the implementation, choose the smallest safe adaptation, and report the discrepancy rather than silently changing the architecture.
