/**
 * FAQ data for services
 * Used to generate FAQ schemas and display FAQs on service pages
 */

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceFAQs {
  serviceId: string;
  serviceName: string;
  faqs: FAQ[];
}

export const serviceFAQs: ServiceFAQs[] = [
  {
    serviceId: "web-development",
    serviceName: "Web Development",
    faqs: [
      {
        question:
          "Berapa lama biasanya pembuatan website profesional memakan waktu?",
        answer:
          "Timeline untuk website profesional biasanya 2-8 minggu tergantung kompleksitas. Website sederhana (company profile) biasanya 2-3 minggu, website e-commerce atau dengan custom features memakan 4-8 minggu. Kami akan memberikan timeline detail setelah konsultasi awal.",
      },
      {
        question: "Apakah website yang dibuat bisa diupdate sendiri?",
        answer:
          "Ya, semua website yang kami buat menggunakan CMS user-friendly atau design yang mudah di-maintain. Kami juga menyediakan training lengkap agar Anda bisa update konten, foto, dan informasi lainnya tanpa harus menghubungi developer.",
      },
      {
        question: "Apakah website akan SEO-optimized?",
        answer:
          "Ya, semua website kami di-build dengan best practices SEO. Termasuk: page speed optimization, mobile responsive, meta tags, schema markup, sitemap, robots.txt, dan technical optimization lainnya. Kami juga memberikan guidance untuk on-page SEO seperti keyword research dan content optimization.",
      },
      {
        question:
          "Apakah termasuk domain dan hosting selamanya atau ada biaya tambahan?",
        answer:
          "Domain dan hosting biasanya terpisah dari harga website development. Kami banyak memberikan free hosting selama beberapa bulan (3-12 bulan tergantung paket). Setelah itu, klien membayar hosting tahunan (relatif terjangkau, ~$50-200/tahun tergantung kebutuhan). Domain beli sendiri atau kami bantu.",
      },
      {
        question: "Apakah ada biaya maintenance setelah website selesai?",
        answer:
          "Website yang sudah selesai tidak perlu biaya maintenance jika Anda handle sendiri. Tapi kami juga menawarkan optional maintenance package untuk: backup otomatis, security updates, bug fixes, dan minor updates. Biasanya ~$50-200/bulan tergantung scope.",
      },
      {
        question: "Bisa di-integrate dengan sistem yang sudah ada?",
        answer:
          "Tentu! Kami bisa integrate website dengan API, database, atau sistem existing. Contoh: integration dengan WA API, payment gateway, CRM, inventory system, dll. Kami bisa diskusikan kebutuhan integrasi spesifik Anda.",
      },
    ],
  },
  {
    serviceId: "mobile-development",
    serviceName: "Mobile Development",
    faqs: [
      {
        question: "Apakah aplikasi bisa di-develop untuk iOS dan Android secara bersamaan?",
        answer:
          "Ya, kami bisa develop cross-platform menggunakan React Native yang support both iOS dan Android dengan 1 codebase. Atau jika Anda butuh native performance maksimal, kami bisa develop native untuk both platform (lebih lama tapi lebih optimal). Tergantung kebutuhan dan budget.",
      },
      {
        question: "Berapa biaya & timeline untuk aplikasi mobile?",
        answer:
          "Timeline untuk MVP aplikasi biasanya 4-12 minggu tergantung complexity. Harga mulai dari ~$3,500 (simple app dengan 1-3 fitur) hingga $10,000+ untuk aplikasi kompleks. Kami menawarkan fleksibilitas dengan paket dan cicilan. Diskusikan kebutuhan di konsultasi awal.",
      },
      {
        question: "Apakah aplikasi harus di-publish ke App Store dan Google Play?",
        answer:
          "Tidak wajib, tapi disarankan untuk reach maksimal. Kami bisa handle publication process termasuk setup developer account, submission ke App Store & Play Store, dan addressing review feedback. Ada biaya publication (sekali, tidak recurring) plus subscription developer account tahunan.",
      },
      {
        question:
          "Bagaimana kalau ingin update fitur atau bug fix setelah app launch?",
        answer:
          "Semua update dan bug fix didiskusikan dengan klien. Kami memberikan support period tertentu (biasanya 1-3 bulan post-launch gratis untuk bug fixes). Setelah itu, ada option maintenance package atau bayar per-feature development.",
      },
      {
        question:
          "Apakah aplikasi bisa offline atau butuh internet terus-menerus?",
        answer:
          "Tergantung kebutuhan. Kami bisa design aplikasi dengan 'offline-first' architecture sehingga bisa digunakan offline dan sync ke server saat ada internet. Atau aplikasi real-time yang perlu internet terus. Diskusikan requirement Anda.",
      },
    ],
  },
  {
    serviceId: "telegram-bot",
    serviceName: "Bot Telegram",
    faqs: [
      {
        question: "Apakah bot Telegram sulit untuk setup dan maintenance?",
        answer:
          "Tidak, bot Telegram cukup mudah. Tapi biasanya perlu server untuk host bot agar berjalan 24/7. Kami handle semuanya: development, deployment, dan maintenance. Anda hanya perlu interaksi dengan bot, kami yang jaga technical side.",
      },
      {
        question: "Bisa integrate bot dengan sistem backend saya?",
        answer:
          "Ya! Bot Telegram bisa di-integrate dengan API, database, payment gateway, CRM, atau sistem apapun. Contoh: bot mengambil data dari API Anda, lalu menampilkan kepada user. Atau bot menerima input dari user, lalu simpan ke database Anda.",
      },
      {
        question: "Berapa biaya hosting bot Telegram?",
        answer:
          "Biaya hosting bot sangat terjangkau, usually less than $5/bulan untuk low-traffic bot. Untuk high-traffic bot bisa $10-50/bulan. Kami tangani setup, Anda tinggal bayar hosting provider langsung. Atau kami bisa bantu manage infranya.",
      },
      {
        question: "Bisa buat bot dengan fitur/command yang banyak?",
        answer:
          "Tentu! Bot bisa punya unlimited commands. Dari simple text response, hingga complex automation dengan database integration, webhook, scheduled tasks, dll. Semakin kompleks, tentu semakin lama development dan biaya lebih tinggi.",
      },
      {
        question: "Apakah user bisa invite bot ke group Telegram?",
        answer:
          "Ya, bot bisa bekerja di personal chat, group, dan channel (dengan permission setup yang tepat). Kami bisa design bot untuk group automation/moderation atau personal assistant. Tergantung use case.",
      },
    ],
  },
  {
    serviceId: "undangan-digital",
    serviceName: "Undangan Digital",
    faqs: [
      {
        question: "Berapa lama buat undangan digital dari awal sampai sempurna?",
        answer:
          "Biasanya 3-7 hari kerja dari konsultasi sampai undangan live dan siap dibagiin. Tergantung seberapa banyak revisi yang diminta dan seserah Anda memberikan data/foto untuk undangan. dengan rush fee, bisa lebih cepat.",
      },
      {
        question: "Bisa customize design sesuai tema saya?",
        answer:
          "Tentu! Kami menawarkan pilihan dari template premium atau custom design dari nol sesuai tema dan preferensi Anda. Paket Premium & Eksklusif termasuk custom design. Paket Basic pakai template yang bisa di-customize warna dan font.",
      },
      {
        question: "Bagaimana cara tamu RSVP? Bisa tracking dari mana?",
        answer:
          "Tamu click tombol RSVP di undangan, isi form (nama, jumlah kehadiran, diet/preference), dan submit. Data RSVP langsung masuk ke dashboard Anda real-time. Anda bisa lihat siapa yang confirm, reject, berapa total tamu, dll. Plus, bisa setup notifikasi WA otomatis.",
      },
      {
        question: "Berapa lama undangan akan aktif/hosting?",
        answer:
          "Hosting gratis biasanya 3-6 bulan tergantung paket. Setelah itu, ada opsi extend hosting dengan biaya tahunan (~$10-30/tahun) atau download seluruh data dan pindah. Kami juga bisa discuss custom hosting arrangement.",
      },
      {
        question: "Apakah undangan bisa di-share ke berbagai media?",
        answer:
          "Ya, undangan punya URL (link) yang bisa di-share via WA, email, social media, apapun. Kami juga bisa generate QR code yang langsung ke undangan. Design undangan juga responsive, jadi bagus di-view dari mobile maupun desktop.",
      },
    ],
  },
];

export function getFAQsByServiceId(serviceId: string): FAQ[] {
  const serviceFAQ = serviceFAQs.find((s) => s.serviceId === serviceId);
  return serviceFAQ ? serviceFAQ.faqs : [];
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
