import HomeHero from "@/components/homeComponents/HomeHero";
import HomeServices from "@/components/homeComponents/HomeServices";
import Pricing from "@/components/homeComponents/Pricing";
import FAQ from "@/components/homeComponents/FAQ";
import Banner from "@/common/Banner";
import HireConsultants from "@/components/homeComponents/HireConsultants";
import Benefits from "@/components/homeComponents/Benefits";

export default function Home() {
  return (
    <main className="min-h-screen antialiased  bg-grid-white/[0.02]">
      <HomeHero />
      <HomeServices />
      <HireConsultants />
      <Benefits />
      <FAQ />
      <Pricing />
      <Banner />
    </main>
  );
}
