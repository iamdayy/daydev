# DESIGN.md — Daydev Studio

Arah visual produk. Filter anti-slop (`antislop.md` + skills) berlaku di atas
dokumen ini. Setiap keputusan besar punya satu baris alasan (R-31).

## Dial

`ENERGY 2 / RHYTHM 2 / MOTION 1`

Dibaca sebagai: situs jasa studio Indonesia untuk pembeli non-teknis
(startup, UMKM, mahasiswa), bahasa visual tegas tapi ramah, bukan eksperimental
dan bukan dokumen pemerintahan.

## Palet (2 inti + 1 aksen + netral)

- Ink `#172033`: fondasi gelap (hero, header, footer, kartu blog kedua).
  Alasan: satu warna gelap untuk semua permukaan gelap agar terlihat satu produk.
- Teal `#0f766e`: primer untuk teks link, ikon, dan segmen Startup/Bot.
  Alasan: kontras 5.47:1 di atas putih, lolos AA untuk teks kecil.
- Amber `#ea7b3c`: satu-satunya aksen, hanya di momen kunci (CTA primer,
  sorotan harga, status aktif). Teks kecil di atas terang memakai turunannya
  `#b45309` (5.02:1 di atas putih).
  Alasan: aksen tunggal agar titik fokus tidak pecah.
- Netral slate/gray untuk teks dan garis. `text-gray-400` dilarang di atas
  terang (2.54:1, gagal AA); gantinya `slate-500` ke atas.
- Varian kategori memakai rumpun yang sama: amber tua `#c2410c`, teal gelap
  `#0e7490`, slate `#334155`. Alasan: beda segmen tetap satu keluarga.

## Tipografi

- System stack (`ui-sans-serif, system-ui, ...`), bukan font unduhan.
  Alasan: tanpa dependensi jaringan saat build, render konsisten.
- Label eyebrow: uppercase + `tracking-wide` (bukan 0.2em).
  Alasan: hierarki antar-section tanpa terlihat seperti template AI.

## Motif identitas

- Kartu dengan header warna segmen + sudut `rounded-2xl` + hover terangkat
  4px. Alasan: satu gestur kartu yang diulang di semua section.
- Monitor 3D di hero menampilkan tayangan layar proyek asli, rotasi otomatis,
  klik layar membuka demo (dengan kontrol manual untuk keyboard).
  Alasan: bukti kerja nyata sebagai objek interaktif, bukan kostum ilustrasi.
  Menggantikan bingkai browser statis atas permintaan klien.
  Detail "sentuhan halus": rangka bersudut bulat (RoundedBox), pantulan studio
  dari Environment lokal, crossfade ease (smoothstep), entrance sekali saat muat.
  Alasan: objek terasa satu produk premium, bukan tumpukan kotak; tidak ada
  loop dekoratif abadi (MOTION 1 tetap).

## CMS blog (R-34)

- Blog dikelola lewat Keystatic (file-based, gratis): admin di `/keystatic`,
  konten disimpan sebagai file di `content/posts/` dan dibaca saat prerender.
- Jika folder belum terisi, halaman blog memakai artikel statis di
  `src/data/blog-static.ts` sebagai fallback.
- Alasan: konten tanpa layanan/hosting eksternal, alur edit non-teknis untuk
  klien, dan tidak mengubah struktur data `BlogArticle` yang sudah dipakai.

## Aturan pakai (dose caps)

- Blur: hanya header saat scroll (1 permukaan, fungsi keterbacaan).
- Shadow: `shadow-sm` default, `shadow-lg` maksimal, hanya saat hover.
- Glow: tidak dipakai.
- Animasi: scroll-reveal + hover saja, tanpa loop abadi (MOTION 1).
- Panah: hanya untuk link eksternal/demo (`ArrowUpRight`); tombol internal
  tanpa panah.
- Badge: hanya label real (`Rekomendasi`, `Paling Populer`, `Mulai ...`).
- Ikon: Lucide yang relevan dengan kontennya (tanggal, jam baca, kategori
  layanan); tanpa emoji di UI.
- Angka dan klaim hanya yang terverifikasi; selebihnya dihapus, bukan
  disamarkan.