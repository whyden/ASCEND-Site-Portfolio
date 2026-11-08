"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/brand/Logo";
import { Glass } from "@/components/fx/Glass";
import { RevealWords } from "@/components/fx/Reveal";
import { Smoke } from "@/components/fx/Smoke";
import { workflow } from "@/data/content";
import { clamp, prefersReducedMotion, range, smooth, subscribeScroll } from "@/lib/motion";
import { PhoneScreen } from "./PhoneScreen";

// How we work, told by a site that comes together while you scroll:
// first a sketch of blocks, then the real interface with its tools, then the launch.
// A line grows down the rail on the left and lights up each step when it reaches it.

const win = workflow.window;

// When each block of the sketch appears and when it turns into the real thing, as parts of the scroll.
const BLOCK_TIMING = [
  { sketch: [0.02, 0.1], real: [0.36, 0.46] },
  { sketch: [0.12, 0.2], real: [0.42, 0.52] },
  { sketch: [0.2, 0.28], real: [0.48, 0.58] },
];
const TOOL_AT = [0.46, 0.5, 0.54];

const ease = (value: number, from: number, to: number) => smooth(range(value, from, to));

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const find = (selector: string) => section.querySelector<HTMLElement>(selector);
    const findAll = (selector: string) => Array.from(section.querySelectorAll<HTMLElement>(selector));

    const rail = find(".rail");
    const stage = find(".pw");
    const address = find(".pw-address");
    const phone = find(".pw-phone");
    const checks = find(".pw-checks");
    const lead = find(".pw-lead");
    if (!rail || !stage || !address || !phone || !checks || !lead) return;

    const steps = findAll(".step");
    const dots = findAll(".step-dot");
    const blocks = findAll(".pw-block");
    const tools = findAll(".pw-tools span");
    const checkItems = findAll(".pw-checks li");

    const reduced = prefersReducedMotion();
    const pinned = window.matchMedia("(min-width: 1000px) and (min-height: 640px)");

    const update = () => {
      let p = 1;
      if (!reduced && pinned.matches) {
        const box = section.getBoundingClientRect();
        p = clamp(-box.top / Math.max(1, section.offsetHeight - window.innerHeight));
      }

      // The rail runs from the first step to the last, the line grows along it.
      const centers = dots.map((dot, index) => steps[index].offsetTop + dot.offsetTop + dot.offsetHeight / 2);
      const lineEnd =
        p < 0.34
          ? centers[0] + (centers[1] - centers[0]) * ease(p, 0.03, 0.34)
          : centers[1] + (centers[2] - centers[1]) * ease(p, 0.36, 0.68);
      rail.style.top = `${centers[0]}px`;
      rail.style.height = `${centers[2] - centers[0]}px`;
      rail.style.setProperty("--filled", `${(lineEnd - centers[0]).toFixed(1)}px`);

      const current = p < 0.32 ? 0 : p < 0.66 ? 1 : 2;
      steps.forEach((step, index) => step.classList.toggle("is-on", index <= current));
      address.textContent = win.addresses[current];

      blocks.forEach((block, index) => {
        const timing = BLOCK_TIMING[index];
        const sketch = block.querySelector<HTMLElement>(".pw-sketch");
        const real = block.querySelector<HTMLElement>(".pw-real");
        if (!sketch || !real) return;
        const grow = ease(p, timing.sketch[0], timing.sketch[1]);
        const turn = ease(p, timing.real[0], timing.real[1]);
        sketch.style.opacity = (grow * (1 - turn)).toFixed(3);
        sketch.style.transform = `scaleX(${(0.25 + 0.75 * grow).toFixed(3)})`;
        real.style.opacity = turn.toFixed(3);
        real.style.transform = `translateY(${((1 - turn) * 10).toFixed(1)}px)`;
      });

      // Launch: the window steps aside for the phone, the checks and the first request.
      const launch = ease(p, 0.68, 0.82);
      stage.style.transform = pinned.matches
        ? `translateX(${(-launch * 5).toFixed(2)}%) scale(${(1 - launch * 0.14).toFixed(4)})`
        : "";

      tools.forEach((tool, index) => {
        const shown = ease(p, TOOL_AT[index], TOOL_AT[index] + 0.08) * (1 - ease(p, 0.68, 0.74));
        tool.style.opacity = shown.toFixed(3);
        tool.style.transform = `translateX(${((1 - shown) * 34).toFixed(1)}px)`;
      });

      const phoneIn = ease(p, 0.72, 0.86);
      phone.style.opacity = phoneIn.toFixed(3);
      phone.style.transform = `translateY(${((1 - phoneIn) * 50).toFixed(1)}px)`;

      const checksIn = ease(p, 0.78, 0.9);
      checks.style.opacity = checksIn.toFixed(3);
      checks.style.transform = `translateY(${((1 - checksIn) * 26).toFixed(1)}px)`;
      checkItems.forEach((item, index) => {
        item.style.opacity = ease(p, 0.8 + index * 0.03, 0.86 + index * 0.03).toFixed(3);
      });

      const leadIn = ease(p, 0.92, 0.98);
      lead.style.opacity = leadIn.toFixed(3);
      lead.style.transform = `translateY(${((1 - leadIn) * -18).toFixed(1)}px) scale(${(0.96 + 0.04 * leadIn).toFixed(3)})`;
    };

    const stop = subscribeScroll(update);
    document.fonts?.ready.then(update).catch(() => {});
    return stop;
  }, []);

  return (
    <section ref={sectionRef} id="process" className="process tone-fog sheet">
      <Smoke palette="light" logo={false} className="smoke-sticky" />
      <div className="process-stage">
        <div className="wrap process-grid">
          <div className="process-left">
            <RevealWords className="t-section" text={workflow.title} />
            <div className="rail-wrap">
              <span className="rail" aria-hidden="true">
                <i />
              </span>
              <ol>
                {workflow.steps.map((step, index) => (
                  <li key={step.title} className="step">
                    <span className="step-dot">{index + 1}</span>
                    <div>
                      <h3 className="t-h3">{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Glass className="process-right" light={false} depth={0.6} max={4} aria-hidden="true">
            <Glass still className="pw glass-card tone-dark">
              <div className="pw-bar">
                <i />
                <i />
                <i />
                <span className="pw-address">{win.addresses[2]}</span>
              </div>
              <div className="pw-body">
                <div className="pw-block">
                  <span className="pw-sketch">{win.sketch[0]}</span>
                  <div className="pw-real pw-hero">
                    <Mark />
                    <b>{win.site.title}</b>
                    <span>{win.site.text}</span>
                    <em>{win.site.button}</em>
                  </div>
                </div>
                <div className="pw-block">
                  <span className="pw-sketch">{win.sketch[1]}</span>
                  <div className="pw-real pw-calc">
                    <span>
                      <span>{win.site.calcLabel}</span>
                      <strong>{win.site.calcValue}</strong>
                    </span>
                    <span className="tile-slider">
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
                <div className="pw-block">
                  <span className="pw-sketch">{win.sketch[2]}</span>
                  <div className="pw-real pw-tiles">
                    {win.site.tiles.map((tile) => (
                      <span key={tile}>{tile}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Glass>

            <div className="pw-tools">
              {win.tools.map((tool) => (
                <span key={tool} className="glass-card">
                  {tool}
                </span>
              ))}
            </div>
            <div className="pw-phone glass-card">
              <PhoneScreen />
            </div>
            <ul className="pw-checks glass-card">
              {win.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <div className="pw-lead glass-card">
              <small>{win.lead.meta}</small>
              <b>{win.lead.title}</b>
            </div>
          </Glass>
        </div>
      </div>
    </section>
  );
}
