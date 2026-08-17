import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import invitationImage from "@/../public/image/portfolio/invitation.png"
import siskuiImage from "@/../public/image/portfolio/sisku.png"
import ecowarnImage from "@/../public/image/portfolio/ecowarn.jpeg"
import himatikaImage from "@/../public/image/portfolio/himatika.png"

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
    image: invitationImage,
    result: "500+ tamu checkin via RSVP",
    technologies: ["React", "Node.js", "WhatsApp API"],
    link: "https://invitation-interactive-storyboard.daydev.studio",
  },
  {
    id: 2,
    title: "Sistem Informasi Sekolah (SIS) - Integrated System",
    category: "Web Development",
    description:
      "Sistem administrasi sekolah berbasis role-based access control (RBAC) yang mencakup manajemen akademik, keuangan SPP, hingga penerimaan siswa baru.",
    image: siskuiImage,
    result: "Sentralisasi operasional dan administrasi sekolah",
    technologies: ["Go", "Next.js", "PostgreSQL", "Turborepo"],
    link: "https://sisku.daydev.studio",
  },
  {
    id: 3,
    title: "EcoWarn - Smart Ecology Hub",
    category: "Mobile & Backend",
    description:
      "Sistem peringatan dini untuk mitigasi banjir rob dan krisis sanitasi menggunakan deteksi visual TFLite pada aplikasi mobile.",
    image: ecowarnImage,
    result: "Pemantauan lingkungan real-time yang akurat",
    technologies: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    link: "https://ecowarn.daydev.studio",
  },
  {
    id: 4,
    title: "HIMATIKA Ecosystem - Portal & Worker",
    category: "Web & Microservices",
    description:
      "Sistem terintegrasi untuk manajemen organisasi yang memiliki fitur agenda event, pendataan anggota, serta stempel tanda tangan dokumen PDF otomatis.",
    image: himatikaImage,
    result: "Efisiensi administrasi dan validasi dokumen digital",
    technologies: ["Nuxt 3", "Bun", "MongoDB", "Python"],
    link: "https://himatika-itsnupekalongan.com",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24 flex-grow w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Portfolio</p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Beberapa cara kami membantu ide menjadi produk digital.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Lihat case studies dan proyek-proyek yang telah kami selesaikan untuk berbagai klien dari startup hingga enterprise.
        </p>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((project) => (
            <article key={project.id} className="group rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg overflow-hidden flex flex-col">
              <div className="relative h-48 bg-secondary flex items-center justify-center text-6xl overflow-hidden shrink-0">
                {typeof project.image === "string" ? (
                  <span>{project.image}</span>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block px-3 py-1 bg-secondary text-primary rounded-full text-xs font-semibold self-start mb-4">
                  {project.category}
                </span>
                <h2 className="text-xl font-bold leading-8">{project.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground flex-grow text-sm">{project.description}</p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {project.link && project.link !== "#" && (
                  <Link href={project.link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                    Lihat Demo →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-16 rounded-3xl bg-secondary p-8 sm:p-10">
          <h2 className="text-2xl font-bold">Punya project yang ingin dibangun?</h2>
          <p className="mt-3 text-muted-foreground">Mari bahas kebutuhan dan langkah terbaiknya bersama.</p>
          <Link href="/contact" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
            Mulai diskusi
          </Link>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
