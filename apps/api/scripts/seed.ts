/**
 * Seed awal: migrasi konten dari versi Next.js lama (legacy/) ke database.
 *
 * Aturan migrasi (jangan disalin apa adanya dari versi lama yang bermasalah):
 * - site_stats: KOSONG. Angka hanya tampil setelah admin mengisi data real
 *   lewat panel (versi lama tidak konsisten: "50+" vs "500+").
 * - team_members: KOSONG. Tim hanya tampil kalau ada data real.
 * - portfolio: hanya item yang punya bukti visual (screenshot) di-publish.
 *   Mola Batik (tanpa screenshot) ikut tersimpan tapi berstatus draft.
 * - blog/pricing/testimoni: seeding ditunda (data legacy sudah dihapus); tetap
 *   kosong sampai ada sumber data baru. Hanya admin yang bisa diisi saat ini.
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
  portfolioItems,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/hashes";

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
  // await upsertPortfolio();
  // await upsertBlog();
  // await upsertPricing();
  // await upsertTestimonials();
  await upsertAdmin();
  console.log("Seed selesai.");
}

main().catch((error) => {
  console.error("Seed gagal:", error);
  process.exit(1);
});