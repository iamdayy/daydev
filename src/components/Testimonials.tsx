"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Ari Wibowo",
    role: "Founder, TechStartup.id",
    segment: "Startup",
    segmentColor: "bg-blue-100 text-blue-700",
    avatar: "AW",
    avatarBg: "bg-blue-500",
    stars: 5,
    text: "Daydev berhasil mengubah ide kami menjadi MVP yang solid hanya dalam 2 minggu! Tim mereka sangat responsif dan memahami kebutuhan startup. Produk kami sekarang sudah onboard 500+ pengguna pertama.",
  },
  {
    name: "Siti Rahayu",
    role: "Pemilik Toko Batik Online",
    segment: "UMKM",
    segmentColor: "bg-green-100 text-green-700",
    avatar: "SR",
    avatarBg: "bg-green-500",
    stars: 5,
    text: "Sebelumnya toko saya hanya jualan offline. Setelah pakai toko online dari Daydev, omzet naik 3x lipat! Sistemnya mudah dipakai dan mereka selalu siap bantu kalau ada kendala.",
  },
  {
    name: "Budi Santoso",
    role: "Mahasiswa Teknik Informatika, UGM",
    segment: "Mahasiswa",
    segmentColor: "bg-purple-100 text-purple-700",
    avatar: "BS",
    avatarBg: "bg-purple-500",
    stars: 5,
    text: "Awalnya saya bingung banget sama skripsi saya. Daydev gak cuma bikin sistemnya, tapi juga nemenin saya sampai paham cara kerjanya. Sidang lancar dan dapet nilai A!",
  },
  {
    name: "Reza Firmansyah",
    role: "Co-Founder, AgriTech Solutions",
    segment: "Startup",
    segmentColor: "bg-blue-100 text-blue-700",
    avatar: "RF",
    avatarBg: "bg-indigo-500",
    stars: 5,
    text: "Quality kodenya bersih, dokumentasinya lengkap, dan delivery tepat waktu. Sangat profesional. Kami sudah 3x menggunakan layanan Daydev untuk fitur-fitur baru.",
  },
  {
    name: "Dewi Kartika",
    role: "Owner, Kafe & Resto Kartika",
    segment: "UMKM",
    segmentColor: "bg-green-100 text-green-700",
    avatar: "DK",
    avatarBg: "bg-teal-500",
    stars: 5,
    text: "Sistem kasir dan manajemen menu yang dibuat Daydev sangat membantu operasional kafe saya. Pelayanan lebih cepat, dan laporan harian jadi lebih mudah dipantau.",
  },
  {
    name: "Ahmad Fauzi",
    role: "Mahasiswa Sistem Informasi, ITS",
    segment: "Mahasiswa",
    segmentColor: "bg-purple-100 text-purple-700",
    avatar: "AF",
    avatarBg: "bg-violet-500",
    stars: 5,
    text: "Daydev benar-benar sabar dalam mendampingi. Setiap pertanyaan dijawab dengan jelas. Tugas akhir saya selesai lebih cepat dari jadwal dan reviewer sangat puas dengan hasilnya!",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#f39c12] fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useScrollAnimation();

  return (
    <section id="testimoni" className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="fade-in inline-block bg-[#f39c12]/10 text-[#f39c12] text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-[#f39c12]/20">
            Testimoni Klien
          </div>
          <h2 className="fade-in text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c3e50] mb-4">
            Mereka Sudah
            <span className="text-[#f39c12]"> Merasakan Manfaatnya</span>
          </h2>
          <p className="fade-in text-gray-500 text-lg max-w-2xl mx-auto">
            Lebih dari 50 klien dari berbagai segmen telah mempercayakan proyek
            mereka kepada Daydev.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="fade-in card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#2c3e50] text-sm truncate">
                    {t.name}
                  </div>
                  <div className="text-gray-400 text-xs truncate">{t.role}</div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${t.segmentColor}`}>
                  {t.segment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="fade-in mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "50+", label: "Proyek Selesai", icon: "✅" },
            { value: "100%", label: "Kepuasan Klien", icon: "⭐" },
            { value: "3 Hari", label: "Rata-rata Delivery", icon: "⚡" },
            { value: "24/7", label: "Support Tersedia", icon: "🛡️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-[#2c3e50]">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
