import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const sitemapUrl = `https://daydev.studio/sitemap-index.xml`;
  return new Response(
    `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${sitemapUrl}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};