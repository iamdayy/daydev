# DESIGN.md — Daydev Studio

Arah visual produk. Filter anti-slop (`antislop.md` + skills) berlaku di atas
dokumen ini. Setiap keputusan besar punya satu baris alasan (R-31).

## Dial

`ENERGY 2 / RHYTHM 2 / MOTION 1`

Dibaca sebagai: situs jasa studio Indonesia untuk pembeli non-teknis
(startup, UMKM, mahasiswa), bahasa visual tegas tapi ramah, bukan eksperimental
dan bukan dokumen pemerintahan.

## Konsep Visual

**"Invisible Elegance"** — Teknologi yang halus, pengalaman yang murni. Kompleksitas disembunyikan, tinggal hanya kesan elegan dan fungsionalitas.

Mood & nuansa: premium & mewah, minimalis, futuristik, elegan. White space yang efusif sebagai elemen desain utama. One-page scroll, tiap section satu focal point, asimetri halus untuk visual interest. Dukungan dark mode & light mode.

## Palet (Warna Dasar + Aksen + Semantik + Glassmorphism)

### Warna Dasar / Background
| Nama | Hex | Penggunaan |
|------|-----|------------|
| Cosmic White | `#FFFFFF` | Background utama light mode |
| Deep Space | `#0A0A0A` | Background utama dark mode |
| Soft Mist | `#F8F9FA` | Surface ringan, section divider light |
| Midnight Veil | `#0F0F11` | Surface gelap, elevated dark mode |
| Slate Mist | `#64748B` | Teks sekunder, caption |
| Stone Soft | `#94A3B8` | Placeholder, teks redup |

Alasan: palet netral memberikan kesan premium dan memungkinkan konten serta karya berbicara tanpa bersaing dengan warna latar.

### Warna Aksen (Primary Accent)
| Nama | Hex | Penggunaan |
|------|-----|------------|
| Aurora Cyan | `#22D3EE` | CTA primary, highlight teks penting, ikon aktif, border glass, glow halus |
| Aurora Cyan Soft | `#67E8F9` | Glow / bayangan warna halus di balik elemen utama |
| Aurora Cyan Deep | `#0891B2` | Hover state tombol primary |

Alasan: satu warna aksen menciptakan focal point yang jelas tanpa ramai, selaras dengan mood futuristik dan teknologi.

### Warna Semantik (minimal, hanya saat diperlukan)
| Nama | Hex | Penggunaan |
|------|-----|------------|
| Growth Green | `#10B981` | Success / konfirmasi |
| Alert Amber | `#F59E0B` | Warning |
| Alert Red | `#EF4444` | Error |

### Glassmorphism (Frosted Glass)
| Token | Nilai | Penggunaan |
|-------|-------|------------|
| Frost Light | `rgba(255,255,255,0.65)` | Navigasi, card overlay light mode |
| Frost Dark | `rgba(10,10,10,0.45)` | Navigasi, card overlay dark mode |
| Border Frost (Light) | `rgba(255,255,255,0.12)` | Border elemen kaca light mode |
| Border Frost (Dark) | `rgba(255,255,255,0.08)` | Border elemen kaca dark mode |

Alasan: memberikan kedalaman visual modern tanpa menambah elemen ornamen.

Kontras teks minimal 4,5:1 untuk teks normal dan 3:1 untuk teks besar (WCAG AA). `text-gray-400` dilarang di atas terang (2.54:1, gagal AA); gunakan `slate-500` ke atas.

## Tipografi

### Font Family
| Jenis | Font | Peran |
|-------|------|-------|
| Display / Heading | Space Grotesk | Heading bold, besar, futuristik |
| UI / Body | Inter | Teks utama, legibilitas tinggi |
| Mono / Teknis | JetBrains Mono | Angka spesifikasi, kode, elemen teknis |

