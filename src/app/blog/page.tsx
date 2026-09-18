import BlogBrowser from "@/components/BlogBrowser";
import {
  getAllArticles,
  getAllCategories,
  getFeaturedArticles,
} from "@/data/blog";

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
  ]);
  const featuredList = await getFeaturedArticles();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BlogBrowser
        articles={articles}
        categories={categories}
        featured={featuredList[0] ?? articles[0]}
      />
    </main>
  );
}