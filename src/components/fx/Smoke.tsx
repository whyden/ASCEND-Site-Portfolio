"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// The background of the site: soft discs of out-of-focus light, like the bokeh of a lens focused on the logo.
// The discs sit on three depths. The farther a layer, the larger and blurrier its discs, and the less it moves
// when the cursor moves, so the picture has depth and the eye stays on the logo and the buttons.
// A layer is blurred once and afterwards only slides (a transform), so nothing is redrawn while it moves.
// Two palettes: grey-white discs on the black screens, white and grey discs on the fog ones.
// The first screen builds the light palette too, and shows it while the flight into the logo turns the page to fog.
// The file is still called Smoke: that is what the background used to be, and the class names follow it.

type Palette = "dark" | "light";
type Layer = { depth: number; el: HTMLElement };
type Stack = { root: HTMLElement; layers: Layer[] };
type Mount = {
  slot: HTMLElement;
  visible: boolean;
  stacks: Partial<Record<Palette, Stack>>;
  mixRef?: { current: number };
  lastMix: number;
  build: (theme: Palette) => void;
};

// How far the layers follow the cursor: 1 is the strongest setting of the demo, 0.2 is the one that was chosen.
const PARALLAX = 0.2;
// How blurred the discs are: 1 is the setting of the demo.
const BLUR = 1;
// A layer is a little larger than its section, so it can slide without showing an edge.
const OVER = 40;

const GROUPS = [
  { depth: 0.18, count: 12, r0: 55, r1: 120, blur: 16, a0: 0.05, a1: 0.1 },
  { depth: 0.5, count: 12, r0: 30, r1: 75, blur: 9, a0: 0.07, a1: 0.14 },
  { depth: 1, count: 9, r0: 14, r1: 42, blur: 3, a0: 0.09, a1: 0.18 },
];

// A small seeded generator, so the discs are in the same places on every visit.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The discs of one palette, on three layers. With a logo on the screen, the middle is kept free of them.
function buildStack(theme: Palette, w: number, h: number, keepMiddleFree: boolean): Stack {
  const root = document.createElement("div");
  root.className = `bk-stack is-${theme}`;
  const r = rng(7);
  const dark = theme === "dark";
  const scale = Math.max(0.5, Math.min(1, w / 1300));
  const layers: Layer[] = GROUPS.map((group) => {
    const layer = document.createElement("div");
    layer.className = "bk-layer";
    const inner = document.createElement("div");
    inner.className = "bk-in";
    inner.style.setProperty("--b", `${group.blur * BLUR}px`);
    for (let k = 0; k < group.count; k += 1) {
      let x = 0;
      let y = 0;
      for (let tries = 0; tries < 20; tries += 1) {
        x = -0.08 * w + r() * w * 1.16;
        y = -0.1 * h + r() * h * 1.2;
        if (!keepMiddleFree || Math.abs(x / w - 0.5) >= 0.2 || Math.abs(y / h - 0.48) >= 0.22) break;
      }
      const radius = (group.r0 + r() * (group.r1 - group.r0)) * scale;
      const strength = group.a0 + r() * (group.a1 - group.a0);
      const white = dark || r() < 0.7;
      const color = dark ? "232,232,230" : white ? "255,255,255" : "120,120,116";
      const alpha = dark ? strength : white ? strength * 5.5 : strength * 0.8;
      const disc = document.createElement("i");
      disc.style.cssText =
        `left:${(x + OVER - radius).toFixed(0)}px;top:${(y + OVER - radius).toFixed(0)}px;` +
        `width:${(radius * 2).toFixed(0)}px;height:${(radius * 2).toFixed(0)}px;` +
        `background:radial-gradient(closest-side,rgba(${color},${(alpha * 0.45).toFixed(3)}) 0%,` +
        `rgba(${color},${(alpha * 0.6).toFixed(3)}) 74%,rgba(${color},${alpha.toFixed(3)}) 92%,rgba(${color},0) 100%)`;
      inner.append(disc);
    }
    layer.append(inner);
    root.append(layer);
    return { depth: group.depth, el: layer };
  });
  return { root, layers };
}

// One loop for the whole page. It moves the layers with the cursor, and when the mouse rests the view drifts
// slowly by itself. It runs only while some background is on screen.
const mounts = new Set<Mount>();
const view = { px: 0, py: 0, tx: 0, ty: 0, moved: -1e9 };
let frame = 0;
let listening = false;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  view.tx = (event.clientX / window.innerWidth - 0.5) * 2;
  view.ty = (event.clientY / window.innerHeight - 0.5) * 2;
  view.moved = performance.now();
}

