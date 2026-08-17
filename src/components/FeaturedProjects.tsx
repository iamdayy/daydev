import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const projects = [
  {
    type: "Undangan Digital",
    title: "Planet Production",
    description: "Undangan digital interaktif dengan RSVP otomatis dan notifikasi WhatsApp.",
    result: "500+ tamu terdata",
    tone: "bg-[#e9f7f4] text-[#0f766e]",
    visual: "from-[#0f766e] via-[#16a394] to-[#b9e6dc]",
  },
  {
    type: "Web Development",
    title: "Konveksi Batik Pekalongan",
    description: "E-commerce yang membantu bisnis lokal menjangkau pelanggan lebih luas.",
    result: "Omzet naik 3x",
    tone: "bg-[#fff1e8] text-[#c2410c]",
    visual: "from-[#c2410c] via-[#ea7b3c] to-[#ffd1b5]",
  },
  {
    type: "Mobile Development",
    title: "Event Organizer App",
    description: "Aplikasi manajemen peserta dengan check-in cepat dan laporan real-time.",
    result: "Check-in 10x lebih cepat",
    tone: "bg-[#eef0ff] text-[#4338ca]",
    visual: "from-[#4338ca] via-[#6366f1] to-[#c7d2fe]",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="bg-muted/40 px-4 py-24 sm:px-6" id="proyek">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">Bukti, bukan janji</p>
            <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Proyek yang membuat bisnis bergerak maju.</h2>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 font-semibold text-primary transition-transform hover:translate-x-1">Lihat semua proyek <ArrowUpRight className="size-4" /></Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`relative flex h-56 items-end overflow-hidden bg-gradient-to-br ${project.visual} p-6`}>
                <div className="absolute right-8 top-8 h-32 w-24 rotate-6 rounded-xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105" />
                <div className="absolute right-16 top-14 h-32 w-24 -rotate-6 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm" />
                <span className="relative rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">Case study</span>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${project.tone}`}>{project.type}</span>
                <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                <p className="leading-6 text-muted-foreground">{project.description}</p>
                <div className="mt-2 flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary"><CheckCircle2 className="size-4" /> {project.result}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
