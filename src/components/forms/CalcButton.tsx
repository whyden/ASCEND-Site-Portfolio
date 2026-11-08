"use client";

import type { ReactNode } from "react";

export const OPEN_CALC_EVENT = "ascend:open-calculator";

export function CalcButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CALC_EVENT))}
    >
      <span>{children}</span>
    </button>
  );
}
