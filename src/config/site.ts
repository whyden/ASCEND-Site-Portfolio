// Main settings of the site. Change contacts and links here, in one place.

// TODO: replace with the real Telegram username, without the @ sign.
const TELEGRAM_USERNAME = "your_username";

export const site = {
  name: "ASCEND STUDIO",
  shortName: "ASCEND",
  descriptor: "Разработка высококонверсионных веб-систем и AI-автоматизация.",
  hours: "Пн–Вс: 09:00–21:00",
  telegram: TELEGRAM_USERNAME,
  telegramIsSet: TELEGRAM_USERNAME !== "your_username",
  telegramUrl: `https://t.me/${TELEGRAM_USERNAME}`,
  // Set NEXT_PUBLIC_SITE_URL when the domain is known.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Быстрые сайты на Next.js, интерактивные калькуляторы и AI Telegram-боты для бизнеса. Фиксированная стоимость под ключ, без подписок и скрытых платежей.",
};

export const nav = [
  { label: "Услуги", href: "/#services" },
  { label: "Почему мы", href: "/#why" },
  { label: "Процесс", href: "/#process" },
  { label: "Кейсы", href: "/cases" },
  { label: "Вопросы", href: "/#faq" },
] as const;
