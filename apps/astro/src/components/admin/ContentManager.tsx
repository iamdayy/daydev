import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteContent } from "@daydev/shared-types";
import { call } from "./adminClient";

const EMPTY = { kind: "skill", key: "", title: "", value: "", displayOrder: 0, isPublished: false };
type FormState = typeof EMPTY;

export default function ContentManager({ initial }: { initial: SiteContent[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<SiteContent | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [message, setMessage] = useState<string | null>(null);
  const input = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm";
  const refresh = async () => setItems((await call<{ content: SiteContent[] }>("/admin/content")).content);
  useEffect(() => { void refresh(); }, []);
  const reset = () => { setEditing(null); setForm(EMPTY); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(null);
    try {
      const body = { ...form, displayOrder: Number(form.displayOrder), metadata: null };
      await call(editing ? `/admin/content/${editing.id}` : "/admin/content", editing ? "PUT" : "POST", body);
      setMessage("Konten disimpan."); reset(); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menyimpan."); }
  };
  const edit = (item: SiteContent) => setForm({
    kind: item.kind, key: item.key, title: item.title, value: item.value,
    displayOrder: item.display_order, isPublished: item.is_published,
  });
  const remove = async (item: SiteContent) => {
    if (!confirm(`Hapus "${item.title}"?`)) return;
    await call(`/admin/content/${item.id}`, "DELETE"); await refresh();
  };
  return <div className="space-y-6">
    {message && <p role="status" className="rounded-xl bg-foreground/5 px-4 py-3 text-sm">{message}</p>}
    <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between"><h2 className="font-bold">{editing ? "Edit fakta" : "Tambah fakta"}</h2>{editing && <button type="button" onClick={reset}><X className="size-4" /></button>}</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input className={input} placeholder="Jenis (skill, milestone, contact, link)" required value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} />
        <input className={input} placeholder="Key unik" required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
        <input className={input} placeholder="Judul" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={input} placeholder="Nilai" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <input className={input} type="number" min="0" placeholder="Urutan" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
      </div>
      <label className="mt-4 flex gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Tampilkan di situs</label>
      <button className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-semibold">{editing ? "Simpan" : "Tambah"}</button>
    </form>
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="p-4">Jenis</th><th className="p-4">Judul</th><th className="p-4">Nilai</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id} className="border-b border-border last:border-0"><td className="p-4">{item.kind}</td><td className="p-4 font-medium">{item.title}</td><td className="p-4">{item.value}</td><td className="p-4">{item.is_published ? "Terbit" : "Draft"}</td><td className="p-4"><button className="mr-3" onClick={() => edit(item)}><Pencil className="size-4" /></button><button onClick={() => remove(item)}><Trash2 className="size-4" /></button></td></tr>)}</tbody>
      </table>
    </div>
  </div>;
}
