"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MARK } from "@/lib/logo";
import { prefersReducedMotion, scrolledRecently } from "@/lib/motion";

// The living background: soft light flowing in layers, drawn on the graphics card.
// It leans towards the cursor and glows under it, and a press sends a wave through it.
// When the mouse rests, the light wanders across the screen by itself.
// Two palettes: dark for the black screens and light for the fog ones.
// The picture is soft, so it is drawn small and stretched, about 30 times a second, and less often
// while the page scrolls. Phones get one layer of detail less. A slow device gets a simpler picture,
// and without a graphics card a calm CSS glow stays instead.
// On the black screens the big soft logo stands under the light.

type Palette = "dark" | "light";
type Rgb = [number, number, number];

const PALETTES: Record<Palette, { a: Rgb; b: Rgb; gain: number }> = {
  dark: { a: [214, 214, 210], b: [58, 58, 58], gain: 0.9 },
  light: { a: [255, 255, 255], b: [120, 120, 116], gain: 0.62 },
};

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAGMENT = `precision highp float;
uniform vec2 uRes;uniform float uT;uniform vec2 uPtr;uniform float uPower;
uniform vec3 uA;uniform vec3 uB;uniform float uGain;uniform vec4 uPulse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<OCTAVES;i++){v+=a*noise(p);p=m*p;a*=.5;}return v*NORM;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 asp=vec2(uRes.x/uRes.y,1.);
  vec2 ptr=vec2(uPtr.x,1.-uPtr.y);
  float d=distance(uv*asp,ptr*asp);
  vec2 p=uv*asp*1.7;
  p+=(ptr-uv)*asp*.5*exp(-d*d*5.)*uPower;
  float t=uT*.085;
  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.8));
  vec2 r=vec2(fbm(p+2.6*q+vec2(1.7,9.2)+t*1.1),fbm(p+2.6*q+vec2(8.3,2.8)-t*.7));
  float f=fbm(p+3.2*r);
  float light=smoothstep(.34,.82,f);
  light*=mix(.42,1.,smoothstep(.12,.82,distance(uv,vec2(.5,.56))*1.35));
  float glow=exp(-d*d*11.)*.36*uPower;
  float ring=0.;
  if(uPulse.w>0.){
    float pd=distance(uv*asp,vec2(uPulse.x,1.-uPulse.y)*asp);
    float w=(pd-uPulse.z*.72)*8.5;
    ring=exp(-w*w)*exp(-uPulse.z*1.5)*uPulse.w;
  }
  vec3 col=mix(uB,uA,clamp(r.x*1.25+glow*1.5+ring,0.,1.));
  float alpha=clamp(light*.5+glow+ring*.55,0.,.9)*uGain;
  alpha+=(hash(gl_FragCoord.xy+fract(uT))-.5)/120.*step(.002,alpha);
  gl_FragColor=vec4(col*max(alpha,0.),max(alpha,0.));
}`;

// Size of the soft logo picture. CSS stretches it, so it never needs redrawing.
// PADDING leaves room for the soft edge and must match .smoke-soft in globals.css.
const LOGO_WIDTH = 800;
const PADDING = 80;
const SOFTNESS = 34;
const LEAN_X = 30;
const LEAN_Y = 22;

