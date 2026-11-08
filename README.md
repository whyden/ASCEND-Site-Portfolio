# Сайт студии ASCEND

Next.js + Tailwind CSS. Две страницы: главная и кейсы.

## Запуск

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000. Заставка показывается один раз за сеанс браузера: чтобы увидеть её снова, откройте новую вкладку в режиме инкогнито.

Проверка перед публикацией:

```bash
npm run lint
npm run build
```

Сборка кладёт готовый сайт в папку `out`: это обычные файлы, сервер им не нужен.

Посмотреть собранный сайт на своём компьютере: `npm run preview`, адрес http://localhost:3001.

## Что где менять

| Что | Где |
|---|---|
| Ник в Telegram, часы работы, меню | `src/config/site.ts` |
| Все тексты главной | `src/data/content.ts` |
| Кейсы: добавить или поправить | `src/data/cases.ts` |
| Скриншоты кейсов | `public/cases/`, пути в `src/data/cases.ts` |
| Цены в калькуляторе | `src/data/calculator.ts` |
| Цвета и анимации | `src/app/globals.css` |
| Живой фон (логотип в дыму) | `src/components/fx/Smoke.tsx` |
| Первый экран и полёт в логотип | `src/components/home/HeroScene.tsx` |
| Насколько блоки наклоняются за курсором | `src/lib/pointer.ts` |
| Сцены в карточках услуг | `src/components/home/DemoSpeed.tsx`, `DemoCalc.tsx`, `DemoBot.tsx` |
| Блок «Как мы работаем» | `src/components/home/Process.tsx` |
| Заставка | `src/components/fx/Intro.tsx` |
| Вопросы анкеты | `src/data/brief.ts` |

## Заявки

На сайте нет сервера, поэтому заявки никуда не отправляются автоматически. Анкета на последнем экране и калькулятор собирают готовый текст, посетитель копирует его и пишет нам в Telegram. Вопросы анкеты лежат в `src/data/brief.ts`, ник в Telegram в `src/config/site.ts`.

## Публикация на GitHub Pages

Один раз настроить в репозитории на GitHub:

1. Settings → General → Danger Zone → Change visibility → Public. На бесплатном аккаунте Pages работает только с открытыми репозиториями.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Дальше каждый `git push` в ветку `main` сам собирает и публикует сайт за 1–2 минуты (файл `.github/workflows/deploy.yml`). Ход сборки виден на вкладке Actions. Адрес: `https://<аккаунт>.github.io/<репозиторий>/`.

Свой домен: Settings → Pages → Custom domain, у регистратора прописать записи, которые покажет GitHub. В `deploy.yml` убрать `NEXT_PUBLIC_BASE_PATH` и указать домен в `NEXT_PUBLIC_SITE_URL`.

## Перед запуском в интернет

- Поставить настоящие цены и `PRICES_ARE_DRAFT = false` в `src/data/calculator.ts`.
- Добавить номер счётчика Метрики (`NEXT_PUBLIC_YM_ID` в настройках сборки).
