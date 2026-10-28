import { useState } from "react";
import { formatRupiah, waLink, type PricingCategory } from "@daydev/shared-types";
import { availablePricing, estimateMessage } from "../lib/pricing";

interface Props {
  categories: PricingCategory[];
}

export default function PriceCalculator({ categories }: Props) {
  const available = availablePricing(categories);
  const [categoryId, setCategoryId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const category = available.find((item) => item.id === categoryId);
  const plan = category?.packages.find((item) => item.id === packageId);

  if (available.length === 0) return null;

  return (
    <section id="kalkulator" className="section-space bg-foreground text-white" aria-labelledby="calculator-title" data-ui>
      <div className="site-container">
        <div className="mb-10 max-w-2xl">
          <h2 id="calculator-title" className="section-title">Rencanakan anggaran</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Pilih paket sebagai dasar estimasi. Ceritakan kebutuhan tambahan untuk mendapatkan penawaran yang sesuai.
          </p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="min-w-0 space-y-6">
            <div>
              <label htmlFor="estimate-category" className="mb-2 block font-semibold">Kategori proyek</label>
              <select
                id="estimate-category"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setPackageId("");
                }}
                className="min-h-12 w-full rounded-xl bg-white px-4 py-3 text-foreground"
              >
                <option value="">Pilih kategori</option>
                {available.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
            {category && (
              <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold">Paket sebagai dasar</legend>
                {category.packages.map((item) => (
                  <label key={item.id} className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-xl p-4 ${packageId === item.id ? "bg-white text-foreground" : "bg-white/10 text-white"}`}>
                    <input type="radio" name="estimate-package" value={item.id} checked={packageId === item.id} onChange={() => setPackageId(item.id)} className="mt-1 size-5 shrink-0 accent-primary" />
                    <span className="flex min-w-0 flex-1 flex-wrap justify-between gap-x-4 gap-y-1">
                      <span className="font-semibold">{item.name}</span>
                      <span className="tabular-nums">{formatRupiah(item.price)}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
            <div>
              <label htmlFor="estimate-requirements" className="mb-2 block font-semibold">Kebutuhan tambahan <span className="font-normal text-slate-300">(opsional)</span></label>
              <textarea id="estimate-requirements" rows={3} maxLength={2000} value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="Fitur, integrasi, atau pendampingan yang Anda perlukan" className="w-full rounded-xl bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground" aria-describedby="estimate-note" />
            </div>
            <div>
              <label htmlFor="estimate-deadline" className="mb-2 block font-semibold">Target waktu <span className="font-normal text-slate-300">(opsional)</span></label>
              <input id="estimate-deadline" maxLength={120} value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="Kapan proyek ingin digunakan?" className="min-h-12 w-full rounded-xl bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="min-w-0 rounded-2xl bg-white p-6 text-foreground sm:p-8 lg:sticky lg:top-[calc(var(--site-header-height)+1.5rem)]">
            <h3 className="text-xl font-bold">Ringkasan estimasi</h3>
            <div className="mt-6" aria-live="polite" aria-atomic="true">
              {plan ? (
                <>
                  <p className="font-semibold">{plan.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Harga dasar paket</p>
                  <p className="mt-1 break-words text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">{formatRupiah(plan.price)}</p>
                </>
              ) : <p className="leading-7 text-muted-foreground">Pilih kategori dan paket untuk melihat harga dasarnya.</p>}
            </div>
            {plan?.features?.length ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 leading-7">
                {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            ) : null}
            <p id="estimate-note" className="mt-6 text-sm leading-6 text-muted-foreground">Kebutuhan tambahan belum termasuk dalam harga dasar. Harga final dan jadwal ditentukan setelah konsultasi.</p>
            {category && plan && (
              <a href={waLink(estimateMessage(category, plan, requirements, deadline))} target="_blank" rel="noopener noreferrer" className="button-primary mt-6 w-full">Diskusikan estimasi via WhatsApp</a>
            )}
            <button type="button" className="mt-3 min-h-11 text-sm font-semibold text-primary disabled:text-muted-foreground" disabled={!categoryId && !requirements && !deadline} onClick={() => {
              setCategoryId("");
              setPackageId("");
              setRequirements("");
              setDeadline("");
              document.getElementById("estimate-category")?.focus();
            }}>Atur ulang pilihan</button>
          </div>
        </div>
      </div>
    </section>
  );
}
