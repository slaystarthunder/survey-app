// /src/features/results/ResultView.tsx
// Mapping result screen (single scroll page, 3 sections) – styled closer to customer mockups.

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

type Row = {
  categoryId: string;
  label: string;
  avg: number | null;
};

type Props = {
  rows: Row[];
  scaleMax: number;
  surveyTitle?: string;

  onNeedsMap: () => void;
  onReassess: () => void;

  onDownload: () => void;
  onSave: () => void;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function pct(avg: number | null, scaleMax: number) {
  if (avg == null) return 0;
  if (!Number.isFinite(avg) || scaleMax <= 0) return 0;
  return clamp((avg / scaleMax) * 100, 0, 100);
}

function statusLabel(p: number) {
  if (p >= 85) return "Integrated";
  if (p >= 65) return "Developing";
  if (p >= 45) return "Exploring";
  return "Emerging";
}

function detailFor(label: string) {
  const key = label.toLowerCase();

  if (key.includes("detached") || key.includes("meta")) {
    return {
      title: "Detached awareness / meta-observation",
      body: [
        "The ability to step back and observe your thoughts, emotions, body sensations, and impulses without automatically identifying with them.",
        "Foundation of curiosity about yourself: you can’t explore what’s inside unless you can witness it from a neutral perspective.",
        "Creates space between stimulus and response — the root of conscious choice.",
        "Impact: reduces autopilot living, shame spirals, and impulsive decisions.",
      ],
    };
  }

  if (key.includes("dopamine") || key.includes("reward") || key.includes("motivation")) {
    return {
      title: "Dopamine awareness / reward & motivation tracking",
      body: [
        "Conscious tracking of what triggers quick dopamine hits (novelty, achievement, approval, pleasure) and what causes avoidance or flatness.",
        "Helps separate authentic wants from craving-driven habits or compulsions.",
        "Supports value-aligned motivation by revealing what your system is actually chasing.",
        "Impact: breaks compulsive loops and helps rewire habits toward what’s meaningful.",
      ],
    };
  }

  if (key.includes("flow") || key.includes("absorbed") || key.includes("engagement")) {
    return {
      title: "Absorbed engagement / flow",
      body: [
        "Moments of complete immersion where self-consciousness drops and you’re fully present in action or creation.",
        "Often feels effortless and deeply satisfying when challenge matches skill.",
        "A peak state of authenticity — less overthinking, more direct participation.",
        "Impact: improves focus, learning, craft, and a sense of meaning-through-doing.",
      ],
    };
  }

  if (key.includes("transcend") || key.includes("spiritual") || key.includes("connection")) {
    return {
      title: "Transcendence / spiritual connection",
      body: [
        "A sense of unity with something larger (nature, humanity, the universe, the divine).",
        "Can dissolve ego boundaries and reveal interconnectedness.",
        "Often brings awe, peace, and purpose beyond personal concerns.",
        "Impact: supports long-term meaning, perspective, and resilience.",
      ],
    };
  }

  return {
    title: label,
    body: [
      "Details for this category will be added later.",
      "For now, use the bar above as a quick snapshot of where attention might help.",
    ],
  };
}

function SegmentedBar({ valuePct }: { valuePct: number }) {
  const segments = 10;
  const filled = Math.round((valuePct / 100) * segments);

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < filled;

        return (
          <div
            key={i}
            style={{
              width: 18, // more square cells
              height: 18, // square cells
              borderRadius: 1, // almost no rounding
              background: on ? "#4F8F7A" : "transparent",
              border: on ? "1px solid transparent" : "1.5px solid rgba(0,0,0,0.18)",
            }}
          />
        );
      })}
    </div>
  );
}

export function ResultView({
  rows,
  scaleMax,
  surveyTitle = "Presence & Awareness",
  onNeedsMap,
  onReassess,
  onDownload,
  onSave,
}: Props) {
  return (
    <PageShell>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "14px 0 28px" }}>
        <Stack gap={16}>
          {/* SECTION A — Mapping summary */}
          <Card
            style={{
              borderRadius: 22,
              background: "rgba(255,255,255,0.35)",
            }}
          >
            <Stack gap={14}>
              <Heading level={2}>Your mapping</Heading>

              <Stack gap={12}>
                {rows.map((r) => {
                  const p = pct(r.avg, scaleMax);

                  return (
                    <div key={r.categoryId} style={{ display: "grid", gap: 6 }}>
                      <Stack direction="row" justify="space-between" style={{ gap: 12 }}>
                        <Text style={{ fontWeight: 650 }}>{r.label}</Text>
                        <Text muted style={{ fontSize: 12 }}>
                          {statusLabel(p)}
                        </Text>
                      </Stack>

                      {/* Removed the % column; bar only */}
                      <SegmentedBar valuePct={p} />
                    </div>
                  );
                })}
              </Stack>

              {/* Move Needs Map + Reassess BELOW the bars (like mock) */}
              <Stack direction="row" gap={10} wrap="wrap" style={{ marginTop: 6 }}>
                <Button
                  variant="ghost"
                  onClick={onNeedsMap}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  Needs Map
                </Button>

                <Button
                  onClick={onReassess}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid transparent",
                    background: "var(--primary)",
                    color: "#ffffff",
                  }}
                >
                  Reassess
                </Button>
              </Stack>

              {/* Keep Download/Save as-is for now */}
              <Stack direction="row" gap={10} wrap="wrap" style={{ marginTop: 2 }}>
                <Button
                  variant="ghost"
                  onClick={onDownload}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  Download
                </Button>

                <Button
                  onClick={onSave}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid transparent",
                    background: "var(--accent)",
                    color: "#ffffff",
                  }}
                >
                  Save
                </Button>
              </Stack>

              <Text muted style={{ fontSize: 12, lineHeight: 1.5 }}>
                Saving your results enables you to test more universal needs to understand where you are, and what you
                might want to focus on improving.
              </Text>
            </Stack>
          </Card>

          {/* SECTION B — Understand */}
          <Card>
            <Stack gap={10}>
              <Heading level={2}>Understand your result</Heading>

              <Text muted style={{ lineHeight: 1.55 }}>
                This is your subjective perception of how present & aware you currently are across these perspectives —
                it serves as a map that enables you to understand what might need your attention.
              </Text>

              <div style={{ height: 1, background: "var(--border)", opacity: 0.7 }} />

              <Stack gap={6}>
                <Text style={{ fontWeight: 750 }}>{surveyTitle}</Text>
                <Text style={{ lineHeight: 1.55 }}>
                  The foundational capacity to be consciously present with your inner experience in the moment —
                  including thoughts, emotions, sensations, and impulses — with clarity and openness.
                </Text>

                <Text muted style={{ fontSize: 12, lineHeight: 1.55 }}>
                  Impact: reduces automatic reactivity, fosters freedom of response, and enables access to higher states
                  of flow and transcendence.
                </Text>
              </Stack>
            </Stack>
          </Card>

          {/* SECTION C — Detail cards */}
          <Stack gap={12}>
            {rows.map((r) => {
              const info = detailFor(r.label);
              return (
                <Card key={r.categoryId}>
                  <Stack gap={10}>
                    <Heading level={3}>{info.title}</Heading>
                    <Stack gap={8}>
                      {info.body.map((t, i) => (
                        <Text key={i} style={{ lineHeight: 1.55 }}>
                          {t}
                        </Text>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      </div>
    </PageShell>
  );
}
