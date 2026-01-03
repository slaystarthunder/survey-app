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
    cursor: rest.disabled ? "not-allowed" : "pointer",
    fontWeight: 650,
  
    opacity: rest.disabled ? 0.55 : 1,
    filter: rest.disabled ? "grayscale(10%)" : "none",
  
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
      disabled={disabled}
      style={{ ...base, ...style }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "none";
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "var(--focus)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    />
  );
}
