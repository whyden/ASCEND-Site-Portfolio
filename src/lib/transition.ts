// Page change: a diagonal curtain covers the screen, the route changes, the curtain leaves.
import { prefersReducedMotion } from "./motion";

type Curtain = { cover: () => Promise<void> };

let curtain: Curtain | null = null;

export const registerCurtain = (value: Curtain | null) => {
  curtain = value;
};

export async function coverPage() {
  if (!curtain || prefersReducedMotion()) return;
  await curtain.cover();
}
