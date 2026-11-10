# DESIGN.md — Daydev Studio

This is the source of truth for the public website's visual design, information architecture, and user experience. AGENTS.md governs engineering workflow and repository safety. Preserve existing repository anti-slop guidance and project-specific skills unless they conflict with the approved direction below.

## 1. Product and brand direction

**Brand:** Daydev Studio  
**Positioning:** Personal-led Digital Product Studio  
**Primary objective:** Acquire qualified freelance clients through credible proof of work.  
**Audience:** UMKM, businesses, founders, startups, and organizations that need digital products.

Daydev Studio combines three capabilities into one coherent product-development practice:
- Web application development.
- Mobile application development.
- AI and machine-learning integration.

Do not present these as unrelated businesses or imply every project uses all three.

**Brand character:** professional, technical, approachable, founder-led, clear, and evidence-based.  
**Core message:** From idea to useful digital product.

The studio identity and founder identity must reinforce each other. Daydev Studio is the service/product-development brand; the founder is the visible person accountable for craft, communication, and delivery. Do not make the site look like either an anonymous agency template or a personal CV with a studio logo pasted on it.

Avoid generic agency claims, exaggerated outcomes, invented client logos, fake testimonials, and unsupported metrics. Prefer real project evidence, concrete capabilities, transparent project status, and visible process.

## 2. Approved decisions

| Decision | Approved direction |
|---|---|
| Layout | Hybrid: persistent desktop sidebar + main content canvas |
| Identity | Studio-personal: studio brand plus founder profile |
| Default theme | Light |
| Theme support | Retain dark mode if currently implemented |
| Brand accent | Daydev orange |
| Visual language | Minimal, editorial, modular, technical, human |
| Navigation | Desktop sidebar; compact header/drawer on smaller screens |
| Primary conversion | Qualified consultation / project inquiry |
| Primary proof | Real projects, case studies, skills, activity, and process |
| Pricing policy | Show an honest starting price; final scope and quote require consultation |
| Reference adaptation | Adapt all relevant modules from both supplied recordings, not their dark theme or visual styling verbatim |

This direction supersedes older conflicting decisions such as cyan-primary colors, one-page-only navigation, and pricing hidden entirely until consultation.

## 3. Reference recordings: what to learn and what not to copy

### Personal portfolio recording

The first recording demonstrates a persistent profile/sidebar navigation and distinct content destinations:
- Beranda / dashboard with GitHub activity, summary statistics, contribution heatmap, and pinned repositories.
- Tentang with biography and career/experience content.
- Kreasi with social/profile information and published creative content.
- Pencapaian with achievement cards.
- Proyek with project cards.
- Dasbor / statistics and project or development data.
- Buku Tamu with visitor messages.
- Kontak with social/contact cards and a message form.
- Links / external destinations.
- A compact mobile profile/navigation presentation.

Adapt all relevant concepts into the Daydev Studio context:
- Founder profile and concise bio in the sidebar.
- A studio overview/dashboard that summarizes real work, capabilities, and current activity.
- GitHub/repository activity where live or cached data can be verified.
- Skills/technology directory grouped by actual capability.
- Kreasi / selected creative or technical output, only if there is genuine content to show.
- Achievements / certifications / milestones, only when verifiable.
- Projects and detailed case studies.
- Development activity and pinned repositories.
- Guestbook, optional and moderated, only if it can be safely maintained.
- Contact cards, social links, and inquiry form.
- A useful compact mobile profile view.

Do not copy personal social metrics, follower counts, TikTok content, or the reference person's data. Do not create empty navigation pages merely to reproduce every menu item. If content is not available, omit the module or mark it as a planned feature in the implementation report.

### Existing Daydev Studio recording

The second recording shows the current studio website's:
- Product-led hero with a large headline and visual showcase.
- Portfolio/project gallery.
- Service explanation, including web/mobile comparisons and AI/ML capability.
- Pricing/packages page with UMKM packages and payment FAQs.
- Blog/insights area and article preview.
- Consultation CTA and WhatsApp contact affordance.
- Footer with studio identity and navigation.
- Existing dark and light appearances.

Preserve the useful information and working interactions. Improve hierarchy, readability, conversion flow, and consistency rather than deleting the current content wholesale. Migrate useful hero/project visuals and service explanations into the new layout when assets and rights allow.

## 4. Visual system

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

Orange is the brand accent, not a semantic warning color. Keep warning semantics distinct.

### Dark theme

If dark mode exists, retain it with equivalent contrast-safe tokens. Light is the default. Do not remove theme persistence, ThemeScript, or theme toggle behavior without an explicit reason and regression plan.

### Contrast

- Meet WCAG 2.2 AA: 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries.
- Keep muted text readable on white.
- Focus indicators must be visible in both themes.
- Never rely on color alone to communicate status.

