"use client";

import { useLayoutEffect } from "react";

declare global {
  interface Window {
    __ascendIntro?: "play" | "done";
  }
}

// The inline script in layout.tsx decides before first paint whether the intro plays.
// In development React clears attributes on <html> when it remounts, so this restores them.
export function IntroGate() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-intro", window.__ascendIntro ?? "done");
  }, []);
  return null;
}