function tick(now: number) {
  frame = 0;
  const active = [...mounts].filter((mount) => mount.visible);
  if (!active.length) return;
  frame = requestAnimationFrame(tick);
  if (document.hidden) return;

  const t = now / 1000;
  if (now - view.moved > 2600) {
    view.tx = Math.sin(t * 0.22) * 0.7;
    view.ty = Math.cos(t * 0.17) * 0.5;
  }
  view.px += (view.tx - view.px) * 0.07;
  view.py += (view.ty - view.py) * 0.07;
  const small = window.innerWidth < 760;
  const ax = (small ? 26 : 64) * PARALLAX;
  const ay = (small ? 18 : 40) * PARALLAX;

  active.forEach((mount) => {
    // The first screen turns to the light palette while we fly into the logo: it is built when first needed.
    if (mount.mixRef) {
      const mix = Math.min(1, Math.max(0, mount.mixRef.current));
      if (mix > 0.001 && !mount.stacks.light) mount.build("light");
      if (mix !== mount.lastMix) {
        mount.lastMix = mix;
        if (mount.stacks.dark) mount.stacks.dark.root.style.opacity = String(1 - mix);
        if (mount.stacks.light) mount.stacks.light.root.style.opacity = String(mix);
      }
    }
    Object.values(mount.stacks).forEach((stack) => {
      stack.layers.forEach((layer) => {
        const x = clamp(-view.px * layer.depth * ax, OVER - 4);
        const y = clamp(-view.py * layer.depth * ay, OVER - 4);
        layer.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    });
  });
}

function wake() {
  if (!frame && [...mounts].some((mount) => mount.visible)) frame = requestAnimationFrame(tick);
}

function register(mount: Mount) {
  mounts.add(mount);
  if (!listening) {
    listening = true;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", wake);
  }
}

function unregister(mount: Mount) {
  mounts.delete(mount);
  if (!mounts.size && listening) {
    listening = false;
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", wake);
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

type SmokeProps = {
  className?: string;
  palette?: Palette;
  /** The first screen: the middle is kept free of discs, and the big logo stands in the background wrapper. */
  logo?: boolean;
  /** From 0 to 1: how far the palette has turned light. The first screen changes it while flying into the facet. */
  mixRef?: { current: number };
  /** Anything that has to stand exactly on the logo: the first screen flies into it. */
  children?: ReactNode;
};

export function Smoke({ className = "", palette = "dark", logo = true, mixRef, children }: SmokeProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const still = prefersReducedMotion();
    let size = { w: 0, h: 0 };

    const mount: Mount = {
      slot,
      visible: false,
      stacks: {},
      mixRef,
      lastMix: -1,
      build: (theme) => {
        mount.stacks[theme]?.root.remove();
        const stack = buildStack(theme, size.w, size.h, logo);
        // The light palette of the first screen starts invisible and fades in with the flight.
        if (theme === "light" && mixRef) stack.root.style.opacity = String(Math.min(1, Math.max(0, mixRef.current)));
        slot.append(stack.root);
        mount.stacks[theme] = stack;
      },
    };

    // Which palettes this background needs: the first screen both, the others one.
    const fill = () => {
      Object.values(mount.stacks).forEach((stack) => stack.root.remove());
      mount.stacks = {};
      mount.lastMix = -1;
      if (palette === "light") mount.build("light");
      else {
        mount.build("dark");
        if (mixRef && mixRef.current > 0.001) mount.build("light");
      }
    };

    // Built at the real size of the place. On a resize it is built again, but not for the small changes
    // that a phone makes when its address bar slides away.
    let timer = 0;
    const sizes = new ResizeObserver(() => {
      const w = slot.clientWidth;
      const h = slot.clientHeight;
      if (!w || !h) return;
      const first = size.w === 0;
      if (!first && Math.abs(w - size.w) < 2 && Math.abs(h - size.h) < Math.max(120, size.h * 0.15)) return;
      size = { w, h };
      window.clearTimeout(timer);
      if (first) fill();
      else timer = window.setTimeout(fill, 200);
    });
    sizes.observe(slot);

    const seen = new IntersectionObserver(([entry]) => {
      mount.visible = entry.isIntersecting;
      if (!still) wake();
    });
    seen.observe(slot);
    if (!still) register(mount);

    return () => {
      window.clearTimeout(timer);
      sizes.disconnect();
      seen.disconnect();
      if (!still) unregister(mount);
      Object.values(mount.stacks).forEach((stack) => stack.root.remove());
    };
  }, [palette, logo, mixRef]);

  return (
    <div className={`smoke is-${palette} ${className}`} aria-hidden="true">
      <div ref={slotRef} className="smoke-light" />
      {logo ? (
        <div className="smoke-lean">
          <div className="smoke-logo">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
