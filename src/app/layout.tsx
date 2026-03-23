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

const structuredData = {
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
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Jasa Pembuatan Aplikasi Mobile",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pengembangan MVP Startup",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
