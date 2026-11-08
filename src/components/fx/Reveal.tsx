"use client";

import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

// Marks an element with .is-in once it scrolls into view. The motion itself lives in globals.css.
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("is-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: ReactNode;
};

// A block rises and appears.
export function Reveal({ as = "div", className = "", delay = 0, children }: RevealProps) {
  const ref = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `rv ${className}`,
      style: { "--delay": `${delay}ms` } as CSSProperties,
    },
    children,
  );
}

type RevealWordsProps = {
  as?: ElementType;
  className?: string;
  text: string;
};

// A heading: each word rises from behind its own edge.
export function RevealWords({ as = "h2", className = "", text }: RevealWordsProps) {
  const ref = useInView<HTMLElement>();
  const words = text.split(" ");
  return createElement(
    as,
    { ref, className: `rv-words ${className}` },
    words.map((word, index) => (
      <Fragment key={`${word}-${index}`}>
        <span className="w">
          <span style={{ "--i": index } as CSSProperties}>{word}</span>
        </span>
        {index < words.length - 1 ? " " : ""}
      </Fragment>
    )),
  );
}
