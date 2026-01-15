// /src/ui/Button.tsx
import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function Button({ variant = "solid", style, disabled, ...rest }: Props) {
  const isSolid = variant === "solid";

  const base: CSSProperties = {
    borderRadius: "var(--r-md)",
    padding: "10px 12px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 650,
    opacity: disabled ? 0.55 : 1,
    filter: disabled ? "grayscale(10%)" : "none",
    border: isSolid ? "1px solid transparent" : "1px solid var(--border)",
    background: isSolid ? "var(--accent)" : "transparent",
    color: isSolid ? "#fff" : "var(--fg)",
  };

  return <button {...rest} disabled={disabled} style={{ ...base, ...style }} />;
}
