import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { adminAuth } from "./lib/auth";
import { HttpError, RateLimitError } from "./lib/http-error";
import type { Env } from "./lib/types";
import { defaultHook } from "./lib/zhelpers";
import { authRoutes } from "./routes/auth";
import { blogRoutes } from "./routes/blog";
import { portfolioRoutes } from "./routes/portfolio";
import { pricingRoutes } from "./routes/pricing";
import { statsRoutes } from "./routes/stats";
import { teamRoutes } from "./routes/team";
import { testimonialRoutes } from "./routes/testimonials";
import { uploadRoutes } from "./routes/uploads";

export const app = new OpenAPIHono<Env>({ defaultHook });

// Semua endpoint /admin/* butuh bearer JWT + session aktif.
app.use("/admin/*", adminAuth);

app.get("/", (c) =>
  c.json({
    name: "Daydev Studio API",
    docs: "/swagger",
    health: "/health",
  }),
);

app.get("/health", (c) =>
  c.json({ status: "ok", time: new Date().toISOString() }),
);

authRoutes(app);
statsRoutes(app);
teamRoutes(app);
portfolioRoutes(app);
blogRoutes(app);
pricingRoutes(app);
testimonialRoutes(app);
uploadRoutes(app);

app.doc("/swagger/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Daydev Studio API",
    version: "1.0.0",
    description:
      "API untuk situs daydev.studio: konten publik + CRUD admin (statistik, tim, portfolio, blog, pricing, testimoni) + presigned upload ke Cloudflare R2.",
  },
  tags: [
    { name: "auth", description: "Autentikasi admin" },
    { name: "stats", description: "Statistik situs (satu sumber data)" },
    { name: "team", description: "Anggota tim" },
    { name: "portfolio", description: "Portfolio / case studies" },
    { name: "blog", description: "Artikel blog" },
    { name: "pricing", description: "Paket harga" },
    { name: "testimonials", description: "Testimoni klien" },
    { name: "uploads", description: "Presigned upload ke R2" },
  ],
});

app.get("/swagger", swaggerUI({ url: "/swagger/openapi.json" }));

app.notFound((c) => c.json({ error: "Endpoint tidak ditemukan." }, 404));

app.onError((error, c) => {
  if (error instanceof RateLimitError) {
    c.header("retry-after", String(error.retryAfterSeconds));
    return c.json(
      { error: error.message },
      error.status as ContentfulStatusCode,
    );
  }
  if (error instanceof HttpError) {
    return c.json(
      { error: error.message },
      error.status as ContentfulStatusCode,
    );
  }
  // Body JSON tidak valid (dibongkar sendiri oleh handler bila perlu).
  if (error instanceof SyntaxError) {
    return c.json({ error: "Request body tidak valid." }, 400);
  }
  // Sisa: error internal. Jangan bocorkan pesan mentah ke klien.
  console.error("[api] unhandled error", error);
  return c.json({ error: "Terjadi kesalahan internal." }, 500);
});