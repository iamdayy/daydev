import type { Segment } from "@daydev/shared-types";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Beranda", href: "/" },
      { label: "Tentang Daydev", href: "/about" },
      { label: "Tim Daydev", href: "/team" },
      { label: "Founder", href: "/founder" },
    ],
  },
  {
    label: "EXPLORE",
    items: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Layanan", href: "/services" },
      { label: "Kreasi", href: "/kreasi" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    label: "DEVELOPMENT",
    items: [
      { label: "Dashboard", href: "/dev/dashboard" },
      { label: "GitHub Activity", href: "/dev/github" },
      { label: "Skills", href: "/dev/skills" },
      { label: "Achievements", href: "/dev/achievements" },
    ],
  },
  {
    label: "CONNECT",
    items: [
      { label: "Buku Tamu", href: "/guestbook" },
      { label: "Links", href: "/links" },
      { label: "Contact", href: "/contact" },
      { label: "Konsultasi", href: "/pricing" },
    ],
  },
];

export const allNavLinks = navigationGroups.flatMap((group) => group.items);

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveGroup(pathname: string): string | null {
  for (const group of navigationGroups) {
    if (group.items.some((item) => isActive(pathname, item.href))) {
      return group.label;
    }
  }
  return null;
}

export function getCurrentSection(pathname: string): string | null {
  for (const group of navigationGroups) {
    const activeItem = group.items.find((item) => isActive(pathname, item.href));
    if (activeItem) return activeItem.label;
  }
  return null;
}

export const SEGMENT_NAV_MAP: Record<Segment, string> = {
  startup: "Startup",
  umkm: "UMKM",
  mahasiswa: "Mahasiswa",
  "undangan-digital": "Undangan Digital",
  "bot-telegram": "Bot Telegram",
};

export function getSegmentHref(segment: Segment): string {
  return `/portfolio?segment=${segment}`;
}