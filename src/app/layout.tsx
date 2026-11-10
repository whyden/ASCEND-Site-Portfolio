import type { Metadata, Viewport } from "next";
import { Jost, Manrope, Playfair_Display } from "next/font/google";
import "lenis/dist/lenis.css";
import { CalculatorDialog } from "@/components/forms/CalculatorDialog";
import { IntroGate } from "@/components/fx/IntroGate";
import { PageCurtain } from "@/components/fx/PageCurtain";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { Analytics } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { basePath, site } from "@/config/site";
import "./globals.css";

const jost = Jost({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

// The lettering of the covers of the beauty cases. Not preloaded: the browser takes it only where it is used.
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  // Only the domain: Next adds the folder of the site to the addresses by itself.
  metadataBase: new URL(new URL(site.url).origin),
  title: {
    default: `${site.name}: сайты на Next.js, калькуляторы и AI Telegram-боты`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
    title: `${site.name}: веб-системы, которые окупают рекламу`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

// Runs before first paint and decides whether the intro plays: only on the main page,
// once per session, and never with reduced motion. The timer is a safety net if scripts fail.
const INTRO_SCRIPT = `(function(){var d=document.documentElement,s="done";try{if((location.pathname==="${basePath}/"||location.pathname==="${basePath}")&&!location.hash&&sessionStorage.getItem("ascend-intro")!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches)s="play"}catch(e){}window.__ascendIntro=s;d.setAttribute("data-intro",s);if(s==="play")setTimeout(function(){if(window.__ascendIntro==="play"){window.__ascendIntro="done";d.setAttribute("data-intro","done")}},7000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${jost.variable} ${manrope.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}.w>span{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <IntroGate />
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
        <CalculatorDialog />
        <PageCurtain />
        <Analytics />
      </body>
    </html>
  );
}
