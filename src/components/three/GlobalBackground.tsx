"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import BusinessCore from "./BusinessCore";
import Effects from "./Effects";
import FloatingPanels from "./FloatingPanels";
import RouteRig from "./RouteRig";
import { getCanvasOpacity } from "./scrollFade";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedSnapshot() {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    () => false,
  );
}

// Canvas global persisten, loop selalu untuk post-processing mulus. Alasan upgrade premium: gerak napas + DOF/Bloom
// butuh frame kontinu; pengguna reduced-motion tetap dapat null (aksesibilitas tidak dikorbankan).
// Komponen ini dimuat via dynamic ssr:false dari layout. Alasan: tidak perlu guard mounted, tidak pernah SSR.
export default function GlobalBackground() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Redakan kanvas saat scroll menjauhi hero. Alasan: section konten didesain di atas backdrop bersih;
  // opacity langsung via ref (tanpa re-render React) + transisi CSS agar mulus.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      el.style.opacity = String(
        getCanvasOpacity(window.scrollY, window.innerHeight),
      );
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (reduced) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        transition: "opacity 0.35s ease-out",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 5.2], fov: 38 }}
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* TWEAK cahaya: intensity 1-2, warna hangat kanan-atas sebagai bias oranye identitas. */}
        <ambientLight intensity={0.55} color="#e6f2f0" />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#fff1e2" />
        <directionalLight position={[-4, -1, 3]} intensity={0.3} color="#cfe3de" />
        <Suspense fallback={null}>
          {/* Studio HDRI rakitan lokal, tanpa fetch CDN. TWEAK: intensity 1-4 per strip pantulan. */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="circle"
              intensity={3}
              position={[0, 5, -9]}
              scale={2}
              color="#ffffff"
            />
            <Lightformer
              form="rect"
              intensity={2}
              position={[6, 1, -2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[6, 1.2]}
              color="#ffd9bd"
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              position={[-6, 0, -1]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[5, 1]}
              color="#9fd8d0"
            />
          </Environment>
          <BusinessCore />
          <FloatingPanels />
          {/* Bayangan halus penanda elevasi, bukan bayangan berat (R-12). */}
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.32}
            scale={9}
            blur={2.6}
            far={3}
            color="#172033"
          />
        </Suspense>
        <RouteRig />
        <Effects />
      </Canvas>
    </div>
  );
}
