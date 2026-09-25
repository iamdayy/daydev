import { useMemo, useState } from "react";
import {
  CreditCard,
  GraduationCap,
  Package,
  Rocket,
  Smartphone,
  Store,
} from "lucide-react";

type Category = "mahasiswa" | "umkm" | "startup";
type Deadline = "normal" | "fast" | "express";

interface CalcState {
  category: Category | null;
  modulCount: number;
  withGuidance: boolean;
  umkmType: "profile" | "toko";
  withPayment: boolean;
  withInventory: boolean;
  withMobile: boolean;
  platform: "web" | "mobile" | "both";
  featureCount: number;
  supportMonths: number;
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

  const { min, max } = useMemo(() => {
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
  }, [state]);

  const buildWhatsAppMessage = () => {
    const cat =
      state.category === "mahasiswa"
        ? "Mahasiswa"
        : state.category === "umkm"
          ? "UMKM"
          : "Startup";
    return `Halo Daydev! Saya sudah coba kalkulator harga dan mendapat estimasi *${formatRupiah(min)} - ${formatRupiah(max)}* untuk kategori *${cat}*. Bisa kita diskusikan lebih detail?`;
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/6285175284253?text=${encodeURIComponent(
        buildWhatsAppMessage(),
      )}`,
      "_blank",
    );
  };

  const categoryColor = {
    mahasiswa: {
      ring: "border-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      btn: "bg-amber-600 hover:bg-amber-500",
    },
    umkm: {
      ring: "border-teal-500",
      bg: "bg-teal-500/10",
      text: "text-teal-300",
      btn: "bg-teal-600 hover:bg-teal-500",
    },
    startup: {
      ring: "border-slate-400",
      bg: "bg-slate-400/10",
      text: "text-slate-200",
      btn: "bg-slate-600 hover:bg-slate-500",
    },
  };

  const color = state.category
    ? categoryColor[state.category]
    : categoryColor.startup;

  return (
    <section id="kalkulator" className="py-20 bg-[#172033]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#ea7b3c]/10 border border-[#ea7b3c]/30 text-[#ea7b3c] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Kalkulator Harga
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Estimasi Harga Proyek Anda
          </h2>
          <p className="text-slate-400 text-lg">
            Jawab beberapa pertanyaan dan dapatkan estimasi harga seketika
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8" aria-hidden="true">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                step >= s ? "bg-[#ea7b3c]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-white/10 p-6 sm:p-8">
          {step === 1 && (
            <div>
              <p className="text-white font-semibold text-lg mb-6">
                Saya adalah...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    value: "mahasiswa" as Category,
                    icon: GraduationCap,
                    label: "Mahasiswa",
                    desc: "Butuh sistem untuk skripsi / tugas akhir",
                    color: "hover:border-amber-500 hover:bg-amber-500/5",
                    active: "border-amber-500 bg-amber-500/10",
                  },
                  {
                    value: "umkm" as Category,
                    icon: Store,
                    label: "UMKM",
                    desc: "Mau bikin website atau toko online bisnis",
                    color: "hover:border-teal-500 hover:bg-teal-500/5",
                    active: "border-teal-500 bg-teal-500/10",
                  },
                  {
                    value: "startup" as Category,
                    icon: Rocket,
                    label: "Startup",
                    desc: "Perlu MVP atau aplikasi skalabel",
                    color: "hover:border-slate-400 hover:bg-slate-400/5",
                    active: "border-slate-400 bg-slate-400/10",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        set("category", item.value);
                        setStep(2);
                      }}
                      className={`p-5 min-h-[44px] rounded-xl border-2 text-left transition-all duration-200 ${
                        state.category === item.value
                          ? item.active
                          : `border-white/10 bg-white/5 ${item.color}`
                      }`}
                    >
                      <Icon className="size-8 mb-3 text-slate-300" aria-hidden="true" />
                      <p className="text-white font-semibold">{item.label}</p>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && state.category && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-slate-400 text-sm min-h-[44px] mb-6 flex items-center gap-1 hover:text-white transition-colors"
              >
                ← Ganti kategori
              </button>

              {state.category === "mahasiswa" && (
                <div className="space-y-6">
                  <fieldset>
                    <legend className="text-white font-medium mb-3">
                      Berapa banyak modul yang dibutuhkan?
                    </legend>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "1 modul", value: 1 },
                        { label: "2–5 modul", value: 3 },
                        { label: "> 5 modul", value: 6 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("modulCount", opt.value)}
                          aria-pressed={state.modulCount === opt.value}
                          className={`py-2.5 px-3 min-h-[44px] rounded-lg border text-sm font-medium transition-all ${
                            state.modulCount === opt.value
                              ? "border-amber-500 bg-amber-500/20 text-amber-200"
                              : "border-white/20 text-slate-400 hover:border-amber-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    onClick={() => set("withGuidance", !state.withGuidance)}
                    aria-pressed={state.withGuidance}
                    className={`flex w-full items-center justify-between p-4 rounded-xl border transition-all min-h-[44px] text-left ${
                      state.withGuidance
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-400"
                    }`}
                  >
                    <span>
                      <span className="block text-white font-medium text-sm">
                        Bimbingan teknis sampai sidang
                      </span>
                      <span className="block text-slate-400 text-xs mt-0.5">
                        Konsultasi & pendampingan revisi dosen{" "}
                        <span className="text-amber-300">+Rp 300rb</span>
                      </span>
                    </span>
                    <span
                      className={`w-11 h-6 rounded-full transition-all shrink-0 relative ${
                        state.withGuidance ? "bg-amber-500" : "bg-white/20"
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                          state.withGuidance ? "left-5" : "left-0.5"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              )}

              {state.category === "umkm" && (
                <div className="space-y-6">
                  <fieldset>
                    <legend className="text-white font-medium mb-3">
                      Tipe website yang dibutuhkan?
                    </legend>
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
                          aria-pressed={state.umkmType === opt.value}
                          className={`py-4 px-4 min-h-[44px] rounded-xl border text-left transition-all ${
                            state.umkmType === opt.value
                              ? "border-teal-500 bg-teal-500/10"
                              : "border-white/20 bg-white/5 hover:border-teal-400"
                          }`}
                        >
                          <span
                            className={`block font-semibold text-sm ${
                              state.umkmType === opt.value
                                ? "text-teal-300"
                                : "text-white"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="block text-slate-400 text-xs mt-1">
                            {opt.desc}
                          </span>
                          <span className="block text-teal-300 text-xs font-medium mt-1">
                            {opt.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-white font-medium mb-3">
                      Fitur tambahan
                    </legend>
                    <div className="space-y-3">
                      {[
                        {
                          key: "withPayment" as keyof CalcState,
                          label: "Payment Gateway",
                          price: "+Rp 300rb",
                          icon: CreditCard,
                        },
                        {
                          key: "withInventory" as keyof CalcState,
                          label: "Manajemen Stok & Pesanan",
                          price: "+Rp 200rb",
                          icon: Package,
                        },
                        {
                          key: "withMobile" as keyof CalcState,
                          label: "Versi Mobile App",
                          price: "+Rp 2jt",
                          icon: Smartphone,
                        },
                      ].map((feat) => {
                        const Icon = feat.icon;
                        const active = Boolean(state[feat.key]);
                        return (
                          <button
                            key={String(feat.key)}
                            onClick={() =>
                              set(
                                feat.key,
                                !state[feat.key] as CalcState[typeof feat.key],
                              )
                            }
                            aria-pressed={active}
                            className={`flex w-full items-center justify-between p-4 rounded-xl border transition-all min-h-[44px] text-left ${
                              active
                                ? "border-teal-500 bg-teal-500/10"
                                : "border-white/10 bg-white/5 hover:border-teal-400"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Icon className="size-5 text-slate-300" aria-hidden="true" />
                              <span>
                                <span className="block text-white text-sm font-medium">
                                  {feat.label}
                                </span>
                                <span className="block text-teal-300 text-xs">
                                  {feat.price}
                                </span>
                              </span>
                            </span>
                            <span
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all ${
                                active
                                  ? "border-teal-500 bg-teal-500 text-white"
                                  : "border-white/30"
                              }`}
                              aria-hidden="true"
                            >
                              {active ? "✓" : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}

              {state.category === "startup" && (
                <div className="space-y-6">
                  <fieldset>
                    <legend className="text-white font-medium mb-3">
                      Platform yang diinginkan?
                    </legend>
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
                          aria-pressed={state.platform === opt.value}
                          className={`py-3 px-3 min-h-[44px] rounded-lg border text-sm transition-all ${
                            state.platform === opt.value
                              ? "border-slate-400 bg-slate-400/20 text-slate-100"
                              : "border-white/20 text-slate-400 hover:border-slate-300 hover:text-white"
                          }`}
                        >
                          <span className="block font-medium">{opt.label}</span>
                          <span className="block text-xs opacity-70 mt-0.5">
                            {opt.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="fitur-utama" className="text-white font-medium">
                        Jumlah fitur utama
                      </label>
                      <span className="text-slate-200 font-bold text-lg" aria-live="polite">
                        {state.featureCount}
                      </span>
                    </div>
                    <input
                      id="fitur-utama"
                      type="range"
                      min={1}
                      max={10}
                      value={state.featureCount}
                      onChange={(e) =>
                        set("featureCount", Number(e.target.value))
                      }
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-slate-300 bg-white/10"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Minimal (1-3)</span>
                      <span>Sedang (4-6)</span>
                      <span>Lengkap (7+)</span>
                    </div>
                  </div>

                  <fieldset>
                    <legend className="text-white font-medium mb-3">
                      Support setelah launch?
                    </legend>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Tidak", value: 0, price: "" },
                        { label: "1 bulan", value: 1, price: "+Rp 700rb" },
                        { label: "3 bulan", value: 3, price: "+Rp 1.5jt" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => set("supportMonths", opt.value)}
                          aria-pressed={state.supportMonths === opt.value}
                          className={`py-3 px-3 min-h-[44px] rounded-lg border text-sm transition-all ${
                            state.supportMonths === opt.value
                              ? "border-slate-400 bg-slate-400/20 text-slate-100"
                              : "border-white/20 text-slate-400 hover:border-slate-300 hover:text-white"
                          }`}
                        >
                          <span className="block font-medium">{opt.label}</span>
                          {opt.price && (
                            <span className="block text-xs text-slate-300 mt-0.5">
                              {opt.price}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              <fieldset className="mt-6 pt-6 border-t border-white/10">
                <legend className="text-white font-medium mb-3 px-1">
                  Target waktu pengerjaan?
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Normal", value: "normal" as Deadline, desc: "> 14 hari" },
                    { label: "Cepat", value: "fast" as Deadline, desc: "7–14 hari" },
                    { label: "Express", value: "express" as Deadline, desc: "< 7 hari" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => set("deadline", opt.value)}
                      aria-pressed={state.deadline === opt.value}
                      className={`py-3 px-3 min-h-[44px] rounded-lg border text-sm transition-all ${
                        state.deadline === opt.value
                          ? "border-amber-500 bg-amber-500/10 text-amber-200"
                          : "border-white/20 text-slate-400 hover:border-amber-400 hover:text-white"
                      }`}
                    >
                      <span className="block font-medium">{opt.label}</span>
                      <span className="block text-xs opacity-70 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                onClick={() => setStep(3)}
                className={`mt-8 w-full min-h-[52px] py-3.5 rounded-xl text-white font-semibold transition-all shadow-lg ${color.btn}`}
              >
                Lihat Estimasi Harga
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="text-slate-400 text-sm min-h-[44px] mb-6 flex items-center gap-1 hover:text-white transition-colors"
              >
                ← Edit pilihan
              </button>

              <div className="text-center" role="status" aria-live="polite">
                <p className="text-slate-400 text-sm mb-2">
                  Estimasi harga proyek Anda
                </p>
                <div className={`rounded-2xl border p-8 mb-6 ${color.ring} ${color.bg}`}>
                  <p className="text-4xl sm:text-5xl font-bold text-white">
                    {formatRupiah(min)}
                  </p>
                  <p className="text-slate-400 mt-2">
                    sampai{" "}
                    <span className="text-white font-semibold">{formatRupiah(max)}</span>
                  </p>
                  <p className={`text-sm mt-4 ${color.text}`}>
                    * Harga final ditentukan setelah konsultasi
                  </p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full min-h-[56px] py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
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
                  className="mt-3 w-full min-h-[48px] py-3 rounded-xl border border-white/20 text-slate-400 hover:border-white/40 hover:text-white text-sm transition-all"
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