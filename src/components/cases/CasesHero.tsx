import { Mark } from "@/components/brand/Logo";
import { Reveal, RevealWords } from "@/components/fx/Reveal";
import { Smoke } from "@/components/fx/Smoke";

// Top of the cases page: the logo, the title under it, and right after this block the cases themselves.

const SUB = "Какие задачи приносит бизнес и что мы для них делаем. Нажмите на карточку, чтобы увидеть подробности.";

export function CasesHero() {
  return (
    <section className="cases-hero">
      <Smoke logo={false} />
      <div className="wrap cases-hero-body">
        <Reveal className="cases-hero-mark">
          <Mark aria-hidden="true" />
        </Reveal>
        <RevealWords as="h1" className="t-mega" text="Кейсы" />
        <Reveal as="p" className="cases-hero-sub" delay={180}>
          {SUB}
        </Reveal>
      </div>
    </section>
  );
}
