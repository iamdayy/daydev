import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HERO_PROJECTS } from "../lib/project-images";

const HeroMonitor = lazy(() => import("./HeroMonitor"));
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (notify: () => void) => {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

class MonitorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroComputer() {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);

  useEffect(() => {
    setMounted(true);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (figureRef.current) observer.observe(figureRef.current);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  useEffect(() => {
    if (!mounted || reduced || paused || hovering || focused || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % HERO_PROJECTS.length), 4200);
    return () => window.clearInterval(timer);
  }, [mounted, reduced, paused, hovering, focused, visible, tabVisible]);

  const step = (direction: number) => {
    setPaused(true);
    setIndex((current) => (current + direction + HERO_PROJECTS.length) % HERO_PROJECTS.length);
  };
  const project = HERO_PROJECTS[index];

  return (
    <figure
      ref={figureRef}
      aria-label="Galeri proyek Daydev"
      className="min-w-0 w-full rounded-2xl bg-white/5"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Buka demo ${project.title}`} className="relative block aspect-[16/11] w-full rounded-2xl">
        <img src={project.image} alt={`Tampilan ${project.title}`} width="1440" height="810" fetchPriority="high" className={`absolute inset-0 h-full w-full rounded-2xl object-contain p-4 sm:p-6 ${ready && !failed ? "opacity-0" : "opacity-100"}`} />
        {mounted && !failed && (
          <div className={`absolute inset-0 overflow-hidden rounded-2xl ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
            <MonitorBoundary onFailure={onFailure}>
              <Suspense fallback={null}>
                <HeroMonitor current={index} reduced={reduced} active={visible && tabVisible} onReady={onReady} onFailure={onFailure} />
              </Suspense>
            </MonitorBoundary>
          </div>
        )}
      </a>
      <figcaption className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 px-4 pb-5 sm:px-6 sm:pb-6">
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="group min-h-11 min-w-0 basis-36 flex-1 text-white" aria-live={paused || focused ? "polite" : "off"}>
          <span className="block text-lg font-semibold leading-snug tracking-tight">{project.title}</span>
          <span className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300 underline underline-offset-4 group-hover:text-white">Buka demo <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /></span>
        </a>
        <div className="ml-auto flex shrink-0 items-center gap-1" role="group" aria-label="Kontrol galeri">
          <button type="button" disabled={!mounted} onClick={() => step(-1)} aria-label="Proyek sebelumnya" className="flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-50"><ChevronLeft className="size-5" aria-hidden="true" /></button>
          {!reduced && <button type="button" disabled={!mounted} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Putar tayangan otomatis" : "Jeda tayangan otomatis"} aria-pressed={paused} className="flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-50">{paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}</button>}
          <button type="button" disabled={!mounted} onClick={() => step(1)} aria-label="Proyek berikutnya" className="flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-50"><ChevronRight className="size-5" aria-hidden="true" /></button>
        </div>
      </figcaption>
    </figure>
  );
}
