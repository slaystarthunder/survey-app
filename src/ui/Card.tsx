// [S04] Added: Card primitive. Domain-agnostic.
// [V2.4] Extended: support className for print/layout control.

import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function Card({ children, style, className }: Props) {
  // /src/ui/Card.tsx
  const s: CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    boxShadow: "var(--shadow-1)",
  
    // ⬇ change this
    padding: "var(--s-5)", // was --s-4
  
    ...style,
  };
  


  return (
    <div className={className} style={s}>
      {children}
    </div>
  );
}
