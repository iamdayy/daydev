"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { whatsapp } from "@/models/whatsapp";
import { GraduationCap, Rocket, Store } from "lucide-react";

const segments = [
  {
    icon: Rocket,
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
    color: "from-[#0f766e] to-[#172033]",
    hoverBg: "linear-gradient(135deg, #0f766e, #172033)",
    bgAccent: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-[#0f766e]",
    badge: "bg-teal-100 text-[#0f766e]",
  },
  {
    icon: Store,
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
    color: "from-[#ea7b3c] to-[#9a3412]",
    hoverBg: "linear-gradient(135deg, #ea7b3c, #9a3412)",
    bgAccent: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-[#c2410c]",
    badge: "bg-orange-100 text-[#c2410c]",
    featured: true,
  },
  {
    icon: GraduationCap,
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
    color: "from-[#334155] to-[#172033]",
    hoverBg: "linear-gradient(135deg, #334155, #172033)",
    bgAccent: "bg-slate-100",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
    badge: "bg-slate-200 text-slate-700",
  },
];

export default function TargetMarket() {
  const ref = useScrollAnimation();

  return (
    <section id="layanan" className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="fade-in inline-block bg-[#b45309]/10 text-[#b45309] text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-[#b45309]/25">
            Siapa yang Kami Layani?
          </div>
          <h2 className="fade-in text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172033] mb-4">
            Solusi untuk Setiap
            <span className="text-[#b45309]"> Kebutuhan</span>
          </h2>
          <p className="fade-in text-slate-600 text-lg max-w-2xl mx-auto">
            Kami memahami bahwa setiap klien memiliki kebutuhan unik. Karena
            itu, kami menyediakan layanan yang disesuaikan secara spesifik.
          </p>
        </div>

        <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-8">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.title}
                className={`fade-in card-hover bg-white rounded-2xl overflow-hidden shadow-sm border ${seg.borderColor} ${seg.featured ? "ring-2 ring-[#ea7b3c] ring-offset-2" : ""}`}
              >
                {seg.featured && (
                  <div className="bg-[#ea7b3c] text-[#172033] text-center text-xs font-bold py-1.5 tracking-wider uppercase">
                    Paling Populer
                  </div>
                )}
                <div className={`p-6 bg-linear-to-br ${seg.color} text-white`}>
                  <Icon className="size-9 mb-3" aria-hidden="true" />
                  <h3 className="text-2xl font-bold mb-1">{seg.title}</h3>
                  <p className="text-white/80 text-sm font-medium">
                    {seg.tagline}
                  </p>
                </div>

                <div className={`p-6 ${seg.bgAccent}`}>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {seg.description}
                  </p>
                  <ul className="space-y-2.5">
                    {seg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-full ${seg.badge} flex items-center justify-center shrink-0 text-xs font-bold`}
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6 pt-6 bg-white">
                  <a
                    href={`https://wa.me/${whatsapp.phoneNumber}?text=Halo%20Daydev%2C%20saya%20dari%20segmen%20${seg.title}%20dan%20ingin%20konsultasi%20gratis.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex min-h-[48px] items-center justify-center w-full text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                      seg.featured
                        ? "bg-[#ea7b3c] text-[#172033] hover:brightness-110 border-[#ea7b3c] shadow-md"
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
                    Konsultasi via WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
