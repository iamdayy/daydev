import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import type { PortfolioItem } from "@daydev/shared-types";
import { call, uploadToR2 } from "./adminClient";

interface PortfolioManagerProps {
  initial: PortfolioItem[];
}

const EMPTY = {
  title: "",
  category: "web" as PortfolioItem["category"],
  segment: null as string | null,
  description: "",
  resultHighlight: "",
  coverImageUrl: "",
  demoUrl: "",
  techStack: "",
  clientName: "",
  displayOrder: 0,
  isPublished: false,
};

type FormState = typeof EMPTY;

export default function PortfolioManager({ initial }: PortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initial);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const refresh = async () => {
    const { portfolio } = await call<{ portfolio: PortfolioItem[] }>(
      "/admin/portfolio",
    );
    setItems(portfolio);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      segment: item.segment,
      description: item.description,
      resultHighlight: item.result_highlight ?? "",
      coverImageUrl: item.cover_image_url ?? "",
      demoUrl: item.demo_url ?? "",
      techStack: (item.tech_stack ?? []).join(", "),
      clientName: item.client_name ?? "",
      displayOrder: item.display_order,
      isPublished: item.is_published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const publicUrl = await uploadToR2(file);
      set("coverImageUrl", publicUrl);
      setMessage("Gambar berhasil diunggah.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const body = {
      title: form.title,
      category: form.category,
      segment: form.segment || null,
      description: form.description,
      resultHighlight: form.resultHighlight || null,
      coverImageUrl: form.coverImageUrl,
      galleryImageUrls: [] as string[],
      demoUrl: form.demoUrl || null,
      techStack: form.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      clientName: form.clientName || null,
      displayOrder: Number(form.displayOrder) || 0,
      isPublished: form.isPublished,
    };
    try {
      if (editing) {
        await call(`/admin/portfolio/${editing.id}`, "PUT", body);
      } else {
        await call("/admin/portfolio", "POST", body);
      }
      setMessage(editing ? "Perubahan disimpan." : "Proyek baru dibuat.");
      startCreate();
      await refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: PortfolioItem) => {
    if (!window.confirm(`Hapus "${item.title}"?`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await call(`/admin/portfolio/${item.id}`, "DELETE");
      setMessage("Proyek dihapus.");
      await refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (item: PortfolioItem) => {
    setBusy(true);
    try {
      await call(`/admin/portfolio/${item.id}`, "PUT", {
        ...item,
        coverImageUrl: item.cover_image_url ?? "",
        resultHighlight: item.result_highlight ?? null,
        galleryImageUrls: item.gallery_image_urls ?? [],
        techStack: item.tech_stack ?? [],
        demoUrl: item.demo_url ?? null,
        clientName: item.client_name ?? null,
        segment: item.segment ?? null,
        isPublished: !item.is_published,
      });
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
        <Plus className="size-4" aria-hidden="true" /> Tambah proyek
      </button>

      <form
        onSubmit={save}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground">
            {editing ? "Edit proyek" : "Proyek baru"}
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
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Judul</label>
            <input
              required minLength={3}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as FormState["category"])}
              className={inputClass}
            >
              <option value="web">Web Development</option>
              <option value="mobile">Mobile</option>
              <option value="bot-telegram">Bot Telegram</option>
              <option value="undangan-digital">Undangan Digital</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Segmen (opsional)</label>
            <select
              value={form.segment ?? ""}
              onChange={(e) => set("segment", e.target.value || null)}
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

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Deskripsi</label>
            <textarea
              required minLength={10} rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Hasil utama</label>
            <input
              value={form.resultHighlight}
              onChange={(e) => set("resultHighlight", e.target.value)}
              placeholder="contoh: RSVP online dengan notifikasi WhatsApp"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Tech stack</label>
            <input
              value={form.techStack}
              onChange={(e) => set("techStack", e.target.value)}
              placeholder="Next.js, PostgreSQL (pisahkan dengan koma)"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">URL demo live</label>
            <input
              type="url"
              value={form.demoUrl}
              onChange={(e) => set("demoUrl", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Urutan tampil</label>
            <input
              type="number" min={0}
              value={form.displayOrder}
              onChange={(e) => set("displayOrder", Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-4">
          <label className="mb-1.5 block text-sm font-semibold">Gambar sampul</label>
          <div className="flex flex-wrap items-center gap-4">
            {form.coverImageUrl ? (
              <img
                src={form.coverImageUrl}
                alt="Pratinjau sampul"
                className="h-24 w-36 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-24 w-36 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                Belum ada gambar
              </div>
            )}
            <label className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
              <Upload className="size-4" aria-hidden="true" />
              {uploading ? "Mengunggah..." : "Unggah gambar"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
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
          {busy ? "Menyimpan..." : editing ? "Simpan perubahan" : "Buat proyek"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-bold">Judul</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                  Belum ada proyek. Tambahkan lewat tombol di atas.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                        Tanpa img
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    className={`min-h-[44px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      item.is_published
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {item.is_published ? "Terbit" : "Draft"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="min-h-[44px] rounded-lg border border-border px-3 py-2 font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      aria-label={`Hapus ${item.title}`}
                      className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-3 py-2 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}