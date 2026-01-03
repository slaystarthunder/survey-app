// /src/ui/PageShell.tsx
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
};

export function PageShell({ children, maxWidth = 480, style }: Props) {
  const s: CSSProperties = {
    maxWidth,
    margin: "0 auto",
    padding: "var(--s-8) var(--s-4)", // more vertical air (closer to mock)
    minHeight: "100vh",
    ...style,
  };

  return <div style={s}>{children}</div>;
}
