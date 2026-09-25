"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getCameraTarget } from "./routeCameraMap";

const _lookAt = new THREE.Vector3();
const _dest = new THREE.Vector3();

// Kamera lerps ke target rute lalu berhenti. Alasan: transisi routing tanpa render loop abadi (MOTION 1).
export default function RouteRig() {
  const pathname = usePathname();
  const invalidate = useThree((s) => s.invalidate);
  const target = useMemo(() => getCameraTarget(pathname ?? "/"), [pathname]);
  const settled = useRef(false);

  // Bangunkan satu frame saat rute ganti.
  useEffect(() => {
    settled.current = false;
    invalidate();
  }, [target, invalidate]);

  // Mutasi kamera via state R3F, bukan via hook return. Alasan: lolos aturan immutability tanpa disable.
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const [px, py, pz] = target.position;
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, px, 2.2, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, py, 2.2, d);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, pz, 2.2, d);
    _lookAt.set(...target.lookAt);
    cam.lookAt(_lookAt);

    _dest.set(px, py, pz);
    const done = cam.position.distanceTo(_dest) < 0.005;
    if (!done) {
      settled.current = false;
      invalidate();
    } else if (!settled.current) {
      settled.current = true;
      invalidate();
    }
  });

  return null;
}
