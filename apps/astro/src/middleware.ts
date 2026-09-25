import { defineMiddleware } from "astro:middleware";

// Melindungi seluruh /admin/* kecuali halaman login. Status login disimpan di
// Astro Sessions (lruCache on-device; cukup untuk mencegah akses tak wajar).
// Untuk produksi dengan multi-instance, bisa diganti driver Redis/DB tanpa
// mengubah kode halaman.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminArea && !isLoginPage) {
    const authenticated = await context.session?.get("authenticated");
    if (authenticated !== true) {
      return context.redirect("/admin/login");
    }
  }

  // Pengguna yang sudah login tidak perlu melihat halaman login lagi.
  if (isLoginPage) {
    const authenticated = await context.session?.get("authenticated");
    if (authenticated === true) {
      return context.redirect("/admin");
    }
  }

  return next();
});