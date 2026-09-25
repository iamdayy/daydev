/** Slug & format helper murni (dipakai di test unit). */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // buang diakritik (é -> e)
    .replace(/[^a-z0-9\s-]/g, "") // buang simbol
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length >= 3 && slug.length <= 160;
}