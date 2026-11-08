// Small helpers for animation, with no external libraries.

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

// 0..1 progress of a value between two points.
export const range = (value: number, from: number, to: number) =>
  clamp((value - from) / (to - from));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lastScrollAt = -Infinity;
let watchingScroll = false;

// True while the page is moving. Decorations step aside for that time, so scrolling gets the whole device.
export function scrolledRecently(ms = 160) {
  if (!watchingScroll) {
    watchingScroll = true;
    window.addEventListener(
      "scroll",
      () => {
        lastScrollAt = performance.now();
      },
      { passive: true },
    );
  }
  return performance.now() - lastScrollAt < ms;
}

// Calls the callback at most once per frame on scroll and resize, and once right away.
export function subscribeScroll(callback: () => void) {
  let queued = false;
  const run = () => {
    queued = false;
    callback();
  };
  const onChange = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  callback();
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}
