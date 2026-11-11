import {
  ContactShadows,
  Environment,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const CROSSFADE_S = 0.6;
const DAYDEV_COLORS = {
  charcoal: "#242426",
  black: "#09090a",
  cream: "#fff8f1",
  orange: "#f97316",
  peach: "#fdba74",
  burntOrange: "#c2410c",
} as const;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function ScreenSlides({
  current,
  images,
  animate,
  onReady,
}: {
  current: number;
  images: string[];
  animate: boolean;
  onReady: () => void;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const textures = useLoader(
    THREE.TextureLoader,
    images,
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
      if (fromMat.current) {
        fromMat.current.map = textures[current];
        fromMat.current.opacity = 1;
      }
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
      <mesh position={[0, 0, 0.11]} renderOrder={1}>
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
      <mesh position={[0, 0, 0.115]} renderOrder={2}>
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
  const shellColor = dark ? DAYDEV_COLORS.black : DAYDEV_COLORS.cream;
  const bezelColor = dark ? "#121214" : DAYDEV_COLORS.charcoal;
  const shellMaterial = (
    <meshStandardMaterial
      color={shellColor}
      roughness={0.38}
      metalness={0.12}
      envMapIntensity={0.8}
    />
  );

  return (
    <>
      <RoundedBox
        args={[4.28, 2.48, 0.16]}
        radius={0.12}
        smoothness={6}
        position={[0, 0, -0.04]}
      >
        {shellMaterial}
      </RoundedBox>
      <RoundedBox
        args={[4.02, 2.22, 0.1]}
        radius={0.08}
        smoothness={6}
        position={[0, 0, 0.035]}
      >
        <meshStandardMaterial
          color={bezelColor}
          roughness={0.48}
          metalness={0.2}
        />
      </RoundedBox>
      <mesh position={[0, -1.49, 0]}>
        <boxGeometry args={[0.22, 0.5, 0.2]} />
        {shellMaterial}
      </mesh>
      <RoundedBox
        args={[1.6, 0.14, 0.8]}
        radius={0.07}
        smoothness={4}
        position={[0, -1.81, 0]}
      >
        {shellMaterial}
      </RoundedBox>
      <mesh position={[0, 1.23, 0.09]}>
        <boxGeometry args={[0.42, 0.025, 0.018]} />
        <meshStandardMaterial
          color={DAYDEV_COLORS.orange}
          emissive={DAYDEV_COLORS.orange}
          emissiveIntensity={0.45}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[1.9, -1.08, 0.09]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={DAYDEV_COLORS.orange}
          emissive={DAYDEV_COLORS.orange}
          emissiveIntensity={0.85}
          roughness={0.28}
          metalness={0.12}
        />
      </mesh>
    </>
  );
}

function SoftGlow({
  position,
  scale,
  color,
  opacity,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity: number;
}) {
  return (
    <mesh position={position} scale={scale} renderOrder={-2}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloatingPanel({
  position,
  rotation,
  dark,
  accent = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  dark: boolean;
  accent?: boolean;
}) {
  const panelColor = dark ? "#151517" : DAYDEV_COLORS.cream;
  const lineColor = accent
    ? DAYDEV_COLORS.orange
    : dark
      ? "#8f8984"
      : DAYDEV_COLORS.burntOrange;
  const secondaryLineColor = dark
    ? DAYDEV_COLORS.cream
    : DAYDEV_COLORS.charcoal;

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.45, 0.9, 0.08]} radius={0.1} smoothness={5}>
        <meshStandardMaterial
          color={panelColor}
          roughness={0.5}
          metalness={0.08}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      <RoundedBox
        args={[0.95, 0.08, 0.02]}
        radius={0.03}
        smoothness={3}
        position={[-0.1, 0.2, 0.06]}
      >
        <meshBasicMaterial color={lineColor} />
      </RoundedBox>
      <RoundedBox
        args={[0.62, 0.08, 0.02]}
        radius={0.03}
        smoothness={3}
        position={[-0.27, 0.02, 0.06]}
      >
        <meshBasicMaterial
          color={secondaryLineColor}
          transparent
          opacity={dark ? 0.78 : 0.68}
        />
      </RoundedBox>
      <RoundedBox
        args={[0.28, 0.08, 0.02]}
        radius={0.03}
        smoothness={3}
        position={[0.2, -0.2, 0.06]}
      >
        <meshBasicMaterial color={lineColor} />
      </RoundedBox>
    </group>
  );
}

function SupportingObjects({
  active,
  reduced,
  dark,
}: {
  active: boolean;
  reduced: boolean;
  dark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!active || reduced || !groupRef.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const phase = elapsed.current * ((Math.PI * 2) / 7);
    groupRef.current.position.y = Math.sin(phase) * 0.045;
    groupRef.current.rotation.z = Math.sin(phase * 0.5) * 0.012;
  });

  return (
    <group ref={groupRef}>
      <SoftGlow
        position={[-2.35, 0.75, -0.8]}
        scale={[1.35, 1, 0.12]}
        color={DAYDEV_COLORS.orange}
        opacity={0.1}
      />
      <SoftGlow
        position={[2.35, -0.3, -0.75]}
        scale={[1.15, 0.9, 0.1]}
        color={DAYDEV_COLORS.peach}
        opacity={0.08}
      />
      <group scale={0.98}>
        <FloatingPanel
          position={[3.55, 1.22, -0.3]}
          rotation={[0.04, -0.2, 0.12]}
          dark={dark}
          accent
        />
        <FloatingPanel
          position={[-3.55, -1.08, -0.2]}
          rotation={[-0.05, 0.18, -0.1]}
          dark={dark}
        />
      </group>
      <mesh position={[2.78, -1.08, 0.05]}>
        <sphereGeometry args={[0.16, 24, 16]} />
        <meshStandardMaterial
          color={DAYDEV_COLORS.orange}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[-2.7, 1.38, 0.05]}>
        <sphereGeometry args={[0.11, 24, 16]} />
        <meshStandardMaterial
          color={dark ? DAYDEV_COLORS.cream : DAYDEV_COLORS.charcoal}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[2.35, 1.58, -0.1]} rotation={[0.2, 0.1, 0.3]}>
        <torusGeometry args={[0.18, 0.028, 12, 32]} />
        <meshStandardMaterial
          color={DAYDEV_COLORS.burntOrange}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function MonitorRig({
  current,
  images,
  reduced,
  active,
  dark,
  onReady,
  onFailure,
}: Props) {
  const tiltRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
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
    const phase = elapsed.current * ((Math.PI * 2) / 6);
    tiltRef.current.position.y = 0.315 + Math.sin(phase) * 0.065;
    tiltRef.current.rotation.y = -0.12 + Math.sin(phase * 0.5) * 0.12;
    tiltRef.current.rotation.x = 0.03 + Math.sin(phase) * 0.02;
  });

  return (
    <group
      ref={tiltRef}
      position={[0, 0.315, 0]}
      rotation={[0.03, -0.12, 0]}
      scale={1.16}
    >
      <Chassis dark={dark} />
      <ScreenSlides
        current={current}
        images={images}
        animate={active && !reduced}
        onReady={onReady}
      />
    </group>
  );
}

