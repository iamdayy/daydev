import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllServiceSlugs, getServiceBySlug } from "@/data/services";
import { Metadata } from "next";
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
  const serviceParams = ((await params) as any).service;
  const service = getServiceBySlug(serviceParams);

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

export default function ServiceDetailPage({ params }: Props) {
    const { service: serviceParams} = React.use(params)
  const service = getServiceBySlug(serviceParams);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section
        className="py-20 px-4"
        style={{
          backgroundColor: service.lightBg,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{service.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                {service.title}
              </h1>
              <p className="text-xl text-slate-600">{service.description}</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="text-slate-600 text-sm">
            <Link href="/" className="hover:text-slate-900">
              Beranda
            </Link>
            {" / "}
            <Link href="/services" className="hover:text-slate-900">
              Layanan
            </Link>
            {" / "}
            <span className="text-slate-900 font-semibold">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Tentang {service.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {service.longDescription}
          </p>

          {/* Target Audience */}
          <div className="bg-slate-50 p-8 rounded-lg mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Ideal Untuk:</h3>
            <div className="flex flex-wrap gap-3">
              {service.targetAudience.map((audience, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-slate-200 rounded-full text-slate-900 font-medium"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Keuntungan {service.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {service.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                  style={{
                    backgroundColor: service.color,
                  }}
                >
                  ✓
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-lg">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Fitur Utama
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {service.features.map((feature, idx) => (
              <div key={idx} className="border-l-4 pl-6 py-2" style={{
                borderColor: service.color,
              }}>
                <p className="text-slate-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Pertanyaan Umum
          </h2>

          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg border border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Berapa lama waktu pengerjaan?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Waktu pengerjaan tergantung pada kompleksitas project. Untuk{" "}
                {service.title.toLowerCase()}, estimasi biasanya{" "}
                {service.title.includes("Undangan") && "3-7 hari"}
                {service.title.includes("Bot") && "1-4 minggu"}
                {service.title.includes("Web") && "2-8 minggu"}
                {service.title.includes("Mobile") && "4-12 minggu"}
                . Kami akan memberikan timeline detail setelah konsultasi awal.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apakah ada package/paket yang tersedia?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Ya, kami menyediakan berbagai paket sesuai dengan kebutuhan dan budget Anda.
                Mulai dari paket basic hingga enterprise. Silahkan kunjungi halaman pricing
                untuk melihat detail paket lengkap.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apakah ada dukungan setelah project selesai?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Tentu saja! Kami menyediakan dukungan teknis dan maintenance setelah project
                selesai. Detail dukungan bervariasi tergantung paket yang Anda pilih. Tim kami
                siap membantu jika ada kendala atau update yang diperlukan.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Bagaimana proses pembayaran?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Kami menerima pembayaran via transfer bank, e-wallet, atau cicilan sesuai
                kesepakatan. Untuk proyek besar, kami mengikuti sistem down payment + progress
                payment sesuai milestone yang telah disepakati.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{
        backgroundColor: service.color + "20",
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Tertarik dengan {service.title}?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran khusus!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6285175284253"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-bold text-white transition-colors inline-block"
              style={{
                backgroundColor: service.color,
              }}
            >
              Chat via WhatsApp
            </a>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-lg font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors inline-block"
            >
              Lihat Paket Harga
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Layanan Lainnya
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/services/web-development"
              className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-all"
            >
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="font-bold text-slate-900">Web Development</h3>
              <p className="text-slate-600 text-sm mt-2">
                Website profesional yang responsive dan cepat
              </p>
            </Link>

            <Link
              href="/services/mobile-development"
              className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-all"
            >
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-slate-900">Mobile Development</h3>
              <p className="text-slate-600 text-sm mt-2">
                Aplikasi iOS dan Android dengan performa optimal
              </p>
            </Link>

            <Link
              href="/services/telegram-bot"
              className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-all"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-slate-900">Bot Telegram</h3>
              <p className="text-slate-600 text-sm mt-2">
                Automasi cerdas untuk bisnis Anda
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
