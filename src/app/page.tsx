import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TargetMarket from "@/components/TargetMarket";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetMarket />
      <Pricing />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}

