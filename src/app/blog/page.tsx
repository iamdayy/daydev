"use client";

import {
    getAllArticles,
    getAllCategories,
    getFeaturedArticles
} from "@/data/blog";
import Link from "next/link";
import { useState } from "react";

export default function BlogPage() {
  const allArticles = getAllArticles();
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? allArticles.filter((article) => article.category === selectedCategory)
    : allArticles;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Tips</h1>
          <p className="text-xl text-blue-100">
            Tips, panduan, dan insight seputar web development, mobile app, dan
            digital strategy
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Artikel Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getFeaturedArticles().map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 relative">
                  <span className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-2">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Articles List */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Kategori
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                      selectedCategory === null
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua Artikel
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content - Articles Grid */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {article.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {article.readingTime} min read
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            <Link
                              href={`/blog/${article.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {article.title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{article.author}</span>
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/blog/${article.slug}`}
                              className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                            >
                              Baca Selengkapnya →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      Tidak ada artikel di kategori ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-blue-100 mb-6">
            Jangan lewatkan tips dan panduan terbaru setiap minggunya
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email Anda..."
              className="flex-1 px-4 py-2 rounded text-gray-900 min-w-0"
              required
            />
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 px-6 py-2 rounded font-semibold transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
