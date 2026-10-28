import { formatRupiah, type PricingCategory, type PricingPackage } from "@daydev/shared-types";

export function availablePricing(categories: PricingCategory[]): PricingCategory[] {
  return categories
    .map((category) => ({
      ...category,
      packages: category.packages
        .filter((plan) => Number.isFinite(plan.price) && plan.price >= 0)
        .sort((a, b) => a.display_order - b.display_order),
    }))
    .filter((category) => category.packages.length > 0)
    .sort((a, b) => a.display_order - b.display_order);
}

export function startingPrice(category: PricingCategory): number {
  return Math.min(...category.packages.map((plan) => plan.price));
}

export function estimateMessage(
  category: PricingCategory,
  plan: PricingPackage,
  requirements: string,
  deadline: string,
): string {
  return [
    "Halo Daydev, saya ingin membahas estimasi proyek.",
    `Kategori: ${category.label}`,
    `Paket: ${plan.name}`,
    `Harga dasar paket: ${formatRupiah(plan.price)}`,
    requirements.trim() && `Kebutuhan tambahan: ${requirements.trim()}`,
    deadline.trim() && `Target waktu: ${deadline.trim()}`,
    "Mohon konfirmasi cakupan, biaya tambahan, dan harga final setelah konsultasi.",
  ].filter(Boolean).join("\n");
}
