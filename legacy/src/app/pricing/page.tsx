import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PriceCalculator from "@/components/PriceCalculator";
import Pricing from "@/components/Pricing";
import WhatsAppButton from "@/components/WhatsAppButton";
import { whatsapp } from "@/models/whatsapp";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Harga & Paket - Daydev Studio",
  description:
    "Lihat paket dan harga layanan kami yang terjangkau untuk Web Development, Mobile App, Bot Telegram, dan Undangan Digital.",
  keywords: [
    "harga layanan",
    "paket website",
    "paket aplikasi",
    "pricing",
    "biaya jasa",
  ],
  alternates: {
    canonical: "https://daydev.studio/pricing",
  },
};

const faqs = [
  {
    question: "Apakah ada paket cicilan?",
    answer:
      "Ya, tersedia opsi cicilan dengan skema down payment dan progress payment atau cicilan berjenjang. Hubungi kami untuk diskusi detail.",
  },
  {
    question: "Berapa banyak revisi yang termasuk dalam paket?",
    answer:
      "Jumlah revisi tergantung paket. Paket basic umumnya termasuk 2 revisi, paket pro termasuk revisi tanpa batas. Revisi tambahan di luar paket dapat dibiayai terpisah.",
  },
  {
    question: "Apakah harga termasuk maintenance dan support jangka panjang?",
    answer:
      "Harga yang ditampilkan adalah untuk pengembangan project. Maintenance dan support jangka panjang dapat ditambahkan sebagai paket terpisah (hosting, support, backup berkala).",
  },
  {
    question: "Apakah ada diskon untuk project besar atau kontrak jangka panjang?",
    answer:
      "Ya, kami menawarkan diskon khusus untuk project besar, kontrak jangka panjang, atau beberapa project sekaligus. Hubungi tim kami untuk penawaran custom.",
  },
  {
    question: "Apa saja yang sudah termasuk dalam setiap paket?",
    answer:
      "Setiap paket mencakup konsultasi awal, development, testing, deployment, dokumentasi, dan support untuk jangka waktu tertentu. Detail lengkap ada di setiap kategori layanan.",
  },
];

const planComparison = [
  { feature: "Development", basic: "✓", pro: "✓", premium: "✓" },
  { feature: "Design", basic: "Template", pro: "Custom", premium: "Premium custom" },
  { feature: "Revisi", basic: "2x", pro: "Tanpa batas", premium: "Tanpa batas" },
  { feature: "Hosting (gratis)", basic: "3 bulan", pro: "6 bulan", premium: "12 bulan" },
  { feature: "Support", basic: "Email", pro: "Chat 24/7", premium: "Dedicated team" },
  { feature: "Training", basic: "–", pro: "✓", premium: "✓" },
];

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Harga &amp; paket</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Harga yang jelas, tanpa biaya tersembunyi.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Pilih paket sesuai kebutuhan dan budget. Semua paket sudah mencakup konsultasi awal dan dukungan teknis.
          </p>
        </div>
      </section>

      <Pricing />

      <PriceCalculator />

      <section className="bg-background">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Pertanyaan tentang harga</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border bg-card p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Perbandingan paket</h2>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#172033] text-left text-white">
                  <th className="px-6 py-4 font-bold">Fitur</th>
                  <th className="px-6 py-4 text-center font-bold">Basic</th>
                  <th className="px-6 py-4 text-center font-bold">Pro</th>
                  <th className="px-6 py-4 text-center font-bold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {planComparison.map((row, idx) => (
                  <tr key={row.feature} className={idx !== planComparison.length - 1 ? "border-b border-border" : undefined}>
                    <td className="px-6 py-4 font-semibold text-foreground">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.basic}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-secondary p-8 sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Butuh paket custom?</p>
            <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">Belum menemukan paket yang tepat?</h2>
          </div>
          <Link
            href={`https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(whatsapp.defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 min-h-[48px] items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Diskusikan via WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}