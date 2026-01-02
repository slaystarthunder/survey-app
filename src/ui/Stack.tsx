// [S04] Added: Stack primitive (layout). Domain-agnostic.

import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: number;
  direction?: "row" | "column";
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
  style?: CSSProperties;
};

export function Stack({
  children,
  gap = 12,
  direction = "column",
  align,
  justify,
  wrap,
  style,
}: Props) {
  const s: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    ...style,
  };

  return <div style={s}>{children}</div>;
}
