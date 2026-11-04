import {
  ContactShadows,
  Environment,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { HERO_PROJECTS } from "../lib/project-images";

const CROSSFADE_S = 0.6;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function ScreenSlides({ current, animate, onReady }: { current: number; animate: boolean; onReady: () => void }) {
  const invalidate = useThree((state) => state.invalidate);
  const textures = useLoader(
    THREE.TextureLoader,
    HERO_PROJECTS.map((p) => p.image),
  );
  const shown = useRef(0);
  const incoming = useRef(-1);
  const progress = useRef(1);
  const fromMat = useRef<THREE.MeshBasicMaterial>(null);
  const toMat = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
    onReady();
  }, [textures, onReady]);

  useEffect(() => {
    if (!animate) {
      shown.current = current;
      incoming.current = -1;
      progress.current = 1;
      if (fromMat.current) { fromMat.current.map = textures[current]; fromMat.current.opacity = 1; }
      if (toMat.current) toMat.current.opacity = 0;
      invalidate();
      return;
    }
    if (current === incoming.current) return;
    if (current === shown.current) {
      if (incoming.current >= 0) {
        incoming.current = -1;
        progress.current = 1;
        if (fromMat.current) fromMat.current.opacity = 1;
        if (toMat.current) toMat.current.opacity = 0;
      }
      return;
    }
    incoming.current = current;
    progress.current = 1;
    if (fromMat.current) {
      fromMat.current.map = textures[shown.current];
      fromMat.current.needsUpdate = true;
    }
    if (toMat.current) {
      toMat.current.map = textures[current];
      toMat.current.needsUpdate = true;
    }
    invalidate();
  }, [current, textures, animate, invalidate]);

  useFrame((_, delta) => {
    if (!animate || incoming.current < 0) return;
    const d = Math.min(delta, 0.05);
    if (incoming.current >= 0) {
      progress.current -= d / CROSSFADE_S;
      if (progress.current <= 0) {
        progress.current = 1;
        shown.current = incoming.current;
        incoming.current = -1;
        if (fromMat.current) fromMat.current.map = textures[shown.current];
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
        <meshBasicMaterial
          ref={fromMat}
          toneMapped={false}
          map={textures[0]}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.05]} renderOrder={2}>
        <planeGeometry args={[3.84, 2.04]} />
        <meshBasicMaterial
          ref={toMat}
          toneMapped={false}
          map={textures[0]}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Chassis({ dark }: { dark: boolean }) {
  const material = (
    <meshStandardMaterial
      color={dark ? "#555b63" : "#aab0b5"}
      roughness={0.32}
      metalness={0.55}
      envMapIntensity={1.1}
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
        <meshStandardMaterial color="#151619" roughness={0.55} metalness={0.45} />
      </RoundedBox>
      <mesh position={[0, -1.49, 0]}>
        <boxGeometry args={[0.26, 0.5, 0.24]} />
        {material}
      </mesh>
      <RoundedBox args={[1.6, 0.14, 0.8]} radius={0.07} smoothness={4} position={[0, -1.81, 0]}>
        {material}
      </RoundedBox>
      <mesh position={[0, 1.14, 0.085]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[1.98, -1.14, 0.085]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} />
      </mesh>
    </>
  );
}

function MonitorRig({ current, reduced, active, dark, onReady, onFailure }: Props) {
  const tiltRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);

  useEffect(() => {
    if (reduced && tiltRef.current) {
      tiltRef.current.rotation.set(0.03, -0.12, 0);
      tiltRef.current.position.y = 0.315;
      invalidate();
    }
  }, [reduced, invalidate]);

  useFrame((_, delta) => {
    if (!active || reduced || !tiltRef.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const phase = elapsed.current * (Math.PI * 2 / 6);
    tiltRef.current.position.y = 0.315 + Math.sin(phase) * 0.065;
    tiltRef.current.rotation.y = -0.12 + Math.sin(phase * 0.5) * 0.12;
    tiltRef.current.rotation.x = 0.03 + Math.sin(phase) * 0.02;
  });

  return (
    <group ref={tiltRef} position={[0, 0.315, 0]} rotation={[0.03, -0.12, 0]}>
      <Chassis dark={dark} />
      <ScreenSlides current={current} animate={active && !reduced} onReady={onReady} />
    </group>
  );
}

interface Props {
  current: number;
  reduced: boolean;
  active: boolean;
  dark: boolean;
  onReady: () => void;
  onFailure: () => void;
}

export default function HeroMonitor({ current, reduced, active, dark, onReady, onFailure }: Props) {
  return (
          <Canvas
            dpr={[1, 1.5]}
            frameloop={active && !reduced ? "always" : "demand"}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 5.7], fov: 40 }}
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
            fallback={null}
          >
            <ambientLight intensity={dark ? 0.9 : 1.3} color="#ffffff" />
            <directionalLight position={[3, 4, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-4, -1, 3]} intensity={0.65} color="#67e8f9" />
            <Suspense fallback={null}>
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
                  scale={[6, 1.2, 1]}
                   color="#ffffff"
                />
                <Lightformer
                  form="rect"
                  intensity={1.2}
                  position={[-6, 0, -1]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[5, 1, 1]}
                   color="#67e8f9"
                />
              </Environment>
              <MonitorRig current={current} reduced={reduced} active={active} dark={dark} onReady={onReady} onFailure={onFailure} />
            </Suspense>
            <ContactShadows
              frames={1}
              position={[0, -1.56, 0]}
              opacity={dark ? 0.5 : 0.16}
              scale={8}
              blur={2.6}
              far={3}
              color="#0a0a0a"
            />
          </Canvas>
  );
}
