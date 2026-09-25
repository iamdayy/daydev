import { app } from "./app";
import type { Hono } from "hono";
import type { Env } from "./lib/types";

// Bind supaya `this` tidak hilang saat dipakai Vercel; type fetch diambil
// dari kelas Hono agar selalu kompatibel dengan adapter Vercel/Bun.
export const handler: Hono<Env>["fetch"] = app.fetch.bind(app);
export default handler;

// Dev/standalone: jalankan Bun HTTP server langsung (batas body 1 MB).
if (
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL !== "1"
) {
  const port = Number(process.env.PORT ?? 8000);
  Bun.serve({
    port,
    maxRequestBodySize: 1024 * 1024, // 1 MB; upload file besar lewat presigned R2
    fetch: handler,
  });
  console.log(`[daydev-api] listening on http://localhost:${port}`);
  console.log(`[daydev-api] swagger docs at http://localhost:${port}/swagger`);
}

export type { App } from "./lib/types";