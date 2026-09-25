/**
 * Seed awal: migrasi konten dari versi Next.js lama (legacy/) ke database.
 *
 * Aturan migrasi (jangan disalin apa adanya dari versi lama yang bermasalah):
 * - site_stats: KOSONG. Angka hanya tampil setelah admin mengisi data real
 *   lewat panel (versi lama tidak konsisten: "50+" vs "500+").
 * - team_members: KOSONG. Tim hanya tampil kalau ada data real.
 * - portfolio: hanya item yang punya bukti visual (screenshot) di-publish.
 *   Mola Batik (tanpa screenshot) ikut tersimpan tapi berstatus draft.
 * - blog/pricing/testimoni: dimigraskan dari konten legacy yang sudah ada.
 *
 * Idempotent: bisa dijalankan ulang tanpa duplikasi.
 */
import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "../src/db/client";
import {
  adminUsers,
  blogPosts,
  portfolioItems,
  pricingCategories,
  pricingPackages,
  testimonials,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/auth";

// --- data sumber dari legacy -------------------------------------------------
import { blogArticles } from "../../../legacy/src/data/blog-static.ts";
import pricingJson from "../../../legacy/src/data/pricing.json";
import testimonialJson from "../../../legacy/src/data/testimonial.json";

async function upsertPortfolio(): Promise<void> {
  const r2 = getR2Config();
  const legacyDir = resolveLegacyDir();

  const items = [
    {
      title: "Undangan Digital Interaktif",
      category: "undangan-digital" as const,
      description:
        "Undangan digital interaktif dengan RSVP otomatis, galeri foto, dan notifikasi WhatsApp. Selesai dipakai untuk acara acara dan dibagikan ke tamu lewat link.",
      resultHighlight: "RSVP online real-time dengan notifikasi WhatsApp",
      imageFile: "invitation.png",
      demoUrl: "https://invitation-interactive-storyboard.daydev.studio",
      techStack: ["Next.js", "Tailwind CSS", "WhatsApp API"],
      displayOrder: 1,
    },
    {
      title: "Sistem Informasi Sekolah (SIS)",
      category: "web" as const,
      description:
        "Sistem administrasi sekolah berbasis role-based access control (RBAC) yang mencakup manajemen akademik, keuangan SPP, hingga penerimaan siswa baru.",
      resultHighlight:
        "Sentralisasi operasional dan administrasi sekolah",
      imageFile: "sisku.png",
      demoUrl: "https://sisku.daydev.studio",
      techStack: ["Go", "Next.js", "PostgreSQL", "Turborepo"],
      displayOrder: 2,
    },
    {
      title: "EcoWarn - Smart Ecology Hub",
      category: "mobile" as const,
      description:
        "Sistem peringatan dini untuk mitigasi banjir rob dan krisis sanitasi menggunakan deteksi visual TFLite pada aplikasi mobile.",
      resultHighlight: "Pemantauan lingkungan real-time yang akurat",
      imageFile: "ecowarn.jpeg",
      demoUrl: "https://ecowarn.daydev.studio",
      techStack: ["React Native", "Node.js", "MongoDB", "Socket.io"],
      displayOrder: 3,
    },
    {
      title: "HIMATIKA Ecosystem - Portal & Worker",
      category: "web" as const,
      description:
        "Sistem terintegrasi untuk manajemen organisasi dengan fitur agenda event, pendataan anggota, serta stempel tanda tangan dokumen PDF otomatis.",
      resultHighlight: "Efisiensi administrasi dan validasi dokumen digital",
      imageFile: "himatika.png",
      demoUrl: "https://himatika-itsnupekalongan.com",
      techStack: ["Nuxt 3", "Bun", "MongoDB", "Python"],
      displayOrder: 4,
    },
    {
      title: "Mola Batik - Pattern-Aware Nesting Optimization",
      category: "web" as const,
      description:
        "Aplikasi web untuk optimasi penempatan pola batik pada kain dengan algoritma nesting berbasis AI.",
      resultHighlight: "Pengurangan waste kain pada proses produksi",
      imageFile: null, // belum ada screenshot
      demoUrl: "https://mola-batik.daydev.studio",
      techStack: ["Python", "Next.js", "SIFT", "Geometry Processing"],
      displayOrder: 5,
      isPublished: false,
    },
  ];

  for (const item of items) {
    const existing = await db.query.portfolioItems.findFirst({
      where: eq(portfolioItems.demoUrl, item.demoUrl),
    });
    if (existing) {
      console.log(`  - portfolio skip (sudah ada): ${item.title}`);
      continue;
    }

    let cover = "";
    if (item.imageFile) {
      cover = await stageImage(item.imageFile, legacyDir, r2);
    }

    await db.insert(portfolioItems).values({
      title: item.title,
      category: item.category,
      segment: null,
      description: item.description,
      resultHighlight: item.resultHighlight,
      coverImageUrl: cover,
      galleryImageUrls: [],
      demoUrl: item.demoUrl,
      techStack: item.techStack,
      clientName: null,
      displayOrder: item.displayOrder,
      isPublished: item.isPublished ?? true,
    });
    console.log(`  + portfolio: ${item.title}`);
  }
}

async function upsertBlog(): Promise<void> {
  for (const article of blogArticles) {
    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, article.slug),
    });
    if (existing) {
      console.log(`  - blog skip (slug sudah ada): ${article.slug}`);
      continue;
    }
    await db.insert(blogPosts).values({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: null,
      author: article.author,
      readingMinutes: article.readingTime,
      publishedAt: new Date(article.publishedAt),
      isPublished: true,
    });
    console.log(`  + blog: ${article.slug}`);
  }
}

