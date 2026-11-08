import type { SVGProps } from "react";
import { LETTERS, MARK, WORD_WIDTH } from "@/lib/logo";

export function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} fill="currentColor" {...props}>
      <path d={MARK.long} />
      <path d={MARK.small} />
    </svg>
  );
}

export function Wordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 -2 ${WORD_WIDTH} 104`} fill="currentColor" {...props}>
      {LETTERS.map((letter) => (
        <path
          key={letter.key}
          fillRule="evenodd"
          transform={`translate(${letter.x} 0)`}
          d={letter.d}
        />
      ))}
    </svg>
  );
}

// A soft arrow to the upper right: the link opens another page or another site.
export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 11.5L11.5 4.5M6 4.5H11.5V10" />
    </svg>
  );
}

// A soft arrow pointing up. Rotate it with CSS for other directions.
export function Chevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 10.5L8 5.5L13 10.5" />
    </svg>
  );
}
