/**
 * @daydev/shared-types
 *
 * Domain types + brand constants yang dipakai bersama Astro frontend dan
 * Hono API. Framework-agnostic, tanpa dependency runtime.
 *
 * Apa yang di sini: tipe entitas (Bayangan dari schema API), konfigurasi
 * brand (WhatsApp, segmen), dan helper format.
 */

// ---------------------------------------------------------------------------
// Entitas (bayangan respons API)
// ---------------------------------------------------------------------------

export type Segment = "startup" | "umkm" | "mahasiswa" | "undangan-digital" | "bot-telegram";
export type PortfolioCategory = "web" | "mobile" | "bot-telegram" | "undangan-digital";

export interface SiteStat {
  key: string;
  value: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_published: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  segment: Segment | null;
  description: string;
  result_highlight: string | null;
  cover_image_url: string;
  gallery_image_urls: string[] | null;
  demo_url: string | null;
  tech_stack: string[] | null;
  client_name: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author: string;
  reading_minutes: number;
  published_at: string;
  is_published: boolean;
}

export interface PricingPackage {
  id: string;
  category_id: string;
  name: string;
  price: number;
  features: string[] | null;
  is_recommended: boolean;
  demo_url: string | null;
  display_order: number;
}

export interface PricingCategory {
  id: string;
  segment: Segment;
  label: string;
  starting_price_label: string;
  display_order: number;
  packages: PricingPackage[];
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  segment: Segment | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  display_order: number;
  is_published: boolean;
}

// ---------------------------------------------------------------------------
// Brand / WhatsApp
// ---------------------------------------------------------------------------

export const BRAND = {
  name: "Daydev Studio",
  domain: "daydev.studio",
} as const;

export const WHATSAPP = {
  phoneNumber: "6285175284253",
  displayNumber: "+62 851-7528-4253",
  defaultMessage:
    "Halo Daydev, saya ingin konsultasi gratis mengenai pengembangan aplikasi.",
  messagePlan: (plan: string, category: string) =>
    `Halo Daydev, saya tertarik dengan paket ${plan} untuk kategori ${category}. Bisakah kita berdiskusi lebih lanjut?`,
  messageSegment: (segment: string) =>
    `Halo Daydev, saya dari segmen ${segment} dan ingin konsultasi gratis.`,
  messageProject:
    "Halo Daydev, saya ingin diskusi proyek.",
} as const;

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP.phoneNumber}?text=${encodeURIComponent(message)}`;

// ---------------------------------------------------------------------------
// Konstanta label segmen & kategori
// ---------------------------------------------------------------------------

export const SEGMENT_LABELS: Record<Segment, string> = {
  startup: "Startup",
  umkm: "UMKM",
  mahasiswa: "Mahasiswa",
  "undangan-digital": "Undangan Digital",
  "bot-telegram": "Bot Telegram",
};

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  web: "Web Development",
  mobile: "Mobile",
  "bot-telegram": "Bot Telegram",
  "undangan-digital": "Undangan Digital",
};

export const PORTFOLIO_CATEGORY_ORDER: PortfolioCategory[] = [
  "web",
  "mobile",
  "bot-telegram",
  "undangan-digital",
];

// ---------------------------------------------------------------------------
// Helper format
// ---------------------------------------------------------------------------

/** Format angka IDR tanpa desimal, dipisah titik: 3500000 -> "Rp 3.500.000". */
export function formatRupiah(value: number): string {
  const rounded = Math.round(value);
  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(rounded)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}