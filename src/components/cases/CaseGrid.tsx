"use client";

import { useCallback, useRef, useState } from "react";
import type { CaseStudy } from "@/data/cases";
import { scrollToElement } from "@/lib/scroll";
import { CaseCard } from "./CaseCard";
import { CaseDialog } from "./CaseDialog";
import { CaseInvite } from "./CaseInvite";

// Cards of cases, three at a time, with page buttons 1, 2, 3 below when there are more.
// Empty places in the last row become "Здесь может быть ваш сайт".
// A click on a card opens its details right here, on the same page.

const PER_PAGE = 3;

type Opened = { item: CaseStudy; from: DOMRect };

export function CaseGrid({ items, paginate = true }: { items: CaseStudy[]; paginate?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [opened, setOpened] = useState<Opened | null>(null);

  const pages = paginate ? Math.max(1, Math.ceil(items.length / PER_PAGE)) : 1;
  const shown = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const invites = Math.max(0, PER_PAGE - shown.length);

  const goTo = (next: number) => {
    if (next === page) return;
    setPage(next);
    // If the top of the cards has gone above the screen, bring it back into view.
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 90) scrollToElement(root, -110);
  };

  const close = useCallback(() => setOpened(null), []);

  return (
    <div ref={rootRef} className="case-list">
      <div key={page} className="case-grid">
        {shown.map((item) => (
          <CaseCard key={item.slug} item={item} onOpen={(from) => setOpened({ item, from })} />
        ))}
        {Array.from({ length: invites }, (_, index) => (
          <CaseInvite key={`invite-${index}`} />
        ))}
      </div>

      {pages > 1 ? (
        <nav className="case-pages" aria-label="Страницы с кейсами">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              className="case-page"
              aria-current={index === page ? "page" : undefined}
              aria-label={`Страница ${index + 1}`}
              onClick={() => goTo(index)}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      ) : null}

      <CaseDialog item={opened?.item ?? null} from={opened?.from ?? null} onClose={close} />
    </div>
  );
}
