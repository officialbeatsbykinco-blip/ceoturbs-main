import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PromptButton } from "@/components/PromptButton";
import { HomeHeroSlide } from "@/components/slides/HomeHeroSlide";
import { BuyBookSlide } from "@/components/slides/BuyBookSlide";
import { ProofSlide } from "@/components/slides/ProofSlide";
import { ServicesSlide } from "@/components/slides/ServicesSlide";
import { FinalCTASlide } from "@/components/slides/FinalCTASlide";

const Index = () => {
  return (
    <div className="h-[100dvh] overflow-y-auto snap-y snap-mandatory bg-background">
      <TopBar />
      <HomeHeroSlide />
      <BuyBookSlide />
      <ProofSlide />
      <ServicesSlide />
      <FinalCTASlide />
      <PromptButton />
      <BottomNav />
    </div>
  );
};

export default Index;
