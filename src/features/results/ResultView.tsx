// /src/features/results/ResultView.tsx
// Result screen (single scroll page, 3 sections) aligned with customer mockups.

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
};

type StatusLabel = "Emerging" | "Exploring" | "Developing" | "Integrated";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function ratioFromAvg(avg: number | null, scaleMax: number) {
  if (avg == null || !Number.isFinite(avg) || scaleMax <= 0) return 0;
  return clamp(avg / scaleMax, 0, 1);
}

function statusFromRatio(r: number): StatusLabel {
  // Tuned to feel “human” rather than “mathy”
  if (r < 0.25) return "Emerging";
  if (r < 0.5) return "Exploring";
  if (r < 0.75) return "Developing";
  return "Integrated";
}

function overallStatus(rows: Row[], scaleMax: number): StatusLabel {
  const vals = rows.map((r) => r.avg).filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return "Emerging";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return statusFromRatio(ratioFromAvg(avg, scaleMax));
}

function SegmentedBar({ ratio }: { ratio: number }) {
  const total = 10;
  const filled = Math.round(clamp(ratio, 0, 1) * total);

  return (
    <div
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${total}, 1fr)`,
        gap: 3,
        width: "100%",
        maxWidth: 260,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <div
            key={i}
            style={{
              height: 16,
              borderRadius: 2, // “almost square” like mock
              background: on ? "rgba(94, 132, 86, 0.95)" : "rgba(67, 60, 94, 0.18)",
              border: "1px solid rgba(67, 60, 94, 0.14)",
            }}
          />
        );
      })}
    </div>
  );
}

function iconForLabel(label: string) {
  const s = label.toLowerCase();
  if (s.includes("meta") || s.includes("observe") || s.includes("awareness")) return "👁️";
  if (s.includes("dopamine") || s.includes("reward") || s.includes("motivation")) return "🧠";
  if (s.includes("flow") || s.includes("engagement")) return "⚡";
  if (s.includes("spiritual") || s.includes("transcend")) return "✨";
  return "•";
}

function explainerForLabel(label: string) {
  const s = label.toLowerCase();

  if (s.includes("meta") || s.includes("detached") || s.includes("observe")) {
    return {
      title: "Meta-observation",
      subtitle: "Detached awareness",
      body:
        "The ability to step back and notice thoughts, emotions, and impulses without automatically identifying with them. " +
        "This creates the space needed for curiosity and non-reactive choice.",
      impact: "Reduces automatic reactivity, strengthens response freedom, and supports self-understanding.",
    };
  }

  if (s.includes("dopamine") || s.includes("reward") || s.includes("motivation")) {
    return {
      title: "Dopamine awareness",
      subtitle: "Reward & motivation tracking",
      body:
        "Conscious tracking of what triggers reward-seeking (novelty, achievement, approval, pleasure) and what creates avoidance or flatness. " +
        "Helps separate authentic wants from craving loops.",
      impact: "Supports habit change, reduces compulsive cycles, and aligns motivation with values.",
    };
  }

  if (s.includes("flow") || s.includes("absorbed") || s.includes("engagement")) {
    return {
      title: "Absorbed engagement",
      subtitle: "Flow",
      body:
        "Moments of complete immersion where self-consciousness decreases and action feels natural. " +
        "Often a signal of presence, ease, and meaningful engagement.",
      impact: "Strengthens satisfaction and momentum through aligned, effortless action.",
    };
  }

  if (s.includes("spiritual") || s.includes("transcend") || s.includes("connection")) {
    return {
      title: "Spiritual connection",
      subtitle: "Transcendence",
      body:
        "Experiencing a sense of connection to something larger (nature, humanity, the divine, meaning). " +
        "Can soften ego boundaries and reveal interconnectedness.",
      impact: "Brings peace, awe, and purpose — especially during uncertainty or transition.",
    };
  }

  // fallback (safe + non-diagnostic)
  return {
    title: label,
    subtitle: "Reflection",
    body:
      "This category represents one aspect of your subjective experience in the assessment. " +
      "Use it as a gentle pointer for curiosity — not as a judgment or diagnosis.",
    impact: "If this area feels important, consider revisiting it with specific examples from your recent life.",
  };
}

export function ResultView({ rows, scaleMax, surveyTitle, onNeedsMap, onReassess }: Props) {
  const overall = overallStatus(rows, scaleMax);

  return (
    <PageShell maxWidth={480}>
      <Stack gap={16} style={{ paddingBottom: "var(--s-6)" }}>
        {/* ========================= */}
        {/* Section 1: Your mapping */}
        {/* ========================= */}
        <Card
          style={{
            padding: "var(--s-5)",
            background: "rgba(255,255,255,0.35)",
            borderRadius: 22,
            border: "1px solid rgba(67, 60, 94, 0.22)",
          }}
        >
          <Stack gap={14}>
            <Stack gap={8}>
              <Text
                style={{
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  color: "rgba(94, 132, 86, 0.95)", // muted green like mock status
                }}
              >
                {overall}
              </Text>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  {surveyTitle ?? "Your Mapping"}
                </Heading>

                <div
                  style={{
                    height: 3,
                    width: 180,
                    background: "rgba(67, 60, 94, 0.65)",
                    borderRadius: 999,
                  }}
                />
              </Stack>
            </Stack>

            {/* Category rows */}
            <Stack gap={12} style={{ marginTop: 4 }}>
              {rows.map((r) => {
                const ratio = ratioFromAvg(r.avg, scaleMax);
                const status = statusFromRatio(ratio);

                return (
                  <div
                    key={r.categoryId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Stack gap={6}>
                      <Text style={{ fontWeight: 650 }}>
                        <span aria-hidden style={{ marginRight: 8 }}>
                          {iconForLabel(r.label)}
                        </span>
                        {r.label}
                      </Text>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <SegmentedBar ratio={ratio} />
                        <div
                          style={{
                            width: 90,
                            textAlign: "right",
                            fontWeight: 700,
                            color:
                              status === "Integrated"
                                ? "rgba(94, 132, 86, 0.95)"
                                : status === "Developing"
                                ? "rgba(116, 144, 82, 0.95)"
                                : status === "Exploring"
                                ? "rgba(109, 151, 141, 0.95)"
                                : "rgba(130, 130, 130, 0.9)",
                          }}
                        >
                          {status}
                        </div>
                      </div>
                    </Stack>
                  </div>
                );
              })}
            </Stack>

            {/* Primary actions */}
            <Stack direction="row" gap={12} style={{ marginTop: 10 }}>
              <Button
                onClick={onNeedsMap}
                variant="ghost"
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "2px solid rgba(67, 60, 94, 0.55)",
                  fontWeight: 700,
                }}
              >
                Needs Map
              </Button>

              <Button
                onClick={onReassess}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: "12px 14px",
                  background: "rgba(67, 60, 94, 0.92)",
                  color: "#fff",
                  border: "2px solid rgba(67, 60, 94, 0.15)",
                  fontWeight: 750,
                }}
              >
                Reassess
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* ========================= */}
        {/* Section 2: Understand your result */}
        {/* ========================= */}
        <Card
          style={{
            padding: "var(--s-5)",
            background: "rgba(255,255,255,0.35)",
            borderRadius: 22,
            border: "1px solid rgba(67, 60, 94, 0.22)",
          }}
        >
          <Stack gap={12}>
            <Heading level={2} style={{ margin: 0 }}>
              Understand your result
            </Heading>

            <Text style={{ lineHeight: 1.6 }}>
              This mapping reflects your <b>subjective self-perception</b> in the moment. It’s a gentle tool for
              noticing patterns and deciding where to place attention — <b>not</b> a clinical or diagnostic assessment.
            </Text>
          </Stack>
        </Card>

        {/* ========================= */}
        {/* Section 3: Detailed category explanations */}
        {/* ========================= */}
        <Stack gap={12}>
          {rows.map((r) => {
            const e = explainerForLabel(r.label);
            return (
              <Card
                key={`explain-${r.categoryId}`}
                style={{
                  padding: "var(--s-5)",
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: 22,
                  border: "1px solid rgba(67, 60, 94, 0.22)",
                }}
              >
                <Stack gap={10}>
                  <Stack gap={2}>
                    <Text style={{ fontWeight: 800, fontSize: 16 }}>
                      <span aria-hidden style={{ marginRight: 8 }}>
                        {iconForLabel(r.label)}
                      </span>
                      {e.title}
                    </Text>
                    <Text muted style={{ fontWeight: 650 }}>
                      {e.subtitle}
                    </Text>
                  </Stack>

                  <Text style={{ lineHeight: 1.65 }}>{e.body}</Text>

                  <Text style={{ lineHeight: 1.65 }}>
                    <b style={{ color: "rgba(214, 112, 84, 0.95)" }}>Impact:</b> {e.impact}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </PageShell>
  );
}