/**
 * Label "Mulai X" diturunkan dari harga paket termurah kategori, bukan salinan
 * dari legacy. Ini memperbaiki inkonsistensi versi lama ("Mulai 5 Jutaan" padahal
 * paket pertama Rp 3.499.000, dan "Mulai 3 Jutaan" padahal paket pertama
 * Rp 1.999.000) supaya label segmen selalu konsisten dengan harga nyata.
 */
function startingLabel(minPrice: number): string {
  if (minPrice >= 1_000_000) {
    const juta = Math.round(minPrice / 1_000_000);
    return `Mulai ${juta} Jutaan`;
  }
  if (minPrice >= 1_000) {
    return `Mulai ${Math.round(minPrice / 1_000)} Ribu-an`;
  }
  return "Mulai Hemat";
}

async function upsertPricing(): Promise<void> {
  const segments = [
    { from: "Undangan Digital", segment: "undangan-digital" },
    { from: "Bot Telegram", segment: "bot-telegram" },
    { from: "Mahasiswa", segment: "mahasiswa" },
    { from: "UMKM", segment: "umkm" },
    { from: "Startup", segment: "startup" },
  ];

  for (const src of pricingJson) {
    const seg = segments.find((s) => s.from === src.category);
    if (!seg) {
      console.warn(`  ! kategori pricing tidak dikenal: ${src.category}`);
      continue;
    }
    const existing = await db.query.pricingCategories.findFirst({
      where: (t, { and }) => and(eq(t.segment, seg.segment)),
    });

    let categoryId = existing?.id ?? "";
    if (!existing) {
      const minPrice = Math.min(
        ...src.plans.map((p: { price: string }) => parsePrice(p.price)),
      );
      const row = await db
        .insert(pricingCategories)
        .values({
          segment: seg.segment,
          label: src.category,
          startingPriceLabel: startingLabel(minPrice),
          displayOrder: src.id,
        })
        .onConflictDoNothing()
        .returning();
      categoryId = row[0]?.id ?? "";
      console.log(`  + pricing kategori: ${src.category}`);
    }
    for (const plan of src.plans) {
      const pkgExisting = await db.query.pricingPackages.findFirst({
        where: (t, { and }) => and(eq(t.categoryId, categoryId), eq(t.name, plan.name)),
      });
      if (pkgExisting) {
        continue;
      }
      await db.insert(pricingPackages).values({
        categoryId,
        name: plan.name,
        price: parsePrice(plan.price),
        features: plan.features,
        isRecommended: Boolean(plan.popular),
        demoUrl: "demoLink" in plan ? plan.demoLink : null,
        displayOrder: plan.id,
      });
      console.log(`  + pricing paket: ${src.category} / ${plan.name}`);
    }
  }
}

