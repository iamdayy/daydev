import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { API_BASE_URL } from "../lib/api";
import { validateAdminPath } from "../lib/admin-paths";

type AdminService = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token: string;
};

async function adminFetch({ path, method, body, token }: AdminService): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
  });
  const data = (await res.json().catch(() => null)) as
    | { error?: string }
    | unknown;
  if (!res.ok) {
    const message = (data as { error?: string })?.error ?? `API error ${res.status}`;
    throw new ActionError({
      code: res.status === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message,
    });
  }
  return data;
}

export const server = {
  login: defineAction({
    accept: "json",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    handler: async (input, context) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.email, password: input.password }),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; token?: string; user?: { id: string; email: string; name: string } }
        | null;
      if (!res.ok || !data?.token) {
        throw new ActionError({
          code: res.status === 401 || res.status === 429 ? "UNAUTHORIZED" : "BAD_REQUEST",
          message: (data as { error?: string } | null)?.error ?? "Login gagal.",
        });
      }
      if (!context.session) {
        throw new ActionError({ code: "BAD_REQUEST", message: "Sesi tidak tersedia." });
      }
      context.session.set("authenticated", true);
      context.session.set("token", data.token);
      return { user: data.user };
    },
  }),

  logout: defineAction({
    handler: async (_input, context) => {
      const token = await context.session?.get("token");
      if (token && typeof token === "string") {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
      context.session?.destroy();
      return { ok: true };
    },
  }),

  // Proxy CRUD admin: semua permintaan dikirim ke API dengan token dari session.
  adminCall: defineAction({
    accept: "json",
    input: z.object({
      path: z.string(),
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      body: z.optional(z.any()),
    }),
    handler: async (input, context) => {
      if (!validateAdminPath(input.path)) {
        throw new ActionError({ code: "BAD_REQUEST", message: "Path tidak diizinkan." });
      }
      const token = await context.session?.get("token");
      if (!token || typeof token !== "string") {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Sesi berakhir." });
      }
      try {
        return await adminFetch({
          path: input.path,
          method: input.method,
          body: input.body ?? {},
          token,
        });
      } catch (error) {
        if (error instanceof ActionError && error.code === "UNAUTHORIZED") {
          context.session?.destroy();
        }
        throw error;
      }
    },
  }),
};