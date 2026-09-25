import { collection, config, fields } from "@keystatic/core";

// CMS bladeblog Daydev (gratis, file-based, tanpa layanan eksternal).
// Konten disimpan sebagai file YAML/markdown dalam folder `content/` dan
// dibaca saat build/prerender oleh `src/data/blog.ts`.
//
// Untuk mengaktifkan pengeditan jarak jauh (repo GitHub), tambahkan env
// KEYSTATIC_GITHUB_CLIENT_ID + KEYSTATIC_GITHUB_CLIENT_SECRET dan ubah
// storage ke mode github. Tanpa env, admin tetap berjalan dalam mode lokal.

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Artikel",
      slugField: "slug",
      path: "content/posts/*",
      columns: ["title", "category", "publishedAt", "featured"],
      entryLayout: "content",
      schema: {
        slug: fields.slug({ name: { label: "Slug URL" } }),
        title: fields.text({
          label: "Judul",
          validation: { length: { min: 1 } },
        }),
        description: fields.text({
          label: "Deskripsi (meta & header)",
          multiline: true,
        }),
        excerpt: fields.text({
          label: "Ringkasan (tampilan listing)",
          multiline: true,
        }),
        author: fields.text({
          label: "Penulis",
          defaultValue: "Tim Daydev",
        }),
        category: fields.select({
          label: "Kategori",
          options: [
            { label: "Tutorial", value: "Tutorial" },
            { label: "SEO", value: "SEO" },
            { label: "Technology", value: "Technology" },
            { label: "Produk", value: "Produk" },
            { label: "Bisnis", value: "Bisnis" },
          ],
          defaultValue: "Tutorial",
        }),
        tags: fields.multiselect({
          label: "Tag",
          options: [
            { label: "undangan digital", value: "undangan digital" },
            { label: "tutorial", value: "tutorial" },
            { label: "seo", value: "seo" },
            { label: "umkm", value: "umkm" },
            { label: "digital marketing", value: "digital marketing" },
            { label: "tips", value: "tips" },
            { label: "web development", value: "web development" },
            { label: "technology", value: "technology" },
            { label: "javascript", value: "javascript" },
            { label: "typescript", value: "typescript" },
            { label: "mobile", value: "mobile" },
            { label: "startup", value: "startup" },
            { label: "bisnis", value: "bisnis" },
            { label: "produk", value: "produk" },
          ],
        }),
        featured: fields.checkbox({
          label: "Featured (pilihan editor)",
          defaultValue: false,
        }),
        readingTime: fields.number({
          label: "Estimasi baca (menit)",
          validation: { min: 1 },
          defaultValue: 5,
        }),
        publishedAt: fields.date({
          label: "Tanggal terbit",
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "Tanggal diperbarui (opsional)",
        }),
        content: fields.text({
          label: "Konten (markdown)",
          multiline: true,
          description:
            "Tulis isi artikel dengan format markdown: # judul, ## subjudul, - daftar, serta paragraf biasa. Kosongkan baris di antara paragraf.",
        }),
      },
    }),
  },
});