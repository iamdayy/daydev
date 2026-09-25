import { describe, expect, it } from "vitest";
import { formatRupiah, waLink } from "@daydev/shared-types";

describe("formatRupiah", () => {
  it("formats IDR with thousand separators", () => {
    expect(formatRupiah(3500000)).toBe("Rp 3.500.000");
    expect(formatRupiah(99000)).toBe("Rp 99.000");
    expect(formatRupiah(0)).toBe("Rp 0");
  });
});

describe("waLink", () => {
  it("builds a wa.me URL with an encoded message", () => {
    const link = waLink("Halo Daydev, konsultasi gratis");
    expect(link.startsWith("https://wa.me/6285175284253?text=")).toBe(true);
    expect(link).toContain(encodeURIComponent("Halo Daydev, konsultasi gratis"));
  });
});