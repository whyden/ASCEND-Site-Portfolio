import { Mark } from "@/components/brand/Logo";

// The screen of a phone with a small version of a client's site.
// Sizes are in cqw, so it fits any phone frame it is put in.
export function PhoneScreen() {
  return (
    <div className="ph" aria-hidden="true">
      <div className="ph-status">
        <span>9:41</span>
        <i />
      </div>
      <div className="ph-nav">
        <Mark />
        <span>Меню</span>
      </div>
      <div className="ph-hero">
        <b>Название вашей компании</b>
        <span>Главное предложение для клиентов</span>
        <em>Оставить заявку</em>
      </div>
      <div className="ph-row">
        <span>Услуги</span>
        <span>Цены</span>
      </div>
      <div className="ph-toast">
        <i />
        Заявка отправлена
      </div>
    </div>
  );
}