function parsePrice(price: string): number {
  // "Rp 99.000" -> 99000
  return Number(price.replace(/[^\d]/g, ""));
}

async function upsertTestimonials(): Promise<void> {
  for (const t of testimonialJson) {
    const existing = await db.query.testimonials.findFirst({
      where: (cols, { and }) => and(eq(cols.clientName, t.name)),
    });
    if (existing) {
      console.log(`  - testimoni skip: ${t.name}`);
      continue;
    }
    const segment =
      t.segment === "Startup"
        ? "startup"
        : t.segment === "UMKM"
          ? "umkm"
          : t.segment === "Mahasiswa"
            ? "mahasiswa"
            : null;
    await db.insert(testimonials).values({
      clientName: t.name,
      clientRole: t.role,
      segment,
      quote: t.text,
      rating: t.stars,
      avatarUrl: null,
      displayOrder: t.id,
      isPublished: true,
    });
    console.log(`  + testimoni: ${t.name}`);
  }
}

async function upsertAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("  - admin skip (set ADMIN_EMAIL + ADMIN_PASSWORD untuk membuat).");
    return;
  }
  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email.toLowerCase()),
  });
  if (existing) {
    console.log("  - admin skip (email sudah ada).");
    return;
  }
  await db.insert(adminUsers).values({
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    name: email.split("@")[0],
  });
  console.log(`  + admin: ${email}`);
}

// --- bantuan gambar -----------------------------------------------------------

interface R2Config {
  client: S3Client | null;
  bucket: string;
  publicBase: string;
}

function getR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
  const bucket = process.env.R2_BUCKET_NAME ?? "";
  const publicBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  if (accountId && accessKeyId && secretAccessKey && bucket && publicBase) {
    return {
      client: new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      }),
      bucket,
      publicBase,
    };
  }
  return { client: null, bucket, publicBase };
}

function resolveLegacyDir(): string {
  const candidates = [
    join(process.cwd(), "..", "..", "legacy", "public", "image", "portfolio"),
    join(process.cwd(), "legacy", "public", "image", "portfolio"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  throw new Error("Folder gambar legacy tidak ditemukan.");
}

const ASTRO_PUBLIC_PORTFOLIO = join(
  process.cwd(),
  "..",
  "astro",
  "public",
  "image",
  "portfolio",
);

/**
 * Jika R2 dikonfigurasi -> upload ke R2 dan return URL publik.
 * Jika tidak -> salin ke public Astro dan return path relatif (masa transisi,
 * admin bisa upload ulang lewat panel untuk memindah penuh ke R2).
 */
async function stageImage(
  filename: string,
  legacyDir: string,
  r2: R2Config,
): Promise<string> {
  const filePath = join(legacyDir, filename);
  if (!existsSync(filePath)) {
    throw new Error(`Gambar ${filename} tidak ada di legacy.`);
  }
  const data = readFileSync(filePath);

  if (r2.client) {
    const key = `portfolio/${filename}`;
    const contentType = filename.endsWith(".jpeg") || filename.endsWith(".jpg")
      ? "image/jpeg"
      : "image/png";
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );
    console.log(`  ~ upload R2: ${key}`);
    return `${r2.publicBase}/${key}`;
  }

  // mode transisi: salin ke public Astro
  const destDir = ASTRO_PUBLIC_PORTFOLIO;
  mkdirSync(destDir, { recursive: true });
  copyFileSync(filePath, join(destDir, filename));
  console.log(`  ~ salin ke public Astro: ${filename}`);
  return `/image/portfolio/${filename}`;
}

// --- main ----------------------------------------------------------------------

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Set DATABASE_URL (Neon) sebelum menjalankan seed.");
    process.exit(1);
  }
  console.log("Seeding database...");
  await upsertPortfolio();
  await upsertBlog();
  await upsertPricing();
  await upsertTestimonials();
  await upsertAdmin();
  console.log("Seed selesai.");
}

main().catch((error) => {
  console.error("Seed gagal:", error);
  process.exit(1);
});