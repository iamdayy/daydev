import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson, loadData } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("data loading states", () => {
  it("distinguishes an empty response from an unavailable API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("[]")).mockRejectedValueOnce(new TypeError("offline")));
    expect(await loadData(fetchJson("/portfolio"))).toEqual({ ok: true, data: [] });
    expect(await loadData(fetchJson("/portfolio"))).toEqual({ ok: false, data: null });
  });

  it("isolates API errors so other sections still load", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("unavailable", { status: 503 })).mockResolvedValueOnce(new Response('[{"id":"project"}]')));
    const [blog, portfolio] = await Promise.all([loadData(fetchJson("/blog")), loadData(fetchJson("/portfolio"))]);
    expect(blog.ok).toBe(false);
    expect(portfolio).toEqual({ ok: true, data: [{ id: "project" }] });
  });
});
