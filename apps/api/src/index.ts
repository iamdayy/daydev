import { app } from "./app";
import type { Hono } from "hono";
import type { Env } from "./lib/types";

// Entrypoint Vercel (Hono preset): default export berbentuk Request -> Response.
// Bind supaya `this` tidak hilang; type fetch diambil dari kelas Hono.
export const handler: Hono<Env>["fetch"] = app.fetch.bind(app);
export default handler;