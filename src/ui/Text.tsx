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
    lineHeight: 1.45,
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

export function Heading({ level = 1, style, ...rest }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const base: CSSProperties = {
    margin: 0,

    /* 👇 Primary brand color for headings */
    color: "var(--primary)",

    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    lineHeight: 1.2,

    /* Size scale */
    fontSize:
      level === 1 ? "2rem" :
      level === 2 ? "1.6rem" :
      level === 3 ? "1.3rem" :
      level === 4 ? "1.1rem" :
      "1rem",
  };

  return <Tag {...rest} style={{ ...base, ...style }} />;
}
