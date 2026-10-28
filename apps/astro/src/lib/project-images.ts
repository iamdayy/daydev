const optimizedImages: Record<string, string> = {
  "/image/portfolio/invitation.png": "/image/portfolio/invitation.webp",
  "/image/portfolio/sisku.png": "/image/portfolio/sisku.webp",
  "/image/portfolio/ecowarn.jpeg": "/image/portfolio/ecowarn.webp",
  "/image/portfolio/himatika.png": "/image/portfolio/himatika.webp",
};

export function projectImage(source: string): string {
  return optimizedImages[source] ?? source;
}

export const HERO_PROJECTS = [
  { title: "Undangan Digital Interaktif", image: "/image/portfolio/invitation.webp", link: "https://invitation-interactive-storyboard.daydev.studio" },
  { title: "Sistem Informasi Sekolah", image: "/image/portfolio/sisku.webp", link: "https://sisku.daydev.studio" },
  { title: "EcoWarn Smart Hub", image: "/image/portfolio/ecowarn.webp", link: "https://ecowarn.daydev.studio" },
  { title: "HIMATIKA Ecosystem", image: "/image/portfolio/himatika.webp", link: "https://himatika-itsnupekalongan.com" },
] as const;
