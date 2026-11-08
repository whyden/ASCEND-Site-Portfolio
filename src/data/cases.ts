// Portfolio. Add a new object here and its card appears on the site, three cards per page.
// Empty places in the last row are filled with an invitation: "Здесь может быть ваш сайт".
//
// shots: screenshots in public/cases/<folder>/. "desktop" is the first screen on a computer, 1440×900,
// "phone" the first screen on a phone, 390×844, "more" a few other screens of the site.
// Without shots the card shows a calm cover with the name of the project.

export type CaseShots = {
  desktop: string;
  phone?: string;
  more?: string[];
};

export type CaseStudy = {
  slug: string;
  /** What we made, the name of the card. */
  title: string;
  /** Who it is for, shown on the cover when there are no screenshots yet. */
  brand: string;
  niche: string;
  short: string;
  task: string;
  done: string[];
  term: string;
  url: string;
  shots?: CaseShots;
};

export const cases: CaseStudy[] = [
  {
    slug: "tatuazh-kazan",
    title: "Сайт-визитка для салона красоты",
    brand: "Татуаж-ПМ студия",
    niche: "Красота · Казань",
    short: "Аккуратный современный сайт, с которого клиент в один клик связывается с салоном.",
    task: "Клиенту требовался аккуратный и современный сайт для демонстрации услуг. Главная цель: чтобы потенциальные клиенты могли ознакомиться с услугами и в один клик связаться с салоном.",
    done: [
      "Чистый адаптивный дизайн: сайт идеально отображается на любых смартфонах и компьютерах",
      "Кликабельные кнопки для быстрой связи через WhatsApp и Telegram",
      "Домен и хостинг зарегистрированы на данные клиента, установлен SSL-сертификат (HTTPS)",
      "Сайт привязан к карточке компании в Яндекс Картах для привлечения местного трафика",
    ],
    term: "3 дня",
    url: "https://tatuazh-kazan.ru",
    shots: {
      desktop: "/cases/tatuazh/first-screen.webp",
      phone: "/cases/tatuazh/phone-master.webp",
      more: ["/cases/tatuazh/services.webp", "/cases/tatuazh/contacts.webp"],
    },
  },
  {
    slug: "almari",
    title: "Продающий сайт для студии красоты «ALMARI»",
    brand: "ALMARI",
    niche: "Красота · Липецк",
    short: "Многоблочный сайт с услугами, прайсом, работами до и после и быстрой записью.",
    task: "Сделать для студии стильный, полноценный многоблочный сайт для привлечения клиентов. Важно было не просто сделать визитку, а наглядно презентовать услуги, прайс, примеры работ и дать клиенту возможность быстро и легко записаться.",
    done: [
      "Индивидуальная структура и приятный чистый дизайн в стилистике студии с полной адаптацией под мобильные устройства",
      "Каталог услуг и прайс: описания процедур, цены, галерея работ студии и интерактивные примеры до и после",
      "Прямая связь и быстрая онлайн-запись через мессенджеры",
      "Быстрый бесплатный хостинг и защищённый SSL-сертификат",
      "Сайт подготовлен к привязке в Яндекс Картах и 2ГИС для сбора горячего трафика",
    ],
    term: "3 дня",
    url: "https://almarilipetsk.ru",
    // Taken from the copy of the site at almari-amber.vercel.app: the .ru address does not open from here.
    shots: {
      desktop: "/cases/almari/desktop.webp",
      phone: "/cases/almari/phone.webp",
      more: [
        "/cases/almari/desktop-2.webp",
        "/cases/almari/desktop-3.webp",
        "/cases/almari/desktop-4.webp",
        "/cases/almari/desktop-5.webp",
      ],
    },
  },
];

export function getCase(slug: string) {
  return cases.find((item) => item.slug === slug);
}

export function getNextCase(slug: string) {
  const index = cases.findIndex((item) => item.slug === slug);
  return cases[(index + 1) % cases.length];
}

// The address of a site without "https://", for captions.
export function siteHost(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
