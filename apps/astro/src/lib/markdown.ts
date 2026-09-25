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
];

/** Render markdown konten artikel menjadi HTML yang sudah disanitasi. */
export function renderMarkdown(content: string): string {
  const raw = marked.parse(content, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
  });
}