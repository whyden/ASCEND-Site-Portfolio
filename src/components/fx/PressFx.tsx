"use client";

import { useEffect } from "react";
import { MARK } from "@/lib/logo";
import { prefersReducedMotion } from "@/lib/motion";

// Small answers to a press, borrowed from the team's 404 project and made our own:
// a soft circle spreads inside the pressed button, and a few sparks shaped like
// the facets of the logo fly out from the cursor. The text of the button never moves.

const MAX_SPARKS = 14;
const SPARKS_PER_PRESS = 5;
const SHAPES = [
  { box: "0 0 637.4 595", path: MARK.long },
  { box: "565 267.25 435 327.75", path: MARK.small },
];

export function PressFx() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = 0;

    const ink = (button: HTMLElement, x: number, y: number) => {
      const box = button.getBoundingClientRect();
      const size = Math.max(box.width, box.height) * 2.2;
      const holder = document.createElement("span");
      holder.className = "ink";
      const drop = document.createElement("i");
      drop.style.cssText = `width:${size}px;height:${size}px;left:${x - box.left - size / 2}px;top:${y - box.top - size / 2}px`;
      holder.append(drop);
      button.append(holder);
      drop
        .animate([{ transform: "scale(0)", opacity: 0.4 }, { transform: "scale(1)", opacity: 0 }], {
          duration: 700,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        })
        .finished.then(() => holder.remove())
        .catch(() => holder.remove());
    };

    const sparks = (x: number, y: number) => {
      const turn = Math.random() * 60;
      for (let i = 0; i < SPARKS_PER_PRESS && alive < MAX_SPARKS; i += 1) {
        alive += 1;
        const shape = SHAPES[i % 2];
        const spark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        spark.setAttribute("viewBox", shape.box);
        spark.setAttribute("class", "spark");
        spark.setAttribute("aria-hidden", "true");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", shape.path);
        spark.append(path);
        document.body.append(spark);
        const angle = ((turn + i * (360 / SPARKS_PER_PRESS)) * Math.PI) / 180;
        const distance = 26 + Math.random() * 16;
        const size = 0.6 + Math.random() * 0.5;
        spark
          .animate(
            [
              { transform: `translate3d(${x}px, ${y}px, 0) scale(${size})`, opacity: 0.9 },
              {
                transform: `translate3d(${x + Math.cos(angle) * distance}px, ${y + Math.sin(angle) * distance}px, 0) scale(0) rotate(80deg)`,
                opacity: 0,
              },
            ],
            { duration: 560, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "forwards" },
          )
          .finished.catch(() => {})
          .then(() => {
            spark.remove();
            alive -= 1;
          });
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.button) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest("input, textarea, select")) return;
      const button = target.closest<HTMLElement>(".btn, .case-page");
      if (button && !button.matches("[disabled], .is-off")) ink(button, event.clientX, event.clientY);
      if (event.pointerType === "mouse") sparks(event.clientX, event.clientY);
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