interface Props {
  current: number;
  images: string[];
  reduced: boolean;
  active: boolean;
  dark: boolean;
  onReady: () => void;
  onFailure: () => void;
}

export default function HeroMonitor({
  current,
  images,
  reduced,
  active,
  dark,
  onReady,
  onFailure,
}: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active && !reduced ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 7.25], fov: 52 }}
      style={{
        pointerEvents: "none",
        overflow: "visible",
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
      fallback={null}
    >
      <ambientLight
        intensity={dark ? 0.72 : 1.05}
        color={DAYDEV_COLORS.cream}
      />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.55}
        color={DAYDEV_COLORS.cream}
      />
      <directionalLight
        position={[-4, -1, 3]}
        intensity={0.32}
        color={DAYDEV_COLORS.orange}
      />
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="circle"
            intensity={3}
            position={[0, 5, -9]}
            scale={2}
            color={DAYDEV_COLORS.cream}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[6, 1, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 1.2, 1]}
            color={DAYDEV_COLORS.cream}
          />
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[-6, 0, -1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[5, 1, 1]}
            color={DAYDEV_COLORS.orange}
          />
        </Environment>
        <SupportingObjects active={active} reduced={reduced} dark={dark} />
        <MonitorRig
          current={current}
          images={images}
          reduced={reduced}
          active={active}
          dark={dark}
          onReady={onReady}
          onFailure={onFailure}
        />
      </Suspense>
      <ContactShadows
        frames={1}
        position={[0, -1.56, 0]}
        opacity={dark ? 0.5 : 0.16}
        scale={8}
        blur={2.6}
        far={3}
        color="#7c2d12"
      />
    </Canvas>
  );
}
