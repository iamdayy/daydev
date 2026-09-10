"use client";

import { getAllArticles, getAllCategories, getFeaturedArticles } from "@/data/blog";
import { ArrowUpRight, BookOpen, Clock3, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const articles = useMemo(() => getAllArticles(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const featured = getFeaturedArticles()[0] ?? articles[0];
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
      const matchesQuery = !normalizedQuery || [article.title, article.excerpt, article.category, ...article.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [articles, query, selectedCategory]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.65fr]">
            <div>
              <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-primary">
                <BookOpen className="size-4" aria-hidden="true" />
                <span>Daydev Journal</span>
              </div>
              <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Insight yang membantu bisnis tumbuh di ruang digital.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                Panduan praktis, perspektif produk, dan strategi teknologi dari tim yang membangun website serta aplikasi untuk bisnis nyata.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Cari insight</p>
              <label className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-primary">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Cari artikel</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="SEO, website, bisnis..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Temukan ide yang relevan untuk langkah digital Anda berikutnya.</p>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Pilihan editor</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Mulai dari sini</h2>
            </div>
            <span className="hidden text-sm text-muted-foreground sm:block">Insight paling relevan minggu ini</span>
          </div>
          <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-64 flex-col justify-between bg-primary p-7 text-primary-foreground sm:p-10">
              <span className="w-fit rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">{featured.category}</span>
              <div>
                <p className="text-sm text-primary-foreground/75">{formatDate(featured.publishedAt)} · {featured.readingTime} menit membaca</p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{featured.title}</h3>
              </div>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10">
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-5 text-sm font-semibold">
                <span>{featured.author}</span>
                <span className="flex items-center gap-2 text-primary">Baca artikel <ArrowUpRight className="size-4" aria-hidden="true" /></span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Semua artikel</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Baca, terapkan, kembangkan</h2>
              <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
                Menampilkan {filteredArticles.length} dari {articles.length} artikel
              </p>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter kategori">
              {["Semua", ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`rounded-full border px-4 py-2 min-h-[44px] text-sm font-medium transition-colors ${selectedCategory === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article key={article.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  <span>{article.category}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" />{article.readingTime} min</span>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-8 tracking-tight"><Link href={`/blog/${article.slug}`} className="group-hover:text-primary">{article.title}</Link></h3>
                <p className="mt-3 line-clamp-3 flex-1 leading-7 text-muted-foreground">{article.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"><span>{formatDate(article.publishedAt)}</span><Link href={`/blog/${article.slug}`} className="font-semibold text-primary">Baca <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" /></Link></div>
              </article>
            ))}
          </div>
          {filteredArticles.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><h3 className="text-lg font-semibold">Belum ada artikel yang cocok</h3><p className="mt-2 text-muted-foreground">Coba kata kunci atau kategori lain.</p></div>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-secondary p-8 sm:p-10 lg:flex-row lg:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Punya tantangan digital?</p><h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">Mari ubah ide Anda menjadi produk yang bekerja.</h2></div>
          <Link href="https://wa.me/6285175284253?text=Halo%20Daydev%2C%20saya%20ingin%20diskusi%20proyek." target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 min-h-[48px] items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Diskusikan proyek via WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
