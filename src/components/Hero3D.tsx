"use client";

import { useEffect, useRef } from "react";

// Satu objek low-poly statis untuk hero. Alasan: gestur Sublevel tanpa biaya full scene.
// Render 1 frame + redraw saat pointer halus saja, tanpa loop abadi (MOTION 1).
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: import("three").WebGLRenderer | null = null;
    let raf = 0;
    let disposed = false;
    const onVisibility: Array<() => void> = [];
    const disposables: Array<{ dispose: () => void }> = [];

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed || !canvas.isConnected) return;

        const parent = canvas.parentElement;
        const width = parent?.clientWidth || 600;
        const height = parent?.clientHeight || 400;

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 0.4, 5.2);

        const group = new THREE.Group();
        scene.add(group);

        const geo = new THREE.IcosahedronGeometry(1.35, 1);
        disposables.push(geo);
        const solidMat = new THREE.MeshStandardMaterial({ color: "#172033", roughness: 0.85, metalness: 0.15 });
        const wireMat = new THREE.MeshBasicMaterial({ color: "#0f766e", wireframe: true, transparent: true, opacity: 0.85 });
        disposables.push(solidMat, wireMat);
        const solid = new THREE.Mesh(geo, solidMat);
        const wire = new THREE.Mesh(geo, wireMat);
        const ringGeo = new THREE.TorusGeometry(2.05, 0.015, 8, 72);
        const ringMat = new THREE.MeshBasicMaterial({ color: "#ea7b3c", transparent: true, opacity: 0.7 });
        disposables.push(ringGeo, ringMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.4;
        group.add(solid, wire, ring);
        group.rotation.set(0.35, -0.5, 0);

        const key = new THREE.DirectionalLight("#ffffff", 1.4);
        key.position.set(3, 4, 5);
        const fill = new THREE.AmbientLight("#e6f2f0", 0.7);
        scene.add(key, fill);

        const renderOnce = () => {
          if (disposed) return;
          renderer?.render(scene, camera);
        };
        renderOnce();

        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

        const onMove = (e: PointerEvent) => {
          if (reduce.matches || document.hidden) return;
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          group.rotation.y = -0.5 + x * 0.25;
          group.rotation.x = 0.35 - y * 0.18;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(renderOnce);
        };

        const onResize = () => {
          const w = parent?.clientWidth || width;
          const h = parent?.clientHeight || height;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer?.setSize(w, h, false);
          renderOnce();
        };

        const onHide = () => {
          if (!document.hidden) renderOnce();
        };

        const onContextLost = (ev: Event) => ev.preventDefault();

        if (fine) window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onHide);
        onVisibility.push(() => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onHide);
        });

        canvas.addEventListener("webglcontextlost", onContextLost);
        onVisibility.push(() => canvas.removeEventListener("webglcontextlost", onContextLost));
      } catch {
        // Fallback statis di Hero tetap tampil, kanvas dibiarkan kosong.
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      onVisibility.forEach((fn) => fn());
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          // Abaikan kegagalan dispose saat unmount.
        }
      });
      try {
        renderer?.dispose();
      } catch {
        // Abaikan kegagalan dispose saat unmount.
      }
      renderer = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none h-full w-full"
    />
  );
}
