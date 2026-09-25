// Opacity kanvas 3D terhadap posisi scroll. Alasan: panggung 3D milik hero;
// section konten (bg-muted/40 dkk, didesain saat body opak) kembali bersih saat user scroll.
// Kurva smoothstep agar transisi terasa mentega, bukan potongan kasar.
export const FADE_FLOOR = 0.1;

export function getCanvasOpacity(
  scrollY: number,
  viewportHeight: number,
): number {
  if (viewportHeight <= 0) return 1;
  const start = viewportHeight * 0.35;
  const end = viewportHeight * 0.9;
  if (scrollY <= start) return 1;
  if (scrollY >= end) return FADE_FLOOR;
  const t = (scrollY - start) / (end - start);
  const smooth = t * t * (3 - 2 * t);
  return 1 - smooth * (1 - FADE_FLOOR);
}
