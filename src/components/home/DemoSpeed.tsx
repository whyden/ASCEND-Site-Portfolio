import { Mark } from "@/components/brand/Logo";
import { Glass } from "@/components/fx/Glass";
import { PhoneScreen } from "./PhoneScreen";

// Scene for the card about sites: a page, its phone version and a race of two loading bars.
export function DemoSpeed() {
  return (
    <>
      <Glass light={false} className="sc-mock glass-inner" depth={0.7} max={6} aria-hidden="true">
        <div className="sc-bar">
          <i />
          <i />
          <i />
          <span>ваш-сайт.ru</span>
        </div>
        <div className="sc-page">
          <div className="sc-hero">
            <Mark />
            <b>Название вашей компании</b>
            <p>Главное предложение для ваших клиентов</p>
            <em>Оставить заявку</em>
          </div>
          <div className="sc-row">
            <i />
            <i />
            <i />
          </div>
        </div>
      </Glass>

      <Glass light={false} className="sc-race glass-inner" depth={1.7} max={8}>
        <p>
          Сайт на чистом коде <b>до 1 с</b>
        </p>
        <span className="sc-track is-fast">
          <i />
        </span>
        <p className="soft">
          Шаблон на конструкторе <b>3–5 с</b>
        </p>
        <span className="sc-track">
          <i />
        </span>
      </Glass>

      <Glass light={false} className="sc-phone glass-inner" depth={2.2} max={10} aria-hidden="true">
        <PhoneScreen />
      </Glass>
    </>
  );
}
