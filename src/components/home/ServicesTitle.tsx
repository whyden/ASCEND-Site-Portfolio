"use client";

import { Fragment, type CSSProperties } from "react";
import { useInView } from "@/components/fx/Reveal";
import { services } from "@/data/content";

// The title of the services.
// On phones and tablets it is one line in the middle, above the cards.
// On wide screens the first word stands letter by letter on the left of the cards, from their top,
// and the last word on the right, down to their bottom. The letters rise one after another.

function SideWord({ word, side, start }: { word: string; side: "left" | "right"; start: number }) {
  return (
    <span className={`side-word is-${side}`} aria-hidden="true">
      {Array.from(word).map((letter, index) => (
        <span key={index} className="w">
          <span style={{ "--i": start + index } as CSSProperties}>{letter}</span>
        </span>
      ))}
    </span>
  );
}

export function ServicesTitle() {
  const ref = useInView<HTMLHeadingElement>();
  const words = services.title.split(" ");
  const [left, right] = services.sides;

  return (
    <h2 ref={ref} className="services-title rv-words">
      <span className="services-line t-section">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="w">
              <span style={{ "--i": index } as CSSProperties}>{word}</span>
            </span>
            {index < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
      <SideWord word={left} side="left" start={0} />
      <SideWord word={right} side="right" start={2} />
    </h2>
  );
}
