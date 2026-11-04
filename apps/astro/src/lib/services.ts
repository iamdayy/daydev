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
    title: "Pembuatan website",
    description: "Desain dan pengembangan website profesional untuk bisnis Anda",
    longDescription:
      "Kami merancang dan membangun website untuk profil bisnis, toko online, serta sistem informasi. Pengerjaan mencakup desain antarmuka, pengembangan, dan konfigurasi agar website dapat digunakan di berbagai perangkat.",
    icon: "Globe",
    color: "var(--accent-ink)",
    lightBg: "var(--muted)",
    benefits: [
      "Desain modern dan responsif",
      "Konfigurasi SEO",
      "Optimasi waktu muat",
      "Fitur keamanan",
      "Pengelolaan konten",
    ],
    features: [
      "Desain responsif untuk berbagai perangkat",
      "Antarmuka interaktif",
      "Optimasi performa",
      "Konfigurasi SEO",
      "Konfigurasi SSL",
      "Backup bulanan otomatis",
    ],
    targetAudience: ["UMKM", "Startup", "Bisnis Profesional"],
    metaDescription:
      "Jasa pembuatan website profesional dengan desain modern, responsif, dan SEO-optimized. Tingkatkan visibilitas bisnis Anda online.",
  },
  {
    id: "mobile-development",
    slug: "mobile-development",
    title: "Aplikasi mobile",
    description:
      "Aplikasi iOS dan Android untuk kebutuhan pelanggan dan operasional bisnis",
    longDescription:
      "Kami mengembangkan aplikasi iOS dan Android, dari rancangan alur pengguna hingga publikasi. Fitur offline, notifikasi, dan integrasi data disesuaikan dengan kebutuhan produk Anda.",
    icon: "Smartphone",
    color: "var(--accent-ink)",
    lightBg: "var(--muted)",
    benefits: [
      "Performa native",
      "Fungsi offline",
      "Notifikasi ke pengguna",
      "Sinkronisasi data",
      "Publikasi ke app store",
    ],
    features: [
      "Pengembangan lintas platform (iOS & Android)",
      "Optimasi performa native",
      "Integrasi database real-time",
      "Integrasi pembayaran",
      "Sistem notifikasi",
      "Integrasi analitik",
    ],
    targetAudience: ["Startup", "UMKM dengan kebutuhan aplikasi mobile"],
    metaDescription:
      "Pengembangan aplikasi mobile iOS dan Android. Kami menciptakan aplikasi berkualitas tinggi dengan performa optimal dan user experience terbaik.",
  },
  {
    id: "telegram-bot",
    slug: "telegram-bot",
    title: "Bot Telegram",
    description:
      "Otomatisasi pesan, layanan pelanggan, dan proses bisnis melalui Telegram",
    longDescription:
      "Hubungkan Telegram dengan proses bisnis Anda. Bot dapat menangani perintah pelanggan, mengirim notifikasi terjadwal, dan mengakses data melalui integrasi API atau database.",
    icon: "Bot",
    color: "var(--accent-ink)",
    lightBg: "var(--muted)",
    benefits: [
      "Automasi proses bisnis",
      "Balasan otomatis",
      "Antarmuka percakapan",
      "Integrasi dengan API",
      "Mengurangi pekerjaan berulang",
    ],
    features: [
      "Perintah bot sesuai kebutuhan",
      "Integrasi API dan webhook",
      "Koneksi database",
      "Pesan terjadwal",
      "Pengelolaan pengguna",
      "Analitik dan laporan",
    ],
    targetAudience: ["UMKM", "Startup", "Bisnis Online"],
    metaDescription:
      "Bot Telegram yang dapat mengotomatisasi proses bisnis Anda 24/7. Integrasikan dengan sistem existing dan tingkatkan efisiensi operasional.",
  },
  {
    id: "undangan-digital",
    slug: "undangan-digital",
    title: "Undangan digital",
    description:
      "Undangan interaktif untuk pernikahan, acara bisnis, dan momen spesial",
    longDescription:
      "Bagikan detail acara melalui undangan digital dengan RSVP, galeri foto, peta lokasi, dan notifikasi WhatsApp. Tampilan serta isi undangan mengikuti kebutuhan acara Anda.",
    icon: "Mail",
    color: "var(--accent-ink)",
    lightBg: "var(--muted)",
    benefits: [
      "Desain interaktif",
      "Pencatatan RSVP otomatis",
      "Notifikasi WhatsApp",
      "Galeri foto",
      "Tema yang dapat disesuaikan",
    ],
    features: [
      "Desain responsif",
      "Formulir RSVP dengan notifikasi",
      "Galeri foto dan video",
      "Hitung mundur acara",
      "Integrasi Google Maps",
      "Dashboard pengelolaan tamu",
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

const comparison = [
  { name: "Web Development", timeline: "2–8 minggu", complexity: "Sedang–Tinggi" },
  { name: "Mobile Development", timeline: "4–12 minggu", complexity: "Tinggi" },
  { name: "Bot Telegram", timeline: "1–4 minggu", complexity: "Rendah–Sedang" },
  { name: "Undangan Digital", timeline: "3–7 hari", complexity: "Rendah" },
];

export { comparison };
