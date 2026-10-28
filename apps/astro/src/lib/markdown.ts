import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

const allowedTags = [
  "p",
  "br",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "a",
  "blockquote",
  "code",
  "pre",
  "hr",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

/** Render markdown konten artikel menjadi HTML yang sudah disanitasi. */
export function renderMarkdown(content: string): string {
  const raw = marked.parse(content, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "loading", "decoding"],
      pre: ["tabindex", "aria-label"],
      table: ["tabindex", "aria-label"],
    },
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      h1: "h2",
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy", decoding: "async" }),
      pre: sanitizeHtml.simpleTransform("pre", { tabindex: "0", "aria-label": "Blok kode" }),
      table: sanitizeHtml.simpleTransform("table", { tabindex: "0", "aria-label": "Tabel artikel" }),
    },
  });
}
