import { app } from "./app";

// Server lokal / standalone (bukan untuk Vercel). Batas body 1 MB;
// file besar harus lewat presigned R2, bukan lewat body request.
const port = Number(process.env.PORT ?? 8000);
Bun.serve({
  port,
  maxRequestBodySize: 1024 * 1024,
  fetch: app.fetch.bind(app),
});
console.log(`[daydev-api] listening on http://localhost:${port}`);
console.log(`[daydev-api] swagger docs at http://localhost:${port}/swagger`);