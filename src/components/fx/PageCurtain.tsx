"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Mark } from "@/components/brand/Logo";
import { refreshScroll, scrollToId, scrollToTop } from "@/lib/scroll";
import { registerCurtain } from "@/lib/transition";

// Page change: the page goes behind frosted glass with the logo on it, the route changes, the glass clears.
export function PageCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    registerCurtain({
      cover: async () => {
        const element = ref.current;
        if (!element) return;
        covered.current = true;
        const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 380,
          easing: "ease-out",
          fill: "forwards",
        });
        await animation.finished;
      },
    });
    return () => registerCurtain(null);
  }, []);

  // A new route is on screen: put the scroll in place and clear the glass.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    refreshScroll();
    if (hash) scrollToId(hash, true);
    else scrollToTop();

    const element = ref.current;
    if (!element || !covered.current) return;
    covered.current = false;
    const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 480,
      delay: 60,
      easing: "ease-out",
      fill: "both",
    });
    animation.finished
      .then(() => element.getAnimations().forEach((item) => item.cancel()))
      .catch(() => {});
  }, [pathname]);

  return (
    <div ref={ref} className="curtain" aria-hidden="true">
      <Mark className="curtain-mark" />
    </div>
  );
}
