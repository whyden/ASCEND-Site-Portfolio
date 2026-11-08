"use client";

import { useEffect, useRef, type ElementType, type HTMLAttributes } from "react";
import { addLight, addTilt } from "@/lib/pointer";

type GlassProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** How far the block travels after the cursor. Bigger means closer to the viewer. */
  depth?: number;
  /** How far the block turns after the cursor, in degrees. */
  max?: number;
  /** The block also drifts slowly up and down on its own. */
  float?: boolean;
  /** The block stays in place. */
  still?: boolean;
  /** Light from the cursor slides over the glass. */
  light?: boolean;
};

// A block that leans towards the cursor and catches its light. The look itself is in globals.css.
export function Glass({
  as = "div",
  depth = 1,
  max = 9,
  float = false,
  still = false,
  light = true,
  className = "",
  children,
  ...rest
}: GlassProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const stopLight = light ? addLight(element) : undefined;
    const stopTilt = still ? undefined : addTilt(element, { depth, max, float });
    return () => {
      stopLight?.();
      stopTilt?.();
    };
  }, [depth, max, float, still, light]);

  const Tag = as;
  return (
    <Tag ref={ref} className={`${light ? "lit " : ""}${className}`} {...rest}>
      {children}
    </Tag>
  );
}
