// Main settings of the site. Change contacts and links here, in one place.

const TELEGRAM_USERNAME = "Alxndrweb";

// The folder the site lives in. Empty on an own domain, the repository name on GitHub Pages.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The address of a file from the public folder, or of a page, with that folder in front.
export const withBase = (path: string) => `${basePath}${path}`;

export const site = {
  name: "ASCEND STUDIO",
  shortName: "ASCEND",
  descriptor: "Разработка высококонверсионных веб-систем и AI-автоматизация.",
  hours: "Пн–Вс: 09:00–21:00",
  telegram: TELEGRAM_USERNAME,
  telegramUrl: `https://t.me/${TELEGRAM_USERNAME}`,
  // Set NEXT_PUBLIC_SITE_URL when the domain is known.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Быстрые сайты на Next.js, интерактивные калькуляторы и AI Telegram-боты для бизнеса. Фиксированная стоимость под ключ, без подписок и скрытых платежей.",
};

// The address of a page without the slash at the end: "/cases/" and "/cases" are the same page.
export const pagePath = (path: string) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

export const nav = [
  { label: "Услуги", href: "/#services" },
  { label: "Почему мы", href: "/#why" },
  { label: "Процесс", href: "/#process" },
  { label: "Кейсы", href: "/cases" },
  { label: "Вопросы", href: "/#faq" },
] as const;
