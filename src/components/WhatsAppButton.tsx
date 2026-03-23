"use client";

import { whatsapp } from "@/models/whatsapp";
import { useEffect, useRef, useState } from "react";

const WA_ICON = (
  <svg
    className="w-7 h-7 fill-current"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const topics = [
  {
    icon: "💬",
    label: "Konsultasi Gratis",
    message:
      "Halo Daydev! Saya ingin konsultasi gratis mengenai pengembangan aplikasi. Bisa bantu saya?",
  },
  {
    icon: "💰",
    label: "Tanya Harga Paket",
    message:
      "Halo Daydev! Saya ingin tahu lebih detail soal harga paket yang tersedia. Bisa dijelaskan?",
  },
  {
    icon: "📁",
    label: "Minta Portofolio",
    message:
      "Halo Daydev! Boleh saya lihat portofolio proyek yang sudah pernah dikerjakan?",
  },
  {
    icon: "🎓",
    label: "Bantu Skripsi",
    message:
      "Halo Daydev! Saya mahasiswa dan butuh bantuan pengembangan sistem untuk skripsi/tugas akhir. Bisa bantu?",
  },
  {
    icon: "🏪",
    label: "Digitalisasi UMKM",
    message:
      "Halo Daydev! Saya punya usaha dan ingin digitalisasi bisnis dengan website atau toko online. Bisa bantu?",
  },
  {
    icon: "🚀",
    label: "Bikin MVP Startup",
    message:
      "Halo Daydev! Saya ada ide startup dan butuh pengembangan MVP. Bisa kita diskusikan?",
  },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTopic = (message: string) => {
    const url = `https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Popup Menu */}
      {open && (
        <div className="wa-popup bg-[#16213e] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-3 w-64">
          <p className="text-[#a0aec0] text-xs font-medium px-2 py-2 border-b border-white/10 mb-1">
            Ada yang bisa kami bantu?
          </p>
          {topics.map((topic) => (
            <button
              key={topic.label}
              onClick={() => handleTopic(topic.message)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group"
            >
              <span className="text-xl leading-none">{topic.icon}</span>
              <span className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                {topic.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`wa-bounce w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          open
            ? "bg-slate-600 hover:bg-slate-500 shadow-slate-500/30"
            : "bg-green-500 hover:bg-green-400 shadow-green-500/40"
        }`}
        aria-label="Chat via WhatsApp"
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          WA_ICON
        )}
        {!open && (
          <span className="absolute right-16 bg-[#2c3e50] text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat WhatsApp
          </span>
        )}
      </button>
    </div>
  );
}
