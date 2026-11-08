import { Brief } from "@/components/forms/Brief";
import { RevealWords } from "@/components/fx/Reveal";
import { finalCta } from "@/data/content";

// Last screen: a short questionnaire that writes a ready message for Telegram.
export function FinalCta() {
  return (
    <section id="contact" className="final tone-dark sheet">
      <div className="wrap final-grid">
        <div className="final-text">
          <RevealWords as="h2" className="t-section" text={finalCta.title} />
          <p className="final-sub">{finalCta.text}</p>
        </div>
        <div className="final-form glass-dark">
          <Brief />
        </div>
      </div>
    </section>
  );
}
