/**
 * Service definitions for multi-page structure
 * Defines the core services offered by Daydev
 */

export interface ServiceInfo {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  lightBg: string;
  benefits: string[];
  features: string[];
  targetAudience: string[];
  metaDescription: string;
  caseStudies?: string[];
}

export const services: ServiceInfo[] = [
  {
    id: "web-development",
    slug: "web-development",
    title: "Jasa Pembuatan Website",
    description: "Desain dan pengembangan website profesional untuk bisnis Anda",
    longDescription:
      "Kami menyediakan solusi website yang modern, responsif, dan SEO-friendly. Dari desain UI/UX hingga development, kami handle semuanya dengan standar internasional.",
    icon: "🌐",
    color: "#3b82f6",
    lightBg: "#eff6ff",
    benefits: [
      "Desain modern dan responsif",
      "SEO-optimized",
      "Fast loading speed",
      "Security features",
      "Easy to manage",
    ],
    features: [
      "Responsive design untuk semua device",
      "Interactive UI dengan animasi smooth",
      "Performance optimization",
      "SEO configuration lengkap",
      "SSL security included",
      "Monthly backup otomatis",
    ],
    targetAudience: ["UMKM", "Startup", "Bisnis Profesional"],
    metaDescription:
      "Jasa pembuatan website profesional dengan desain modern, responsif, dan SEO-optimized. Tingkatkan visibilitas bisnis Anda online.",
  },
  {
    id: "mobile-development",
    slug: "mobile-development",
    title: "Pengembangan Aplikasi Mobile",
    description:
      "Aplikasi iOS dan Android native dengan fitur lengkap dan user experience terbaik",
    longDescription:
      "Kami mengembangkan aplikasi mobile native untuk iOS dan Android dengan performance optimal. Tim kami berpengalaman dalam menghadirkan aplikasi yang user-friendly dan scalable.",
    icon: "📱",
    color: "#f59e0b",
    lightBg: "#fffbeb",
    benefits: [
      "Native performance",
      "Offline functionality",
      "Push notifications",
      "Real-time sync",
      "App store submission",
    ],
    features: [
      "Cross-platform development (iOS & Android)",
      "Native performance optimization",
      "Real-time database integration",
      "Payment gateway integration",
      "Push notification system",
      "Analytics integration",
    ],
    targetAudience: ["Startup", "SME dengan mobile strategy"],
    metaDescription:
      "Pengembangan aplikasi mobile iOS dan Android. Kami menciptakan aplikasi berkualitas tinggi dengan performa optimal dan user experience terbaik.",
  },
  {
    id: "telegram-bot",
    slug: "telegram-bot",
    title: "Pengembangan Bot Telegram",
    description:
      "Automasi cerdas untuk bisnis dan kebutuhan pribadi melalui Telegram",
    longDescription:
      "Bot Telegram dapat mengotomatisasi berbagai proses bisnis Anda, dari customer service hingga manajemen inventory. Kami develop bot yang intelligent dan scalable.",
    icon: "🤖",
    color: "#f59e0b",
    lightBg: "#fffbeb",
    benefits: [
      "Automasi proses bisnis",
      "24/7 instant response",
      "Easy to use interface",
      "Integration dengan API",
      "Cost-effective solution",
    ],
    features: [
      "Custom command development",
      "API integration (webhook support)",
      "Database connection",
      "Scheduled messaging",
      "User management system",
      "Analytics & reporting",
    ],
    targetAudience: ["UMKM", "Startup", "Bisnis Online"],
    metaDescription:
      "Bot Telegram yang dapat mengotomatisasi proses bisnis Anda 24/7. Integrasikan dengan sistem existing dan tingkatkan efisiensi operasional.",
  },
  {
    id: "undangan-digital",
    slug: "undangan-digital",
    title: "Undangan Digital Interaktif",
    description:
      "Platform untuk membuat undangan digital yang cantik, interaktif, dan profesional",
    longDescription:
      "Undangan digital modern dengan fitur RSVP terintegrasi, galeri foto, dan notifikasi WhatsApp. Sempurna untuk pernikahan, acara corporate, dan celebration lainnya.",
    icon: "💌",
    color: "#ec4899",
    lightBg: "#fdf2f8",
    benefits: [
      "Desain cantik dan interaktif",
      "RSVP tracking otomatis",
      "WhatsApp notification",
      "Photo gallery integration",
      "Customizable theme",
    ],
    features: [
      "Premium responsive design",
      "RSVP form dengan notifikasi",
      "Photo/video gallery",
      "Countdown timer",
      "Google Maps integration",
      "Guest management dashboard",
    ],
    targetAudience: ["Individu", "Wedding Organizer", "Event Organizer"],
    metaDescription:
      "Buat undangan digital yang menarik dan interaktif dengan RSVP tracking real-time. Sempurna untuk pernikahan, acara, dan celebration spesial Anda.",
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return services.find((service) => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}
