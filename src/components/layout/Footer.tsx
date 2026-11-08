import { Wordmark } from "@/components/brand/Logo";
import { Reveal } from "@/components/fx/Reveal";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="footer tone-dark sheet">
      <div className="wrap footer-top">
        <p className="footer-descriptor">{site.descriptor}</p>
        <div className="footer-contacts">
          <p>
            Telegram:{" "}
            <a href={site.telegramUrl} target="_blank" rel="noreferrer">
              @{site.telegram}
            </a>
          </p>
          <p>{site.hours}</p>
        </div>
      </div>
      <Reveal className="wrap footer-word">
        <Wordmark aria-label={site.shortName} role="img" />
      </Reveal>
      <div className="wrap footer-bottom">
        <p>© 2026 {site.name}. Все права защищены.</p>
      </div>
    </footer>
  );
}
