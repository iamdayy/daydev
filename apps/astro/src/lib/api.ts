import type {
  BlogPost,
  PortfolioItem,
  PricingCategory,
  SiteStat,
  TeamMember,
  Testimonial,
} from "@daydev/shared-types";

const configuredApiUrl = import.meta.env.PUBLIC_API_URL?.trim();

if (!configuredApiUrl && import.meta.env.PROD) {
  throw new Error("PUBLIC_API_URL wajib diatur untuk build production Astro.");
}

export const API_BASE_URL = (
  configuredApiUrl || "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** GET JSON dari API publik. Lempar ApiError kalau status >= 400. */
export async function fetchJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError(0, "API tidak dapat dijangkau.");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new ApiError(res.status, body?.error ?? `API error ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getStats(): Promise<SiteStat[]> {
  const data = await fetchJson<{ stats: SiteStat[] }>("/stats");
  return data.stats;
}

export async function getTeam(): Promise<TeamMember[]> {
  const data = await fetchJson<{ team: TeamMember[] }>("/team");
  return data.team;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const data = await fetchJson<{ portfolio: PortfolioItem[] }>("/portfolio");
  return data.portfolio;
}

export async function getPricing(): Promise<PricingCategory[]> {
  const data = await fetchJson<{ categories: PricingCategory[] }>("/pricing");
  return data.categories;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchJson<{ posts: BlogPost[] }>("/blog");
  return data.posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await fetchJson<{ post: BlogPost }>(`/blog/${slug}`);
    return data.post;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchJson<{ testimonials: Testimonial[] }>("/testimonials");
  return data.testimonials;
}

export async function getBlogSlugs(): Promise<string[]> {
  return (await getBlogPosts()).map((p) => p.slug);
}