import GoogleAnalytics from "@/components/GoogleAnalytics";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daydev.studio"),
  title: "Daydev – Dari Ide Menjadi Aplikasi",
  description:
    "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa. Konsultasi gratis, harga terjangkau, hasil profesional.",
  keywords: [
    "pengembangan aplikasi",
    "web development",
    "mobile development",
    "bot telegram",
    "undangan digital",
    "startup",
    "UMKM",
    "skripsi",
    "daydev",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Daydev - Dari Ide Menjadi Aplikasi",
    description:
      "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa.",
    url: "https://daydev.studio",
    siteName: "Daydev",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Daydev Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daydev - Dari Ide Menjadi Aplikasi",
    description:
      "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa.",
    images: ["/logo.png"],
  },
};

// Organization & LocalBusiness Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Daydev",
  url: "https://daydev.studio",
  logo: "https://daydev.studio/logo.png",
  description:
    "Studio pengembangan aplikasi web dan mobile terpercaya. Kami mengubah ide menjadi solusi digital yang profesional untuk startup, UMKM, dan mahasiswa di Indonesia.",
  areaServed: {
    "@type": "Country",
    name: "Indonesia",
  },
  sameAs: [
    "https://instagram.com/daydev__",
    "https://wa.me/6285175284253",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+62 851-7528-4253",
      areaServed: "ID",
      availableLanguage: ["id"],
    },
  ],
};

// Local Business Schema with ratings
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Daydev Studio",
  description:
    "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa.",
  url: "https://daydev.studio",
  logo: "https://daydev.studio/logo.png",
  serviceArea: {
    "@type": "Country",
    name: "Indonesia",
  },
  telephone: "+62 851-7528-4253",
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "3",
  },
};

// Professional Service Schema (existing, expanded)
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Daydev",
  url: "https://daydev.studio",
  logo: "https://daydev.studio/logo.png",
  image: "https://daydev.studio/logo.png",
  description:
    "Jasa pengembangan aplikasi web dan mobile untuk startup, UMKM, dan mahasiswa di Indonesia.",
  areaServed: {
    "@type": "Country",
    name: "Indonesia",
  },
  sameAs: ["https://instagram.com/daydev__"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+62 851-7528-4253",
      areaServed: "ID",
      availableLanguage: ["id"],
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Jasa Pembuatan Website",
        description:
          "Desain dan pengembangan website profesional untuk bisnis, portfolio, dan e-commerce dengan teknologi terkini.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Jasa Pembuatan Aplikasi Mobile",
        description:
          "Pengembangan aplikasi iOS dan Android native dengan fitur-fitur canggih dan user experience terbaik.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pengembangan MVP Startup",
        description:
          "Konsep, desain, dan development MVP (Minimum Viable Product) untuk startup dengan metodologi agile dan hasil cepat.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pengembangan Bot Telegram",
        description:
          "Otomasi bisnis dan kemudahan komunikasi melalui bot Telegram yang custom sesuai kebutuhan Anda.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Undangan Digital",
        description:
          "Pembuatan undangan digital yang menarik, interaktif, dan profesional untuk acara spesial Anda.",
      },
    },
  ],
};

// Combine all schemas into @context array
const structuredData = [
  organizationSchema,
  localBusinessSchema,
  professionalServiceSchema,
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <GoogleAnalytics />
        {/* Multiple Structured Data Schemas */}
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
