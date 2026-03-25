import { getAllArticles, getArticleBySlug, getArticlesByTag } from "@/data/blog";
import Link from "next/link";
import React, { Usable } from "react";

interface Props {
  params: Usable<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogDetailPage({ params }: Props) {
    const {slug} = React.use(params)
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artikel tidak ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Maaf, artikel yang Anda cari tidak ada atau sudah dihapus.
          </p>
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Kembali ke Blog
          </Link>
        </div>
      </main>
    );
  }

  const relatedArticles = getArticlesByTag(article.tags[0])
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-blue-200">{article.readingTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-blue-100">
            <span>{article.author}</span>
            <span>•</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 px-4 py-3">
        <div className="max-w-4xl mx-auto text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            dangerouslySetInnerHTML={{
              __html: article.content
                .split("\n")
                .map((line: string) => {
                  if (line.startsWith("# ")) {
                    return `<h1 class="text-4xl font-bold mt-8 mb-4 text-gray-900">${line.replace("# ", "")}</h1>`;
                  }
                  if (line.startsWith("## ")) {
                    return `<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900">${line.replace("## ", "")}</h2>`;
                  }
                  if (line.startsWith("### ")) {
                    return `<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-900">${line.replace("### ", "")}</h3>`;
                  }
                  if (line.startsWith("- ")) {
                    return `<li class="ml-6 text-gray-700">${line.replace("- ", "")}</li>`;
                  }
                  if (line.startsWith("|")) {
                    return `<div class="overflow-x-auto mb-4"><table class="w-full border-collapse border border-gray-300"><tr>${line
                      .split("|")
                      .slice(1, -1)
                      .map(
                        (cell: string) =>
                          `<td class="border border-gray-300 px-4 py-2">${cell.trim()}</td>`
                      )
                      .join("")}</tr></table></div>`;
                  }
                  if (line.startsWith("✅") || line.startsWith("❌")) {
                    const icon =
                      line.startsWith("✅") ? "✅ " : "❌ ";
                    return `<p class="flex items-start gap-2 text-gray-700 mb-2"><span class="flex-shrink-0">${icon}</span><span>${line.replace(/^[✅❌]\s/, "")}</span></p>`;
                  }
                  if (line.trim() === "") {
                    return "<br />";
                  }
                  return `<p class="text-gray-700 mb-4">${line}</p>`;
                })
                .join(""),
            }}
          />
        </div>

        {/* Author Info */}
        <div className="border-t border-b border-gray-200 py-8 my-12">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {article.author.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {article.author}
              </h3>
              <p className="text-gray-600">
                Tim developer expert Daydev Studio
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 rounded-lg p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Butuh Solusi Web Development?
          </h3>
          <p className="text-gray-600 mb-6">
            Tim Daydev Studio siap membantu mewujudkan project Anda dengan
            teknologi terkini.
          </p>
          <Link
            href="https://wa.me/6281234567890?text=Saya%20tertarik%20dengan%20layanan%20web%20development"
            target="_blank"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded transition-colors"
          >
            Chat via WhatsApp
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Artikel Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle) => (
                <article
                  key={relArticle.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 rounded-lg mb-4"></div>
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      href={`/blog/${relArticle.slug}`}
                      className="hover:text-blue-600"
                    >
                      {relArticle.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {relArticle.excerpt}
                  </p>
                  <div className="text-sm text-gray-500">
                    {new Date(relArticle.publishedAt).toLocaleDateString(
                      "id-ID",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          ← Kembali ke Blog
        </Link>
      </div>
    </main>
  );
}
