import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PriceCalculator from "@/components/PriceCalculator";
import Pricing from "@/components/Pricing";
import TargetMarket from "@/components/TargetMarket";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetMarket />
      <Pricing />
      <PriceCalculator />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
