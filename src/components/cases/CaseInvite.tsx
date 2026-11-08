"use client";

import { ArrowUpRight, Mark } from "@/components/brand/Logo";
import { Glass } from "@/components/fx/Glass";
import { TransitionLink } from "@/components/fx/TransitionLink";

// An empty place among the cases: "Здесь может быть ваш сайт". The whole card leads to the request form.
export function CaseInvite() {
  return (
    <Glass as="article" still className="case-card case-invite">
      <div className="case-preview invite-preview" aria-hidden="true">
        <div className="invite-bar">
          <i />
          <i />
          <i />
          <span>ваш-сайт.ru</span>
        </div>
        <div className="invite-body">
          <Mark className="invite-mark" />
        </div>
      </div>
      <div className="case-text">
        <span className="t-small soft">Следующий проект</span>
        <h3 className="t-h3 case-name">Здесь может быть ваш сайт</h3>
        <p className="case-short">
          Расскажите о задаче: разберём её и бесплатно подготовим концепт первого экрана под ваш бизнес.
        </p>
      </div>
      <div className="case-actions-row">
        <span className="case-more">
          Обсудить проект
          <ArrowUpRight className="case-more-arrow" aria-hidden="true" />
        </span>
      </div>
      <TransitionLink href="/#contact" className="case-hit" aria-label="Здесь может быть ваш сайт: обсудить проект" />
    </Glass>
  );
}
