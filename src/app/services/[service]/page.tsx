import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllServiceSlugs, getServiceBySlug, services } from "@/data/services";
import { whatsapp } from "@/models/whatsapp";
import { serviceIcons } from "@/lib/service-icons";
import { ArrowUpRight, ChevronDown, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Usable } from "react";

interface Props {
  params: Usable<{
    service: string;
  }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({
    service: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = (await params) as { service: string };
  const service = getServiceBySlug(resolved.service);

  if (!service) {
    return {
      title: "Layanan Tidak Ditemukan",
    };
  }

  return {
    title: `${service.title} - Daydev Studio`,
    description: service.metaDescription,
    keywords: service.title.split(" "),
    alternates: {
      canonical: `https://daydev.studio/services/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url: `https://daydev.studio/services/${service.slug}`,
      type: "website",
    },
  };
}

const faqs = (service: string) => [
  {
    question: "Berapa lama waktu pengerjaan?",
    answer: `Waktu pengerjaan tergantung kompleksitas project. Estimasi untuk ${service.toLowerCase()} bisa dilihat di halaman layanan. Kami memberikan timeline detail setelah konsultasi awal.`,
  },
  {
    question: "Apakah ada paket yang tersedia?",
    answer:
      "Ya, kami menyediakan berbagai paket sesuai kebutuhan dan budget, dari basic hingga lengkap. Silakan lihat halaman harga untuk detail paket.",
  },
  {
    question: "Apakah ada dukungan setelah project selesai?",
    answer:
      "Ya, kami menyediakan dukungan teknis dan maintenance setelah project selesai. Detail dukungan bervariasi tergantung paket yang dipilih.",
  },
  {
    question: "Bagaimana proses pembayaran?",
    answer:
      "Kami menerima transfer bank dan e-wallet. Untuk proyek besar, pembayaran mengikuti skema down payment dan progress payment sesuai milestone yang disepakati.",
  },
];

export default function ServiceDetailPage({ params }: Props) {
  const { service: serviceParams } = React.use(params);
  const service = getServiceBySlug(serviceParams);

  if (!service) {
    notFound();
  }

  const ServiceIcon = serviceIcons[service.icon] ?? Globe;
  const related = services.filter((item) => item.slug !== service.slug);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <section className="border-b border-border" style={{ backgroundColor: service.lightBg }}>
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Beranda</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/services" className="transition-colors hover:text-foreground">Layanan</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-semibold text-foreground">{service.title}</span>
          </nav>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
              <ServiceIcon className="size-8" style={{ color: service.color }} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{service.title}</h1>
              <p className="mt-3 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Tentang {service.title}</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{service.longDescription}</p>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8">
          <h3 className="text-lg font-bold text-foreground">Ideal untuk:</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.targetAudience.map((audience) => (
              <span key={audience} className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground">
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Keuntungan {service.title}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: service.color }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <p className="font-semibold leading-7 text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Fitur utama</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {service.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: service.color }} aria-hidden="true" />
              <p className="font-medium leading-7 text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Pertanyaan umum</h2>
          <div className="mt-10 space-y-4">
            {faqs(service.title).map((faq) => (
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

      <section className="bg-[#172033]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:py-20">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Tertarik dengan {service.title}?</h2>
            <p className="mt-3 max-w-xl leading-7 text-gray-300">Hubungi kami untuk konsultasi gratis dan dapatkan penawaran yang sesuai kebutuhan.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={`https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(whatsapp.defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Chat via WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#ea7b3c] px-5 py-3 font-semibold text-[#172033] transition-transform hover:scale-[1.02]"
            >
              Lihat paket harga <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:pt-24">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Layanan lainnya</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {related.map((item) => {
            const Icon = serviceIcons[item.icon] ?? Globe;
            return (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <Icon className="size-8 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}