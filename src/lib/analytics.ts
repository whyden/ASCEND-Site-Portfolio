// Sends a goal to Yandex Metrica if the counter is connected.
declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

export function trackGoal(goal: string) {
  const id = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (id && window.ym) window.ym(id, "reachGoal", goal);
}
