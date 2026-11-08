import type { CSSProperties, ReactNode } from "react";
import { Glass } from "@/components/fx/Glass";
import { Smoke } from "@/components/fx/Smoke";
import { services } from "@/data/content";
import { DemoBot } from "./DemoBot";
import { DemoCalc } from "./DemoCalc";
import { DemoSpeed } from "./DemoSpeed";
import { ServicesTitle } from "./ServicesTitle";
import { StackCards } from "./StackCards";

// Dark glass cards stacking on top of each other. Text on the left, a live scene on the right.

const scenes: Record<string, ReactNode> = {
  sites: <DemoSpeed />,
  calculators: <DemoCalc />,
  bots: <DemoBot />,
};

export function Services() {
  return (
    <section id="services" className="services tone-fog">
      <Smoke palette="light" logo={false} className="smoke-sticky" />
      <div className="wrap">
        <StackCards
          className="cards"
          title={<ServicesTitle />}
        >
          {services.items.map((item, index) => (
            <Glass
              as="article"
              still
              key={item.id}
              className="gcard glass-card tone-dark"
              style={{ "--i": index } as CSSProperties}
            >
              <div className="gc-text">
                <div className="gc-top">
                  <span className="t-small soft">{item.tag}</span>
                  <h3 className="t-lead">{item.title}</h3>
                  <p className="gc-lead">{item.text}</p>
                </div>
                <ul className="gets">
                  {item.gets.map((get) => (
                    <li key={get}>{get}</li>
                  ))}
                </ul>
              </div>
              <div className="scene">{scenes[item.id]}</div>
            </Glass>
          ))}
        </StackCards>
      </div>
    </section>
  );
}
