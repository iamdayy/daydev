"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { pricingPlans } from "@/models/pricing";
import { whatsapp } from "@/models/whatsapp";

export default function Pricing() {
  const ref = useScrollAnimation();

  const handleCTA = (category: string, planName: string) => {
    const url = `https://wa.me/${encodeURIComponent(whatsapp.phoneNumber)}?text=${encodeURIComponent(whatsapp.messagePlan(planName, category))}`;
    window.open(url, "_blank");
  };

  return (
    <section id="harga" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="fade-in inline-block bg-[#f39c12]/10 text-[#f39c12] text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-[#f39c12]/20">
            Harga Transparan
          </div>
          <h2 className="fade-in text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c3e50] mb-4">
            Investasi yang
            <span className="text-[#f39c12]"> Sepadan</span>
          </h2>
          <p className="fade-in text-gray-500 text-lg max-w-2xl mx-auto">
            Semua paket sudah termasuk konsultasi gratis sebelum memulai. Tidak
            ada biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Categories */}
        <div className="space-y-16">
          {pricingPlans.map((category) => (
            <div key={category.category} className="fade-in">
              {/* Category header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.lightBg }}
                >
                  {category.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-[#2c3e50]">
                      {category.category}
                    </h3>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: category.lightBg,
                        color: category.themeColor,
                      }}
                    >
                      {category.badge}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              {/* // Plans grid */}
              <div className="flex flex-row gap-6 justify-start overflow-x-auto">
                {category.plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`card-hover relative rounded-2xl border-2 overflow-hidden ${
                      plan.popular
                        ? "border-[#f39c12] shadow-xl"
                        : "border-gray-100 shadow-sm"
                    }`}
                  >
                    {plan.popular && (
                      <div className="bg-[#f39c12] text-[#2c3e50] text-center text-xs font-bold py-1.5 tracking-wider uppercase">
                        ⭐ Rekomendasi
                      </div>
                    )}

                    <div
                      className="p-6"
                      style={{
                        backgroundColor: plan.popular
                          ? category.lightBg
                          : "#fff",
                      }}
                    >
                      <h4 className="font-bold text-[#2c3e50] text-lg mb-1">
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span
                          className="text-3xl font-extrabold"
                          style={{ color: category.themeColor }}
                        >
                          {plan.price}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {plan.period}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-sm text-gray-600"
                          >
                            <span
                              className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                              style={{ backgroundColor: category.themeColor }}
                            >
                              ✓
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleCTA(category.category, plan.name)}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={
                          plan.popular
                            ? {
                                backgroundColor: category.themeColor,
                                color: "white",
                              }
                            : {
                                backgroundColor: "transparent",
                                color: category.themeColor,
                                border: `2px solid ${category.themeColor}`,
                              }
                        }
                      >
                        {plan.cta} →
                      </button>
                      {plan.demo && (
                        <a
                          href={plan.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-3 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {plan.demo}
                      </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom pricing note */}
        <div className="fade-in mt-16 bg-[#2c3e50] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Butuh Solusi yang Lebih Spesifik?
          </h3>
          <p className="text-gray-300 mb-6">
            Kami juga menerima proyek custom dengan kebutuhan unik. Diskusikan
            kebutuhan Anda dan kami akan berikan penawaran terbaik!
          </p>
          <a
            href={`https://wa.me/${whatsapp.phoneNumber}?text=Halo%20Daydev%2C%20saya%20ingin%20diskusi%20proyek%20custom.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#f39c12] text-[#2c3e50] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Hubungi Kami Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
