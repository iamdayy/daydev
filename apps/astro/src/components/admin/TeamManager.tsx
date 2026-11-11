import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { TeamMember } from "@daydev/shared-types";
import { call } from "./adminClient";

const empty = { name: "", role: "", photoUrl: "", linkedinUrl: "", displayOrder: 0, isPublished: false };
type Form = typeof empty;

export default function TeamManager({ initial }: { initial: TeamMember[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<Form>(empty);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const refresh = async () => setItems((await call<{ team: TeamMember[] }>("/admin/team")).team);
  useEffect(() => { void refresh(); }, []);
  const reset = () => { setEditing(null); setForm(empty); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await call(editing ? `/admin/team/${editing.id}` : "/admin/team", editing ? "PUT" : "POST", { ...form, displayOrder: Number(form.displayOrder), photoUrl: form.photoUrl || null, linkedinUrl: form.linkedinUrl || null });
      setMessage("Anggota tim disimpan."); reset(); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menyimpan anggota tim."); }
  };
  const edit = (item: TeamMember) => { setEditing(item); setForm({ name: item.name, role: item.role, photoUrl: item.photo_url ?? "", linkedinUrl: item.linkedin_url ?? "", displayOrder: item.display_order, isPublished: item.is_published }); };
  const remove = async (item: TeamMember) => { if (!confirm(`Hapus ${item.name}?`)) return; try { await call(`/admin/team/${item.id}`, "DELETE"); await refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menghapus anggota tim."); } };
  const input = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm";
  return <div className="space-y-6">{message && <p role="status" className="rounded-xl bg-foreground/5 px-4 py-3 text-sm">{message}</p>}<form onSubmit={save} className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><h2 className="font-bold">{editing ? "Edit anggota" : "Tambah anggota"}</h2>{editing && <button type="button" onClick={reset} aria-label="Batal"><X className="size-4" /></button>}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><input className={input} placeholder="Nama" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input className={input} placeholder="Peran" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /><input className={input} placeholder="URL foto (R2)" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} /><input className={input} placeholder="URL LinkedIn" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} /><input className={input} type="number" min="0" placeholder="Urutan" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></div><label className="mt-4 flex gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Tampilkan di situs</label><button className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-semibold">{editing ? "Simpan" : "Tambah"}</button></form><div className="grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex justify-between"><div><h2 className="font-semibold">{item.name}</h2><p className="text-sm text-muted-foreground">{item.role}</p></div><div className="flex gap-3"><button onClick={() => edit(item)} aria-label={`Edit ${item.name}`}><Pencil className="size-4" /></button><button onClick={() => remove(item)} aria-label={`Hapus ${item.name}`}><Trash2 className="size-4" /></button></div></div><p className="mt-3 text-sm">{item.is_published ? "Terbit" : "Draft"}</p></article>)}</div></div>;
}
