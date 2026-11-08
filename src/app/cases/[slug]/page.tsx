import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Chevron } from "@/components/brand/Logo";
import { CasePreview } from "@/components/cases/CasePreview";
import { Reveal, RevealWords } from "@/components/fx/Reveal";
import { TransitionLink } from "@/components/fx/TransitionLink";
import { cases, getCase, getNextCase } from "@/data/cases";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return { title: item.title, description: item.short };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();
  const next = getNextCase(slug);

  return (
    <main className="tone-dark">
      <div className="case-hero" data-case-hero={slug}>
        <div className="case-hero-picture">
          <CasePreview item={item} sizes="100vw" />
        </div>
      </div>

      <article className="section case-body">
        <div className="wrap">
          <TransitionLink href="/cases" className="case-back">
            <Chevron className="chevron chevron-left" aria-hidden="true" />
            Все кейсы
          </TransitionLink>

          <p className="t-small soft case-niche">{item.niche}</p>
          <RevealWords as="h1" className="t-section case-title" text={item.title} />
          <Reveal as="p" className="t-lead case-lead">
            {item.short}
          </Reveal>

          <div className="case-columns">
            <Reveal>
              <h2 className="t-small soft">Задача</h2>
              <p className="case-text">{item.task}</p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="t-small soft">Что сделали</h2>
              <ul className="ticks">
                {item.done.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={240}>
              <h2 className="t-small soft">Срок</h2>
              <p className="case-text">{item.term}</p>
            </Reveal>
          </div>

          <div className="case-actions">
            <a className="btn btn-solid" href={item.url} target="_blank" rel="noreferrer">
              <span>Перейти на сайт</span>
              <ArrowUpRight className="btn-arrow" aria-hidden="true" />
            </a>
            <TransitionLink href="/#contact" className="btn">
              <span>Обсудить похожий проект</span>
            </TransitionLink>
          </div>
        </div>
      </article>

      <TransitionLink href={`/cases/${next.slug}`} className="case-following tone-fog sheet">
        <span className="wrap">
          <span className="t-small">Следующий кейс</span>
          <span className="t-section">{next.title}</span>
        </span>
      </TransitionLink>
    </main>
  );
}
