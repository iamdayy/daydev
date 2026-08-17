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

      {/* Quick Services Preview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Link
              href="/services/web-development"
              className="group p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🌐
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600">
                Web Development
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Website modern & responsive
              </p>
            </Link>

            <Link
              href="/services/mobile-development"
              className="group p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-orange-400 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-orange-600">
                Mobile Apps
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Aplikasi iOS & Android
              </p>
            </Link>

            <Link
              href="/services/telegram-bot"
              className="group p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-orange-400 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-orange-600">
                Bot Telegram
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Automasi bisnis 24/7
              </p>
            </Link>

            <Link
              href="/services/undangan-digital"
              className="group p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-pink-400 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                💌
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-pink-600">
                Undangan Digital
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Undangan online interaktif
              </p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Lihat Semua Layanan
            </Link>
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
