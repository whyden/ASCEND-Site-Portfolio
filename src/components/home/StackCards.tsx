"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, prefersReducedMotion, subscribeScroll } from "@/lib/motion";

// A stack of cards under a title that stays on screen while they stack.
// The card underneath steps back a little as the next slides over it,
// and when the last card leaves, the title leaves with it instead of being covered.
export function StackCards({
  title,
  className,
  children,
}: {
  title: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const titleRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const head = titleRef.current;
    const root = rootRef.current;
    if (!head || !root || prefersReducedMotion()) return;

    // The same condition as the sticky cards in globals.css.
    const stacking = window.matchMedia("(min-width: 1000px) and (min-height: 700px)");
    const cards = Array.from(root.children) as HTMLElement[];
    const last = cards[cards.length - 1];

    return subscribeScroll(() => {
      if (!stacking.matches) {
        cards.forEach((card) => {
          card.style.transform = "";
        });
        head.style.transform = "";
        return;
      }

      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) return;
        const covered = clamp(
          1 - (next.getBoundingClientRect().top - 110) / (window.innerHeight * 0.75),
        );
        card.style.transform = `scale(${(1 - covered * 0.035).toFixed(4)})`;
      });

      // Once the last card moves up past its place, the title moves up by the same amount.
      if (last) {
        const place = parseFloat(getComputedStyle(last).top) || 0;
        const shift = Math.min(0, last.getBoundingClientRect().top - place);
        head.style.transform = shift < 0 ? `translateY(${shift.toFixed(1)}px)` : "";
      }
    });
  }, []);

  return (
    <>
      <div ref={titleRef} className="stack-title">
        {title}
      </div>
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </>
  );
}
