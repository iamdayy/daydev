"use client";

import { whatsapp } from "@/models/whatsapp";
import { Bot, Globe, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import HeroComputer from "./three/HeroComputerLoader";

// Sel modular ala Sublevel berisi layanan real Daydev. Alasan: bukti layanan sekilas tanpa 3D penuh.
const serviceCells = [
  { href: "/services/web-development", icon: Globe, title: "Web", desc: "Website modern" },
  { href: "/services/mobile-development", icon: Smartphone, title: "Mobile", desc: "iOS dan Android" },
  { href: "/services/telegram-bot", icon: Bot, title: "Bot", desc: "Automasi 24/7" },
  { href: "/services/undangan-digital", icon: Mail, title: "Undangan", desc: "Online interaktif" },
];

export default function Hero() {
  const handleConsultation = () => {
    const url = `https://wa.me/${encodeURIComponent(whatsapp.phoneNumber)}?text=${encodeURIComponent(whatsapp.defaultMessage)}`;
    window.open(url, "_blank");
  };

  const handleScrollToServices = () => {
    document.querySelector("#layanan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden pt-28 pb-20"
    >
      {/* Scrim arah: opak di zona teks, tipis di zona visual. Alasan: 3D global terlihat tapi teks putih tetap kontras (R-25). */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-b from-[#172033] via-[#172033]/95 to-[#172033]/30 lg:bg-linear-to-r lg:from-[#172033] lg:via-[#172033]/95 lg:to-[#172033]/30" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0f766e]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#ea7b3c]/15 border border-[#ea7b3c]/30 text-[#ea7b3c] text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#ea7b3c] rounded-full" />
              Tersedia untuk proyek baru
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Dari Ide
              <br />
              <span className="text-[#ea7b3c]">Menjadi Aplikasi</span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Jasa pembuatan aplikasi{" "}
              <span className="text-white font-semibold">Web &amp; Mobile</span>{" "}
              untuk{" "}
              <span className="text-[#ea7b3c] font-semibold">Startup</span>,{" "}
              <span className="text-[#ea7b3c] font-semibold">UMKM</span>, dan{" "}
              <span className="text-[#ea7b3c] font-semibold">Mahasiswa</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleConsultation}
                className="bg-[#ea7b3c] text-[#172033] px-8 py-4 min-h-[52px] rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konsultasi Gratis
              </button>
              <button
                onClick={handleScrollToServices}
                className="border-2 border-white/30 text-white px-8 py-4 min-h-[52px] rounded-full font-semibold text-lg hover:border-[#ea7b3c] hover:text-[#ea7b3c] transition-all duration-300"
              >
                Jelajahi Layanan
              </button>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0" aria-label="Layanan Daydev">
              {serviceCells.map((cell) => {
                const Icon = cell.icon;
                return (
                  <li key={cell.href}>
                    <Link
                      href={cell.href}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 min-h-[64px] hover:border-[#ea7b3c]/60 hover:bg-white/10 transition-colors"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-[#ea7b3c]">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block truncate text-sm font-bold text-white">{cell.title}</span>
                        <span className="block truncate text-xs text-gray-300">{cell.desc}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 text-xs text-gray-300">
              Status: Menerima proyek baru. Balas via WhatsApp pada jam kerja.
            </p>
          </div>

          {/* Monitor 3D: galeri proyek nyata Daydev, klik layar membuka demo (lihat HeroComputer). */}
          <HeroComputer />
        </div>
      </div>
    </section>
  );
}
