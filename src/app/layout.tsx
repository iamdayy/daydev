import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daydev – Dari Ide Menjadi Aplikasi",
  description:
    "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa. Konsultasi gratis, harga terjangkau, hasil profesional.",
  keywords: [
    "pengembangan aplikasi",
    "web development",
    "mobile development",
    "startup",
    "UMKM",
    "skripsi",
    "daydev",
  ],
  openGraph: {
    title: "Daydev – Dari Ide Menjadi Aplikasi",
    description:
      "Solusi pengembangan aplikasi Web & Mobile terpercaya untuk Startup, UMKM, dan Mahasiswa.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
