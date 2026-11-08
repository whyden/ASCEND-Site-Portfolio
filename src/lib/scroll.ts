// One shared smooth scroll instance, used by links and dialogs.
import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (value: Lenis | null) => {
  instance = value;
};

export const pauseScroll = () => instance?.stop();
export const resumeScroll = () => instance?.start();
export const refreshScroll = () => instance?.resize();

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

// Smooth way back to the top of the page, for the logo in the header.
export function scrollToStart() {
  if (instance) instance.scrollTo(0, { force: true, duration: 1.6 });
  else window.scrollTo(0, 0);
}

// Smoothly brings an element to the top of the screen, "offset" pixels away from it.
export function scrollToElement(element: HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(element, { offset, force: true, duration: 1 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function scrollToId(id: string, immediate = false) {
  const target = document.getElementById(id);
  if (!target) return;
  if (instance) {
    instance.scrollTo(target, { immediate, force: true, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}
