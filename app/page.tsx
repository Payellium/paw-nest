import AdoptionSteps from "@/components/home/AdoptionSteps";
import CatCategories from "@/components/home/CatCategories";
import Hero from "@/components/home/Hero";
import ImpactStats from "@/components/home/ImpactStats";
import Newsletter from "@/components/home/Newsletter";


export default function Home() {
  return (
    <main>
      <Hero></Hero>
      <CatCategories></CatCategories>
      <AdoptionSteps></AdoptionSteps>
      <ImpactStats></ImpactStats>
      <Newsletter></Newsletter>
    </main>
  );
}