## 5. Typography

Reuse fonts already shipped by the project unless there is a clear reason to change them:
- Space Grotesk: display headings and prominent titles.
- Inter: body copy, navigation, controls, and UI.
- JetBrains Mono: technical metadata, code, and compact technical labels.

Do not add Plus Jakarta Sans unless its asset and loading strategy are intentionally introduced. Prefer local fonts.

Suggested responsive scale:
- Hero title: clamp(2.75rem, 6vw, 5rem).
- Page title: clamp(2.5rem, 5vw, 4.5rem).
- Section title: clamp(1.875rem, 4vw, 3rem).
- Card title: 1.125rem–1.5rem.
- Body: 1rem, line-height 1.6–1.75.
- Caption: 0.75rem–0.875rem.
- Technical metadata: 0.75rem–0.875rem, mono where appropriate.

Use readable line lengths and balanced heading wraps. Avoid oversized headings that bury useful content below the fold.

## 6. Layout and navigation

### Desktop shell

- Persistent sidebar + flexible main content canvas.
- Sidebar contains Daydev logo/wordmark, founder avatar/profile summary, concise role/status (only if accurate), grouped navigation, social links, and compact theme/language utilities where supported.
- The founder block must remain visually secondary to the Daydev Studio identity.
- Main canvas has clear page title/breadcrumb where useful and readable max width.
- Primary consultation CTA should be discoverable in the sidebar and/or page context without overwhelming navigation.
- Keep sidebar width stable; content must never be obscured.
- Avoid dense dashboard-style UI on every page. Use the dashboard treatment only where it adds information.

### Suggested navigation

Use these labels as a starting information architecture, mapping to existing route conventions after audit:

**Overview**
- Beranda
- Tentang / Founder

**Explore**
- Kreasi / Skills
- Pencapaian
- Proyek
- Layanan
- Blog / Insights

**Studio activity**
- Dasbor / Activity
- GitHub / Repositories

**Connect**
- Buku Tamu (optional)
- Kontak
- Links / Social links

Navigation can be grouped or collapsed. Do not create separate routes for every item if a section or tab is more appropriate. Avoid duplicate destinations such as both Dasbor and Activity unless they have clearly different content.

### Tablet

- Collapse sidebar into accessible drawer or compact rail based on available width.
- Keep content readable and avoid cramped multi-column layouts.
- Maintain clear access to consultation CTA.

### Mobile

- Compact top header with brand and menu control.
- Accessible drawer or compact navigation.
- Show founder avatar/name and key social links in the drawer/profile panel, not as a huge fixed sidebar.
- Single-column content by default.
- Touch targets at least 44×44 CSS pixels where practical.
- Do not force desktop dashboard density onto a phone.
- Keep consultation action easy to find without covering content.
- Reflow stats and cards; no horizontal page overflow. A horizontally scrollable contribution heatmap is acceptable only if labelled and keyboard accessible.

Keep existing public routes working. Known public routes include /, /portfolio, /pricing, /blog, /services and nested service pages. Inspect the actual route tree before adding or renaming paths. Add redirects if a route must change.

The /admin experience is a separate product surface. Do not apply the public sidebar shell to admin pages.

## 7. Page architecture and content

The following is the target experience. Map it to current routes and components; do not assume every page already exists.

### 7.1 Beranda / Studio dashboard (/)

The homepage should combine the existing product-led Daydev hero with a concise studio overview:
1. Hero: specific value proposition, short description, primary consultation CTA, secondary project CTA, and a real project/product visual.
2. Studio snapshot: concise founder identity and what Daydev builds.
3. Capability overview: web, mobile, AI/ML as connected capabilities.
4. Featured projects: real project cards with domain, role/scope, technologies, and verified status.
5. Selected case-study / proof section.
6. Development snapshot: recent work, GitHub or repository activity only if sourced and timestamped.
7. Skills/technology highlights grouped by capability, based on actual experience.
8. Working process / how collaboration works.
9. Selected insight/article.
10. Final consultation CTA and footer.

Avoid a generic analytics dashboard as the entire homepage. Use statistics only when they are useful, current, and verifiable.

### 7.2 Founder and About

- Introduce the actual founder with real photo, name, role, biography, and relevant background if approved for public display.
- Follow the reference's personal greeting/profile-led presentation as an editorial introduction, not as a generic resume hero.
- Founder information should be visible in the desktop sidebar and expanded in the About page. On mobile, show it in the navigation drawer/profile panel.
- Explain the studio's founder-led working model honestly.
- Show career/experience timeline only from verified records.
- Include working principles, communication, ownership, and collaboration approach.
- Do not imply a large team or unverified years of experience.

### 7.3 Kreasi / Skills

