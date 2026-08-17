import Link from "next/link";

const projects = [
  { title: "Website bisnis yang siap menghasilkan", type: "Web Development", description: "Landing page dan website company profile dengan struktur yang jelas untuk membangun kepercayaan dan mendatangkan inquiry." },
  { title: "Produk digital untuk kebutuhan spesifik", type: "Custom Application", description: "Aplikasi yang dirancang mengikuti alur kerja bisnis, bukan sekadar template yang dipaksakan." },
  { title: "Pengalaman digital yang lebih mudah diakses", type: "UI/UX & Development", description: "Interface responsif dengan performa dan pengalaman pengguna sebagai prioritas." },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Portfolio</p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">Beberapa cara kami membantu ide menjadi produk digital.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Lihat pendekatan Daydev dalam membangun website dan aplikasi yang terlihat profesional, mudah digunakan, dan relevan dengan tujuan bisnis.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{project.type}</p>
              <h2 className="mt-5 text-xl font-bold leading-8">{project.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-secondary p-8 sm:p-10"><h2 className="text-2xl font-bold">Punya project yang ingin dibangun?</h2><p className="mt-3 text-muted-foreground">Mari bahas kebutuhan dan langkah terbaiknya bersama.</p><Link href="/contact" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">Mulai diskusi</Link></div>
      </div>
    </main>
  );
}
