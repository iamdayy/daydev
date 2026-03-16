"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { whatsapp } from "@/models/whatsapp";

const segments = [
  {
    icon: "🚀",
    title: "Startup",
    tagline: "Akselerasi MVP & Validasi Ide",
    description:
      "Bangun Minimum Viable Product dengan cepat dan efisien. Kami membantu Anda memvalidasi ide bisnis sebelum terlanjur berinvestasi besar, sehingga Anda bisa fokus pada pertumbuhan.",
    features: [
      "MVP dalam waktu singkat",
      "Arsitektur yang skalabel",
      "Integrasi API & Third-party",
      "Dashboard analitik",
      "Iterasi cepat sesuai feedback",
    ],
    color: "from-blue-500 to-[#2c3e50]",
    hoverBg: "linear-gradient(135deg, #3b82f6, #2c3e50)",
    bgAccent: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    icon: "🏪",
    title: "UMKM",
    tagline: "Efisiensi & Digitalisasi Bisnis",
    description:
      "Tingkatkan daya saing bisnis Anda dengan solusi digital yang tepat sasaran. Dari sistem kasir, manajemen stok, hingga toko online yang siap bersaing di era digital.",
    features: [
      "Sistem manajemen toko & stok",
      "Toko online (e-commerce)",
      "Laporan keuangan otomatis",
      "Integrasi payment gateway",
      "Notifikasi WhatsApp otomatis",
    ],
    color: "from-green-500 to-teal-600",
    hoverBg: "linear-gradient(135deg, #22c55e, #0d9488)",
    bgAccent: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    badge: "bg-green-100 text-green-700",
    featured: true,
  },
  {
    icon: "🎓",
    title: "Mahasiswa",
    tagline: "Pendampingan Skripsi & Tugas Akhir (Sampai Paham)",
    description:
      "Jangan stres menghadapi skripsi atau tugas akhir! Kami mendampingi Anda dari awal hingga sidang, mulai dari pembuatan sistem, bimbingan teknis, hingga dokumentasi.",
    features: [
      "Pembuatan sistem skripsi",
      "Bimbingan & konsultasi teknis",
      "Dokumentasi laporan lengkap",
      "Revisi tanpa batas",
      "Support sampai lulus",
    ],
    color: "from-purple-500 to-indigo-600",
    hoverBg: "linear-gradient(135deg, #a855f7, #4f46e5)",
    bgAccent: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
];

export default function TargetMarket() {
  const ref = useScrollAnimation();

  return (
    <section id="layanan" className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="fade-in inline-block bg-[#f39c12]/10 text-[#f39c12] text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-[#f39c12]/20">
            Siapa yang Kami Layani?
          </div>
          <h2 className="fade-in text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c3e50] mb-4">
            Solusi untuk Setiap
            <span className="text-[#f39c12]"> Kebutuhan</span>
          </h2>
          <p className="fade-in text-gray-500 text-lg max-w-2xl mx-auto">
            Kami memahami bahwa setiap klien memiliki kebutuhan unik. Karena
            itu, kami menyediakan layanan yang disesuaikan secara spesifik.
          </p>
        </div>

        {/* Cards */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-8">
          {segments.map((seg) => (
            <div
              key={seg.title}
              className={`fade-in card-hover bg-white rounded-2xl overflow-hidden shadow-sm border ${seg.borderColor} ${seg.featured ? "ring-2 ring-[#f39c12] ring-offset-2" : ""}`}
            >
              {seg.featured && (
                <div className="bg-[#f39c12] text-[#2c3e50] text-center text-xs font-bold py-1.5 tracking-wider uppercase">
                  ⭐ Paling Populer
                </div>
              )}
              {/* Card header */}
              <div className={`p-6 bg-linear-to-br ${seg.color} text-white`}>
                <div className="text-4xl mb-3">{seg.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{seg.title}</h3>
                <p className="text-white/80 text-sm font-medium">
                  {seg.tagline}
                </p>
              </div>

              {/* Card body */}
              <div className={`p-6 ${seg.bgAccent}`}>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {seg.description}
                </p>
                <ul className="space-y-2.5">
                  {seg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full ${seg.badge} flex items-center justify-center shrink-0 text-xs font-bold`}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card footer */}
              <div className="px-6 pb-6 bg-white">
                <a
                  href={`https://wa.me/${whatsapp.phoneNumber}?text=Halo%20Daydev%2C%20saya%20dari%20segmen%20${seg.title}%20dan%20ingin%20konsultasi%20gratis.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                    seg.featured
                      ? "bg-[#f39c12] text-[#2c3e50] hover:bg-yellow-400 border-[#f39c12] shadow-md"
                      : `${seg.borderColor} ${seg.textColor} hover:text-white`
                  }`}
                  style={
                    seg.featured
                      ? undefined
                      : ({
                          "--hover-bg": seg.hoverBg,
                        } as React.CSSProperties)
                  }
                  onMouseEnter={(e) => {
                    if (!seg.featured) {
                      (e.currentTarget as HTMLElement).style.background =
                        seg.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!seg.featured) {
                      (e.currentTarget as HTMLElement).style.background = "";
                    }
                  }}
                >
                  Konsultasi Sekarang →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
