"use client";

import { ArrowUpRight } from "@/components/brand/Logo";
import { Glass } from "@/components/fx/Glass";
import type { CaseStudy } from "@/data/cases";
import { CaseCover } from "./CaseCover";

// A case as a glass card: a cover in the style of the client's site, the name and a short description.
// A click anywhere on the card opens the details (see CaseDialog);
// "Перейти на сайт" opens the site itself in a new tab.
export function CaseCard({ item, onOpen }: { item: CaseStudy; onOpen: (from: DOMRect) => void }) {
  return (
    <Glass as="article" still className="case-card">
      <div className="case-preview">
        <CaseCover item={item} />
      </div>
      <div className="case-text">
        <span className="t-small soft">{item.niche}</span>
        <h3 className="t-h3 case-name">{item.title}</h3>
        <p className="case-short">{item.short}</p>
      </div>
      <div className="case-actions-row">
        <span className="case-more" aria-hidden="true">
          Подробнее
        </span>
        <a className="btn case-site" href={item.url} target="_blank" rel="noreferrer">
          <span>Перейти на сайт</span>
          <ArrowUpRight className="btn-arrow" aria-hidden="true" />
        </a>
      </div>
      <button
        type="button"
        className="case-hit"
        aria-haspopup="dialog"
        aria-label={`Подробнее: ${item.title}`}
        onClick={(event) => {
          const card = event.currentTarget.closest("article");
          if (card) onOpen(card.getBoundingClientRect());
        }}
      />
    </Glass>
  );
}
