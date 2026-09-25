/**
 * Aggregasi helper data untuk astro.config sitemap customPages.
 * getServiceSlugs dari layanan statis; getBlogSlugs dari API blog.
 */
export { getBlogSlugs } from "./api";
export { getAllServiceSlugs as getServiceSlugs } from "./services";