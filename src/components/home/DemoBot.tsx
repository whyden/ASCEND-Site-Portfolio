"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/Logo";
import { Glass } from "@/components/fx/Glass";
import { prefersReducedMotion } from "@/lib/motion";

// Scene for the card about bots: the bot types, answers and hands over a ready request.
// The dialogue fits any business on purpose.

const MESSAGES = [
  { from: "client", text: "Здравствуйте! Сколько стоит ваша услуга?" },
  { from: "bot", text: "Добрый день! Подскажу. Какая у вас задача и какие сроки?" },
  { from: "client", text: "Нужно успеть к концу месяца." },
  { from: "bot", text: "Успеем. Оставьте телефон, менеджер свяжется сегодня." },
];

const TYPING_MS = 1000;
const READING_MS = 1100;
const HOLD_MS = 3800;

export function DemoBot() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(MESSAGES.length);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    let alive = true;
    let visible = false;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(element);

    const play = async () => {
      while (alive) {
        if (!visible) {
          await wait(400);
          continue;
        }
        setShown(0);
        await wait(500);
        for (let index = 0; alive && index < MESSAGES.length; index += 1) {
          if (MESSAGES[index].from === "bot") {
            setTyping(true);
            await wait(TYPING_MS);
            setTyping(false);
          }
          setShown(index + 1);
          await wait(READING_MS);
        }
        await wait(HOLD_MS);
      }
    };
    play();

    return () => {
      alive = false;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Glass light={false} className="sc-chat glass-inner" depth={0.7} max={5}>
        <div className="sc-chat-head">
          <i>
            <Mark aria-hidden="true" />
          </i>
          Бот-консультант
          <small>Отвечает сразу</small>
        </div>
        <div ref={ref} className="sc-chat-body" aria-live="off">
          {MESSAGES.map((message, index) => (
            <p
              key={message.text}
              className={`sc-msg is-${message.from} ${index < shown ? "is-shown" : ""}`}
            >
              {message.text}
            </p>
          ))}
          <p className={`sc-typing ${typing ? "is-on" : ""}`} aria-hidden="true">
            <i />
            <i />
            <i />
          </p>
        </div>
      </Glass>

      <Glass
        light={false}
        className={`sc-chat-lead glass-inner ${shown === MESSAGES.length ? "is-on" : ""}`}
        depth={2}
        max={9}
      >
        <small>Telegram, только что</small>
        <b>Новая заявка</b>
        <span>Задача, сроки и телефон клиента</span>
      </Glass>

      <Glass light={false} className="sc-always glass-inner" depth={1.5} max={9}>
        <b>24/7</b>
        <small>без выходных</small>
      </Glass>
    </>
  );
}
