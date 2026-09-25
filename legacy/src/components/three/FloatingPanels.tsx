"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Dua panel isometrik melayang kontra-fase. Alasan: gabungan software/multimedia tanpa ilustrasi generik (R-22).
// Panel sengaja LDR (tanpa emissive): tetap bersih dari bloom, blur lembut oleh DOF karena di luar fokus.
export default function FloatingPanels() {
  const code = useRef<THREE.Group>(null);
  const lens = useRef<THREE.Group>(null);

  // TWEAK layang: amplitudo 0.08-0.12, fase PI agar panel bernapas bergantian dengan inti.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (code.current) code.current.position.y = 0.9 + Math.sin(t * 0.5) * 0.1;
    if (lens.current)
      lens.current.position.y = -0.8 + Math.sin(t * 0.5 + Math.PI) * 0.08;
  });

  return (
    <group rotation={[-0.35, -0.6, 0]}>
      {/* Panel kode: pelat terang dengan 3 baris sebagai hierarki, bukan terminal palsu (R-05). */}
      <group ref={code} position={[2.3, 0.9, -0.6]}>
        <RoundedBox args={[1.5, 1.0, 0.08]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.4}
            transmission={0.6}
            thickness={0.4}
            ior={1.3}
            envMapIntensity={0.9}
          />
        </RoundedBox>
        {[
          { y: 0.24, w: 1.1, c: "#0f766e" },
          { y: 0.02, w: 0.85, c: "#334155" },
          { y: -0.2, w: 0.95, c: "#ea7b3c" },
        ].map((row) => (
          <mesh key={row.y} position={[-0.12 + (1.1 - row.w) / -2, row.y, 0.05]}>
            <boxGeometry args={[row.w, 0.09, 0.02]} />
            <meshBasicMaterial color={row.c} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>

      {/* Lensa multimedia: cincin + kaca. Alasan: gestur lensa spesifik produk, bukan ikon orb generik (R-04). */}
      <group ref={lens} position={[-2.4, -0.8, -0.4]}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 0.18, 48]} />
          <meshStandardMaterial color="#172033" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.2, 48]} />
          <meshPhysicalMaterial
            color="#dbe3ea"
            roughness={0.12}
            transmission={0.9}
            thickness={0.6}
            ior={1.45}
            envMapIntensity={1.1}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.02, 8, 48]} />
          <meshBasicMaterial color="#0f766e" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}
