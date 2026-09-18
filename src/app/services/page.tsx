import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { services } from "@/data/services";
import { whatsapp } from "@/models/whatsapp";
import { serviceIcons } from "@/lib/service-icons";
import { ArrowUpRight, Check, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layanan - Daydev Studio",
  description:
    "Jasa pengembangan website, aplikasi mobile, bot Telegram, dan undangan digital untuk startup, UMKM, dan mahasiswa.",
  alternates: {
    canonical: "https://daydev.studio/services",
  },
};

const comparison = [
  { name: "Web Development", timeline: "2–8 minggu", complexity: "Sedang–Tinggi" },
  { name: "Mobile Development", timeline: "4–12 minggu", complexity: "Tinggi" },
  { name: "Bot Telegram", timeline: "1–4 minggu", complexity: "Rendah–Sedang" },
  { name: "Undangan Digital", timeline: "3–7 hari", complexity: "Rendah" },
];

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Layanan</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Solusi dari ide menjadi produk yang dipakai.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Kami membantu startup, UMKM, dan mahasiswa membangun website, aplikasi mobile, bot Telegram, hingga undangan digital.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] ?? Globe;
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{service.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {service.benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.targetAudience.map((audience) => (
                    <span key={audience} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                      {audience}
                    </span>
                  ))}
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary">
                  Baca detail layanan <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Perbandingan</p>
          <h2 className="mt-2 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Pilih layanan yang sesuai kebutuhan Anda.
          </h2>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-bold text-foreground">Layanan</th>
                  <th className="px-6 py-4 text-center font-bold text-foreground">Timeline</th>
                  <th className="px-6 py-4 text-center font-bold text-foreground">Kompleksitas</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={row.name} className={idx !== comparison.length - 1 ? "border-b border-border" : undefined}>
                    <td className="px-6 py-4 font-semibold text-foreground">{row.name}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.timeline}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.complexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#172033]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:py-20">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Siap memulai proyek Anda?</h2>
            <p className="mt-3 max-w-xl leading-7 text-gray-300">
              Konsultasi gratis untuk menyusun langkah paling masuk akal, tanpa komitmen.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(whatsapp.defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 min-h-[48px] items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Konsultasi via WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}