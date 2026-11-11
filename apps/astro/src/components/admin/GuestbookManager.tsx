import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { GuestbookEntry } from "@daydev/shared-types";
import { call } from "./adminClient";

export default function GuestbookManager({ initial }: { initial: GuestbookEntry[] }) {
  const [items, setItems] = useState(initial);
  const refresh = async () => setItems((await call<{ entries: GuestbookEntry[] }>("/admin/guestbook")).entries);
  useEffect(() => { void refresh(); }, []);
  const toggle = async (item: GuestbookEntry) => { await call(`/admin/guestbook/${item.id}`, "PUT", { isPublished: !item.is_published }); await refresh(); };
  const remove = async (item: GuestbookEntry) => { if (confirm(`Hapus pesan dari ${item.name}?`)) { await call(`/admin/guestbook/${item.id}`, "DELETE"); await refresh(); } };
  return <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex justify-between"><div><h2 className="font-semibold">{item.name}</h2><p className="text-sm text-muted-foreground">{item.role || "Tamu"} · ★ {item.rating}</p></div><button onClick={() => remove(item)}><Trash2 className="size-4" /></button></div><p className="mt-4 leading-7">“{item.message}”</p><button className="mt-4 rounded-lg border border-border px-3 py-2 text-sm" onClick={() => toggle(item)}>{item.is_published ? "Sembunyikan" : "Terbitkan"}</button></article>)}</div>;
}
