import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { waLink } from "@daydev/shared-types";
import ArticlePreview, { type ArticleSummary } from "./ArticlePreview";

interface BlogBrowserProps {
  articles: ArticleSummary[];
  loadError?: boolean;
}

export default function BlogBrowser({ articles, loadError = false }: BlogBrowserProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredArticles = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return articles.filter((article) => [article.title, article.excerpt, article.author].join(" ").toLowerCase().includes(normalized));
  }, [articles, query]);

  return (
    <>
      <header className="section-space bg-card">
        <div className="site-container grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <h1 className="page-title">Catatan dari studio</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8">Pengalaman membangun produk dan panduan untuk menentukan langkah digital Anda.</p>
          </div>
          <div>
            <label htmlFor="article-search" className="font-semibold">Cari artikel</label>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background px-4 focus-within:border-primary">
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input ref={searchRef} id="article-search" type="search" disabled={loadError || articles.length === 0} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Judul, topik, atau penulis" className="min-h-12 min-w-0 w-full bg-transparent placeholder:text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      <section className="section-space">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="section-title">{query.trim() ? "Hasil pencarian" : "Artikel terbaru"}</h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">{loadError ? "Daftar artikel belum tersedia" : `Menampilkan ${filteredArticles.length} dari ${articles.length} artikel`}</p>
          </div>
          <div className="article-list" data-count={filteredArticles.length}>
            {filteredArticles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div role="status" className="rounded-2xl bg-muted p-6 sm:p-8">
              <h3 className="text-xl font-semibold">{loadError ? "Artikel belum dapat dimuat" : articles.length === 0 ? "Artikel sedang disiapkan" : "Belum ada artikel yang cocok"}</h3>
              <p className="mt-3 leading-7">{loadError ? "Silakan muat ulang halaman untuk mencoba lagi." : articles.length === 0 ? "Kunjungi kembali untuk membaca tulisan terbaru dari tim Daydev." : "Coba kata kunci lain."}</p>
              {loadError && <a href="/blog" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline">Coba lagi</a>}
              {query && <button type="button" onClick={() => { setQuery(""); searchRef.current?.focus(); }} className="button-secondary mt-4">Hapus pencarian</button>}
            </div>
          )}
        </div>
      </section>

      <section className="section-space bg-muted">
        <div className="site-container flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div><h2 className="section-title">Bahas ide Anda</h2><p className="mt-5 leading-7">Ceritakan kebutuhan proyek Anda melalui konsultasi gratis.</p></div>
          <a href={waLink("Halo Daydev, saya ingin diskusi proyek setelah membaca blog.")} target="_blank" rel="noopener noreferrer" className="button-primary shrink-0">Diskusikan via WhatsApp</a>
        </div>
      </section>
    </>
  );
}
