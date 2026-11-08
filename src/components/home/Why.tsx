import { Reveal, RevealWords } from "@/components/fx/Reveal";
import { why } from "@/data/content";

export function Why() {
  return (
    <section id="why" className="section tone-dark sheet">
      <div className="wrap">
        <RevealWords className="t-screen section-title" text={why.title} />
        <div className="why">
          <div className="why-head t-small soft" aria-hidden="true">
            <span>{why.otherLabel}</span>
            <span>{why.oursLabel}</span>
          </div>
          {why.rows.map((row) => (
            <Reveal as="article" key={row.title} className="why-row">
              <p className="why-other">
                <span className="sr-only">{why.otherLabel}: </span>
                <span className="why-strike">{row.other}</span>
              </p>
              <div className="why-ours">
                <h3 className="t-h3">{row.title}</h3>
                <p>{row.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
