import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TargetMarket from "@/components/TargetMarket";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getFeaturedArticles } from "@/data/blog";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetMarket />
      <FeaturedProjects />

      {/* Services Preview */}
      <section className="bg-background px-4 py-24 sm:px-6" id="layanan">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">Dari ide ke rilis</p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Teknologi yang bekerja untuk tujuan bisnis Anda.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[{ href: "/services/web-development", title: "Website", description: "Website cepat, rapi, dan siap mengubah pengunjung menjadi pelanggan." }, { href: "/services/mobile-development", title: "Mobile app", description: "Produk mobile yang terasa natural dan siap tumbuh bersama pengguna." }, { href: "/services/telegram-bot", title: "Automasi", description: "Kurangi pekerjaan repetitif dengan alur kerja yang lebih cerdas." }, { href: "/services/undangan-digital", title: "Undangan digital", description: "Pengalaman acara yang elegan, interaktif, dan mudah dibagikan." }].map((service) => (
              <Link key={service.href} href={service.href} className="group flex min-h-64 flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                <div><div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><span className="text-xl font-bold">+</span></div><h3 className="text-xl font-bold text-foreground group-hover:text-primary">{service.title}</h3><p className="mt-3 leading-6 text-muted-foreground">{service.description}</p></div>
                <span className="mt-8 text-sm font-semibold text-primary">Pelajari layanan <ArrowUpRight className="ml-1 inline size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Blog Preview Section */}
      <section className="bg-background px-4 py-24 sm:px-6" id="artikel">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">Insight untuk langkah berikutnya</p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Artikel yang membantu Anda membuat keputusan lebih baik.</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Tips praktis, panduan teknis, dan sudut pandang produk untuk membangun digital product yang benar-benar dipakai.</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-primary transition-transform hover:translate-x-1">Lihat semua artikel <ArrowUpRight className="size-4" /></Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {getFeaturedArticles().slice(0, 2).map((article) => (
              <article key={article.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative flex h-52 items-end overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-accent p-6">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, currentColor 25%, currentColor 26%, transparent 26%, transparent 55%, currentColor 55%, currentColor 56%, transparent 56%)", backgroundSize: "28px 28px" }} />
                  <span className="relative rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">{article.category}</span>
                </div>
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{article.readingTime} menit baca</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl"><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
                  <p className="line-clamp-3 leading-7 text-muted-foreground">{article.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="font-semibold text-foreground">{article.author}</span>
                    <Link href={`/blog/${article.slug}`} className="font-semibold text-primary">Baca artikel <ArrowUpRight className="ml-1 inline size-4" /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
