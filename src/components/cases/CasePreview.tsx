import Image from "next/image";
import { Mark } from "@/components/brand/Logo";
import { withBase } from "@/config/site";
import { siteHost, type CaseStudy } from "@/data/cases";

// Pictures of the cases: real screenshots of the sites, in a browser window or a phone.
// A case without screenshots gets a calm cover with its name.

const CARD_SIZES = "(min-width: 1100px) 31vw, (min-width: 700px) 47vw, 94vw";

// The preview of a card: the first screen of the site on a computer, or the cover.
export function CasePreview({ item, sizes = CARD_SIZES }: { item: CaseStudy; sizes?: string }) {
  if (item.shots) {
    return (
      <Image
        className="shot-img"
        src={withBase(item.shots.desktop)}
        alt={`${item.brand}: первый экран сайта`}
        fill
        sizes={sizes}
      />
    );
  }
  return (
    <div className="case-cover">
      <Mark className="case-cover-mark" aria-hidden="true" />
      <span className="case-cover-name">{item.brand}</span>
      <span className="case-cover-host">{siteHost(item.url)}</span>
    </div>
  );
}

// A screenshot in a browser window with the address of the site on top.
export function BrowserShot({ src, host, alt, sizes }: { src: string; host: string; alt: string; sizes: string }) {
  return (
    <figure className="shot-browser">
      <div className="shot-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{host}</span>
      </div>
      <div className="shot-frame">
        <Image className="shot-img" src={withBase(src)} alt={alt} fill sizes={sizes} />
      </div>
    </figure>
  );
}

// A screenshot in a phone.
export function PhoneShot({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <figure className="shot-phone">
      <div className="shot-frame">
        <Image className="shot-img" src={withBase(src)} alt={alt} fill sizes={sizes} />
      </div>
    </figure>
  );
}
