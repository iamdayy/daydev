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
});