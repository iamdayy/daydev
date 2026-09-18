export type CameraTarget = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

// Satu kamera per segmen rute. Alasan: transisi routing terasa beda tanpa loop abadi.
export function getCameraTarget(pathname: string): CameraTarget {
  if (pathname.startsWith("/services")) {
    return { position: [1.4, 0.7, 4.6], lookAt: [0.3, 0, 0] };
  }
  if (pathname.startsWith("/portfolio")) {
    return { position: [-1.4, 0.4, 4.8], lookAt: [-0.3, 0, 0] };
  }
  if (pathname.startsWith("/pricing")) {
    return { position: [0, 1.0, 4.4], lookAt: [0, 0.1, 0] };
  }
  if (pathname.startsWith("/blog")) {
    return { position: [0, 0.2, 5.6], lookAt: [0, 0, 0] };
  }
  return { position: [0, 0.4, 5.2], lookAt: [0, 0, 0] };
}
