import { useState } from "react";
import { call } from "./adminClient";

interface StatRow {
  key: string;
  value: string;
  updated_at: string;
}

interface StatsManagerProps {
  initial: StatRow[];
}

const SUGGESTED_KEYS = [
  "topik-konsultasi",
  "proyek-selesai",
  "klien-bisnis",
  "rating-klien",
  "tahun-pengalaman",
];

export default function StatsManager({ initial }: StatsManagerProps) {
  const [rows, setRows] = useState<StatRow[]>(initial);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (k: string, v: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const { stat } = await call<{ stat: StatRow }>(
        `/admin/stats/${encodeURIComponent(k)}`,
        "PUT",
        { value: v },
      );
      setRows((prev) => {
        const next = prev.filter((r) => r.key !== stat.key);
        return [...next, stat].sort((a, b) => a.key.localeCompare(b.key));
      });
      setMessage(`Statistik "${k}" diperbarui.`);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const addNew = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    await save(key.trim(), value.trim());
    setKey("");
    setValue("");
    if (message?.startsWith("Statistik")) {
      await refresh();
    }
  };

  const refresh = async () => {
    try {
      const { stats } = await call<{ stats: StatRow[] }>("/admin/stats");
      setRows(stats);
    } catch {
      // helper sudah menangani redirect 401
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <p role="status" className="rounded-xl bg-foreground/5 px-4 py-3 text-sm font-medium">
          {message}
        </p>
      )}

      <form
        onSubmit={addNew}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="font-bold text-foreground">Tambah / perbarui statistik</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Kosongkan baris yang tidak dipakai — angka hanya tampil bila datanya
          terisi.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label htmlFor="stat-key" className="mb-1.5 block text-sm font-semibold">
              Key
            </label>
            <input
              id="stat-key"
              list="stat-key-suggestions"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="contoh: proyek-selesai"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
            <datalist id="stat-key-suggestions">
              {SUGGESTED_KEYS.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="stat-value" className="mb-1.5 block text-sm font-semibold">
              Value
            </label>
            <input
              id="stat-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="contoh: 50+"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={busy}
              className="min-h-[46px] w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-bold text-foreground">Key</th>
              <th className="px-6 py-4 font-bold text-foreground">Value</th>
              <th className="px-6 py-4 text-right font-bold text-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                  Belum ada data. Tambahkan statistik di atas.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border last:border-0">
                <td className="px-6 py-4 font-semibold text-foreground">{row.key}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.value}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setKey(row.key);
                      setValue(row.value);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="min-h-[44px] rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}