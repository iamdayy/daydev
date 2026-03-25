import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Daydev Studio",
  description:
    "Lihat case studies dan portfolio proyek kami. Dari undangan digital, bot telegram, website, hingga aplikasi mobile yang sukses di market.",
  keywords: [
    "portfolio",
    "case studies",
    "proyek selesai",
    "contoh pekerjaan",
    "hasil kerja",
  ],
  alternates: {
    canonical: "https://daydev.studio/portfolio",
  },
};

const caseStudies = [
  {
    id: 1,
    title: "Undangan Digital Pernikahan - Planet Production",
    category: "Undangan Digital",
    description:
      "Undangan digital interaktif untuk client dengan fitur RSVP online, gallery foto, dan notifikasi WhatsApp otomatis.",
    image: "💌",
    result: "500+ tamu checkin via RSVP",
    technologies: ["React", "Node.js", "WhatsApp API"],
    link: "https://invitation-minimalist-modern.daydev.studio",
  },
  {
    id: 2,
    title: "Bot Telegram Automasi Inventory - Toko Online Batik",
    category: "Bot Telegram",
    description:
      "Bot Telegram untuk automasi inventory management dan customer service yang menghemat waktu operasional hingga 50%.",
    image: "🤖",
    result: "Efisiensi waktu 50%, Response time 24/7",
    technologies: ["Telegram Bot API", "Node.js", "MySQL"],
    link: "#",
  },
  {
    id: 3,
    title: "Toko Online E-Commerce - UMKM Konveksi Pekalongan",
    category: "Web Development",
    description:
      "Platform e-commerce lengkap dengan payment gateway, inventory management, dan customer dashboard yang user-friendly.",
    image: "🛒",
    result: "Omzet naik 3x, Traffic 10K+ per bulan",
    technologies: ["Next.js", "Express.js", "PostgreSQL"],
    link: "#",
  },
  {
    id: 4,
    title: "Aplikasi Manajemen Peserta Event - Event Organizer",
    category: "Mobile Development",
    description:
      "Aplikasi mobile untuk mengelola peserta event, checkin, dan real-time reporting untuk tim organizer.",
    image: "📱",
    result: "Proses checkin 10x lebih cepat",
    technologies: ["React Native", "Firebase", "Express.js"],
    link: "#",
  },
  {
    id: 5,
    title: "MVP Startup SaaS - Managemen Proyek Freelancer",
    category: "Web & Mobile",
    description:
      "MVP dari platform SaaS yang menghubungkan client dengan freelancer, dilengkapi dengan sistem payment dan rating.",
    image: "🚀",
    result: "100+ active users, Series A funding ready",
    technologies: ["Next.js", "React Native", "Stripe API"],
    link: "#",
  },
  {
    id: 6,
    title: "Sistem Skripsi Mahasiswa - Universitas",
    category: "Web Development",
    description:
      "Sistem management skripsi dengan modul nilai, bimbingan online, dan laporan komprehensif untuk dosen dan mahasiswa.",
    image: "🎓",
    result: "Digunakan 500+ mahasiswa, Sidang 100% lancar",
    technologies: ["Laravel", "Vue.js", "MySQL"],
    link: "#",
  },
];

export default function PortfolioPage() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Portfolio Kami
          </h1>
          <p className="text-xl text-slate-600">
            Lihat case studies dan proyek-proyek yang telah kami selesaikan untuk berbagai
            klien dari startup hingga enterprise.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-lg border-2 border-slate-200 overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all duration-300"
              >
                {/* Image/Icon Section */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-6xl">
                  {project.image}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Result */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded">
                    <p className="text-sm font-semibold text-green-800">
                      ✓ {project.result}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">TEKNOLOGI:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 font-semibold hover:text-blue-800 text-sm"
                    >
                      Lihat Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section Info */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Kategori Proyek
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Web Development",
                icon: "🌐",
                count: 45,
              },
              {
                name: "Mobile Development",
                icon: "📱",
                count: 32,
              },
              {
                name: "Bot Telegram",
                icon: "🤖",
                count: 28,
              },
              {
                name: "Undangan Digital",
                icon: "💌",
                count: 120,
              },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-white rounded-lg border-2 border-slate-200"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{cat.count}+</p>
                <p className="text-sm text-slate-600">proyek selesai</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Apa Kata Klien Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-yellow-400">
              <div className="flex gap-1 mb-3">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    {star}
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Daydev berhasil mengubah ide kami menjadi MVP yang solid hanya dalam 2
                minggu! Tim mereka sangat responsif dan memahami kebutuhan startup."
              </p>
              <p className="font-semibold text-slate-900">Erdy Aditya</p>
              <p className="text-sm text-slate-600">Director, Planet Production</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-yellow-400">
              <div className="flex gap-1 mb-3">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    {star}
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Setelah pakai toko online dari Daydev, omzet naik 3x lipat! Sistemnya
                mudah dipakai dan mereka selalu siap bantu."
              </p>
              <p className="font-semibold text-slate-900">Fathimah</p>
              <p className="text-sm text-slate-600">Pemilik Konveksi Batik</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-yellow-400">
              <div className="flex gap-1 mb-3">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    {star}
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Daydev gak cuma bikin sistemnya, tapi juga nemenin saya sampai paham cara
                kerjanya. Sidang lancar dan dapet nilai A!"
              </p>
              <p className="font-semibold text-slate-900">Husni Mubarok</p>
              <p className="text-sm text-slate-600">Mahasiswa Teknik Informatika</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-slate-300">Projects</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">200+</div>
              <p className="text-slate-300">Happy Clients</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5★</div>
              <p className="text-slate-300">Average Rating</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5+</div>
              <p className="text-slate-300">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ingin Lihat Lebih Banyak?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Hubungi kami untuk melihat portfolio lengkap dan diskusikan bagaimana kami bisa
            membantu proyek Anda.
          </p>
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
