import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const HeroMonitor = lazy(() => import("./HeroMonitor"));
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (notify: () => void) => {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const subscribeTheme = (notify: () => void) => {
  window.addEventListener("themechange", notify);
  return () => window.removeEventListener("themechange", notify);
};

class MonitorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface HeroProject {
  title: string;
  demo_url: string | null;
  cover_image_url: string;
}

export default function HeroComputer({ projects }: { projects: HeroProject[] }) {
  if (projects.length === 0) return null;
  const heroProjects = projects.filter((project) => project.demo_url);
  if (heroProjects.length === 0) return null;
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.dataset.theme === "dark", () => false);
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

  const animate = mounted && !reduced && !paused && !hovering && !focused && visible && tabVisible;

  useEffect(() => {
    if (!animate) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % heroProjects.length), 6000);
    return () => window.clearInterval(timer);
  }, [animate, heroProjects.length]);

  const step = (direction: number) => {
    setPaused(true);
    setIndex((current) => (current + direction + heroProjects.length) % heroProjects.length);
  };
  const project = heroProjects[index % heroProjects.length];

  return (
    <figure
      ref={figureRef}
      aria-label="Galeri proyek Daydev"
      className="hero-gallery"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    >
      <a href={project.demo_url!} target="_blank" rel="noopener noreferrer" aria-label={`Buka demo ${project.title}`} className="hero-screen">
        <div className={`hero-fallback ${ready && !failed ? "opacity-0" : "opacity-100"}`}>
          <img src={project.cover_image_url} alt={`Tampilan ${project.title}`} width="1440" height="810" fetchPriority="high" />
        </div>
        {mounted && !failed && (
          <div className={`hero-canvas ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
            <MonitorBoundary onFailure={onFailure}>
              <Suspense fallback={null}>
                <HeroMonitor current={index} images={heroProjects.map((item) => item.cover_image_url)} reduced={reduced} active={animate} dark={dark} onReady={onReady} onFailure={onFailure} />
              </Suspense>
            </MonitorBoundary>
          </div>
        )}
      </a>
      <div className="hero-caption glass-surface mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <a href={project.demo_url!} target="_blank" rel="noopener noreferrer" className="group min-h-11 min-w-0 flex-1" aria-label={`Buka demo ${project.title}`} aria-atomic="true">
            <ArrowUpRight className="size-4 shrink-0 text-accent-ink" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-2 hero-gallery-controls" role="group" aria-label="Kontrol galeri">
          <span className="hero-gallery-count" aria-hidden="true">{index + 1} / {heroProjects.length}</span>
          <button type="button" disabled={!mounted} onClick={() => step(-1)} aria-label="Proyek sebelumnya" className="icon-button"><ChevronLeft className="size-5" aria-hidden="true" /></button>
          {!reduced && <button type="button" disabled={!mounted} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Putar animasi hero" : "Jeda animasi hero"} aria-pressed={paused} className="icon-button">{paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}</button>}
          <button type="button" disabled={!mounted} onClick={() => step(1)} aria-label="Proyek berikutnya" className="icon-button"><ChevronRight className="size-5" aria-hidden="true" /></button>
        </div>
      </div>
    </figure>
  );
}
