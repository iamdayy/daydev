import { actions } from "astro:actions";

/** Panggil proxy adminCall dari island; otomatis arahkan ke login saat sesi berakhir. */
export async function call<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
): Promise<T> {
  const result = await actions.adminCall({ path, method, body: body ?? {} });
  if (result.error) {
    if (result.error.code === "UNAUTHORIZED") {
      window.location.replace("/admin/login");
      throw new Error("Sesi berakhir. Silakan login ulang.");
    }
    throw new Error(result.error.message ?? "Permintaan gagal.");
  }
  return result.data as T;
}

/** Unikahkan nama file agar aman di R2. */
function uniqueFilename(name: string): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const base = (name.slice(0, name.lastIndexOf(".")) || "file")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Date.now()}${ext}`;
}

/** Upload file ke R2 lewat presigned URL, kembalikan URL publik. */
export async function uploadToR2(file: File): Promise<string> {
  const { url, publicUrl } = await call<{ url: string; publicUrl: string }>(
    "/admin/uploads/presign",
    "POST",
    { filename: uniqueFilename(file.name), contentType: file.type || "application/octet-stream" },
  );
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error("Upload ke R2 gagal.");
  return publicUrl;
}