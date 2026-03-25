import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PriceCalculator from "@/components/PriceCalculator";
import Pricing from "@/components/Pricing";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Metadata } from "next";

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

export default function PricingPage() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Paket & Harga
          </h1>
          <p className="text-xl text-slate-600">
            Pilih paket yang sesuai dengan kebutuhan dan budget Anda. Semua paket dilengkapi
            dengan konsultasi gratis dan dukungan teknis.
          </p>
        </div>
      </section>

      {/* Pricing Component */}
      <Pricing />

      {/* Price Calculator */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Kalkulator Harga Custom
          </h2>
          <PriceCalculator />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Pertanyaan Tentang Harga
          </h2>

          <div className="space-y-6">
            <details className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apakah ada paket cicilan?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Ya, kami menyediakan opsi cicilan dengan skema down payment + progress
                payment atau cicilan berjenjang. Silahkan hubungi kami untuk diskusi detail
                tentang opsi cicilan yang tersedia.
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Berapa banyak revisi yang termasuk dalam paket?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Jumlah revisi tergantung paket yang Anda pilih. Paket Basic biasanya
                termasuk 2 revisi, Pro termasuk unlimited revisi. Revisi tambahan diluar
                paket dapat dibiayai secara terpisah.
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apakah harga termasuk maintenance/support jangka panjang?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Harga yang ditampilkan adalah untuk pengembangan project. Maintenance dan
                support jangka panjang dapat ditambahkan dengan paket terpisah (hosting,
                support 24/7, regular backup, dll).
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apakah ada diskon untuk project besar atau kontrak jangka panjang?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Ya, kami menawarkan diskon khusus untuk project besar, kontrak jangka
                panjang, atau multiple projects. Hubungi tim kami untuk mendiskusikan
                penawaran custom.
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 cursor-pointer group">
              <summary className="font-bold text-slate-900 flex justify-between items-center">
                Apa yang sudah termasuk dalam setiap paket?
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Setiap paket termasuk: konsultasi awal, development, testing, deployment,
                dokumentasi, training, dan support kurun waktu tertentu. Detail lengkap
                bisa dilihat di setiap kategori layanan.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Perbandingan Paket
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left py-4 px-4 font-bold">Fitur</th>
                  <th className="text-center py-4 px-4 font-bold">Basic</th>
                  <th className="text-center py-4 px-4 font-bold">Pro</th>
                  <th className="text-center py-4 px-4 font-bold">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold">Development</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold">Design</td>
                  <td className="text-center py-4 px-4">Template</td>
                  <td className="text-center py-4 px-4">Custom</td>
                  <td className="text-center py-4 px-4">Premium Custom</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold">Revisi</td>
                  <td className="text-center py-4 px-4">2x</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold">Hosting (Gratis)</td>
                  <td className="text-center py-4 px-4">3 bulan</td>
                  <td className="text-center py-4 px-4">6 bulan</td>
                  <td className="text-center py-4 px-4">12 bulan</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold">Support</td>
                  <td className="text-center py-4 px-4">Email</td>
                  <td className="text-center py-4 px-4">Chat 24/7</td>
                  <td className="text-center py-4 px-4">Dedicated Team</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Training</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓✓</td>
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
            Belum Menemukan Paket yang Tepat?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Hubungi kami untuk membuat paket custom yang sesuai dengan kebutuhan spesifik Anda.
          </p>
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Hubungi Kami Sekarang
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
