import { app } from "./app";
import type { Hono } from "hono";
import type { Env } from "./lib/types";

// Vercel (Node runtime) mendeteksi web-style handler hanya jika default export
// memiliki properti `fetch` (atau method HTTP ber-*name*). Export berupa object
// dengan `.fetch` yang sudah di-bind supaya `this` = app saat dipanggil.
const handler: { fetch: Hono<Env>["fetch"] } = {
  fetch: app.fetch.bind(app),
};

export default handler;