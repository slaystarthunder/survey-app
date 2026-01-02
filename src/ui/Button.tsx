// [S04] Added: Button primitive. Domain-agnostic.

import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function Button({ variant = "solid", style, ...rest }: Props) {
  const isSolid = variant === "solid";

  const base: CSSProperties = {
    borderRadius: "var(--r-md)",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 650,

    /* Colors & borders */
    border: isSolid
      ? "1px solid transparent"
      : "1px solid var(--btn-ghost-border)",

    background: isSolid
      ? "var(--btn-solid-bg)"
      : "transparent",

    color: isSolid
      ? "var(--btn-solid-fg)"
      : "var(--btn-ghost-fg)",
  };

  return (
    <button
      {...rest}
      style={{ ...base, ...style }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "var(--focus)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}
