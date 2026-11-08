"use client";

import { useId, useState } from "react";
import { Chevron } from "@/components/brand/Logo";
import { RevealWords } from "@/components/fx/Reveal";
import { Smoke } from "@/components/fx/Smoke";
import { faq } from "@/data/content";

export function Faq() {
  // All questions start closed.
  const [open, setOpen] = useState(-1);
  const baseId = useId();

  return (
    <section id="faq" className="section tone-fog sheet has-light-bg">
      <Smoke palette="light" logo={false} className="smoke-sticky" />
      <div className="wrap faq-grid">
        <RevealWords className="t-screen" text={faq.title} />
        <div className="faq">
          {faq.items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-${index}`;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    <span>{item.q}</span>
                    <Chevron className="faq-arrow" aria-hidden="true" />
                  </button>
                </h3>
                <div id={panelId} className="faq-a" inert={!isOpen}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
