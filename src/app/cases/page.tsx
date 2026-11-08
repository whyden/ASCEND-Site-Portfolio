import type { Metadata } from "next";
import { CaseGrid } from "@/components/cases/CaseGrid";
import { CasesHero } from "@/components/cases/CasesHero";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Кейсы",
  description: "Проекты студии ASCEND: задачи бизнеса и сайты, которые мы для них сделали.",
};

// The logo and the title on top, the cases right under them.
// Empty places among the cases invite to discuss a project, so there is no separate call to action here.
export default function CasesPage() {
  return (
    <main className="tone-dark">
      <CasesHero />
      <section className="section cases-page">
        <div className="wrap">
          <CaseGrid items={cases} />
        </div>
      </section>
    </main>
  );
}
