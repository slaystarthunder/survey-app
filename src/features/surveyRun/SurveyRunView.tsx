// /src/features/surveyRun/SurveyRunView.tsx
// [S09b] Fix: Render labeled 1–7 statements (mock) instead of bare number pills.
// Keeps small counter near Next and removes any "Statement x" header.

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";
import { PageShell } from "@ui/PageShell";

type Props = {
  // header
  title: string;
  description?: string | null;

  // progress
  index: number; // 1-based
  totalCount: number;

  // current prompt
  promptText: string;

  // scale
  min: number;
  max: number;
  value: number | null;
  onPickValue: (n: number) => void;

  // nav
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;

  // completion
  isComplete: boolean;
  onFinish: () => void;
};

function getLabelForValue(v: number, min: number, max: number) {
  // Mock wants the classic 7-point Likert wording.
  // If a survey later uses a different scale, we still render numeric rows, but only provide
  // this wording when it matches 1..7.
  const isLikert7 = min === 1 && max === 7;

  if (!isLikert7) return `${v}`;

  switch (v) {
    case 1:
      return "Strongly disagree";
    case 2:
      return "Disagree";
    case 3:
      return "Somewhat disagree";
    case 4:
      return "Neither agree nor disagree";
    case 5:
      return "Somewhat agree";
    case 6:
      return "Agree";
    case 7:
      return "Strongly agree";
    default:
      return `${v}`;
  }
}

export function SurveyRunView(props: Props) {
  const {
    title,
    promptText,
    index,
    totalCount,
    min,
    max,
    value,
    onPickValue,
    canGoBack,
    canGoNext,
    onBack,
    onNext,
    isComplete,
    onFinish,
  } = props;

  const rightCounter = totalCount > 0 ? `${index} / ${totalCount}` : "";

  const values: number[] = [];
  for (let v = min; v <= max; v += 1) values.push(v);

  return (
    <PageShell maxWidth={480}>
      <Card
        style={{
          padding: "var(--s-5)",
          borderRadius: 26,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(67, 60, 94, 0.10)",
          boxShadow: "var(--shadow-1)",
        }}
      >
        <Stack gap={16}>
          {/* Header block */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Icon tile placeholder */}
            <div
              aria-hidden
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(67, 60, 94, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              <span style={{ fontSize: 18 }}>🖼️</span>
            </div>

            <div style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: 700, color: "rgba(234, 135, 69, 0.95)", marginBottom: 2 }}>
                Assessment
              </Text>

              <Heading
                level={2}
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.1,
                  letterSpacing: 0.2,
                }}
              >
                {title}
              </Heading>

              <div
                style={{
                  height: 2,
                  width: 240,
                  marginTop: 10,
                  background: "rgba(67, 60, 94, 0.65)",
                  borderRadius: 999,
                }}
              />
            </div>
          </div>

          {/* Prompt */}
          <Text style={{ fontSize: 20, lineHeight: 1.5, marginTop: 6 }}>{promptText}</Text>

          {/* Labeled choices (mock) */}
          <div style={{ marginTop: 6 }}>
            <Stack gap={10}>
              {values.map((v) => {
                const selected = value === v;

                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onPickValue(v)}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      margin: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    aria-label={`${v} = ${getLabelForValue(v, min, max)}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "4px 2px",
                      }}
                    >
                      {/* Radio circle */}
                      <div
                        aria-hidden
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          border: "2px solid rgba(67, 60, 94, 0.75)",
                          background: selected ? "rgba(67, 60, 94, 0.92)" : "transparent",
                          boxShadow: selected ? "0 0 0 3px rgba(67, 60, 94, 0.10)" : "none",
                          flex: "0 0 auto",
                        }}
                      />

                      {/* Label */}
                      <Text style={{ fontSize: 16, lineHeight: 1.35 }}>
                        <span style={{ fontWeight: 800 }}>{v}</span> = {getLabelForValue(v, min, max)}
                      </Text>
                    </div>
                  </button>
                );
              })}
            </Stack>
          </div>

          {/* Bottom controls */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <Button
                onClick={onBack}
                disabled={!canGoBack}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.45)",
                  color: "var(--fg)",
                  border: "2px solid rgba(67, 60, 94, 0.55)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 650,
                  opacity: canGoBack ? 1 : 0.55,
                }}
              >
                Back
              </Button>

              <Button
                onClick={isComplete ? onFinish : onNext}
                disabled={isComplete ? false : !canGoNext}
                style={{
                  flex: 1,
                  background: "rgba(67, 60, 94, 0.92)",
                  color: "#fff",
                  border: "2px solid rgba(67, 60, 94, 0.55)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 700,
                  opacity: isComplete || canGoNext ? 1 : 0.55,
                }}
              >
                {isComplete ? "Finish" : "Next"}
              </Button>
            </div>

            {/* Small counter above Next (right-aligned) */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <Text muted style={{ fontWeight: 700, fontSize: 18 }}>
                {rightCounter}
              </Text>
            </div>
          </div>
        </Stack>
      </Card>
    </PageShell>
  );
}
