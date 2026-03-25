"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/services" },
  { label: "Harga", href: "/pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Tentang", href: "/about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2c3e50] shadow-lg py-3"
          : "bg-[#2c3e50]/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-bold text-[#2c3e50] text-lg group-hover:scale-110 transition-transform">
            <Image
              src="/logo.png"
              alt="Daydev Logo"
              width={20}
              height={20}
              className="object-contain"
              priority
              sizes="(max-width: 640px) 16px, 20px"
            />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            day<span className="text-[#f39c12]">dev</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`transition-colors font-medium text-sm ${
                pathname === link.href
                  ? "text-[#f39c12]"
                  : "text-gray-300 hover:text-[#f39c12]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f39c12] text-[#2c3e50] px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition-colors"
          >
            Konsultasi Gratis
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#2c3e50] border-t border-white/10 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`block py-3 transition-colors font-medium border-b border-white/5 ${
                pathname === link.href
                  ? "text-[#f39c12]"
                  : "text-gray-300 hover:text-[#f39c12]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/6285175284253"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block bg-[#f39c12] text-[#2c3e50] px-5 py-3 rounded-full font-semibold text-center hover:bg-yellow-400 transition-colors"
          >
            Konsultasi Gratis
          </a>
        </div>
      )}
    </header>
  );
}
