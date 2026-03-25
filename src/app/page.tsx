import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TargetMarket from "@/components/TargetMarket";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getFeaturedArticles } from "@/data/blog";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetMarket />

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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Artikel Terbaru
              </h2>
              <p className="text-gray-600 mt-2">
                Tips, tutorial, dan panduan untuk web & mobile development
              </p>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Lihat Semua Artikel →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {getFeaturedArticles()
              .slice(0, 2)
              .map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-40 relative">
                    <span className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex gap-2">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <span>{article.readingTime} min</span>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                      >
                        Baca Selengkapnya →
                      </Link>
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