- Adapt the reference's creative/skills area into a showcase of genuine technical and creative output.
- Group skills into Web, Mobile, AI/ML, Backend/Infrastructure, Design/Tooling only when supported by actual work.
- Distinguish production experience, project use, and learning/experimentation; do not imply equal proficiency across every tool.
- Include social/creative channels only when they contain relevant public work.
- Do not reproduce unrelated social media follower metrics or third-party content without permission.

### 7.4 Pencapaian / Achievements

- Adapt the reference's achievement cards/grid for verifiable certificates, awards, milestones, shipped products, contributions, or completed learning credentials.
- Include issuer/date/source link where available.
- If no verified records are available, omit the page/menu item for launch rather than inventing badges.

### 7.5 Proyek / Portfolio (/portfolio)

- Real project listing.
- Category filters only if supported by actual data.
- Cards show project name, problem/domain, role or scope, technologies, and verified status.
- Do not label a project Live unless it is publicly usable.
- Preserve current portfolio API/data flow.

### 7.6 Project detail / case study

Add detail routes only after checking the current portfolio data model and route conventions. Structure:
- Context and problem.
- Constraints and requirements.
- Approach and key decisions.
- Implementation and architecture.
- Screenshots / product visuals.
- Verified results and impact.
- Lessons learned.
- Related work and consultation CTA.

Never invent metrics, testimonials, client quotes, or business impact. If quantitative outcome data is unavailable, describe shipped functionality and engineering decisions without implying measured impact.

### 7.7 Services (/services and nested service routes)

- Explain client problems, deliverables, process, and scope—not just technology names.
- Keep web, mobile, and AI/ML as integrated capabilities.
- Show relevant project evidence and CTA.
- Preserve useful existing web/mobile service comparison content and AI/ML service explanation.

### 7.8 Pricing (/pricing)

**Policy: starting-price presentation (owner-approved).** Do not hide all pricing, and do not publish an unconditional fixed quote.

- Display a clear "Mulai dari" / "Starting at" price for each approved package or service category where the current offer is still valid.
- Audit current package definitions and displayed amounts in the existing pricing page/data before reusing them. The supplied recording shows UMKM package prices, but the recording alone is not sufficient approval that those amounts remain current.
- Never invent a new amount. If the current price cannot be verified with the owner/current source, use "Mulai dari — konsultasikan kebutuhan" as a temporary non-numeric state and flag the missing amount.
- Explain what is included, scope boundaries, assumptions, and what can change the final quote.
- Add a concise note: final price depends on scope, integrations, complexity, timeline, and agreed deliverables; confirm after consultation.
- CTA: "Konsultasikan proyek" / "Minta estimasi".
- Preserve /pricing and audit existing calculator/payment FAQs. If a calculator remains, label its result as an indicative estimate, show assumptions, and do not represent it as a binding quote.
- Avoid false discounts, urgency, or package comparisons that hide exclusions.

### 7.9 Dasbor / Development activity / GitHub

Adapt the reference's dashboard, GitHub contribution heatmap, summary cards, and pinned repository patterns. The dashboard may combine a small number of useful studio/founder indicators with recent work, but must not become a vanity-metrics page:
- Use real GitHub API or existing integration data, with caching and clear last-updated timestamps.
- Potential data: public repositories, pinned repositories, contributions/commit activity, languages, stars, and recent public activity where the source supports them. Each metric must show its period/source or be omitted.
- Do not scrape or fabricate unavailable private contribution data.
- Do not present lifetime/annual stats without defining their period and source.
- Keep activity as supporting proof, not a replacement for project case studies.
- If API access is unavailable, show a curated static list of public repositories with source links and omit live stats/heatmap.

### 7.10 Kreasi / Content and creative output

Adapt the reference's Kreasi destination as a curated showcase of genuine output beyond client project cards:
- Product demos, experiments, prototypes, technical explorations, published videos, articles, talks, and selected social posts.
- Use categories or tabs only when there is enough real content to support them.
- Link to the original source and add context about the creator's role.
- Distinguish client work, personal work, learning experiments, and collaborative contributions.
- Do not embed an arbitrary social feed or copy third-party content just to imitate the reference.
- Respect platform embedding rules, copyright, and privacy.
- If no relevant content is ready, keep this as a section within Projects/Insights or omit the menu item until populated.

### 7.11 Buku Tamu / Guestbook (optional)

Adapt the reference's guestbook concept only as an optional community feature, not a core lead-generation dependency.
- Optional feature, not a launch blocker.
- Implement only if moderation, spam protection, privacy notice, and deletion process can be supported.
- Validate and sanitize all user input server-side.
- Do not expose email addresses or other private data.
- Provide a clear empty state and moderation expectations.
- If these safeguards cannot be delivered, defer the feature and omit its navigation item.

