/**
 * Blog articles data
 * Used for blog listing, detail pages, and SEO
 */

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  image?: string;
  readingTime: number; // in minutes
  publishedAt: string; // ISO date
  updatedAt?: string;
  excerpt: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "panduan-lengkap-membuat-undangan-digital",
    title: "Panduan Lengkap Membuat Undangan Digital yang Menarik",
    description:
      "Panduan step-by-step cara membuat undangan digital yang modern dan interaktif. Dari konsep, design, hingga cara berbagi ke tamu.",
    content: `
# Panduan Lengkap Membuat Undangan Digital

Undangan digital menjadi tren di era modern ini. Lebih dari sekedar hemat biaya, undangan digital juga more eco-friendly dan memudahkan tracking RSVP.

## Mengapa Memilih Undangan Digital?

1. **Lebih Terjangkau** - Hemat biaya print & pengiriman
2. **Mudah di-Share** - Cukup share link, tidak perlu print ribuan
3. **Real-time RSVP** - Tahu langsung siapa yang hadir
4. **Interaktif** - Bisa tambah foto, cerita, musik
5. **Ramah Lingkungan** - Tidak perlu mencetak kertas

## Langkah-Langkah Membuat Undangan Digital

### 1. Pilih Platform/Tool yang Tepat
Ada beberapa pilihan:
- **Custom Website** - Paling fleksibel, sepuasnya design
- **Template Builder** - Lebih mudah, sudah ada template siap pakai
- **Social Media** - Gratis, tapi terbatas fitur

### 2. Pilih Design/Tema
Pertimbangkan:
- Theme acara (minimalis, rustic, modern, vintage)
- Warna yang sesuai
- Font yang readable
- Layout yang bagus di mobile

### 3. Isi Konten Penting
- Nama pengantin & tanggal
- Lokasi & jam acara
- Info dress code
- Bank transfer / gift registry
- Contact person
- RSVP form

### 4. Tambah Elemen Interaktif
- Photo gallery
- Love story / cerita cinta
- Countdown timer
- Google Maps (lokasi acara)
- Music/playlist
- Guest book

### 5. Setup RSVP & Notifikasi
- Form untuk name, jumlah tamu, dietary restriction
- Notifikasi ke WA/Email saat ada RSVP baru
- Dashboard untuk tracking

### 6. Share & Promosi
- Generate QR code
- Share di WA, Instagram, Facebook
- Cek analytics & attendance rate
- Follow up yang belum RSVP

## Tips & Best Practices

✅ **Wajib**
- Mobile responsive (mayoritas buka dari WhatsApp/mobile)
- Location pin & jam yang jelas
- RSVP button yang obvious
- Kontak yang mudah dihubungi

❌ **Hindari**
- Design terlalu rumit (loading lama)
- Design hanya bagus di desktop
- Typo atau salah data
- Terlalu banyak animasi (lag)

## Perkiraan Biaya

| Opsi | Biaya | Fitur |
|------|-------|-------|
| DIY Template | Gratis-$50 | Basic, limited custom |
| Template Builder | $50-200 | Lebih custom, easy to use |
| Custom Development | $200-500+ | Full custom, unlimited fitur |

## Kesimpulan

Undangan digital adalah pilihan smart untuk acara modern. Tidak hanya hemat biaya, tapi juga profesional dan memorable bagi tamu.

Mau bikin undangan digital tapi tidak tahu caranya? Kami siap membantu! 😊
    `,
    author: "Tim Daydev",
    category: "Tutorial",
    tags: [
      "undangan digital",
      "tutorial",
      "acara",
      "pernikahan",
      "event",
    ],
    featured: true,
    readingTime: 8,
    publishedAt: "2024-03-20",
    updatedAt: "2024-03-25",
    excerpt:
      "Pelajari cara membuat undangan digital yang menarik dan interaktif. Panduan lengkap dari konsep hingga sharing dengan tamu.",
  },
  {
    id: "2",
    slug: "tips-optimasi-seo-website-umkm",
    title: "Tips Optimasi SEO untuk Website UMKM Agar Ranking Tinggi",
    description:
      "Panduan SEO praktis khusus untuk UMKM. Bagaimana cara ranking di Google tanpa budget marketing besar?",
    content: `
# Tips Optimasi SEO untuk Website UMKM

Banyak UMKM yang punya website tapi tidak ada traffic dari Google. Padahal kalau SEO di-optimize dengan baik, bisa dapat traffic organik gratis!

## Mengapa SEO Penting untuk UMKM?

- **Gratis** - Tidak perlu bayar per-click seperti iklan
- **Sustainable** - Traffic terjaga lama (tidak seperti iklan yang stop kalau ad stop)
- **Trust** - Orang lebih percaya hasil organic search vs ads
- **Cost-effective** - ROI terbaik untuk marketing budget kecil

## Langkah-Langkah SEO untuk UMKM

### 1. Keyword Research
Cari keywords yang:
- Relevant dengan bisnis Anda
- Punya volume search decent
- Kompetisi tidak terlalu tinggi

Contoh UMKM:
- "Toko kue online Jakarta" (untuk toko kue)
- "Jasa cleaning service Surabaya" (untuk cleaning)
- "Katering murah Bandung" (untuk catering)

### 2. On-Page Optimization
- **Title tag** - Include keyword utama (50-60 char)
- **Meta description** - Deskripsi singkat yang menarik (150-160 char)
- **H1** - Satu H1 per page, harus include keyword
- **Content** - Tulis natural, tidak perlu keyword stuffing
- **Images** - Pakai alt text dengan keyword
- **Internal linking** - Link ke halaman lain yang relevan

### 3. Technical SEO
- **Mobile responsive** - WAJIB! Mayoritas user pakai mobile
- **Page speed** - Target <3 detik loading time
- **SSL certificate** - Website harus HTTPS
- **Sitemap & robots.txt** - Bantu Google crawl website
- **Schema markup** - Structured data untuk rich snippets

### 4. Content Strategy
- Tulis blog/artikel berkualitas & helpful
- Target long-tail keywords (lebih spesifik, lebih mudah rank)
- Natural internal linking
- Update konten lama yang sudah outdated

### 5. Backlinks (Off-Page SEO)
- Minta link dari website lokal yang relevant
- Business directory (Google My Business, Yellow Pages, dll)
- Guest posting di blog lokal
- Social media mentions

### 6. Local SEO (untuk UMKM lokal)
- **Google My Business** - PENTING! Optimize GMB profile
- **Local citations** - Daftar di local directories
- **Local keywords** - Include nama kota/wilayah
- **Reviews** - Minta pelanggan review di GMB & Google

## Contoh Quick Wins untuk UMKM

1. **Optimize GMB profile** (1 hari)
   - Foto berkualitas
   - Deskripsi lengkap
   - Jam operasional
   - Link ke website

2. **Add meta descriptions** (1-2 hari)
   - Jika semua halaman belum punya
   - Target 150-160 characters
   - Include keyword

3. **Internal linking** (1-2 minggu)
   - Review semua halaman
   - Add 2-3 internal links per halaman
   - Use descriptive anchor text

4. **Mulai blog** (Ongoing)
   - Artikel 1-2 minggu sekali
   - Target long-tail keywords
   - Helpful & actionable content

## Tools Gratis untuk SEO

- **Google Search Console** - Monitor ranking & errors
- **Google Analytics** - Traffic tracking
- **Ubersuggest** (free version) - Keyword research
- **Mobile-Friendly Test** - Check mobile optimization
- **PageSpeed Insights** - Check loading speed
- **Screaming Frog** (free version) - Website audit

## Timeline Realistis

- **1 bulan** - Foundation setup, optimization awal
- **3 bulan** - Mulai lihat progress, beberapa keyword ranking
- **6 bulan** - Traffic meningkat signifikan
- **1 tahun** - Established ranking untuk keywords utama

Ingat: SEO itu jangka panjang, bukan instant. Tapi worth it!

## Kesimpulan

UMKM tidak perlu budget marketing besar untuk dapat traffic Google. Dengan optimasi SEO yang konsisten + content berkualitas, bisa dapat traffic organik gratis.

Mulai sekarang juga! 🚀
    `,
    author: "Tim Daydev",
    category: "SEO",
    tags: ["seo", "umkm", "digital marketing", "google ranking", "tips"],
    featured: true,
    readingTime: 12,
    publishedAt: "2024-03-15",
    excerpt:
      "Pelajari tips SEO praktis untuk UMKM agar ranking tinggi di Google tanpa budget marketing besar.",
  },
  {
    id: "3",
    slug: "teknologi-terkini-web-development-2024",
    title: "Teknologi Terkini Web Development 2024 yang Wajib Diketahui",
    description:
      "Update teknologi web development yang trending di 2024. Dari framework, tools, hingga best practices.",
    content: `
# Teknologi Terkini Web Development 2024

Web development terus evolve dengan teknologi dan trend baru. Mari kita bahas teknologi yang trending & wajib diketahui di 2024.

## Frontend Frameworks

### React (masih dominan)
- Ecosystem besar & mature
- Banyak library support
- Cocok untuk aplikasi kompleks

### Next.js (semakin populer)
- Full-stack React framework
- Built-in SSR/SSG
- AI integration lebih mudah
- Ideal untuk startup yang ingin move fast

### Vue.js (solid alternative)
- Syntax lebih simple
- Good documentation
- Gentler learning curve

### Astro (untuk static content)
- Fast build times
- Low JavaScript
- Good untuk blog/documentation sites

## Backend Technologies

### Node.js + Express/Fastify
- JavaScript everywhere
- Large ecosystem
- Good untuk real-time apps

### Python + FastAPI/Django
- Clean syntax
- Great libraries (data processing, AI/ML)
- Good for data-intensive apps

### Go
- Fast execution
- Concurrent
- Good for high-traffic apps

## Key Trends 2024

### 1. AI Integration
- AI-powered features jadi standard
- LLM integration (ChatGPT, Claude, dll)
- AI-assisted development tools (GitHub Copilot, etc)

### 2. TypeScript Adoption
- Type safety reduces bugs
- Better developer experience
- Industry standard sekarang

### 3. Edge Computing
- Serverless functions
- Faster response time
- Lower costs

### 4. Database Innovation
- PostgreSQL masih king
- NoSQL specialized (MongoDB, Supabase)
- Serverless databases trending

### 5. DevOps & Containerization
- Docker & Kubernetes standard
- CI/CD automation
- Infrastructure as Code

## Tools & Services 2024

| Category | Popular | Alternative |
|----------|---------|-------------|
| Hosting | Vercel, Netlify | Railway, Render |
| Database | PostgreSQL | Supabase, PlanetScale |
| ORM | Prisma | TypeORM, Drizzle |
| Testing | Vitest, Jest | Playwright (e2e) |
| Styling | Tailwind | UnoCSS, Panda CSS |
| Bundler | Vite, esbuild | Turbopack |

## Best Practices 2024

✅ **Do**
- Use TypeScript
- Write tests (unit + integration)
- Optimize Web Vitals
- Use proper error tracking
- API versioning
- Security best practices (OWASP)

❌ **Don't**
- Skip security
- Ignore performance
- Monolithic architecture
- Manual deployment
- Technical debt piling

## Skill yang Wajib Dimiliki

### Core (fundamentals)
- HTML/CSS/JavaScript
- HTTP & REST API
- Git & version control
- Database basics

### Modern Stack Pick One
- **Full-stack JS**: Next.js + TypeScript + Prisma
- **Python**: FastAPI + SQLAlchemy
- **Go**: Gin + GORM

### DevOps/Infra
- Docker basics
- Git CI/CD
- Cloud platforms (AWS/GCP/Railway)

## Learning Path untuk 2024

**Beginner (3-6 bulan)**
- HTML/CSS/JavaScript fundamentals
- React basics
- Git & GitHub

**Intermediate (6-12 bulan)**
- React advanced
- Next.js
- TypeScript
- Database (PostgreSQL)
- API design

**Advanced (1-2+ tahun)**
- Full-stack development
- DevOps/Deployment
- System design
- Optimization & Performance

## Tools untuk Productivity

- **VS Code** - Best editor hands down
- **GitHub Copilot** - AI-assisted coding
- **Cursor** - AI-first code editor
- **ChatGPT/Claude** - Brainstorming & debugging
- **Figma** - Design collaboration

## Kesimpulan

Web development 2024 lebih accessible tapi juga more complex. Fokus pada fundamentals, learn TypeScript, integrate AI strategically.

Jangan chase setiap trend, tapi stay updated dengan yang relevant untuk project Anda.

Happy coding! 💻
    `,
    author: "Tim Daydev",
    category: "Technology",
    tags: [
      "web development",
      "technology",
      "2024 trends",
      "javascript",
      "typescript",
    ],
    featured: false,
    readingTime: 10,
    publishedAt: "2024-03-10",
    excerpt:
      "Explore trending technologies in web development 2024. From frameworks, tools, to best practices.",
  },
];

export function getAllArticles(): BlogArticle[] {
  return blogArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedArticles(): BlogArticle[] {
  return blogArticles
    .filter((article) => article.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles
    .filter((article) => article.category === category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticlesByTag(tag: string): BlogArticle[] {
  return blogArticles
    .filter((article) => article.tags.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getAllCategories(): string[] {
  const categories = new Set(blogArticles.map((article) => article.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
