import { describe, expect, test } from "bun:test";
import { app } from "../../app";

describe("app (tanpa sentuh database)", () => {
  test("GET /health -> ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; time: string };
    expect(body.status).toBe("ok");
    expect(typeof body.time).toBe("string");
  });

  test("GET / -> daftar endpoint", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { docs: string; health: string };
    expect(body.docs).toBe("/swagger");
    expect(body.health).toBe("/health");
  });

  test("route tak dikenal -> 404 { error }", async () => {
    const res = await app.request("/tidak-ada");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Endpoint tidak ditemukan.");
  });

  test("body login tidak valid -> 422 { error, issues }", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "bukan-email", password: "123456" }),
    });
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: string; issues: unknown[] };
    expect(body.error).toBe("Validasi gagal.");
    expect(Array.isArray(body.issues)).toBe(true);
  });

  test("endpoint admin tanpa bearer -> 401", async () => {
    const res = await app.request("/admin/stats");
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Missing bearer token");
  });

  test("/swagger/openapi.json memuat route", async () => {
    const res = await app.request("/swagger/openapi.json");
    expect(res.status).toBe(200);
    const spec = (await res.json()) as {
      paths: Record<string, unknown>;
      tags: { name: string }[];
    };
    expect(spec.paths["/stats"]).toBeDefined();
    expect(spec.paths["/auth/login"]).toBeDefined();
    expect(spec.tags.some((t) => t.name === "uploads")).toBe(true);
  });
});