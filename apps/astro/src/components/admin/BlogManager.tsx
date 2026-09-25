import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import type { BlogPost } from "@daydev/shared-types";
import { call, uploadToR2 } from "./adminClient";

interface BlogManagerProps {
  initial: BlogPost[];
}

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  author: "Tim Daydev",
  readingMinutes: 5,
  isPublished: false,
};

type FormState = typeof EMPTY;

export default function BlogManager({ initial }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initial);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const refresh = async () => {
    const { posts: all } = await call<{ posts: BlogPost[] }>("/admin/blog");
    setPosts(all);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.cover_image_url ?? "",
      author: post.author,
      readingMinutes: post.reading_minutes,
      isPublished: post.is_published,
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
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      coverImageUrl: form.coverImageUrl || null,
      author: form.author,
      readingMinutes: Number(form.readingMinutes) || 5,
      isPublished: form.isPublished,
    };
    try {
      if (editing) {
        await call(`/admin/blog/${editing.id}`, "PUT", body);
      } else {
        await call("/admin/blog", "POST", body);
      }
      setMessage(editing ? "Perubahan disimpan." : "Artikel baru dibuat.");
      startCreate();
      await refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (post: BlogPost) => {
    if (!window.confirm(`Hapus "${post.title}"?`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await call(`/admin/blog/${post.id}`, "DELETE");
      setMessage("Artikel dihapus.");
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
        <Plus className="size-4" aria-hidden="true" /> Tulis artikel
      </button>

      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground">
            {editing ? "Edit artikel" : "Artikel baru"}
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
            <label className="mb-1.5 block text-sm font-semibold">Slug (opsional)</label>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="otomatis dari judul bila kosong"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Penulis</label>
            <input
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Ringkasan</label>
            <textarea
              required minLength={10} rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Konten (markdown)</label>
            <textarea
              required minLength={20} rows={12}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="# Judul bagian&#10;&#10;Tulis paragraf di sini. Gunakan markdown: - list, **tebal**, dan tautan [label](https://...)."
              className={`${inputClass} font-mono text-xs leading-6`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Banyak menit baca</label>
            <input
              type="number" min={1} max={120}
              value={form.readingMinutes}
              onChange={(e) => set("readingMinutes", Number(e.target.value))}
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
          Terbitkan sekarang
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-6 min-h-[46px] w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Menyimpan..." : editing ? "Simpan perubahan" : "Buat artikel"}
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
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                  Belum ada artikel.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="max-w-xs px-6 py-4">
                  <p className="truncate font-semibold text-foreground">{post.title}</p>
                  <p className="truncate text-xs text-muted-foreground">/{post.slug}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      post.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.is_published ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="min-h-[44px] rounded-lg border border-border px-3 py-2 font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(post)}
                      aria-label={`Hapus ${post.title}`}
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