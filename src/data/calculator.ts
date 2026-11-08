// Project cost calculator. All prices live here.
// TODO: the prices below are placeholders. Replace them with real ones and set PRICES_ARE_DRAFT to false.
export const PRICES_ARE_DRAFT = true;

export type ProjectType = { id: string; label: string; base: number; pages: boolean };

export const projectTypes: ProjectType[] = [
  { id: "landing", label: "Лендинг", base: 60000, pages: false },
  { id: "site", label: "Многостраничный сайт", base: 120000, pages: true },
  { id: "bot", label: "Telegram-бот", base: 50000, pages: false },
  { id: "calculator", label: "Калькулятор на готовый сайт", base: 40000, pages: false },
];

// Price of one extra page above the included ones.
export const pages = { included: 5, max: 20, pricePerPage: 6000 };

export const extras = [
  { id: "calculator", label: "Интерактивный калькулятор", price: 40000, hideFor: ["calculator"] },
  { id: "bot", label: "AI Telegram-бот", price: 60000, hideFor: ["bot"] },
  { id: "crm", label: "Интеграция с CRM", price: 25000, hideFor: [] },
  { id: "language", label: "Второй язык", price: 20000, hideFor: ["bot", "calculator"] },
];

export const speeds = [
  { id: "normal", label: "Обычные сроки", factor: 1 },
  { id: "fast", label: "Срочно", factor: 1.25 },
];

export type CalcState = {
  type: string;
  pageCount: number;
  extras: string[];
  speed: string;
};

export const initialCalc: CalcState = {
  type: "landing",
  pageCount: pages.included,
  extras: [],
  speed: "normal",
};

export function calcPrice(state: CalcState) {
  const type = projectTypes.find((item) => item.id === state.type) ?? projectTypes[0];
  const extraPages = type.pages ? Math.max(0, state.pageCount - pages.included) : 0;
  const extrasPrice = extras
    .filter((item) => state.extras.includes(item.id) && !item.hideFor.includes(type.id))
    .reduce((sum, item) => sum + item.price, 0);
  const factor = speeds.find((item) => item.id === state.speed)?.factor ?? 1;
  return Math.round((type.base + extraPages * pages.pricePerPage + extrasPrice) * factor);
}

export function calcSummary(state: CalcState) {
  const type = projectTypes.find((item) => item.id === state.type) ?? projectTypes[0];
  const parts = [type.label];
  if (type.pages) parts.push(`страниц: ${state.pageCount}`);
  extras
    .filter((item) => state.extras.includes(item.id) && !item.hideFor.includes(type.id))
    .forEach((item) => parts.push(item.label));
  parts.push(speeds.find((item) => item.id === state.speed)?.label ?? "");
  return parts.filter(Boolean).join(", ");
}

export const formatPrice = (value: number) =>
  `${value.toLocaleString("ru-RU")} ₽`;
