"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  calcPrice,
  calcSummary,
  extras,
  formatPrice,
  initialCalc,
  pages,
  PRICES_ARE_DRAFT,
  projectTypes,
  speeds,
  type CalcState,
} from "@/data/calculator";
import { prefersReducedMotion } from "@/lib/motion";
import { pauseScroll, resumeScroll } from "@/lib/scroll";
import { OPEN_CALC_EVENT } from "./CalcButton";
import { TelegramMessage } from "./TelegramMessage";

// The number runs to its new value.
function AnimatedPrice({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const from = shown.current;
    if (from === value || prefersReducedMotion()) {
      shown.current = value;
      element.textContent = formatPrice(value);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 520);
      const eased = 1 - Math.pow(1 - t, 3);
      shown.current = Math.round((from + (value - from) * eased) / 100) * 100;
      element.textContent = formatPrice(shown.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <strong ref={ref}>{formatPrice(value)}</strong>;
}

export function CalculatorDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<CalcState>(initialCalc);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const open = () => {
      dialog.showModal();
      pauseScroll();
    };
    const onClose = () => resumeScroll();
    window.addEventListener(OPEN_CALC_EVENT, open);
    dialog.addEventListener("close", onClose);
    return () => {
      window.removeEventListener(OPEN_CALC_EVENT, open);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  const type = projectTypes.find((item) => item.id === state.type) ?? projectTypes[0];
  const price = calcPrice(state);

  const toggleExtra = (id: string) =>
    setState((value) => ({
      ...value,
      extras: value.extras.includes(id)
        ? value.extras.filter((item) => item !== id)
        : [...value.extras, id],
    }));

  return (
    <dialog
      ref={dialogRef}
      className="calc tone-dark"
      aria-labelledby="calc-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="calc-inner">
        <button type="button" className="calc-close" onClick={() => dialogRef.current?.close()}>
          Закрыть
        </button>

        <div className="calc-options">
          <h2 id="calc-title" className="t-section">
            Рассчитать стоимость проекта
          </h2>

          <fieldset>
            <legend>Что нужно сделать</legend>
            <div className="chips">
              {projectTypes.map((item) => (
                <label key={item.id} className="chip">
                  <input
                    type="radio"
                    name="calc-type"
                    checked={state.type === item.id}
                    onChange={() => setState((value) => ({ ...value, type: item.id }))}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {type.pages ? (
            <fieldset>
              <legend>
                Сколько страниц <strong>{state.pageCount}</strong>
              </legend>
              <input
                type="range"
                aria-label="Количество страниц"
                min={1}
                max={pages.max}
                value={state.pageCount}
                style={{ "--fill": `${((state.pageCount - 1) / (pages.max - 1)) * 100}%` } as CSSProperties}
                onChange={(event) =>
                  setState((value) => ({ ...value, pageCount: Number(event.target.value) }))
                }
              />
            </fieldset>
          ) : null}

          <fieldset>
            <legend>Что добавить</legend>
            <div className="chips">
              {extras
                .filter((item) => !item.hideFor.includes(type.id))
                .map((item) => (
                  <label key={item.id} className="chip">
                    <input
                      type="checkbox"
                      checked={state.extras.includes(item.id)}
                      onChange={() => toggleExtra(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Сроки</legend>
            <div className="chips">
              {speeds.map((item) => (
                <label key={item.id} className="chip">
                  <input
                    type="radio"
                    name="calc-speed"
                    checked={state.speed === item.id}
                    onChange={() => setState((value) => ({ ...value, speed: item.id }))}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="calc-result">
          <div className="calc-total">
            <p className="t-small soft">Примерная стоимость</p>
            <AnimatedPrice value={price} />
            {PRICES_ARE_DRAFT ? <p className="calc-draft">Цены пока условные</p> : null}
          </div>

          <TelegramMessage
            text={`Здравствуйте! Хочу обсудить проект из калькулятора на сайте.\n\nПроект: ${calcSummary(state)}\nПримерная стоимость: ${formatPrice(price)}`}
          />
        </aside>
      </div>
    </dialog>
  );
}
