import { describe, expect, it } from "vitest";
import type { PricingCategory, PricingPackage } from "@daydev/shared-types";
import { availablePricing, estimateMessage, startingPrice } from "./pricing";

function packageWith(price: number, order = 0): PricingPackage {
  return { id: `plan-${order}`, category_id: "umkm", name: `Paket ${order}`, price, features: ["Katalog produk"], display_order: order, is_recommended: false, demo_url: null };
}

function categoryWith(packages: PricingPackage[]): PricingCategory {
  return { id: "umkm", segment: "umkm", label: "UMKM", starting_price_label: "Label lama", display_order: 0, packages };
}

describe("pricing data shared by packages and estimates", () => {
  it("uses an updated API price for both starting price and the consultation message", () => {
    const category = categoryWith([packageWith(2750000)]);
    expect(startingPrice(category)).toBe(2750000);
    const message = estimateMessage(category, category.packages[0], "  Integrasi kasir  ", "  Desember  ");
    expect(message).toContain("Rp 2.750.000");
    expect(message).toContain("Kebutuhan tambahan: Integrasi kasir");
    expect(message).toContain("Target waktu: Desember");
    expect(message).not.toContain("Label lama");
    category.packages[0].price = 3100000;
    expect(startingPrice(category)).toBe(3100000);
    expect(estimateMessage(category, category.packages[0], "", "")).toContain("Rp 3.100.000");
  });

  it("keeps zero-price packages, excludes unavailable prices, and leaves API ordering intact", () => {
    const category = categoryWith([packageWith(5000000, 2), packageWith(0, 1), packageWith(-1, 3), packageWith(Number.NaN, 4)]);
    const available = availablePricing([category, { ...categoryWith([]), id: "empty" }]);
    expect(available).toHaveLength(1);
    expect(available[0].packages.map((plan) => plan.price)).toEqual([0, 5000000]);
    expect(startingPrice(available[0])).toBe(0);
    expect(category.packages[0].display_order).toBe(2);
    expect(category.packages).toHaveLength(4);
  });
});
