import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Testimonial } from "@daydev/shared-types";
import { call } from "./adminClient";

interface TestimonialManagerProps {
  initial: Testimonial[];
}

const EMPTY = {
  clientName: "",
  clientRole: "",
  segment: "" as string,
  quote: "",
  rating: 5,
  isPublished: false,
};

type FormState = typeof EMPTY;

export default function TestimonialManager({ initial }: TestimonialManagerProps) {
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const refresh = async () => {
    const { testimonials } = await call<{ testimonials: Testimonial[] }>(
      "/admin/testimonials",
    );
    setItems(testimonials);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({
      clientName: item.client_name,
      clientRole: item.client_role ?? "",
      segment: item.segment ?? "",
      quote: item.quote,
      rating: item.rating,
      isPublished: item.is_published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const body = {
      clientName: form.clientName,
      clientRole: form.clientRole || null,
      segment: form.segment || null,
      quote: form.quote,
      rating: Number(form.rating) || 5,
      isPublished: form.isPublished,
    };
    try {
      if (editing) {
        await call(`/admin/testimonials/${editing.id}`, "PUT", body);
      } else {
        await call("/admin/testimonials", "POST", body);
      }
      setMessage(editing ? "Perubahan disimpan." : "Testimoni baru dibuat.");
      startCreate();
      await refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: Testimonial) => {
    if (!window.confirm(`Hapus testimoni dari "${item.client_name}"?`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await call(`/admin/testimonials/${item.id}`, "DELETE");
      setMessage("Testimoni dihapus.");
      await refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

  return (
    <div className="space-y-6">
      {message && (
        <p role="status" className="rounded-xl bg-foreground/5 px-4 py-3 text-sm font-medium">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={startCreate}
        className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
      >
        <Plus className="size-4" aria-hidden="true" /> Tambah testimoni
      </button>

      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground">
            {editing ? "Edit testimoni" : "Testimoni baru"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-[44px] items-center gap-1 px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" /> Batal
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Nama klien</label>
            <input
              required minLength={2}
              value={form.clientName}
              onChange={(e) => set("clientName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Peran (opsional)</label>
            <input
              value={form.clientRole}
              onChange={(e) => set("clientRole", e.target.value)}
              placeholder="CEO / Founder / Mahasiswa"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Segmen</label>
            <select
              value={form.segment}
              onChange={(e) => set("segment", e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              <option value="startup">Startup</option>
              <option value="umkm">UMKM</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="undangan-digital">Undangan Digital</option>
              <option value="bot-telegram">Bot Telegram</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => set("rating", Number(e.target.value))}
              className={inputClass}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} dari 5
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Ulasan</label>
            <textarea
              required minLength={10} rows={4}
              value={form.quote}
              onChange={(e) => set("quote", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
            className="size-4 accent-primary"
          />
          Tampilkan di situs
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-6 min-h-[46px] w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Menyimpan..." : editing ? "Simpan perubahan" : "Buat testimoni"}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada testimoni. Tambahkan lewat tombol di atas.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.is_published
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.is_published ? "Terbit" : "Draft"}
              </span>
              <span className="text-sm text-muted-foreground">★ {item.rating}</span>
            </div>
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
              “{item.quote}”
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-foreground">{item.client_name}</span>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="min-h-[44px] rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`Hapus testimoni ${item.client_name}`}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-3 py-2 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}