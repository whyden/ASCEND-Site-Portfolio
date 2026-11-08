import { Intro } from "@/components/fx/Intro";
import { CasesPreview } from "@/components/home/CasesPreview";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroScene } from "@/components/home/HeroScene";
import { Process } from "@/components/home/Process";
import { Services } from "@/components/home/Services";
import { Why } from "@/components/home/Why";

export default function HomePage() {
  return (
    <>
      <Intro />
      <main>
        <HeroScene />
        <Services />
        <Why />
        <Process />
        <CasesPreview />
        <Faq />
        <FinalCta />
      </main>
    </>
  );
}
