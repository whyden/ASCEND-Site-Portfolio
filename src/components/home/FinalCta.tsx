"use client";

import { useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { RevealWords } from "@/components/fx/Reveal";
import { finalCta } from "@/data/content";
import { site } from "@/config/site";

// Last screen. After sending, the section goes behind frosted glass with the answer on it.
export function FinalCta() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className={`final tone-dark sheet ${sent ? "is-sent" : ""}`}>
      <div className="wrap final-grid">
        <div className="final-text">
          <RevealWords as="h2" className="t-section" text={finalCta.title} />
          <p className="final-sub">{finalCta.text}</p>
        </div>
        <div className="final-form glass-dark">
          <LeadForm
            source="Форма на главной"
            submitLabel={finalCta.button}
            consent={finalCta.consent}
            onSent={() => setSent(true)}
          />
        </div>
      </div>
      <div className="final-done" aria-live="polite" inert={!sent}>
        {sent ? (
          <div className="wrap">
            <p className="t-section">Заявка у нас.</p>
            <p className="final-sub">
              Разберём вашу ситуацию и напишем в рабочее время. {site.hours}.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
