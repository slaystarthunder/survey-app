// [S04] Added: PageShell primitive to constrain width and provide consistent padding.

import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
};

export function PageShell({ children, maxWidth = 980, style }: Props) {
  const s: CSSProperties = {
    maxWidth,
    margin: "0 auto",
    padding: "var(--s-6) var(--s-4)",
    ...style,
  };

  return <div style={s}>{children}</div>;
}
