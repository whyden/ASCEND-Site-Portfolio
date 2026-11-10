import type { CaseStudy } from "@/data/cases";
import { CasePreview } from "./CasePreview";

// The picture on the card of a case: not a screenshot but a small cover in the style of the client's site,
// with its name, its colours and its own lettering. The screenshots wait in the window with the details.
// A case without a cover of its own shows its screenshot or the plain cover instead.

function Tatuazh() {
  return (
    <div className="cv cv-tatuazh" aria-hidden="true">
      <span className="cv-eyebrow">Студия красоты · Казань</span>
      <p className="cv-name">
        Татуаж-ПМ <em>студия</em>
      </p>
      <svg className="cv-swash" viewBox="0 0 340 44" preserveAspectRatio="none">
        <path d="M3 34C58 8 128 8 188 22S296 40 337 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="cv-pill">Позвонить мастеру</span>
    </div>
  );
}

function Almari() {
  return (
    <div className="cv cv-almari" aria-hidden="true">
      <span className="cv-tag">Липецк</span>
      <p className="cv-name">Алмари</p>
      <span className="cv-eyebrow">Дом красоты</span>
      <span className="cv-rule" />
      <span className="cv-pill">Записаться онлайн</span>
    </div>
  );
}

function Taranova() {
  return (
    <div className="cv cv-taranova" aria-hidden="true">
      <span className="cv-eyebrow">Студия перманентного макияжа</span>
      <p className="cv-name">TARANOVA</p>
      <span className="cv-sub">PERMANENT</span>
      <span className="cv-pill">Записаться онлайн</span>
    </div>
  );
}

const covers = {
  tatuazh: Tatuazh,
  almari: Almari,
  taranova: Taranova,
};

export function CaseCover({ item }: { item: CaseStudy }) {
  const Cover = item.cover ? covers[item.cover] : null;
  return Cover ? <Cover /> : <CasePreview item={item} />;
}
