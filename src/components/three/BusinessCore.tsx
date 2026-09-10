"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// "The Digital Lens & Code Core": barel lensa faset + bracket kode emissive.
// Alasan: representasi dua lini bisnis (multimedia + IT) tanpa geometri abstrak generik.
export default function BusinessCore() {
  const root = useRef<THREE.Group>(null);
  const barrel = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Parallax kursor via window agar canvas tetap pointer-events: none. Alasan: background tidak mencuri klik/keyboard (R-32).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches === false) return;
    const onMove = (e: PointerEvent) => {
      if (document.hidden) return;
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // TWEAK gerak: fokus 0.15 rad/s, layang 0.14, putar inti 0.15 rad/s, lambda tilt 1.5 (berat).
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (barrel.current) barrel.current.rotation.z += d * 0.15;
    if (core.current) {
      core.current.position.y = Math.sin(t * 0.7) * 0.14;
      core.current.rotation.y = t * 0.15;
    }
    // Damping THREE bawaan, tanpa dependensi maath. Alasan: satu pipeline easing untuk seluruh scene.
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        pointer.current.x * 0.3,
        1.5,
        d,
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        pointer.current.y * -0.22,
        1.5,
        d,
      );
    }
  });

  return (
    <group ref={root}>
      {/* OUTER SHELL: barel lensa 12-segmen, faset tajam, menghadap kamera. */}
      <group ref={barrel}>
        {/* Dinding barel kaca, dua sisi agar dinding dalam terlihat. */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.75, 12, 1, true]} />
          {/* TWEAK kaca: roughness 0.05-0.12, thickness 1-1.5, ior kaca optik 1.5-1.52. */}
          <meshPhysicalMaterial
            color="#f4f7fa"
            roughness={0.08}
            metalness={0}
            transmission={1}
            thickness={1.2}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.06}
            flatShading
            side={THREE.DoubleSide}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Barel dalam gelap: memberi kedalaman di balik kaca. */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.22, 1.22, 0.65, 12, 1, true]} />
          <meshStandardMaterial
            color="#0b1220"
            roughness={0.6}
            metalness={0.3}
            flatShading
            side={THREE.DoubleSide}
            envMapIntensity={0.7}
          />
        </mesh>
        {/* Ring aperture: lubang tengah untuk inti kode. */}
        <mesh position={[0, 0, -0.15]}>
          <ringGeometry args={[0.5, 1.22, 12]} />
          <meshStandardMaterial
            color="#0b1220"
            roughness={0.55}
            metalness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Elemen kaca depan: lensa jernih di depan inti. */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.28]}>
          <cylinderGeometry args={[1.18, 1.18, 0.1, 48]} />
          <meshPhysicalMaterial
            color="#eef2f6"
            roughness={0.04}
            transmission={1}
            thickness={0.8}
            ior={1.52}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.3}
          />
        </mesh>
        {/* Trim depan-belakang: penampang kotak, kesan teknis presisi. */}
        {[0.375, -0.375].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[1.4, 0.06, 4, 12]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.35}
              metalness={0.65}
              flatShading
              envMapIntensity={0.9}
            />
          </mesh>
        ))}
        {/* 12 tick fokus di rim depan, 1 amber sebagai marka indeks. LDR: tidak ikut bloom. */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const isIndex = i === 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0.44]}
              rotation={[0, 0, a - Math.PI / 2]}
            >
              <boxGeometry args={[0.045, 0.14, 0.03]} />
              <meshBasicMaterial
                color={isIndex ? "#ea7b3c" : "#0f766e"}
                transparent
                opacity={0.75}
              />
            </mesh>
          );
        })}
      </group>

      {/* INNER CORE: bracket < > dari balok presisi, emissive amber khas Daydev. */}
      <group ref={core} position={[0, 0, 0.05]}>
        {[
          // Kurung buka: apex kiri.
          { p: [-0.195, 0.143, 0] as const, r: 35 },
          { p: [-0.195, -0.143, 0] as const, r: -35 },
          // Kurung tutup: apex kanan.
          { p: [0.195, 0.143, 0] as const, r: 145 },
          { p: [0.195, -0.143, 0] as const, r: -145 },
        ].map((bar, i) => (
          <mesh
            key={i}
            position={[bar.p[0], bar.p[1], bar.p[2]]}
            rotation={[0, 0, THREE.MathUtils.degToRad(bar.r)]}
          >
            {/* Balok tebal agar terbaca saat inti edge-on. TWEAK pendar: emissiveIntensity 2-3.5. */}
            <boxGeometry args={[0.5, 0.14, 0.18]} />
            {/* Emissive HDR: satu-satunya aksen pendar di komposisi ini. */}
            <meshStandardMaterial
              color="#ea7b3c"
              emissive="#ea7b3c"
              emissiveIntensity={3}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
