"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowUpRight } from "@/components/brand/Logo";
import { TransitionLink } from "@/components/fx/TransitionLink";
import { siteHost, type CaseStudy } from "@/data/cases";
import { prefersReducedMotion } from "@/lib/motion";
import { pauseScroll, resumeScroll } from "@/lib/scroll";
import { BrowserShot, CasePreview, PhoneShot } from "./CasePreview";

// The details of a case. The window grows out of the card that was clicked
// and closes with Escape, the "Закрыть" button or a click outside it.

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

type Props = { item: CaseStudy | null; from: DOMRect | null; onClose: () => void };

export function CaseDialog({ item, from, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);

  // Open as soon as a case is chosen, growing out of its card.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item || dialog.open) return;
    closingRef.current = false;
    dialog.showModal();
    dialog.scrollTop = 0;
    pauseScroll();
    if (!from || prefersReducedMotion()) return;
    const to = dialog.getBoundingClientRect();
    const scale = from.width / to.width;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    dialog.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.3 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 560, easing: EASE },
    );
  }, [item, from]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;
    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }
    dialog
      .animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.96)" }], {
        duration: 220,
        easing: "linear",
      })
      .finished.then(() => dialog.close())
      .catch(() => dialog.close());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };
    const onClosed = () => {
      resumeScroll();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClosed);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClosed);
    };
  }, [onClose, requestClose]);

  const host = item ? siteHost(item.url) : "";

  return (
    <dialog
      ref={dialogRef}
      className="case-dialog tone-dark"
      aria-labelledby="case-dialog-title"
      data-lenis-prevent=""
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      {item ? (
        <div className="cd-inner">
          <div className="cd-head">
            <span className="t-small soft">{item.niche}</span>
            <button type="button" className="cd-close" onClick={requestClose}>
              Закрыть
            </button>
          </div>

          {/* The site on a computer and on a phone, side by side. */}
          {item.shots ? (
            <div className={`cd-shots ${item.shots.phone ? "" : "is-single"}`}>
              <BrowserShot
                src={item.shots.desktop}
                host={host}
                alt={`${item.brand}: сайт на компьютере`}
                sizes="(min-width: 1200px) 860px, 74vw"
              />
              {item.shots.phone ? (
                <PhoneShot src={item.shots.phone} alt={`${item.brand}: сайт на телефоне`} sizes="(min-width: 1200px) 260px, 23vw" />
              ) : null}
            </div>
          ) : (
            <div className="cd-preview">
              <CasePreview item={item} sizes="(min-width: 1200px) 1160px, 96vw" />
            </div>
          )}

          <div className="cd-body">
            <h2 id="case-dialog-title" className="t-section cd-title">
              {item.title}
            </h2>
            <p className="cd-lead">{item.short}</p>

            <div className="cd-columns">
              <div>
                <h3 className="t-small soft">Задача</h3>
                <p>{item.task}</p>
              </div>
              <div>
                <h3 className="t-small soft">Что сделали</h3>
                <ul className="ticks">
                  {item.done.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="t-small soft">Срок</h3>
                <p className="cd-term">{item.term}</p>
                <h3 className="t-small soft cd-site-label">Сайт</h3>
                <a className="cd-site" href={item.url} target="_blank" rel="noreferrer">
                  {host}
                </a>
              </div>
            </div>

            <div className="cd-actions">
              <a className="btn btn-solid" href={item.url} target="_blank" rel="noreferrer">
                <span>Перейти на сайт</span>
                <ArrowUpRight className="btn-arrow" aria-hidden="true" />
              </a>
              <TransitionLink href="/#contact" className="btn" onClick={() => dialogRef.current?.close()}>
                <span>Обсудить похожий проект</span>
              </TransitionLink>
            </div>

            {item.shots?.more?.length ? (
              <div className="cd-more">
                <h3 className="t-small soft">Другие экраны сайта</h3>
                <div className="cd-more-grid">
                  {item.shots.more.map((src, index) => (
                    <BrowserShot
                      key={src}
                      src={src}
                      host={host}
                      alt={`${item.brand}: экран ${index + 2}`}
                      sizes="(min-width: 1200px) 560px, (min-width: 700px) 46vw, 92vw"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
