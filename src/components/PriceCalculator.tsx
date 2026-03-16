"use client";

import { whatsapp } from "@/models/whatsapp";
import { useState } from "react";

type Category = "mahasiswa" | "umkm" | "startup";
type Deadline = "normal" | "fast" | "express";

interface CalcState {
  category: Category | null;
  // Mahasiswa
  modulCount: number;
  withGuidance: boolean;
  // UMKM
  umkmType: "profile" | "toko";
  withPayment: boolean;
  withInventory: boolean;
  withMobile: boolean;
  // Startup
  platform: "web" | "mobile" | "both";
  featureCount: number;
  supportMonths: number;
  // Common
  deadline: Deadline;
}

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const initialState: CalcState = {
  category: null,
  modulCount: 1,
  withGuidance: false,
  umkmType: "profile",
  withPayment: false,
  withInventory: false,
  withMobile: false,
  platform: "web",
  featureCount: 3,
  supportMonths: 0,
  deadline: "normal",
};

export default function PriceCalculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const set = <K extends keyof CalcState>(key: K, value: CalcState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const calculatePrice = (): { min: number; max: number } => {
    if (!state.category) return { min: 0, max: 0 };

    let base = 0;
    let add = 0;

    if (state.category === "mahasiswa") {
      base =
        state.modulCount <= 1
          ? 999_000
          : state.modulCount <= 5
            ? 1_799_000
            : 2_499_000;
      if (state.withGuidance) add += 300_000;
      if (state.deadline === "fast") add += 200_000;
      if (state.deadline === "express") add += 400_000;
    } else if (state.category === "umkm") {
      base = state.umkmType === "profile" ? 1_999_000 : 3_499_000;
      if (state.withPayment) add += 300_000;
      if (state.withInventory) add += 200_000;
      if (state.withMobile) add += 1_999_000;
      if (state.deadline === "fast") add += 300_000;
      if (state.deadline === "express") add += 600_000;
    } else {
      base =
        state.platform === "web"
          ? 3_499_000
          : state.platform === "mobile"
            ? 4_999_000
            : 6_999_000;
      if (state.featureCount > 3 && state.featureCount <= 6) add += 1_499_000;
      if (state.featureCount > 6) add += 2_999_000;
      if (state.supportMonths === 1) add += 699_000;
      if (state.supportMonths === 3) add += 1_499_000;
      if (state.deadline === "fast") add += 699_000;
      if (state.deadline === "express") add += 1_299_000;
    }

    const total = base + add;
    return { min: total, max: Math.round(total * 1.2) };
  };

  const buildWhatsAppMessage = () => {
    const { min, max } = calculatePrice();
    const cat =
      state.category === "mahasiswa"
        ? "Mahasiswa"
        : state.category === "umkm"
          ? "UMKM"
          : "Startup";
    return `Halo Daydev! Saya sudah coba kalkulator harga dan mendapat estimasi *${formatRupiah(min)} - ${formatRupiah(max)}* untuk kategori *${cat}*. Bisa kita diskusikan lebih detail?`;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(
      buildWhatsAppMessage(),
    )}`;
    window.open(url, "_blank");
  };

  const { min, max } = calculatePrice();

  const categoryColor = {
    mahasiswa: {
      ring: "border-purple-500",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      btn: "bg-purple-600 hover:bg-purple-500",
    },
    umkm: {
      ring: "border-green-500",
      bg: "bg-green-500/10",
      text: "text-green-400",
      btn: "bg-green-600 hover:bg-green-500",
    },
    startup: {
      ring: "border-blue-500",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      btn: "bg-blue-600 hover:bg-blue-500",
    },
  };

  const color = state.category
    ? categoryColor[state.category]
    : categoryColor.startup;

  return (
    <section id="kalkulator" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Kalkulator Harga
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Estimasi Harga Proyek Anda
          </h2>
          <p className="text-[#a0aec0] text-lg">
            Jawab beberapa pertanyaan dan dapatkan estimasi harga seketika
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                step >= s
                  ? color.bg.replace("bg-", "bg-").replace("/10", "") +
                    " opacity-80"
                  : "bg-white/10"
              } ${step >= s ? "bg-blue-500!" : ""}`}
            />
          ))}
        </div>

        <div className="bg-[#16213e] rounded-2xl border border-white/10 p-6 sm:p-8">
          {/* STEP 1 — Category */}
          {step === 1 && (
            <div>
              <p className="text-white font-semibold text-lg mb-6">
                Saya adalah...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    value: "mahasiswa" as Category,
                    icon: "🎓",
                    label: "Mahasiswa",
                    desc: "Butuh sistem untuk skripsi / tugas akhir",
                    color: "hover:border-purple-500 hover:bg-purple-500/5",
                    active: "border-purple-500 bg-purple-500/10",
                  },
                  {
                    value: "umkm" as Category,
                    icon: "🏪",
                    label: "UMKM",
                    desc: "Mau bikin website atau toko online bisnis",
                    color: "hover:border-green-500 hover:bg-green-500/5",
                    active: "border-green-500 bg-green-500/10",
                  },
                  {
                    value: "startup" as Category,
                    icon: "🚀",
                    label: "Startup",
                    desc: "Perlu MVP atau aplikasi skalabel",
                    color: "hover:border-blue-500 hover:bg-blue-500/5",
                    active: "border-blue-500 bg-blue-500/10",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      set("category", item.value);
                      setStep(2);
                    }}
                    className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                      state.category === item.value
                        ? item.active
                        : `border-white/10 bg-white/5 ${item.color}`
                    }`}
                  >
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <p className="text-white font-semibold">{item.label}</p>
                    <p className="text-[#a0aec0] text-sm mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Options */}
          {step === 2 && state.category && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-[#a0aec0] text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors"
              >
                ← Ganti kategori
              </button>

              {/* Mahasiswa options */}
              {state.category === "mahasiswa" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-white font-medium mb-3">
                      Berapa banyak modul yang dibutuhkan?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "1 modul", value: 1 },
                        { label: "2–5 modul", value: 3 },
                        { label: "> 5 modul", value: 6 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("modulCount", opt.value)}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                            state.modulCount === opt.value
                              ? "border-purple-500 bg-purple-500/20 text-purple-300"
                              : "border-white/20 text-[#a0aec0] hover:border-purple-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    onClick={() => set("withGuidance", !state.withGuidance)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      state.withGuidance
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-purple-400"
                    }`}
                  >
                    <div>
                      <p className="text-white font-medium text-sm">
                        Bimbingan teknis sampai sidang
                      </p>
                      <p className="text-[#a0aec0] text-xs mt-0.5">
                        Konsultasi & pendampingan revisi dosen{" "}
                        <span className="text-purple-400">+Rp 300rb</span>
                      </p>
                    </div>
                    <div
                      className={`w-11 h-6 rounded-full transition-all shrink-0 relative ${
                        state.withGuidance ? "bg-purple-500" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                          state.withGuidance ? "left-5" : "left-0.5"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UMKM options */}
              {state.category === "umkm" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-white font-medium mb-3">
                      Tipe website yang dibutuhkan?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Company Profile",
                          value: "profile" as const,
                          desc: "Tampilan & info bisnis",
                          price: "Rp 1.9jt",
                        },
                        {
                          label: "Toko Online",
                          value: "toko" as const,
                          desc: "Jual produk secara online",
                          price: "Rp 3.5jt",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("umkmType", opt.value)}
                          className={`py-4 px-4 rounded-xl border text-left transition-all ${
                            state.umkmType === opt.value
                              ? "border-green-500 bg-green-500/10"
                              : "border-white/20 bg-white/5 hover:border-green-400"
                          }`}
                        >
                          <p
                            className={`font-semibold text-sm ${
                              state.umkmType === opt.value
                                ? "text-green-400"
                                : "text-white"
                            }`}
                          >
                            {opt.label}
                          </p>
                          <p className="text-[#a0aec0] text-xs mt-1">
                            {opt.desc}
                          </p>
                          <p className="text-green-400 text-xs font-medium mt-1">
                            {opt.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-white font-medium">Fitur tambahan</p>
                    {[
                      {
                        key: "withPayment" as keyof CalcState,
                        label: "Payment Gateway",
                        price: "+Rp 300rb",
                        icon: "💳",
                      },
                      {
                        key: "withInventory" as keyof CalcState,
                        label: "Manajemen Stok & Pesanan",
                        price: "+Rp 200rb",
                        icon: "📦",
                      },
                      {
                        key: "withMobile" as keyof CalcState,
                        label: "Versi Mobile App",
                        price: "+Rp 2jt",
                        icon: "📱",
                      },
                    ].map((feat) => (
                      <div
                        key={String(feat.key)}
                        onClick={() =>
                          set(
                            feat.key,
                            !state[feat.key] as CalcState[typeof feat.key],
                          )
                        }
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          state[feat.key]
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/10 bg-white/5 hover:border-green-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{feat.icon}</span>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {feat.label}
                            </p>
                            <p className="text-green-400 text-xs">
                              {feat.price}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all ${
                            state[feat.key]
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-white/30"
                          }`}
                        >
                          {state[feat.key] ? "✓" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Startup options */}
              {state.category === "startup" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-white font-medium mb-3">
                      Platform yang diinginkan?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Web App",
                          value: "web" as const,
                          price: "Rp 3.5jt",
                        },
                        {
                          label: "Mobile App",
                          value: "mobile" as const,
                          price: "Rp 4.9jt",
                        },
                        {
                          label: "Web + Mobile",
                          value: "both" as const,
                          price: "Rp 6.9jt",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("platform", opt.value)}
                          className={`py-3 px-3 rounded-lg border text-sm transition-all ${
                            state.platform === opt.value
                              ? "border-blue-500 bg-blue-500/20 text-blue-300"
                              : "border-white/20 text-[#a0aec0] hover:border-blue-400 hover:text-white"
                          }`}
                        >
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-xs opacity-70 mt-0.5">
                            {opt.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">
                        Jumlah fitur utama
                      </p>
                      <span className="text-blue-400 font-bold text-lg">
                        {state.featureCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={state.featureCount}
                      onChange={(e) =>
                        set("featureCount", Number(e.target.value))
                      }
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-white/10"
                    />
                    <div className="flex justify-between text-xs text-[#a0aec0] mt-1">
                      <span>Minimal (1-3)</span>
                      <span>Sedang (4-6)</span>
                      <span>Lengkap (7+)</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-white font-medium mb-3">
                      Support setelah launch?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Tidak", value: 0, price: "" },
                        { label: "1 bulan", value: 1, price: "+Rp 700rb" },
                        { label: "3 bulan", value: 3, price: "+Rp 1.5jt" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("supportMonths", opt.value)}
                          className={`py-3 px-3 rounded-lg border text-sm transition-all ${
                            state.supportMonths === opt.value
                              ? "border-blue-500 bg-blue-500/20 text-blue-300"
                              : "border-white/20 text-[#a0aec0] hover:border-blue-400 hover:text-white"
                          }`}
                        >
                          <p className="font-medium">{opt.label}</p>
                          {opt.price && (
                            <p className="text-xs text-blue-400 mt-0.5">
                              {opt.price}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Deadline — common */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white font-medium mb-3">
                  Target waktu pengerjaan?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Normal",
                      value: "normal" as Deadline,
                      desc: "> 14 hari",
                      extra: "",
                    },
                    {
                      label: "Cepat",
                      value: "fast" as Deadline,
                      desc: "7–14 hari",
                      extra: "biaya tambah",
                    },
                    {
                      label: "Express",
                      value: "express" as Deadline,
                      desc: "< 7 hari",
                      extra: "biaya tambah",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => set("deadline", opt.value)}
                      className={`py-3 px-3 rounded-lg border text-sm transition-all ${
                        state.deadline === opt.value
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                          : "border-white/20 text-[#a0aec0] hover:border-yellow-400 hover:text-white"
                      }`}
                    >
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className={`mt-8 w-full py-3.5 rounded-xl text-white font-semibold transition-all shadow-lg ${color.btn}`}
              >
                Lihat Estimasi Harga →
              </button>
            </div>
          )}

          {/* STEP 3 — Result */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="text-[#a0aec0] text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors"
              >
                ← Edit pilihan
              </button>

              <div className="text-center">
                <p className="text-[#a0aec0] text-sm mb-2">
                  Estimasi harga proyek Anda
                </p>
                <div
                  className={`rounded-2xl border p-8 mb-6 ${color.ring} ${color.bg}`}
                >
                  <p className="text-4xl sm:text-5xl font-bold text-white">
                    {formatRupiah(min)}
                  </p>
                  <p className="text-[#a0aec0] mt-2">
                    sampai{" "}
                    <span className="text-white font-semibold">
                      {formatRupiah(max)}
                    </span>
                  </p>
                  <p className={`text-sm mt-4 ${color.text}`}>
                    * Harga final ditentukan setelah konsultasi
                  </p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/20"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Diskusi via WhatsApp
                </button>

                <button
                  onClick={() => {
                    setState(initialState);
                    setStep(1);
                  }}
                  className="mt-3 w-full py-3 rounded-xl border border-white/20 text-[#a0aec0] hover:border-white/40 hover:text-white text-sm transition-all"
                >
                  Hitung Ulang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
