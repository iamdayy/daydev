import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth";
import { statsRoutes } from "./routes/stats";
import { teamRoutes } from "./routes/team";
import { portfolioRoutes } from "./routes/portfolio";
import { blogRoutes } from "./routes/blog";
import { pricingRoutes } from "./routes/pricing";
import { testimonialRoutes } from "./routes/testimonials";
import { uploadRoutes } from "./routes/uploads";
import { HttpError, RateLimitError } from "./lib/http-error";

export const app = new Elysia({
  name: "daydev-api",
  serve: {
    maxRequestBodySize: 1024 * 1024, // 1 MB; upload file besar lewat presigned R2
  },
})
  .use(
    swagger({
      path: "/swagger",
      documentation: {
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
          { name: "admin", description: "Endpoint admin (perlu JWT bearer)" },
        ],
      },
    }),
  )
  .get("/", () => ({
    name: "Daydev Studio API",
    docs: "/swagger",
    health: "/health",
  }))
  .get("/health", () => ({ status: "ok", time: new Date().toISOString() }))
  .use(authRoutes)
  .use(statsRoutes)
  .use(teamRoutes)
  .use(portfolioRoutes)
  .use(blogRoutes)
  .use(pricingRoutes)
  .use(testimonialRoutes)
  .use(uploadRoutes)
  .onError(({ code, error, set }) => {
    // error buatan sendiri dengan status eksplisit
    if (error instanceof RateLimitError) {
      set.status = error.status;
      set.headers["retry-after"] = String(error.retryAfterSeconds);
      return { error: error.message };
    }
    if (error instanceof HttpError) {
      set.status = error.status;
      return { error: error.message };
    }
    if (code === "VALIDATION") {
      set.status = 422;
      const issues = (error as unknown as { all?: unknown }).all;
      return { error: "Validasi gagal.", issues };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Endpoint tidak ditemukan." };
    }
    if (code === "PARSE") {
      set.status = 400;
      return { error: "Request body tidak valid." };
    }
    // sisa: error internal. Jangan bocorkan pesan mentah ke klien.
    console.error("[api] unhandled error", error);
    set.status = 500;
    return { error: "Terjadi kesalahan internal." };
  });

export type App = typeof app;