Alasan: Space Grotesk geometris dan futuristik sejalan inspirasi Apple Vision Pro. Inter netral dan tidak bersaing visually dengan heading. JetBrains Mono menonjolkan identitas studio pengembangan.

### Skala Ukuran, Weight, dan Spasi

**Heading (Space Grotesk)**
| Elemen | Ukuran (approx) | Weight | Letter Spacing | Line Height |
|--------|-----------------|--------|----------------|-------------|
| H1 Hero | 80–120px (fluid/clamp) | 700–800 | -0.02em | 1.05 |
| H2 Section | 40–56px | 700 | -0.02em | 1.15 |
| H3 Subsection | 24–32px | 600 | -0.01em | 1.25 |

**Body (Inter)**
| Elemen | Ukuran | Weight | Line Height |
|--------|--------|--------|-------------|
| Body Besar (lead) | 18–20px | 400–500 | 1.60 |
| Body Normal | 16px | 400 | 1.60 |
| Body Kecil | 14px | 400 | 1.50 |
| Caption | 12px | 500 | 1.50 (tracking 0.04em, uppercase) |

**Mono (JetBrains Mono)**
| Elemen | Ukuran | Weight |
|--------|--------|--------|
| Tech specs / angka | 14–16px | 500 |

Label eyebrow: uppercase + tracking-wide (bukan 0.2em). Alasan: hierarki antar-section tanpa terlihat seperti template AI.

## Motif Identitas

- Kartu: sudut `rounded-2xl` + hover terangkat 4px. Glassmorphism (backdrop-blur, border halus) untuk navigasi floating dan card overlay.
- Hero: ilustrasi abstrak 3D halus + mockup perangkat dengan efek float. Monitor 3D opsional, rotasi otomatis, klik layar membuka demo.
- Ikon: monolinear outline tipis (1,5–2 px), rounded corners. Lucide / Heroicons yang relevan; tanpa emoji di UI.
- Animasi: fade-in section saat scroll, float ringan (4–6 detik), hover translateY -4px + shadow + border glow halus. Support `prefers-reduced-motion`. Tanpa loop abadi (MOTION 1 tetap).
- Blur: header saat scroll (1 permukaan, keterbacaan).
- Shadow: `shadow-sm` default, `shadow-lg` maksimal, hanya saat hover.
- Glow: diperbolehkan secara halus sebagai border glow tombol primary (Aurora Cyan).
- Panah: hanya untuk link eksternal/demo (`ArrowUpRight`); tombol internal tanpa panah.
- Badge: hanya label real (contoh: "Now Accepting Projects 2026").

## CMS Blog (R-34)

- Blog dikelola lewat Keystatic (file-based, gratis): admin di `/keystatic`, konten disimpan sebagai file di `content/posts/` dan dibaca saat prerender.
- Jika folder belum terisi, halaman blog memakai artikel statis di `src/data/blog-static.ts` sebagai fallback.
- Alasan: konten tanpa layanan/hosting eksternal, alur edit non-teknis untuk klien, dan tidak mengubah struktur data `BlogArticle` yang sudah dipakai.

## Aturan Pakai (Dose Caps)

- Blur: hanya header saat scroll (1 permukaan, fungsi keterbacaan).
- Shadow: `shadow-sm` default, `shadow-lg` maksimal, hanya saat hover.
- Glow: hanya border glow halus untuk tombol primary (Aurora Cyan), tidak berlebihan.
- Animasi: scroll-reveal + hover saja, tanpa loop abadi (MOTION 1).
- Panah: hanya untuk link eksternal/demo (`ArrowUpRight`); tombol internal tanpa panah.
- Badge: hanya label real.
- Ikon: Lucide yang relevan dengan kontennya; tanpa emoji di UI.
- Angka dan klaim hanya yang terverifikasi; selebihnya dihapus, bukan disamarkan.

---

*Konsep desain visual lengkap tersimpan di: `workspace/ui-specialist/KONSEP-DESAIN-HOMEPAGE.md`*