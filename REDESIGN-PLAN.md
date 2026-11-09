# Daydev Studio redesign plan

- **Shared layout and navigation:** `Base.astro`, `Header.astro`, `Footer.astro`, and `global.css` add the public sidebar, responsive navigation, orange token layer, and founder-led studio framing. `Admin.astro` remains independent.
- **Homepage:** `index.astro`, `SolutionsTable.astro`, `CustomerStories.astro`, and `Testimonials.astro` lead with the consultation goal, verified portfolio proof, and the web, mobile, and AI/ML capability grouping.
- **Portfolio and case studies:** `portfolio.astro` and `ProjectCard.astro` improve proof presentation using current API fields only. No project detail route is added because the current model does not define one.
- **Services and pricing:** `services/index.astro`, `services/[service].astro`, `pricing.astro`, `PricingSection.astro`, and `PriceCalculator.tsx` retain existing service routes, API pricing, estimator behavior, and WhatsApp consultation handoff.
- **About and development activity:** no new public route is added because verified founder profile and live development-activity data are not currently present.
- **Blog and contact:** `blog/index.astro`, `blog/[slug].astro`, `BlogBrowser.tsx`, and `ConsultationCTA.astro` continue using API-backed content, explicit loading/error/empty states, and existing inquiry links.
- **Regression testing:** run `bun run typecheck`, `bun run test`, and `bun run build`; check public navigation/theme behavior and verify `/admin` still uses its separate layout.

## Risks and owner input

The repository has no verified founder profile data or dedicated AI/ML service record. A founder name, photo, bio, and any verified AI/ML case study are needed before those surfaces can make more specific claims. Pricing remains consultation-led even where API-backed package estimates are shown.