### 7.12 Contact

- Provide clear WhatsApp and email routes using existing shared constants where available.
- Link to the canonical Links/social directory where implemented; avoid duplicating a long list of social destinations on the contact page.
- Inquiry form asks for useful project context without excessive friction.
- Preserve server-side validation and API boundaries.
- Contact cards should have meaningful labels and accessible destinations.

### 7.13 Blog / Insights (/blog)

- Preserve current API-backed blog and admin content workflow.
- Do not introduce Keystatic or a file-based CMS unless explicitly approved.
- Prioritize articles derived from real engineering work, product decisions, and case studies.

### 7.14 Social links and external profile destinations

- Adapt the reference's dedicated Links area as a curated set of external destinations: GitHub, LinkedIn, Instagram, professional profiles, product demos, and other channels only when they are real, public, relevant, and maintained.
- Group links by purpose (professional, creative, product, community) when there are enough destinations to justify grouping.
- Include a short description so visitors know what each destination contains.
- Do not add dead links, private dashboards, or unrelated social accounts.
- Social destinations may also appear as compact sidebar icons, but the dedicated Links section/page should remain the canonical directory if implemented.

### 7.15 Footer

- Studio identity, concise value proposition, primary links, contact/social links, and copyright.
- Do not repeat the entire sidebar navigation if it adds clutter.

## 8. Components and visual language

Prefer existing Astro components and React islands. Build reusable components only when repeated UI or behavior justifies them.

Core patterns:
- Public sidebar and mobile navigation.
- Founder mini-profile.
- Page heading and breadcrumb.
- Studio overview/stat card (real data only).
- Skills group / technology badge.
- Project card and metadata.
- Case-study section navigation.
- Service card.
- Achievement card.
- Repository card / contribution visualization.
- Activity item / timeline.
- Article preview.
- Verified testimonial card only.
- Pricing package card with starting-price treatment.
- Guestbook message and moderation state if implemented.
- Contact/social card.
- Consultation CTA and form.
- Footer.

Cards:
- White or muted surfaces with subtle 1px border.
- Typical radius 12–16px.
- Restrained shadows; spacing and borders establish hierarchy.
- Subtle hover states; never require hover to understand interactivity.

Icons:
- Continue using installed lucide-react.
- Consistent stroke weight and meaningful icons.
- No emoji as interface icons.
- Accessible labels for icon-only controls.

Glassmorphism:
- Not the default card treatment.
- Restrained translucent effect only for floating utility surfaces when it improves layering.
- Avoid blur-heavy panels that reduce contrast or performance.

## 9. Motion and interaction

- Restrained motion.
- Short transitions for hover, focus, drawer, and theme changes.
- Scroll reveal optional; content must remain visible if JavaScript fails.
- Respect prefers-reduced-motion.
- No perpetual decorative animation.
- Do not delay navigation or content access.
- Every interactive control has visible hover, focus, active, and disabled states where relevant.

## 10. Responsive behavior and accessibility

Test at minimum: 360px, 390px, 768px, 1024px, 1280px, and 1440px.

- Semantic landmarks and logical heading order.
- Keyboard-accessible navigation, drawers, tabs, forms, and widgets.
- Visible keyboard focus.
- Meaningful image alt text; empty alt for decorative images.
- Form labels, validation errors, and status messages.
- Contrast requirements above.
- Reduced-motion support.
- No horizontal overflow or keyboard traps.
- Heatmaps and dense stats need accessible text alternatives.

## 11. Content integrity and language

- Indonesian is the default language; English only where current localization architecture supports it.
- Use concise, specific copy.
- Do not claim outcomes, client counts, years of experience, testimonials, achievements, project status, or availability unless verified.
- Mark project roles and ownership accurately.
- Distinguish "built by founder", "team contribution", "client project", and "personal experiment" where relevant.
- Never expose private client or founder information without approval.

## 12. Existing implementation constraints

The public frontend is Astro 5 with React islands and Tailwind CSS v4 in a Bun/Turborepo monorepo. Global tokens live in apps/astro/src/styles/global.css.

Known existing elements include:
- Base.astro layout.
- Header.astro and Footer.astro.
- ThemeScript.astro and ThemeToggle.astro.
- HeroComputer.tsx and HeroMonitor.tsx.
- Portfolio and service components.
- API-backed blog, testimonials, and portfolio data.
- Separate /admin experience.

Audit before creating replacements. Preserve useful behavior and data flow.

## 13. Decision rule

When design choices conflict, follow this document unless the owner explicitly approves a change. When this document conflicts with actual code or available data, inspect the implementation, choose the smallest safe adaptation, and report the discrepancy rather than silently changing architecture or inventing content.
