// [S04] Added: Text + Heading primitives. Domain-agnostic.

import type { CSSProperties, HTMLAttributes } from "react";

/* ------------------------------------------------------------
 * Text
 * ------------------------------------------------------------ */

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
  mono?: boolean;
};

export function Text({ muted, mono, style, ...rest }: TextProps) {
  const base: CSSProperties = {
    margin: 0,
    color: muted ? "var(--muted)" : "var(--fg)",
    fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
    fontSize: 14,
  };

  return <p {...rest} style={{ ...base, ...style }} />;
}

/* ------------------------------------------------------------
 * Heading
 * ------------------------------------------------------------ */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

const HEADING_TAG: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

export function Heading({ level = 1, style, ...rest }: HeadingProps) {
  const Tag = HEADING_TAG[level];

  const base: CSSProperties = {
    margin: 0,

    // Brand color for headings
    color: "var(--primary)",

    fontFamily: "var(--font-sans)",
    fontWeight: 800,

    fontSize:
      level === 1
        ? "2.2rem"
        : level === 2
        ? "1.6rem"
        : level === 3
        ? "1.3rem"
        : level === 4
        ? "1.1rem"
        : "1rem",
  };

  return <Tag {...rest} style={{ ...base, ...style }} />;
}
