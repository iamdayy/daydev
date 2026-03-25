"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { services } from "@/data/services";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Layanan Kami
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Solusi lengkap pengembangan aplikasi dan teknologi digital untuk
            mengubah ide Anda menjadi kenyataan.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group"
              >
                <div
                  className="p-8 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-all duration-300 h-full"
                  style={{
                    backgroundColor: service.lightBg,
                  }}
                >
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-slate-700 mb-4">{service.description}</p>

                  {/* Benefits Preview */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Keuntungan:
                    </h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {service.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Audience */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.targetAudience.map((audience, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white bg-opacity-60 rounded-full text-sm text-slate-700 font-medium"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors group-hover:shadow-lg">
                    Pelajari Lebih Lanjut →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Pilih Layanan yang Sesuai dengan Kebutuhan Anda
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">
                    Layanan
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900">
                    Timeline
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900">
                    Kompleksitas
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    Web Development
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    2-8 minggu
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    Sedang-Tinggi
                  </td>
                  <td className="py-4 px-4 text-center text-green-600">
                    ★★★★★
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    Mobile Development
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    4-12 minggu
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    Tinggi
                  </td>
                  <td className="py-4 px-4 text-center text-green-600">
                    ★★★★★
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    Bot Telegram
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    1-4 minggu
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    Rendah-Sedang
                  </td>
                  <td className="py-4 px-4 text-center text-green-600">
                    ★★★★
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    Undangan Digital
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    3-7 hari
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    Rendah
                  </td>
                  <td className="py-4 px-4 text-center text-green-600">
                    ★★★
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap untuk Memulai Proyek Anda?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Hubungi kami sekarang untuk konsultasi gratis dan diskusi detail
            tentang kebutuhan Anda.
          </p>
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Konsultasi Gratis via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
