/**
 * Blog articles: didukung CMS file-based (Keystatic).
 *
 * - Jika ada konten di `content/posts/` (hasil edit lewat /keystatic),
 *   artikel diambil dari sana dan menjadi sumber utama.
 * - Jika folder belum terisi, kembali ke artikel statis di `blog-static.ts`.
 *
 * Hanya dipakai oleh server components (halaman blog, beranda, sitemap).
 * Admin CMS berada di /keystatic.
 */
import { createReader } from "@keystatic/core/reader";
import { blogArticles as staticArticles } from "@/data/blog-static";
import type { BlogArticle } from "@/data/blog-static";
import config from "../../keystatic.config";

function makeReader() {
  return createReader(process.cwd(), config);
}

type BlogReader = ReturnType<typeof makeReader>;

let reader: BlogReader | null = null;

function getReader() {
  if (!reader) {
    reader = makeReader();
  }
  return reader;
}

async function readCmsArticles(): Promise<BlogArticle[]> {
  const entries = await getReader().collections.posts.all();
  return entries.map(({ slug, entry }) => ({
    id: slug,
    slug,
    title: entry.title || slug,
    description: entry.description ?? "",
    content: entry.content ?? "",
    author: entry.author || "Tim Daydev",
    category: entry.category ?? "Tutorial",
    tags: [...(entry.tags ?? [])],
    featured: Boolean(entry.featured),
    readingTime: entry.readingTime || 5,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt || undefined,
    excerpt: entry.excerpt ?? "",
  }));
}

async function loadArticles(): Promise<BlogArticle[]> {
  try {
    const cmsArticles = await readCmsArticles();
    return cmsArticles.length > 0 ? cmsArticles : staticArticles;
  } catch {
    return staticArticles;
  }
}

export async function getAllArticles(): Promise<BlogArticle[]> {
  const articles = await loadArticles();
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getFeaturedArticles(): Promise<BlogArticle[]> {
  const articles = await loadArticles();
  return articles
    .filter((article) => article.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getArticleBySlug(
  slug: string,
): Promise<BlogArticle | undefined> {
  const articles = await loadArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getArticlesByCategory(
  category: string,
): Promise<BlogArticle[]> {
  const articles = await loadArticles();
  return articles
    .filter((article) => article.category === category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getArticlesByTag(tag: string): Promise<BlogArticle[]> {
  const articles = await loadArticles();
  return articles
    .filter((article) => article.tags.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getAllCategories(): Promise<string[]> {
  const articles = await loadArticles();
  const categories = new Set(articles.map((article) => article.category));
  return Array.from(categories).sort();
}

export async function getAllTags(): Promise<string[]> {
  const articles = await loadArticles();
  const tags = new Set<string>();
  articles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}