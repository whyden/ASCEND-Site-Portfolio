"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Mark, Wordmark } from "@/components/brand/Logo";
import { TransitionLink } from "@/components/fx/TransitionLink";
import { nav, pagePath } from "@/config/site";

const CASES = "/cases";

export function Header() {
  const pathname = pagePath(usePathname());
  const [open, setOpen] = useState(false);

  // The menu is a small window: it closes on Escape and on a tap anywhere outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("#mobile-menu, .header-burger")) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* The header is always dark glass and always on screen.
          The cases have their own page, so their link is a button with an arrow, next to the request button. */}
      <header className="site-header" data-menu={open}>
        <div className="header-bar">
          <TransitionLink href="/" className="header-logo" aria-label="ASCEND, на главную" onClick={close}>
            <Mark className="header-mark" data-header-mark="" />
            <Wordmark className="header-word" />
          </TransitionLink>

          <nav className="header-nav" aria-label="Основное меню">
            {nav
              .filter((item) => item.href !== CASES)
              .map((item) => (
                <TransitionLink key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </TransitionLink>
              ))}
            <TransitionLink
              href={CASES}
              className="btn header-cta header-cases"
              aria-current={pathname === CASES ? "page" : undefined}
            >
              <span>Кейсы</span>
              <ArrowUpRight className="header-arrow" aria-hidden="true" />
            </TransitionLink>
            <TransitionLink href="/#contact" className="btn header-cta">
              <span>Оставить заявку</span>
            </TransitionLink>
          </nav>

          <button
            type="button"
            className="header-burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Закрыть" : "Меню"}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${open ? "is-open" : ""}`} inert={!open}>
        <nav aria-label="Мобильное меню" className="menu-nav">
          {nav.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={item.href === CASES && pathname === CASES ? "page" : undefined}
            >
              {item.label}
              {item.href === CASES ? <ArrowUpRight className="menu-arrow" aria-hidden="true" /> : null}
            </TransitionLink>
          ))}
        </nav>
        <TransitionLink href="/#contact" className="btn btn-solid menu-cta" onClick={close}>
          <span>Оставить заявку</span>
        </TransitionLink>
      </div>
    </>
  );
}
