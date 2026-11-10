"use client";

import { useEffect, useRef } from "react";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { CalcButton } from "@/components/forms/CalcButton";
import { Smoke } from "@/components/fx/Smoke";
import { TransitionLink } from "@/components/fx/TransitionLink";
import { hero } from "@/data/content";
import { clamp, prefersReducedMotion, range, smooth, subscribeScroll } from "@/lib/motion";

// First screen, a long scene in three parts.
// 1. The logo in the middle, ASCEND STUDIO under it and two buttons.
// 2. Scrolling flies us into the long facet of the logo; the page turns to fog.
// 3. The offer shows through the facets while we fly into them, stays a moment once we are inside,
//    and the page moves on.

// The share of the scene spent on the flight into the logo; the rest belongs to the offer.
const DIVE_END = 0.5;

// The two facets of the mark, in its own units: 1000 wide, 595 tall.
const FACETS: [number, number][][] = [
  [
    [0, 595],
    [517.4, 0],
    [637.4, 138],
    [240, 595],
  ],
  [
    [565, 439.75],
    [715, 267.25],
    [1000, 595],
    [700, 595],
  ],
];

// The offer. While we fly in, it is cut out by the facets of the growing logo.
function Statement() {
  return (
    <div className="hero-statement">
      <div className="wrap st-inner">
        <h1 className="st-title">{hero.title}</h1>
        <p className="st-sub">{hero.subtitle}</p>
      </div>
    </div>
  );
}

export function HeroScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const lightMix = useRef(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const body = bodyRef.current;
    const mark = markRef.current;
    const logo = stage?.querySelector<HTMLElement>(".smoke-logo");
    const light = stage?.querySelector<HTMLElement>(".smoke-light");
    const lean = stage?.querySelector<HTMLElement>(".smoke-lean");
    const statement = stage?.querySelector<HTMLElement>(".hero-statement");
    if (!scene || !stage || !body || !mark || !logo || !light || !statement) return;
    mark.style.opacity = "1";
    if (prefersReducedMotion()) {
      stage.style.setProperty("--s", "1");
      return;
    }

    let base = { left: 0, top: 0, width: 1, height: 1 };
    let leanAt = { x: 0, y: 0 };
    let dx = 0;
    let dy = 0;
    let maxScale = 1;
    let distance = 1;
    let lastP = -1;
    let lastS = -1;

    // The logo leans after the light of the background, so its offset is read every time.
    const leanOffset = () => {
      if (!lean) return { x: 0, y: 0 };
      const matrix = new DOMMatrixReadOnly(getComputedStyle(lean).transform);
      return { x: matrix.m41, y: matrix.m42 };
    };

    const measure = () => {
      logo.style.transform = "none";
      const box = logo.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      base = { left: box.left - stageBox.left, top: box.top - stageBox.top, width: box.width, height: box.height };
      leanAt = leanOffset();
      const originX = base.left + base.width * 0.3487;
      const originY = base.top + base.height * 0.558;
      dx = stageBox.width / 2 - originX;
      dy = stageBox.height / 2 - originY;
      // The long facet is 181 units thick on a 1000 unit mark. Grow until it covers the screen corners.
      const halfThickness = (90.5 * base.width) / 1000;
      maxScale = (Math.hypot(stageBox.width, stageBox.height) / 2 / halfThickness) * 1.25;
      distance = Math.max(1, scene.offsetHeight - stageBox.height);
      lastP = -1;
      lastS = -1;
    };

    // The outline of both facets on screen, exactly where the growing logo is now.
    const facetPath = (eased: number, scale: number, now: { x: number; y: number }) => {
      const originX = base.left + base.width * 0.3487;
      const originY = base.top + base.height * 0.558;
      const point = ([u, v]: [number, number]) => {
        const x = base.left + (u / 1000) * base.width;
        const y = base.top + (v / 595) * base.height;
        const sx = originX + (x - originX) * scale + dx * eased + now.x - leanAt.x;
        const sy = originY + (y - originY) * scale + dy * eased + now.y - leanAt.y;
        return `${sx.toFixed(1)} ${sy.toFixed(1)}`;
      };
      const shapes = FACETS.map((facet) => `M${facet.map(point).join("L")}Z`).join("");
      return `path("${shapes}")`;
    };

    const update = () => {
      const p = clamp(window.scrollY / distance);
      // Past the end of the scene nothing changes, so the rest of the page pays nothing for it.
      if (p === lastP && (p === 0 || p === 1)) return;
      lastP = p;
      const d = range(p, 0, DIVE_END);
      const s = range(p, DIVE_END, 1);
      // Read before anything is written, so the browser does not have to recalculate styles twice.
      const lean = d > 0.3 && d < 0.985 ? leanOffset() : null;
      const eased = smooth(range(d, 0.02, 1));
      const scale = Math.pow(maxScale, eased);
      logo.style.transform = `translate(${(dx * eased).toFixed(1)}px, ${(dy * eased).toFixed(1)}px) scale(${scale.toFixed(3)})`;

      // Inside the facet the background turns to its light palette. At the very end of the scene
      // it fades to plain fog, so the next section can bring its own background in without a seam.
      lightMix.current = range(d, 0.7, 0.9);
      light.style.opacity = (1 - range(p, 0.94, 0.995)).toFixed(3);

      const leaving = range(d, 0, 0.2);
      body.style.opacity = (1 - leaving).toFixed(3);
      body.style.transform = `translateY(${(-leaving * 70).toFixed(1)}px)`;
      body.style.visibility = leaving >= 1 ? "hidden" : "visible";

      const through = d >= 0.985;
      stage.classList.toggle("is-through", through);

      // The offer: appears inside the logo, stays, then leaves upwards before the next section.
      if (s !== lastS) {
        lastS = s;
        statement.style.setProperty("--s", s.toFixed(4));
      }
      const appear = range(d, 0.3, 0.5);
      const leave = range(s, 0.82, 1);
      const shown = appear * (1 - leave);
      statement.style.opacity = shown.toFixed(3);
      statement.style.visibility = shown > 0 ? "visible" : "hidden";
      statement.style.transform = `translateY(${(-leave * 60).toFixed(1)}px)`;
      statement.style.clipPath = lean && !through ? facetPath(eased, scale, lean) : "none";
    };

    measure();
    const stop = subscribeScroll(update);
    const onResize = () => {
      measure();
      update();
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sceneRef} className="hero-scene" aria-label="Главный экран">
      <div ref={stageRef} className="hero-stage tone-dark">
        <Smoke mixRef={lightMix}>
          <Mark ref={markRef} className="hero-dive" />
        </Smoke>

        <div ref={bodyRef} className="hero-body">
          <div className="wrap hero-lockup">
            <p className="sr-only">ASCEND STUDIO</p>
            <Wordmark className="hero-word" aria-hidden="true" />
            <span className="hero-studio" aria-hidden="true">
              {hero.studio}
            </span>
            <div className="hero-actions">
              <TransitionLink href="/#cases" className="btn btn-solid">
                <span>{hero.primary}</span>
              </TransitionLink>
              <CalcButton className="btn">{hero.secondary}</CalcButton>
            </div>
          </div>
        </div>

        <Statement />
      </div>
    </section>
  );
}
