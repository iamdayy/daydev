import data from "@/data/pricing.json";

export interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface Pricing {
  id: number;
  category: "UMKM" | "Mahasiswa" | "Startup";
  icon: string;
  badge: string;
  description: string;
  plans: Plan[];
  themeColor: string;
  lightBg: string;
}

export const pricingPlans: Pricing[] = data as Pricing[];
