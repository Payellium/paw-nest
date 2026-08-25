import PawNestAISection from "@/components/chatbot/PawNestAISection";
import AdoptionSteps from "@/components/home/AdoptionSteps";
import BestSellers from "@/components/home/BestSellers";
import CatCategories from "@/components/home/CatCategories";
import FeaturedCats from "@/components/home/FeaturedCats";
import Hero from "@/components/home/Hero";
import ImpactStats from "@/components/home/ImpactStats";
import Newsletter from "@/components/home/Newsletter";
import ShopPreview from "@/components/home/ShopPreview";
import SuccessStories from "@/components/home/SuccessStories";
import ScrollParallax from "@/components/ScrollParallax";
import ScrollReveal from "@/components/ScrollReveal";


export default function Home() {
  return (
    <main>
      <ScrollParallax distance={35}>
        <Hero />
      </ScrollParallax>

      <ScrollReveal>
        <PawNestAISection></PawNestAISection>
      </ScrollReveal>

      <ScrollReveal>
        <CatCategories />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedCats></FeaturedCats>
      </ScrollReveal>

      <ScrollReveal>
        <AdoptionSteps />
      </ScrollReveal>

      <ScrollReveal>
        <ShopPreview></ShopPreview>
      </ScrollReveal>

      <ScrollReveal>
        <BestSellers></BestSellers>
      </ScrollReveal>

      <ScrollReveal>
        <SuccessStories></SuccessStories>
      </ScrollReveal>

      <ScrollReveal>
        <ImpactStats />
      </ScrollReveal>

      <ScrollReveal>
        <Newsletter />
      </ScrollReveal>
    </main>
  );
}
