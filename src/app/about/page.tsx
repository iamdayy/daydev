import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - Daydev Studio",
  description:
    "Daydev studio adalah perusahaan pengembangan software yang terpercaya dan profesional. Kami membantu startup, UMKM, dan mahasiswa mengubah ide menjadi aplikasi real.",
  keywords: [
    "tentang daydev",
    "perusahaan software",
    "tim developer",
    "pengembang aplikasi",
  ],
  alternates: {
    canonical: "https://daydev.studio/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Tentang Daydev Studio
          </h1>
          <p className="text-xl text-slate-600">
            Kami adalah tim developer profesional yang berdedikasi untuk mengubah ide Anda
            menjadi solusi digital yang nyata dan berdampak.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Misi Kami</h3>
              <p className="text-slate-600">
                Menyediakan solusi teknologi berkualitas tinggi yang terjangkau dan mudah
                diakses oleh startup, UMKM, dan mahasiswa di Indonesia.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visi Kami</h3>
              <p className="text-slate-600">
                Menjadi partner terpercaya dalam transformasi digital dan membantu bisnis
                Indonesia berkembang melalui teknologi.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Nilai Kami</h3>
              <p className="text-slate-600">
                Integritas, inovasi, dan hasil berkualitas. Kami percaya pada transparansi
                dan kolaborasi yang kuat dengan klien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Cerita Kami</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Daydev Studio didirikan dengan visi sederhana: membuatsolusi teknologi yang
              berkualitas menjadi terjangkau dan mudah diakses. Kami menyadari bahwa
              banyak startup, UMKM, dan mahasiswa di Indonesia memiliki ide bagus tapi
              terhambat oleh biaya dan akses ke developer profesional.
            </p>
            <p>
              Dengan tim yang berpengalaman dalam berbagai bidang (web development, mobile
              development, backend systems, dan UX/UI design), kami mampu memberikan solusi
              end-to-end yang comprehensive dan terpercaya.
            </p>
            <p>
              Sejak didirikan, kami telah membantu ratusan klien mewujudkan ide mereka
              menjadi produk digital yang sukses di pasar. Dari undangan digital yang
              meriah, bot telegram yang menghemat waktu, website yang meningkatkan penjualan,
              hingga aplikasi mobile dan MVP startup yang competitive.
            </p>
            <p>
              Setiap project adalah kesempatan bagi kami untuk belajar, tumbuh, dan
              memberikan dampak positif. Kepuasan klien adalah prioritas utama kami, dan
              kami berkomitmen untuk memberikan hasil yang melebihi ekspektasi.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Mengapa Memilih Daydev?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Tim Profesional & Berpengalaman
                </h3>
                <p className="text-slate-600">
                  Tim kami terdiri dari developer, designer, dan project manager berpengalaman
                  yang passionate tentang teknologi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Harga Terjangkau & Kompetitif
                </h3>
                <p className="text-slate-600">
                  Kami menawarkan paket yang fleksibel dan terjangkau tanpa mengorbankan
                  kualitas hasil kerja.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Responsif & Komunikasi Terbuka
                </h3>
                <p className="text-slate-600">
                  Kami aktif berkomunikasi dengan klien dan selalu responsif terhadap feedback
                  dan kebutuhan perubahan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Support Jangka Panjang
                </h3>
                <p className="text-slate-600">
                  Kami tidak hanya mengerjakan project, tapi juga memberikan support dan
                  maintenance jangka panjang.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Portfolio Proven Track Record
                </h3>
                <p className="text-slate-600">
                  Portofolio kami mencakup berbagai industri dan ukuran project yang
                  menunjukkan kemampuan kami.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✓</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Konsultasi Gratis & Agile
                </h3>
                <p className="text-slate-600">
                  Kami menawarkan konsultasi gratis dan bekerja dengan metodologi agile yang
                  fleksibel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap untuk Bermitra dengan Kami?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Hubungi kami hari ini dan mari diskusikan bagaimana kami bisa membantu mewujudkan
            ide Anda menjadi kenyataan.
          </p>
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
