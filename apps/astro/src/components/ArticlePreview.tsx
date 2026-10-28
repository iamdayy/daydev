import type { BlogPost } from "@daydev/shared-types";

export type ArticleSummary = Pick<BlogPost, "slug" | "title" | "excerpt" | "author" | "reading_minutes" | "published_at" | "cover_image_url">;

export default function ArticlePreview({ article }: { article: ArticleSummary }) {
  return (
    <article className="article-preview">
      {article.cover_image_url && (
        <div className="article-preview-cover" data-optional-image>
          <img src={article.cover_image_url} alt="" width="1200" height="800" loading="lazy" decoding="async" />
        </div>
      )}
      <div className="article-preview-body">
        <div className="article-meta">
          <time dateTime={article.published_at}>{new Date(article.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</time>
          <span>{article.author} · {article.reading_minutes} menit membaca</span>
        </div>
        <div className="min-w-0">
          <h3 className="article-preview-title"><a href={`/blog/${article.slug}`} className="hover:text-primary">{article.title}</a></h3>
          <p className="mt-4 max-w-2xl leading-7">{article.excerpt}</p>
          <a href={`/blog/${article.slug}`} className="text-link mt-4" aria-label={`Baca artikel: ${article.title}`}>Baca artikel</a>
        </div>
      </div>
    </article>
  );
}
