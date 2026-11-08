"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

// Smooth wheel scrolling on a computer. Phones keep their native scrolling.
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1 });
    setLenis(lenis);

    const introPlaying = window.__ascendIntro === "play";
    if (introPlaying) lenis.stop();
    const onIntroDone = () => lenis.start();
    window.addEventListener("ascend:intro-done", onIntroDone);

    return () => {
      window.removeEventListener("ascend:intro-done", onIntroDone);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
