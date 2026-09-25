"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";

// 4 proyek nyata dengan gambar tayangan layar dan URL demo asli (C-5, R-17).
// URL merujuk yang sudah dipakai situs: daftar case studies di /portfolio dan
// label alamat lama di hero (invitation-interactive-storyboard.daydev.studio).
const PROJECTS = [
  {
    title: "Undangan Digital Interaktif",
    image: "/image/portfolio/invitation.png",
    link: "https://invitation-interactive-storyboard.daydev.studio",
  },
  {
    title: "Sistem Informasi Sekolah",
    image: "/image/portfolio/sisku.png",
    link: "https://sisku.daydev.studio",
  },
  {
    title: "EcoWarn Smart Hub",
    image: "/image/portfolio/ecowarn.jpeg",
    link: "https://ecowarn.daydev.studio",
  },
  {
    title: "HIMATIKA Ecosystem",
    image: "/image/portfolio/himatika.png",
    link: "https://himatika-itsnupekalongan.com",
  },
] as const;

const CYCLE_MS = 4200;
const CROSSFADE_S = 0.6;
const CHASSIS_COLOR = "#172033";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// Ease (smoothstep) untuk crossfade: perpindahan dimulai dan berakhir pelan,
// di tengahnya paling cepat. Lebih sinematik daripada fade linear (R-33).
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_QUERY).matches;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, getReducedSnapshot, () => false);
}

// Dua bidang layar crossfade. Satu yang tampil penuh ("shown") dan satu yang
// meluncur masuk ("incoming"); opacity digerakkan per frame agar perpindahan
// proyek terasa sinematik, bukan potongan kaku.
function ScreenSlides({ current }: { current: number }) {
  const textures = useLoader(
    THREE.TextureLoader,
    PROJECTS.map((p) => p.image),
  );
  const shown = useRef(0);
  const incoming = useRef(-1);
  const progress = useRef(1);
  const fromMat = useRef<THREE.MeshStandardMaterial>(null);
  const toMat = useRef<THREE.MeshStandardMaterial>(null);

  // TextureLoader (r152+) sudah meng-set SRGBColorSpace otomatis, tanpa mutasi hasil hook.

  useEffect(() => {
    if (current === shown.current || current === incoming.current) return;
    incoming.current = current;
    progress.current = 1;
    if (fromMat.current) {
      fromMat.current.map = textures[shown.current];
      fromMat.current.emissiveMap = textures[shown.current];
      fromMat.current.needsUpdate = true;
    }
    if (toMat.current) {
      toMat.current.map = textures[current];
      toMat.current.emissiveMap = textures[current];
      toMat.current.needsUpdate = true;
    }
  }, [current, textures]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (incoming.current >= 0) {
      progress.current -= d / CROSSFADE_S;
      if (progress.current <= 0) {
        progress.current = 0;
        shown.current = incoming.current;
        incoming.current = -1;
      }
    }
    const shownAlpha = smoothstep(progress.current);
    if (fromMat.current) fromMat.current.opacity = shownAlpha;
    if (toMat.current) toMat.current.opacity = smoothstep(1 - progress.current);
  });

  return (
    <>
      <mesh position={[0, 0, 0.045]} renderOrder={1}>
        <planeGeometry args={[3.84, 2.04]} />
        <meshStandardMaterial
          ref={fromMat}
          color="#111827"
          emissive="#ffffff"
          emissiveIntensity={1.15}
          map={textures[0]}
          emissiveMap={textures[0]}
          transparent
          opacity={1}
          depthWrite={false}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0, 0.05]} renderOrder={2}>
        <planeGeometry args={[3.84, 2.04]} />
        <meshStandardMaterial
          ref={toMat}
          color="#111827"
          emissive="#ffffff"
          emissiveIntensity={1.15}
          map={textures[0]}
          emissiveMap={textures[0]}
          transparent
          opacity={0}
          depthWrite={false}
          roughness={0.5}
        />
      </mesh>
    </>
  );
}