function drawSoftMark(canvas: HTMLCanvasElement) {
  const scale = LOGO_WIDTH / MARK.width;
  canvas.width = LOGO_WIDTH + PADDING * 2;
  canvas.height = Math.round(MARK.height * scale + PADDING * 2);
  const context = canvas.getContext("2d");
  if (!context) return;
  // The shapes are drawn far outside the picture and only their shadows land on it:
  // that is a soft edge every browser can do.
  const far = canvas.width * 2;
  context.setTransform(scale, 0, 0, scale, PADDING - far, PADDING);
  context.shadowOffsetX = far;
  context.shadowBlur = SOFTNESS;
  context.shadowColor = "#c4c4c2";
  context.fill(new Path2D(MARK.long));
  context.shadowColor = "#9c9c9a";
  context.fill(new Path2D(MARK.small));
  // Light falls from above.
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.shadowColor = "transparent";
  context.globalCompositeOperation = "source-atop";
  const shade = context.createLinearGradient(0, 0, 0, canvas.height);
  shade.addColorStop(0, "rgba(0, 0, 0, 0)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.55)");
  context.fillStyle = shade;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function createLight(canvas: HTMLCanvasElement, small: boolean) {
  // A software renderer would make the whole page slow, so it gets the CSS glow instead.
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  // On phones one layer of detail less, with the brightness kept the same.
  const defines = small ? "#define OCTAVES 2\n#define NORM 1.1667\n" : "#define OCTAVES 3\n#define NORM 1.\n";
  const fragment = compile(gl.FRAGMENT_SHADER, defines + FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const names = ["uRes", "uT", "uPtr", "uPower", "uA", "uB", "uGain", "uPulse"] as const;
  const u = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));

  let scale = small ? 0.5 : 0.42;
  let width = 1;
  let height = 1;
  return {
    resize(w: number, h: number) {
      width = w;
      height = h;
      canvas.width = Math.max(2, Math.round(Math.min(w, 1800) * scale));
      canvas.height = Math.max(2, Math.round((h * canvas.width) / Math.max(w, 1)));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    lower() {
      scale = 0.3;
      this.resize(width, height);
    },
    draw(time: number, pointer: [number, number], power: number, a: Rgb, b: Rgb, gain: number, pulse: [number, number, number, number]) {
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uT, time);
      gl.uniform2f(u.uPtr, pointer[0], pointer[1]);
      gl.uniform1f(u.uPower, power);
      gl.uniform3f(u.uA, a[0] / 255, a[1] / 255, a[2] / 255);
      gl.uniform3f(u.uB, b[0] / 255, b[1] / 255, b[2] / 255);
      gl.uniform1f(u.uGain, gain);
      gl.uniform4f(u.uPulse, pulse[0], pulse[1], pulse[2], pulse[3]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    release() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

// The share of the way to the target in one frame: the same speed at 60 and at 144 frames a second.
const follow = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const mixRgb = (from: Rgb, to: Rgb, k: number): Rgb => [
  from[0] + (to[0] - from[0]) * k,
  from[1] + (to[1] - from[1]) * k,
  from[2] + (to[2] - from[2]) * k,
];

type SmokeProps = {
  className?: string;
  palette?: Palette;
  /** Show the big soft logo under the light. */
  logo?: boolean;
  /** Brightness of the soft logo, from 0 to 1. */
  gain?: number;
  /** From 0 to 1: how far the palette has turned light. The first screen changes it while flying into the facet. */
  mixRef?: { current: number };
  /** Anything that has to stand exactly on the logo: the first screen flies into it. */
  children?: ReactNode;
};

export function Smoke({ className = "", palette = "dark", logo = true, gain = 0.4, mixRef, children }: SmokeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const leanRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (softRef.current) drawSoftMark(softRef.current);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const slot = lightRef.current;
    if (!root || !slot) return;
    if (prefersReducedMotion()) {
      root.classList.remove("has-light");
      return;
    }

    // A fresh canvas every time the page is shown. Next keeps a page we left in the document, hidden,
    // and runs this effect again when we come back. A canvas whose context was released cannot get
    // a new one, and the browser paints it white, so the old canvas always leaves with its context.
    const canvas = document.createElement("canvas");
    slot.appendChild(canvas);
    const small = window.matchMedia("(hover: none), (max-width: 699px)").matches;
    let light: ReturnType<typeof createLight> = null;
    try {
      light = createLight(canvas, small);
    } catch {
      light = null;
    }
    root.classList.toggle("has-light", Boolean(light));
    if (!light) {
      canvas.remove();
      return;
    }
    const glow = light;

    // Everything is measured on the light itself: in long sections it is only one screen tall.
    let width = 1;
    let height = 1;
    const sizes = new ResizeObserver(() => {
      width = slot.clientWidth;
      height = slot.clientHeight;
      glow.resize(width, height);
    });
    sizes.observe(slot);

    // The light: wanders by itself, follows the cursor while it moves.
    const spot = { x: 0, y: 0, tx: 0, ty: 0, power: 0.55, moved: -1e9 };
    let pulse: { x: number; y: number; t0: number; s: number } | null = null;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = canvas.getBoundingClientRect();
      spot.tx = event.clientX - box.left;
      spot.ty = event.clientY - box.top;
      spot.moved = performance.now();
    };
    const onDown = (event: PointerEvent) => {
      if (event.button) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select")) return;
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (x < 0 || y < 0 || x > box.width || y > box.height) return;
      const strength = target?.closest(".btn, .case-page, .case-hit") ? 0.75 : 0.28;
      pulse = { x, y, t0: performance.now(), s: strength };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });

    let visible = false;
    let frame = 0;
    let count = 0;
    let last = 0;
    let lastDraw = 0;
    let sampled = 0;
    let slow = 0;
    let quality = 2;
    let stopped = false;

    // Without the light the page falls back to the calm CSS glow, and the dead canvas is removed.
    const stop = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      root.classList.remove("has-light");
      canvas.remove();
    };
    // The graphics card can drop the context on its own, for example after a driver reset.
    const onLost = () => stop();
    canvas.addEventListener("webglcontextlost", onLost);

    // Off screen the loop does not run at all, it starts again when the light comes into view.
    const step = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || stopped) return;
      frame = requestAnimationFrame(step);
      const dtMs = Math.min(now - (last || now), 60);
      last = now;
      const dt = dtMs / 1000;
      const t = now / 1000;
      count += 1;

      const moving = now - spot.moved < 2600;
      const tx = moving ? spot.tx : width * (0.5 + 0.36 * Math.sin(t * 0.17) + 0.09 * Math.sin(t * 0.41 + 1.3));
      const ty = moving ? spot.ty : height * (0.46 + 0.32 * Math.cos(t * 0.13 + 0.7) + 0.08 * Math.sin(t * 0.37));
      if (!spot.x) {
        spot.x = width * 0.68;
        spot.y = height * 0.34;
      }
      const k = follow(moving ? 6 : 1.1, dt);
      spot.x += (tx - spot.x) * k;
      spot.y += (ty - spot.y) * k;
      spot.power += ((moving ? 1 : 0.62) - spot.power) * follow(2.4, dt);

      // The logo leans a little towards the light.
      const lean = leanRef.current;
      if (lean) {
        const lx = (spot.x / Math.max(width, 1) - 0.5) * 2 * LEAN_X;
        const ly = (spot.y / Math.max(height, 1) - 0.5) * 2 * LEAN_Y;
        lean.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0)`;
      }

      // Thirty pictures a second are enough for slow light, about fifty while the cursor moves,
      // and twenty during scrolling, when the page itself needs the graphics card.
      // Behind an open window the light waits.
      const gap = scrolledRecently() ? 48 : moving ? 20 : 30;
      if (now - lastDraw < gap || document.querySelector("dialog[open]")) return;
      lastDraw = now;

      const mix = Math.min(1, Math.max(0, mixRef?.current ?? 0));
      const from = PALETTES[palette];
      const a = mixRgb(from.a, PALETTES.light.a, mix);
      const b = mixRgb(from.b, PALETTES.light.b, mix);
      const g = from.gain + (PALETTES.light.gain - from.gain) * mix;
      let wave: [number, number, number, number] = [0, 0, 0, 0];
      if (pulse) {
        const age = (now - pulse.t0) / 1000;
        if (age > 2.4) pulse = null;
        else wave = [pulse.x / width, pulse.y / height, age, pulse.s];
      }
      glow.draw(t, [spot.x / width, spot.y / height], spot.power, a, b, g, wave);

      // The device cannot keep up: first a smaller picture, then the calm CSS glow.
      if (count > 20 && sampled < 120) {
        sampled += 1;
        if (dtMs > 26) slow += 1;
        if (sampled === 120 && slow > 48) {
          if (quality === 2) {
            quality = 1;
            glow.lower();
            sampled = 0;
            slow = 0;
          } else {
            glow.release();
            stop();
          }
        }
      }
    };
    const wake = () => {
      if (!frame && visible && !document.hidden && !stopped) frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    observer.observe(slot);
    document.addEventListener("visibilitychange", wake);

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!stopped) glow.release();
      canvas.remove();
    };
  }, [palette, mixRef]);

  return (
    <div ref={rootRef} className={`smoke is-${palette} ${className}`} aria-hidden="true">
      <i className="smoke-haze is-a" />
      <i className="smoke-haze is-b" />
      {logo ? (
        <div ref={leanRef} className="smoke-lean">
          <div className="smoke-logo">
            <canvas ref={softRef} className="smoke-soft" style={{ opacity: gain }} />
            {children}
          </div>
        </div>
      ) : null}
      <div ref={lightRef} className="smoke-light" />
    </div>
  );
}
