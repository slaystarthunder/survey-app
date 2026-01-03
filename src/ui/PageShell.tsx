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
        // Phone “safe inset” — prevents cards touching screen edges
        paddingLeft: "var(--s-4)",
        paddingRight: "var(--s-4)",
        paddingTop: "var(--s-2)",

        // Optional future-proofing for iOS safe areas
        paddingLeft: "max(var(--s-4), env(safe-area-inset-left))",
        paddingRight: "max(var(--s-4), env(safe-area-inset-right))",

        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth,
          margin: "0 auto",

          // Vertical rhythm (as you already had)
          paddingTop: "var(--s-8)",
          paddingBottom: "var(--s-8)",

          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
