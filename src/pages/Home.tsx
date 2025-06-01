import HeroSection from "@/components/layout/HeroSection";
import AboutSection from "@/components/layout/AboutSection";
import ServicesSection from "@/components/layout/ServicesSection";
import PriceListSection from "@/components/layout/PriceListSection";
import GalleryHeroSection from "@/components/layout/GallerySection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GalleryHeroSection />
      <PriceListSection />
    </div>
  );
}
