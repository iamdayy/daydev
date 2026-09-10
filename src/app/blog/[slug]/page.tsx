import { getAllArticles, getArticleBySlug, getArticlesByTag } from "@/data/blog";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import React, { Usable } from "react";

interface Props { params: Usable<{ slug: string }> }

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function renderContent(content: string) {
  return content.split("\n").map((line: string, index: number) => {
    const key = `${line}-${index}`;
    if (line.startsWith("# ")) return <h2 key={key} className="mt-12 text-3xl font-bold tracking-tight text-foreground first:mt-0">{line.replace("# ", "")}</h2>;
    if (line.startsWith("## ")) return <h2 key={key} className="mt-12 text-2xl font-bold tracking-tight text-foreground">{line.replace("## ", "")}</h2>;
    if (line.startsWith("### ")) return <h3 key={key} className="mt-8 text-xl font-bold text-foreground">{line.replace("### ", "")}</h3>;
    if (line.startsWith("- ")) return <li key={key} className="ml-5 list-disc leading-8 text-muted-foreground">{line.replace("- ", "")}</li>;
    if (line.trim() === "") return <div key={key} className="h-3" />;
    return <p key={key} className="leading-8 text-muted-foreground">{line}</p>;
  });
}

export default function BlogDetailPage({ params }: Props) {
  const { slug } = React.use(params);
  const article = getArticleBySlug(slug);

  if (!article) return <main className="min-h-screen bg-background px-4 py-24 text-center"><h1 className="text-3xl font-bold">Artikel tidak ditemukan</h1><p className="mt-3 text-muted-foreground">Artikel yang Anda cari tidak tersedia.</p><Link href="/blog" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary"><ArrowLeft className="size-4" aria-hidden="true" />Kembali ke blog</Link></main>;

  const relatedArticles = getArticlesByTag(article.tags[0]).filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" aria-hidden="true" />Kembali ke blog</Link>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-semibold text-primary"><span className="rounded-full bg-primary/10 px-3 py-1">{article.category}</span><span className="flex items-center gap-1 text-muted-foreground"><Clock3 className="size-4" aria-hidden="true" />{article.readingTime} menit membaca</span></div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">{article.title}</h1>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">{article.description}</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><span>Oleh {article.author}</span><span>{formatDate(article.publishedAt)}</span>{article.updatedAt && <span>Diperbarui {formatDate(article.updatedAt)}</span>}</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,680px)_260px] lg:py-16">
        <article>
          <div className="mb-10 flex flex-wrap gap-2">{article.tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">#{tag}</Link>)}</div>
          <div className="flex flex-col gap-2 text-[17px]">{renderContent(article.content)}</div>
          <div className="mt-14 rounded-3xl bg-secondary p-7 sm:p-9"><p className="text-sm font-semibold uppercase tracking-wide text-primary">Siap mulai?</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Butuh partner untuk membangun solusi digital?</h2><p className="mt-3 leading-7 text-muted-foreground">Ceritakan tantangan Anda. Kami bantu menyusun langkah yang paling masuk akal untuk bisnis.</p><Link href="https://wa.me/6285175284253?text=Halo%20Daydev%2C%20saya%20ingin%20diskusi%20proyek." target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">Diskusikan proyek via WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
        </article>
        <aside className="lg:sticky lg:top-8 lg:self-start"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Tentang penulis</p><p className="mt-4 text-lg font-bold">{article.author}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Tim developer Daydev yang membagikan pengalaman membangun produk digital.</p></div></aside>
      </div>

      {relatedArticles.length > 0 && <section className="border-t border-border bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16"><p className="text-sm font-semibold uppercase tracking-wide text-primary">Lanjut membaca</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Artikel terkait</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{relatedArticles.map((related) => <Link key={related.id} href={`/blog/${related.slug}`} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{related.category}</p><h3 className="mt-4 font-bold leading-7">{related.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{related.excerpt}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Baca artikel <ArrowUpRight className="size-4" aria-hidden="true" /></span></Link>)}</div></div></section>}
    </main>
  );
}
