import type { OpenAPIHono } from "@hono/zod-openapi";

/** Data admin hasil autentikasi (ditaruh di variabel konteks Hono). */
export interface Admin {
  id: string;
  email: string;
  sid: string;
}

/** Variabel konteks aplikasi: `admin` terisi oleh middleware adminAuth. */
export type Env = {
  Variables: {
    admin?: Admin;
  };
};

/** Tipe app bersama untuk semua modul route. */
export type App = OpenAPIHono<Env>;