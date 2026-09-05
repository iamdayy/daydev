import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { services } from "@/data/services";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main>
      <Header />
      <section className="bg-foreground px-4 pb-20 pt-36 text-primary-foreground sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent">Layanan Daydev Studio</p>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">Bangun produk digital yang jelas, cepat, dan siap dipakai.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/70">Kami membantu Anda memilih scope yang tepat, membuat pengalaman yang mudah dipahami, lalu mengirimkan produk yang bisa berkembang.</p>
        </div>
      </section>
      <section className="px-4 py-24 sm:px-6"><div className="mx-auto max-w-6xl"><div className="grid gap-6 md:grid-cols-2">{services.map((service) => <Link key={service.id} href={`/services/${service.slug}`} className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"><div className="mb-10 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">+</div><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{service.targetAudience.slice(0, 2).join(" · ")}</p><h2 className="text-2xl font-bold text-foreground">{service.title}</h2><p className="mt-3 max-w-lg leading-7 text-muted-foreground">{service.description}</p><ul className="mt-6 flex flex-col gap-3">{service.benefits.slice(0, 3).map((benefit) => <li key={benefit} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="size-4 text-primary" />{benefit}</li>)}</ul><span className="mt-8 inline-flex items-center font-semibold text-primary">Lihat detail <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></section>
      <section className="bg-muted px-4 py-24 sm:px-6"><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">Cara kerja</p><h2 className="text-3xl font-bold text-foreground sm:text-5xl">Proses yang transparan dari awal.</h2><div className="mt-12 grid gap-4 text-left md:grid-cols-4">{["Discovery", "Rencana", "Build", "Launch"].map((step, index) => <div key={step} className="rounded-2xl border border-border bg-card p-5"><span className="text-sm font-bold text-accent">0{index + 1}</span><h3 className="mt-10 font-bold text-foreground">{step}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Scope jelas, update rutin, dan keputusan dibuat bersama.</p></div>)}</div></div></section>
      <section className="bg-foreground px-4 py-24 text-center text-primary-foreground sm:px-6"><h2 className="text-3xl font-bold sm:text-5xl">Punya ide yang ingin diuji?</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-primary-foreground/70">Ceritakan konteksnya. Kami bantu memetakan langkah paling masuk akal untuk memulainya.</p><a href="https://wa.me/6285175284253" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-accent px-7 py-3 font-bold text-foreground transition-transform hover:-translate-y-0.5">Mulai konsultasi</a></section>
      <Footer /><WhatsAppButton />
    </main>
  );
}
