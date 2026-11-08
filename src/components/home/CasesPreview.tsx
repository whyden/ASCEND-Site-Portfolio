import { ArrowUpRight } from "@/components/brand/Logo";
import { CaseGrid } from "@/components/cases/CaseGrid";
import { Reveal, RevealWords } from "@/components/fx/Reveal";
import { TransitionLink } from "@/components/fx/TransitionLink";
import { cases } from "@/data/cases";

// Three cases on the main page. The rest are on the cases page.
export function CasesPreview() {
  return (
    <section id="cases" className="section tone-dark sheet">
      <div className="wrap">
        <div className="cases-head">
          <RevealWords className="t-screen" text="Портфолио и кейсы" />
          <Reveal delay={150}>
            <TransitionLink href="/cases" className="btn">
              <span>Все кейсы</span>
              <ArrowUpRight className="btn-arrow" aria-hidden="true" />
            </TransitionLink>
          </Reveal>
        </div>
        <CaseGrid items={cases.slice(0, 3)} paginate={false} />
      </div>
    </section>
  );
}