// Bodi monitor: rangka, housing layar, dudukan, kamera web, dan LED. Material
// satu keluarga (ink) agar semua permukaan gelap terasa satu produk (R-29).
function Chassis() {
  const material = (
    <meshStandardMaterial
      color={CHASSIS_COLOR}
      roughness={0.42}
      metalness={0.4}
      envMapIntensity={0.9}
    />
  );

  return (
    <>
      {(
        [
          { p: [0, 1.14, 0], s: [4.3, 0.22, 0.14] },
          { p: [0, -1.14, 0], s: [4.3, 0.22, 0.14] },
          { p: [-2.04, 0, 0], s: [0.22, 2.5, 0.14] },
          { p: [2.04, 0, 0], s: [0.22, 2.5, 0.14] },
        ] as { p: [number, number, number]; s: [number, number, number] }[]
      ).map((strip, i) => (
        // Sudut tepi dibulatkan (RoundedBox) agar rangka terasa satu benda
        // mulus, bukan kepingan kotak terpisah (R-33).
        <RoundedBox
          key={i}
          args={strip.s}
          radius={0.05}
          smoothness={4}
          position={strip.p}
        >
          {material}
        </RoundedBox>
      ))}
      <RoundedBox args={[4.0, 2.26, 0.1]} radius={0.06} smoothness={4} position={[0, 0, -0.04]}>
        <meshStandardMaterial color="#0b1220" roughness={0.55} metalness={0.45} />
      </RoundedBox>
      <mesh position={[0, -1.49, 0]}>
        <boxGeometry args={[0.26, 0.5, 0.24]} />
        {material}
      </mesh>
      <RoundedBox args={[1.6, 0.14, 0.8]} radius={0.07} smoothness={4} position={[0, -1.81, 0]}>
        {material}
      </RoundedBox>
      <mesh position={[0, 2.35, 0.085]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#0b1220" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[1.98, -1.14, 0.085]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#ea7b3c" emissive="#ea7b3c" emissiveIntensity={1.5} />
      </mesh>
    </>
  );
}

// Rig monitor: parallax kursor (reaksi pengguna, bukan loop dekoratif, R-19);
// dimatikan untuk reduced-motion. Layar di dalam Suspense sendiri agar rangka
// langsung tampil sementara tekstur proyek dimuat.
function MonitorRig({ current, reduced }: { current: number; reduced: boolean }) {
  const tiltRef = useRef<THREE.Group>(null);
  const enterRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (document.hidden) return;
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (tiltRef.current) {
      const targetY = reduced ? 0 : pointer.current.x * 0.2;
      const targetX = reduced ? 0 : pointer.current.y * -0.12;
      tiltRef.current.rotation.y = THREE.MathUtils.damp(
        tiltRef.current.rotation.y,
        targetY,
        2.2,
        d,
      );
      tiltRef.current.rotation.x = THREE.MathUtils.damp(
        tiltRef.current.rotation.x,
        targetX,
        2.2,
        d,
      );
    }
    if (enterRef.current) {
      // Entrance satu kali (bukan loop): monitor meluncur naik ke posisi
      // akhir lalu diam. Dinonaktifkan untuk reduced-motion (R-19, R-33).
      enterRef.current.position.y = THREE.MathUtils.damp(
        enterRef.current.position.y,
        0.315,
        3.4,
        d,
      );
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={enterRef} position={[0, reduced ? 0.315 : -0.5, 0]}>
        <Chassis />
        <Suspense fallback={null}>
          <ScreenSlides current={current} />
        </Suspense>
      </group>
    </group>
  );
}

// Komponen hero: layar yang berputar otomatis menampilkan proyek nyata Daydev.
// Klik layar = buka demo proyek yang tampil; tombol kiri/kanan = pilih manual
// agar tetap bisa dipakai keyboard dan penuh reduced-motion (R-32).
// `mounted` menjaga agar Canvas baru dibuat setelah hidrasi (SSR aman tanpa ssr:false):
// server/hidrasi render fallback loading dengan tinggi sama, jadi tidak ada layout shift,
// dan R3F tidak pernah di-SSR.
export default function HeroComputer() {
  const reduced = useReducedMotion();
  // True hanya setelah hidrasi, tanpa setState di efek (pola React: useSyncExternalStore
  // dengan server snapshot false). Canvas baru dirender saat ini, R3F tidak pernah di-SSR.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (reduced || hovering) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % PROJECTS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, hovering]);

  const openCurrent = () => {
    window.open(PROJECTS[index].link, "_blank", "noopener,noreferrer");
  };

  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + PROJECTS.length) % PROJECTS.length);

  const handleEnter = () => {
    if (window.matchMedia("(pointer: fine)").matches) setHovering(true);
  };

  return (
    <figure className="flex w-full max-w-md flex-col items-center gap-4 lg:items-end">
      <div
        onClick={openCurrent}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        role="group"
        aria-label="Galeri proyek Daydev. Klik layar untuk membuka demo proyek yang sedang ditampilkan."
        className="relative h-[300px] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-[#172033] shadow-xl sm:h-[380px] lg:h-[420px]"
      >
        {mounted ? (
          <Canvas
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 6.6], fov: 40 }}
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
          >
            <ambientLight intensity={0.5} color="#e6f2f0" />
            <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff1e2" />
            <directionalLight position={[-4, -1, 3]} intensity={0.3} color="#cfe3de" />
            <Suspense fallback={null}>
              {/* Studio HDRI rakitan lokal, sama seperti backdrop global agar
                  material ink punya pantulan yang konsisten (R-33). */}
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
              <MonitorRig current={index} reduced={reduced} />
            </Suspense>
            <ContactShadows
              position={[0, -1.56, 0]}
              opacity={0.28}
              scale={8}
              blur={2.6}
              far={3}
              color="#172033"
            />
          </Canvas>
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-3 text-gray-300"
            aria-hidden="true"
          >
            <span className="size-8 rounded-full border-2 border-[#ea7b3c]/30 border-t-[#ea7b3c] animate-spin" />
            <span className="text-sm">Memuat galeri proyek...</span>
          </div>
        )}
      </div>
      <figcaption className="flex w-full items-center gap-1 rounded-2xl bg-[#172033]/95 px-2 py-1 shadow-lg">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Proyek sebelumnya"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white/70 hover:text-white"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center px-1">
          <span className="max-w-full truncate text-[11px] text-gray-300">
            Galeri proyek Daydev, klik layar untuk buka demo
          </span>
          <a
            href={PROJECTS[index].link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-flex max-w-full items-center gap-1 text-sm font-semibold text-[#ea7b3c] hover:underline"
          >
            <span className="truncate">{PROJECTS[index].title}</span>
            <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Proyek berikutnya"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white/70 hover:text-white"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </figcaption>
    </figure>
  );
}