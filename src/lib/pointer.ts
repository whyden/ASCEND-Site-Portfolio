// The pointer, shared by everything on the site that reacts to it, and one animation loop for all of it.
// A block "leans" towards the cursor, and light slides over the glass under the cursor.
// Touch screens have no cursor, so there is nothing to follow and the loop does not run.
// While the page scrolls the loop rests: scrolling matters more than a few pixels of tilt.

import { scrolledRecently } from "./motion";

type Tilt = {
  element: HTMLElement;
  depth: number;
  max: number;
  float: boolean;
  phase: number;
  lift: number;
  hovered: boolean;
};

type TiltOptions = { depth?: number; max?: number; float?: boolean };

// x and y go from -1 to 1 across the window and follow the real pointer softly.
const pointer = { x: 0, y: 0, clientX: -9999, clientY: -9999, moved: false };

const target = { x: 0, y: 0 };
const tilts = new Map<HTMLElement, Tilt>();
const lights = new Set<HTMLElement>();
const inView = new Set<Element>();
const lastLight = new WeakMap<HTMLElement, string>();

let observer: IntersectionObserver | null = null;
let listening = false;
let frame = 0;
let phase = 0;
let lightsStale = false;
let wasScrolling = false;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const noCursor = () => reduced() || window.matchMedia("(hover: none)").matches;

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  target.x = (event.clientX / window.innerWidth) * 2 - 1;
  target.y = (event.clientY / window.innerHeight) * 2 - 1;
  pointer.clientX = event.clientX;
  pointer.clientY = event.clientY;
  pointer.moved = true;
  lightsStale = true;
}

function tick(now: number) {
  frame = requestAnimationFrame(tick);
  if (document.hidden) return;
  if (scrolledRecently()) {
    wasScrolling = true;
    return;
  }
  if (wasScrolling) {
    wasScrolling = false;
    lightsStale = true;
  }

  // Until the pointer moves, the blocks sway on their own.
  if (!pointer.moved) {
    target.x = Math.sin(now / 2600) * 0.6;
    target.y = Math.cos(now / 3300) * 0.35;
  }
  pointer.x += (target.x - pointer.x) * 0.075;
  pointer.y += (target.y - pointer.y) * 0.075;

  tilts.forEach((item) => {
    if (!inView.has(item.element)) return;
    item.lift += ((item.hovered ? 1 : 0) - item.lift) * 0.12;
    const drift = item.float ? Math.sin(now / 2400 + item.phase) * 5 : 0;
    const x = pointer.x * 13 * item.depth;
    const y = pointer.y * 9 * item.depth + drift;
    const turnX = -pointer.y * item.max * 0.7;
    const turnY = pointer.x * item.max;
    const scale = 1 + item.lift * 0.025;
    item.element.style.transform = `perspective(1100px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateX(${turnX.toFixed(2)}deg) rotateY(${turnY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
  });

  // Read every box first and write afterwards, so the browser measures the page only once.
  if (pointer.moved && lightsStale) {
    lightsStale = false;
    const boxes: [HTMLElement, DOMRect][] = [];
    lights.forEach((element) => {
      if (inView.has(element)) boxes.push([element, element.getBoundingClientRect()]);
    });
    boxes.forEach(([element, box]) => {
      const x = `${(pointer.clientX - box.left).toFixed(0)}px`;
      const y = `${(pointer.clientY - box.top).toFixed(0)}px`;
      const place = `${x} ${y}`;
      if (lastLight.get(element) === place) return;
      lastLight.set(element, place);
      element.style.setProperty("--lx", x);
      element.style.setProperty("--ly", y);
    });
  }

}

function syncLoop() {
  const needed = tilts.size + lights.size > 0;
  if (needed && !frame) frame = requestAnimationFrame(tick);
  if (!needed && frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
}

function watch(element: HTMLElement) {
  listen();
  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }),
    { rootMargin: "80px" },
  );
  observer.observe(element);
}

function unwatch(element: HTMLElement) {
  if (tilts.has(element) || lights.has(element)) return;
  observer?.unobserve(element);
  inView.delete(element);
}

export function addTilt(element: HTMLElement, { depth = 1, max = 9, float = false }: TiltOptions = {}) {
  if (noCursor()) return () => {};
  const item: Tilt = { element, depth, max, float, phase: (phase += 1.7), lift: 0, hovered: false };
  const onEnter = () => {
    item.hovered = true;
  };
  const onLeave = () => {
    item.hovered = false;
  };
  element.addEventListener("pointerenter", onEnter);
  element.addEventListener("pointerleave", onLeave);
  tilts.set(element, item);
  watch(element);
  syncLoop();
  return () => {
    element.removeEventListener("pointerenter", onEnter);
    element.removeEventListener("pointerleave", onLeave);
    element.style.transform = "";
    tilts.delete(element);
    unwatch(element);
    syncLoop();
  };
}

export function addLight(element: HTMLElement) {
  if (noCursor()) return () => {};
  lights.add(element);
  watch(element);
  syncLoop();
  return () => {
    lights.delete(element);
    unwatch(element);
    syncLoop();
  };
}
