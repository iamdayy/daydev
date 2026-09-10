import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TargetMarket from "@/components/TargetMarket";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getFeaturedArticles } from "@/data/blog";
import Link from "next/link";
import { ArrowUpRight, Bot, CalendarDays, Clock3, Globe, Mail, Smartphone } from "lucide-react";

const servicePreview = [
  {
    href: "/services/web-development",
    icon: Globe,
    title: "Web Development",
    desc: "Website modern & responsive",
  },
  {
    href: "/services/mobile-development",
    icon: Smartphone,
    title: "Mobile Apps",
    desc: "Aplikasi iOS & Android",
  },
  {
    href: "/services/telegram-bot",
    icon: Bot,
    title: "Bot Telegram",
    desc: "Automasi bisnis 24/7",
  },
  {
    href: "/services/undangan-digital",
    icon: Mail,
    title: "Undangan Digital",
    desc: "Undangan online interaktif",
  },
];

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetMarket />
      <FeaturedProjects />

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {servicePreview.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-[#0f766e] transition-all hover:shadow-lg"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#172033] text-[#ea7b3c] group-hover:scale-110 transition-transform">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#0f766e]">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {service.desc}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-block px-6 py-3 min-h-[48px] bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Buka Katalog Layanan
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="bg-background px-4 py-24 sm:px-6" id="artikel">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-primary">Insight untuk langkah berikutnya</p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Artikel yang membantu Anda membuat keputusan lebih baik.</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Tips praktis, panduan teknis, dan sudut pandang produk untuk membangun digital product yang benar-benar dipakai.</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-primary transition-transform hover:translate-x-1">Baca semua artikel <ArrowUpRight className="size-4" /></Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {getFeaturedArticles().slice(0, 2).map((article, i) => (
              <article key={article.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className={`relative flex h-52 items-end overflow-hidden p-6 ${i === 0 ? "bg-gradient-to-br from-primary/90 via-primary to-accent" : "bg-[#172033]"}`}>
                  {i === 0 && (
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, currentColor 25%, currentColor 26%, transparent 26%, transparent 55%, currentColor 55%, currentColor 56%, transparent 56%)", backgroundSize: "28px 28px" }} />
                  )}
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
                    <Link href={`/blog/${article.slug}`} className="font-semibold text-primary">Baca selengkapnya <ArrowUpRight className="ml-1 inline size-4" /></Link>
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
