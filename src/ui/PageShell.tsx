// /src/ui/PageShell.tsx
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
};

export function PageShell({ children, maxWidth = 480, style }: Props) {
  return (
    <div
      style={{
        // Phone “safe inset” — prevents content touching screen edges
        paddingLeft: "max(var(--s-4), env(safe-area-inset-left))",
        paddingRight: "max(var(--s-4), env(safe-area-inset-right))",
        paddingTop: "var(--s-2)",
        minHeight: "100vh",

        ...style,
      }}
    >
      <div
        style={{
          maxWidth,
          margin: "0 auto",
          paddingTop: "var(--s-8)",
          paddingBottom: "var(--s-8)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
