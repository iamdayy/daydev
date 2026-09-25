import { app } from "./app";

// Vercel (Fluid compute / Bun runtime): import default berbentuk Request -> Response
export default app.handle;

// Dev/standalone: jalankan Bun HTTP server langsung.
if (
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL !== "1"
) {
  const port = Number(process.env.PORT ?? 8000);
  app.listen(port);
  console.log(`[daydev-api] listening on http://localhost:${port}`);
  console.log(`[daydev-api] swagger docs at http://localhost:${port}/swagger`);
}

export type { App } from "./app";
