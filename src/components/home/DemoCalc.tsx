"use client";

import { useState, type CSSProperties } from "react";
import { Glass } from "@/components/fx/Glass";
import { formatPrice } from "@/data/calculator";

// Scene for the card about calculators: a working example that fits any business,
// and the request that would reach the owner, updated as you change the numbers.
// The numbers are invented for the example and marked as such on the screen.

const packs = [
  { id: "basic", label: "Базовый", rate: 6000 },
  { id: "standard", label: "Стандарт", rate: 12000 },
  { id: "premium", label: "Премиум", rate: 20000 },
];

const VOLUME_MIN = 1;
const VOLUME_MAX = 20;
const URGENT_RATE = 1.3;

function units(count: number) {
  const tens = count % 100;
  const ones = count % 10;
  if (tens > 10 && tens < 20) return `${count} единиц`;
  if (ones === 1) return `${count} единица`;
  if (ones > 1 && ones < 5) return `${count} единицы`;
  return `${count} единиц`;
}

export function DemoCalc() {
  const [packIndex, setPackIndex] = useState(1);
  const [volume, setVolume] = useState(8);
  const [urgent, setUrgent] = useState(false);

  const pack = packs[packIndex];
  const price = Math.round(volume * pack.rate * (urgent ? URGENT_RATE : 1));
  const fill = ((volume - VOLUME_MIN) / (VOLUME_MAX - VOLUME_MIN)) * 100;

  return (
    <>
      <Glass light={false} className="sc-calc glass-inner" depth={0.7} max={5}>
        <p className="t-small soft">Покрутите: цифры для примера</p>

        <div
          className="sc-seg"
          role="group"
          aria-label="Пакет"
          style={{ "--at": packIndex } as CSSProperties}
        >
          <span className="sc-seg-cap" />
          {packs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === packIndex}
              onClick={() => setPackIndex(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="sc-field" htmlFor="demo-volume">
          <span>Объём работ</span>
          <strong>{units(volume)}</strong>
        </label>
        <input
          id="demo-volume"
          type="range"
          min={VOLUME_MIN}
          max={VOLUME_MAX}
          step={1}
          value={volume}
          style={{ "--fill": `${fill.toFixed(1)}%` } as CSSProperties}
          onChange={(event) => setVolume(Number(event.target.value))}
        />

        <label className="sc-switch">
          <span>Срочно</span>
          <input
            type="checkbox"
            checked={urgent}
            onChange={(event) => setUrgent(event.target.checked)}
          />
          <i />
        </label>

        <div className="sc-total">
          <span className="t-small soft">Примерная стоимость</span>
          <strong>{formatPrice(price)}</strong>
        </div>
      </Glass>

      <Glass light={false} className="sc-lead glass-inner" depth={2} max={9}>
        <small>Заявка с расчётом</small>
        <b>
          {pack.label}, {units(volume)}
        </b>
        <span>
          {formatPrice(price)}, {urgent ? "срочно" : "обычные сроки"}
        </span>
      </Glass>
    </>
  );
}
