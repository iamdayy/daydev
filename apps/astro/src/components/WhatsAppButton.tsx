import { useEffect, useRef, useState } from "react";
import { waLink } from "@daydev/shared-types";
import {
  FolderOpen,
  GraduationCap,
  MessageCircle,
  Rocket,
  Store,
  Tag,
} from "lucide-react";

const WA_ICON = (
  <svg
    className="w-7 h-7 fill-current"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const topics = [
  {
    icon: MessageCircle,
    label: "Konsultasi Gratis",
    message:
      "Halo Daydev! Saya ingin konsultasi gratis mengenai pengembangan aplikasi. Bisa bantu saya?",
  },
  {
    icon: Tag,
    label: "Tanya Harga Paket",
    message:
      "Halo Daydev! Saya ingin tahu lebih detail soal harga paket yang tersedia. Bisa dijelaskan?",
  },
  {
    icon: FolderOpen,
    label: "Minta Portofolio",
    message:
      "Halo Daydev! Boleh saya lihat portofolio proyek yang sudah pernah dikerjakan?",
  },
  {
    icon: GraduationCap,
    label: "Bantu Skripsi",
    message:
      "Halo Daydev! Saya mahasiswa dan butuh bantuan pengembangan sistem untuk skripsi/tugas akhir. Bisa bantu?",
  },
  {
    icon: Store,
    label: "Digitalisasi UMKM",
    message:
      "Halo Daydev! Saya punya usaha dan ingin digitalisasi bisnis dengan website atau toko online. Bisa bantu?",
  },
  {
    icon: Rocket,
    label: "Bikin MVP Startup",
    message:
      "Halo Daydev! Saya ada ide startup dan butuh pengembangan MVP. Bisa kita diskusikan?",
  },
];

export default function WhatsAppButton({ hideWhile }: { hideWhile?: string }) {
  const [open, setOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(Boolean(hideWhile));
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const hero = hideWhile ? document.querySelector(hideWhile) : null;
    if (!hero) { setHeroVisible(false); return; }
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, [hideWhile]);

  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.contains(document.activeElement)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={ref}
      className={`fixed right-20 top-2.5 z-50 flex flex-col items-end gap-3 xl:bottom-6 xl:right-6 xl:top-auto ${!open && !focused ? "md:hidden xl:flex" : ""} ${heroVisible && !open && !focused ? "invisible pointer-events-none" : ""}`}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { setOpen(false); setFocused(false); }
      }}
    >
      {open && (
        <nav
          id="whatsapp-topics"
          className="wa-popup fixed right-4 top-[calc(var(--site-header-height)+0.5rem)] max-h-[calc(100dvh-7rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl bg-foreground p-3 shadow-xl xl:static"
          aria-label="Topik chat WhatsApp"
        >
          <p className="mb-1 px-2 py-2 text-sm font-medium text-slate-300">
            Ada yang bisa kami bantu?
          </p>
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <a
                key={topic.label}
                ref={index === 0 ? firstLinkRef : undefined}
                href={waLink(topic.message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="w-full min-h-[48px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group"
              >
                <Icon
                  className="size-5 shrink-0 text-slate-400 group-hover:text-green-400 transition-colors"
                  aria-hidden="true"
                />
                <span className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                  {topic.label}
                </span>
              </a>
            );
          })}
        </nav>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 group ${
          open
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-green-700 hover:bg-green-800"
        }`}
        aria-label={open ? "Tutup topik WhatsApp" : "Chat via WhatsApp"}
        aria-expanded={open}
        aria-controls="whatsapp-topics"
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
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
          <span className="absolute right-16 hidden bg-foreground text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none xl:block">
            Chat WhatsApp
          </span>
        )}
      </button>
    </div>
  );
}
