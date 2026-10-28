import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("converts markdown to an HTML string", () => {
    const html = renderMarkdown("## Judul\n\nteks **tebal** dan *miring*.");
    expect(typeof html).toBe("string");
    expect(html).toContain("<h2>Judul</h2>");
    expect(html).toContain("<strong>tebal</strong>");
    expect(html).toContain("<em>miring</em>");
  });

  it("strips disallowed tags and inline handlers", () => {
    const html = renderMarkdown(
      "Teks <script>alert('xss')</script> dan <b>tebal</b>",
    );
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(");
    expect(html).toContain("<b>tebal</b>");
  });

  it("blocks javascript: URLs in links", () => {
    const html = renderMarkdown("[x](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
  });

  it("passes links to allowed http/https origins", () => {
    const html = renderMarkdown("[Daydev](https://daydev.studio)");
    expect(html).toContain('<a href="https://daydev.studio"');
  });

  it("renders article images while rejecting executable URLs and attributes", () => {
    const html = renderMarkdown('![Diagram uji](/image/diagram.webp "Diagram")\n\n<img src="https://example.com/cover.webp" onerror="alert(1)" style="position:fixed">\n\n<img src="data:image/svg+xml,test"><img src="javascript:alert(1)">');
    expect(html).toContain('src="/image/diagram.webp"');
    expect(html).toContain('alt="Diagram uji"');
    expect(html).toContain('src="https://example.com/cover.webp"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toMatch(/onerror|style=|data:image|javascript:/);
  });

  it("keeps the page title unique and makes wide code and tables keyboard reachable", () => {
    const html = renderMarkdown('# Judul dalam artikel\n\n```js\nconst example = "teks";\n```\n\n| Kolom | Isi |\n| --- | --- |\n| A | B |');
    expect(html).toContain('<h2>Judul dalam artikel</h2>');
    expect(html).not.toContain('<h1');
    expect(html).toContain('<pre tabindex="0" aria-label="Blok kode">');
    expect(html).toContain('<table tabindex="0" aria-label="Tabel artikel">');
    expect(html).toContain('<td>B</td>');
  });
});
