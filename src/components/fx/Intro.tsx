"use client";

import { useEffect, useRef } from "react";
import { LETTERS, MARK, WORD_WIDTH } from "@/lib/logo";

// Opening screen, first visit of a session only.
// The facets of the logo slide into place, the letters rise.
// Then the mark flies to its place in the header while the black screen parts along the angle of the logo.
// The word in the header appears from left to right once the mark has landed: see .header-word in globals.css.

const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const EASE_CUT = "cubic-bezier(0.76, 0, 0.24, 1)";

export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.__ascendIntro !== "play") return;

    const running: Animation[] = [];
    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      running.forEach((animation) => animation.cancel());
      window.__ascendIntro = "done";
      document.documentElement.setAttribute("data-intro", "done");
      try {
        sessionStorage.setItem("ascend-intro", "1");
      } catch {
        // Private mode: the intro will simply play again next time.
      }
      window.dispatchEvent(new Event("ascend:intro-done"));
    };
    skipRef.current = finish;

    const play = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, { fill: "both", ...options });
      running.push(animation);
      return animation;
    };

    const long = root.querySelector(".i-long");
    const small = root.querySelector(".i-small");
    const letters = root.querySelectorAll(".i-letter");
    const mark = root.querySelector(".intro-mark");
    const word = root.querySelector(".intro-word");
    const partA = root.querySelector(".intro-a");
    const partB = root.querySelector(".intro-b");
    if (!long || !small || !mark || !word || !partA || !partB) {
      finish();
      return;
    }

    // The long facet comes up its slope, the small one comes down from the right.
    play(
      long,
      [
        { opacity: 0, transform: "translate(-260px, 299px)" },
        { opacity: 1, transform: "translate(0, 0)" },
      ],
      { duration: 1050, delay: 120, easing: EASE_OUT },
    );
    play(
      small,
      [
        { opacity: 0, transform: "translate(170px, 195.5px)" },
        { opacity: 1, transform: "translate(0, 0)" },
      ],
      { duration: 1050, delay: 340, easing: EASE_OUT },
    );

    // Letters rise from behind the baseline.
    letters.forEach((letter, index) => {
      play(letter, [{ transform: "translateY(130px)" }, { transform: "translateY(0)" }], {
        duration: 800,
        delay: 680 + index * 60,
        easing: EASE_OUT,
      });
    });

    const leave = () => {
      if (finished) return;
      play(word, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: "linear" });

      // The mark lands exactly on the logo in the header.
      const target = document.querySelector("[data-header-mark]")?.getBoundingClientRect();
      const from = mark.getBoundingClientRect();
      if (target && target.width > 0) {
        const scale = target.width / from.width;
        const dx = target.left + target.width / 2 - (from.left + from.width / 2);
        const dy = target.top + target.height / 2 - (from.top + from.height / 2);
        play(
          mark,
          [
            { transform: "translate(0, 0) scale(1)" },
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
          ],
          { duration: 1050, easing: EASE_CUT },
        );
      }

      // The screen parts across the angle of the logo.
      const distance = "120vmax";
      const across = (sign: number) =>
        `translate(calc(${sign} * 0.755 * ${distance}), calc(${sign} * 0.656 * ${distance}))`;
      play(partA, [{ transform: "translate(0, 0)" }, { transform: across(-1) }], {
        duration: 1050,
        easing: EASE_CUT,
      });
      const last = play(partB, [{ transform: "translate(0, 0)" }, { transform: across(1) }], {
        duration: 1050,
        easing: EASE_CUT,
      });
      last.finished.then(finish).catch(() => {});
    };

    timers.push(window.setTimeout(leave, 1850));

    const onKey = () => finish();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      timers.forEach(clearTimeout);
      running.forEach((animation) => animation.cancel());
      skipRef.current = () => {};
    };
  }, []);

  return (
    <div ref={rootRef} className="intro" aria-hidden="true" onClick={() => skipRef.current()}>
      <div className="intro-a" />
      <div className="intro-b" />
      <div className="intro-stage">
        <div className="intro-lockup">
          <svg
            className="intro-mark"
            viewBox={`0 0 ${MARK.width} ${MARK.height}`}
            fill="currentColor"
          >
            <path className="i-long" d={MARK.long} />
            <path className="i-small" d={MARK.small} />
          </svg>
          <svg className="intro-word" viewBox={`0 -2 ${WORD_WIDTH} 104`} fill="currentColor">
            {LETTERS.map((letter) => (
              <g key={letter.key} transform={`translate(${letter.x} 0)`}>
                <path className="i-letter" fillRule="evenodd" d={letter.d} />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
