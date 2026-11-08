// The questionnaire on the last screen. Edit the questions here, the form and the message follow.
// "one": a single choice, "many": several choices, "text": a free line.
// "line" is the name of the answer in the message that goes to Telegram.

export type BriefQuestion =
  | { id: string; kind: "one" | "many"; title: string; line: string; options: string[] }
  | { id: string; kind: "text"; title: string; line: string };

export const briefQuestions: BriefQuestion[] = [
  {
    id: "need",
    kind: "many",
    title: "Что нужно сделать",
    line: "Что нужно",
    options: [
      "Лендинг",
      "Многостраничный сайт",
      "Калькулятор стоимости",
      "Telegram-бот",
      "AI-бот для клиентов",
      "Пока не знаю, нужен совет",
    ],
  },
  { id: "business", kind: "text", title: "Сфера бизнеса", line: "Сфера бизнеса" },
  {
    id: "goal",
    kind: "many",
    title: "Что важнее всего",
    line: "Главная цель",
    options: ["Больше заявок", "Окупить рекламу", "Показать услуги и цены", "Онлайн-запись", "Разгрузить менеджеров"],
  },
  {
    id: "current",
    kind: "one",
    title: "Сайт сейчас",
    line: "Сайт сейчас",
    options: ["Сайта нет", "Есть, нужно переделать", "Есть, нужно дополнить"],
  },
  {
    id: "time",
    kind: "one",
    title: "Когда нужно запустить",
    line: "Сроки",
    options: ["Как можно скорее", "В течение месяца", "Сроки не горят"],
  },
  { id: "name", kind: "text", title: "Как к вам обращаться", line: "Имя" },
];

export type BriefAnswers = Record<string, string[]>;

// The message built from the answers. Unanswered questions are left out.
export function briefMessage(answers: BriefAnswers) {
  const rows = briefQuestions
    .filter((question) => question.id !== "name")
    .map((question) => {
      const value = (answers[question.id] ?? []).map((item) => item.trim()).filter(Boolean);
      return value.length ? `${question.line}: ${value.join(", ")}` : "";
    })
    .filter(Boolean);
  const name = answers.name?.[0]?.trim();
  const hello = name ? `Здравствуйте! Меня зовут ${name}. Хочу обсудить проект.` : "Здравствуйте! Хочу обсудить проект.";
  return rows.length ? `${hello}\n\n${rows.join("\n")}` : hello;
}
