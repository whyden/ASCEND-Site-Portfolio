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
npm start
```

## Что где менять

| Что | Где |
|---|---|
| Ник в Telegram, часы работы, меню | `src/config/site.ts` |
| Все тексты главной | `src/data/content.ts` |
| Кейсы: добавить или поправить | `src/data/cases.ts` |
| Картинка кейса | `src/components/cases/CasePreview.tsx` |
| Цены в калькуляторе | `src/data/calculator.ts` |
| Цвета и анимации | `src/app/globals.css` |
| Живой фон (логотип в дыму) | `src/components/fx/Smoke.tsx` |
| Блоки на первом экране | `src/components/home/HeroTiles.tsx` |
| Насколько блоки наклоняются за курсором | `src/lib/pointer.ts` |
| Сцены в карточках услуг | `src/components/home/DemoSpeed.tsx`, `DemoCalc.tsx`, `DemoBot.tsx` |
| Блок «Как мы работаем» | `src/components/home/Process.tsx` |
| Заставка | `src/components/fx/Intro.tsx` |
| Курсор: стрелка и кольцо | `src/components/fx/Cursor.tsx` |

## Заявки

Формы отправляют заявки в Telegram через `src/app/api/lead/route.ts`. Нужны настройки из `.env.example`: скопируйте его в `.env.local` и заполните. Пока их нет, форма честно сообщает, что не подключена, и заявка не теряется молча.

## Перед запуском в интернет

- Указать настоящий ник в `src/config/site.ts`.
- Заменить черновики кейсов и их картинки, убрать `draft: true`.
- Поставить настоящие цены и `PRICES_ARE_DRAFT = false`.
- Заполнить `.env.local`: адрес сайта, токен бота, чат, счётчик Метрики.
- Добавить страницу политики обработки персональных данных и ссылку на неё у формы.
