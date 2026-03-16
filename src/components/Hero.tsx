"use client";

import { whatsapp } from "@/models/whatsapp";

export default function Hero() {
  const handleConsultation = () => {
    const url = `https://wa.me/${encodeURIComponent(whatsapp.phoneNumber)}?text=${encodeURIComponent(whatsapp.defaultMessage)}`;
    window.open(url, "_blank");
  };

  const handleScrollToServices = () => {
    document.querySelector("#layanan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="beranda"
      className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-20"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#f39c12 1px, transparent 1px), linear-gradient(90deg, #f39c12 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Stars */}
        <div className="star absolute top-20 left-16 w-2 h-2 bg-[#f39c12] rounded-full" />
        <div className="star absolute top-40 right-24 w-3 h-3 bg-yellow-300 rounded-full" />
        <div className="star absolute top-60 left-1/3 w-1.5 h-1.5 bg-white rounded-full" />
        <div className="star absolute bottom-40 right-1/3 w-2 h-2 bg-[#f39c12] rounded-full" />
        {/* Large blur circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#f39c12]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#f39c12]/20 border border-[#f39c12]/30 text-[#f39c12] text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#f39c12] rounded-full animate-pulse" />
              Tersedia untuk proyek baru
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Dari Ide
              <br />
              <span className="text-[#f39c12]">Menjadi Aplikasi</span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Solusi pengembangan aplikasi{" "}
              <span className="text-white font-semibold">Web &amp; Mobile</span>{" "}
              terpercaya untuk{" "}
              <span className="text-[#f39c12] font-semibold">Startup</span>,{" "}
              <span className="text-[#f39c12] font-semibold">UMKM</span>, dan{" "}
              <span className="text-[#f39c12] font-semibold">Mahasiswa</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleConsultation}
                className="pulse-glow bg-[#f39c12] text-[#2c3e50] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konsultasi Gratis
              </button>
              <button
                onClick={handleScrollToServices}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-[#f39c12] hover:text-[#f39c12] transition-all duration-300"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto lg:mx-0">
              {[
                { value: "50+", label: "Proyek Selesai" },
                { value: "3 Hari", label: "Pengiriman Cepat" },
                { value: "100%", label: "Kepuasan Klien" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-[#f39c12] font-bold text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Rocket Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Orbit ring */}
              <div className="absolute inset-0 border-2 border-[#f39c12]/20 rounded-full" />
              <div className="absolute inset-8 border border-white/10 rounded-full" />

              {/* Rocket container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rocket-float relative">
                  {/* Rocket SVG */}
                  <svg
                    viewBox="0 0 200 200"
                    className="w-48 h-48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Rocket body */}
                    <ellipse cx="100" cy="85" rx="28" ry="55" fill="#f39c12" />
                    {/* Rocket nose */}
                    <ellipse cx="100" cy="38" rx="20" ry="25" fill="#e67e22" />
                    {/* Window */}
                    <circle
                      cx="100"
                      cy="80"
                      r="12"
                      fill="#2c3e50"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="80" r="7" fill="#3498db" />
                    <circle
                      cx="97"
                      cy="77"
                      r="2.5"
                      fill="white"
                      opacity="0.6"
                    />
                    {/* Left fin */}
                    <path d="M72 120 L85 100 L85 135 Z" fill="#e67e22" />
                    {/* Right fin */}
                    <path d="M128 120 L115 100 L115 135 Z" fill="#e67e22" />
                    {/* Flame */}
                    <ellipse
                      cx="100"
                      cy="148"
                      rx="14"
                      ry="18"
                      fill="#f39c12"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="100"
                      cy="148"
                      rx="9"
                      ry="13"
                      fill="#f1c40f"
                      opacity="0.8"
                    />
                    <ellipse
                      cx="100"
                      cy="148"
                      rx="5"
                      ry="8"
                      fill="white"
                      opacity="0.7"
                    />
                    {/* Left small flame */}
                    <ellipse
                      cx="88"
                      cy="145"
                      rx="5"
                      ry="8"
                      fill="#e67e22"
                      opacity="0.6"
                    />
                    {/* Right small flame */}
                    <ellipse
                      cx="112"
                      cy="145"
                      rx="5"
                      ry="8"
                      fill="#e67e22"
                      opacity="0.6"
                    />
                  </svg>

                  {/* Exhaust particles */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#f39c12]/60 animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting dot */}
              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "10s" }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f39c12] rounded-full shadow-lg shadow-[#f39c12]/50" />
              </div>

              {/* Labels floating */}
              <div className="absolute -left-4 top-1/4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-medium">
                🚀 Web App
              </div>
              <div className="absolute -right-4 top-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-medium">
                📱 Mobile App
              </div>
              <div className="absolute bottom-8 left-1/4 bg-[#f39c12]/20 backdrop-blur-sm border border-[#f39c12]/30 rounded-xl px-3 py-2 text-xs text-[#f39c12] font-medium">
                ✅ MVP Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-xs">Scroll ke bawah</span>
        <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
