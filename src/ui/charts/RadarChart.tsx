// [S07] Added: Radar (spider) chart as pure SVG. Domain-agnostic.
// [V2.4-A] Fix: prevent label clipping + wrap long labels.
// [V2.4-B] Fix: defensive guards when axes/max are missing.

import type { CSSProperties } from "react";

type Axis = {
  label: string;
  value: number; // 0..max
};

type Props = {
  axes: Axis[];
  max: number; // e.g. 10
  size?: number; // px
  rings?: number; // number of grid rings
  style?: CSSProperties;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function wrapLabel(label: string, maxCharsPerLine = 14): string[] {
  const s = label.trim();
  if (s.length <= maxCharsPerLine) return [s];

  // Prefer splitting on spaces, then on "/" if needed.
  const parts = s.includes(" ") ? s.split(" ") : s.split("/").flatMap((p) => [p, "/"]).slice(0, -1);

  const lines: string[] = [];
  let current = "";

  for (const part of parts) {
    const next = current ? `${current}${part === "/" ? "" : " "}${part}` : part;
    if (next.length <= maxCharsPerLine) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = part === "/" ? part : part;
      if (lines.length === 1) break; // keep to max 2 lines
    }
  }
  if (current && lines.length < 2) lines.push(current);

  // If still too long, truncate the second line.
  if (lines.length === 2 && lines[1].length > maxCharsPerLine) {
    lines[1] = lines[1].slice(0, Math.max(0, maxCharsPerLine - 1)) + "…";
  }

  // Hard fallback: split into two chunks.
  if (lines.length === 1) {
    const a = s.slice(0, maxCharsPerLine);
    const b = s.slice(maxCharsPerLine, maxCharsPerLine * 2);
    return b ? [a, b + (s.length > maxCharsPerLine * 2 ? "…" : "")] : [a];
  }

  return lines;
}

export function RadarChart({
  axes = [],              // [V2.4-B] default to empty
  max,
  size = 320,
  rings = 4,
  style,
}: Props) {
  // [V2.4-B] Defensive guards
  const safeMax = Number.isFinite(max) ? max : 0;
  const n = Array.isArray(axes) ? axes.length : 0;

  if (n < 3) {
    return <div style={{ ...style, opacity: 0.8 }}>RadarChart needs at least 3 axes.</div>;
  }
  

  const cx = size / 2;
  const cy = size / 2;

  // Chart radius (grid)
  const radius = size * 0.36;

  // [V2.4-A] Extra viewBox padding so labels aren’t clipped
  const pad = Math.max(44, Math.round(size * 0.18));

  const angle0 = -Math.PI / 2; // start at top

  const toPoint = (i: number, r: number) => {
    const a = angle0 + (i * 2 * Math.PI) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // grid rings (polygons)
  const ringPolys = Array.from({ length: rings }, (_, k) => {
    const t = (k + 1) / rings;
    const r = radius * t;
    const pts = axes.map((_, i) => {
      const p = toPoint(i, r);
      return `${p.x},${p.y}`;
    });
    return pts.join(" ");
  });

  // axis lines + labels
  const axisLines = axes.map((ax, i) => {
    const p = toPoint(i, radius);
    return { ax, i, x: p.x, y: p.y };
  });

  // data polygon
  const dataPts = axes.map((ax, i) => {
    const v = clamp(ax.value, 0, safeMax);
    const r = safeMax === 0 ? 0 : radius * (v / safeMax);
    const p = toPoint(i, r);
    return `${p.x},${p.y}`;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      style={style}
      role="img"
      aria-label="Radar chart"
    >
      {/* Background */}
      <rect x={-pad} y={-pad} width={size + pad * 2} height={size + pad * 2} fill="transparent" />

      {/* Rings */}
      {ringPolys.map((pts, idx) => (
        <polygon
          key={idx}
          points={pts}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          opacity={0.9}
        />
      ))}

      {/* Axes */}
      {axisLines.map(({ i, x, y }) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="var(--border)"
          strokeWidth="1"
          opacity={0.9}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={dataPts.join(" ")}
        fill="var(--surface-strong)"
        stroke="var(--fg)"
        strokeWidth="1.5"
        opacity={0.9}
      />

      {/* Data points */}
      {axes.map((ax, i) => {
        const v = clamp(ax.value, 0, safeMax);
        const r = safeMax === 0 ? 0 : radius * (v / safeMax);
        const p = toPoint(i, r);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--fg)" opacity={0.95} />;
      })}

      {/* Labels */}
      {axisLines.map(({ ax, i, x, y }) => {
        // label offset slightly beyond axis end
        const dx = x - cx;
        const dy = y - cy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ox = (dx / len) * 16;
        const oy = (dy / len) * 16;

        // anchor based on quadrant
        const anchor = Math.abs(dx) < 6 ? "middle" : dx > 0 ? "start" : "end";

        const lines = wrapLabel(ax.label, 14);
        const baseX = x + ox;
        const baseY = y + oy;
        const lineH = 12;

        return (
          <text
            key={i}
            x={baseX}
            y={baseY}
            fill="var(--muted)"
            fontSize="12"
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {lines.map((ln, li) => {
              const offset = (li - (lines.length - 1) / 2) * lineH;
              return (
                <tspan key={li} x={baseX} y={baseY + offset}>
                  {ln}
                </tspan>
              );
            })}
          </text>
        );
      })}
    </svg>
  );
}
