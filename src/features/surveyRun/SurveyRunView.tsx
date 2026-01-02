import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { PromptCard } from "./PromptCard";


type Props = {
  title: string;
  description?: string;

  index: number; // 1-based
  totalCount: number;

  promptText: string;

  min: number;
  max: number;
  value: number | null;
  onPickValue: (value: number) => void;

  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;

  isComplete: boolean;
  onFinish: () => void;
};

function ProgressDots({ total, currentIndex1 }: { total: number; currentIndex1: number }) {
  // Top-left dots like screenshot (simple)
  const dots = [];
  for (let i = 1; i <= total; i++) {
    const active = i === currentIndex1;
    dots.push(
      <span
        key={i}
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: active ? "var(--primary)" : "transparent",
          display: "inline-block",
        }}
      />
    );
  }

  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{dots}</div>;
}

export function SurveyRunView(props: Props) {
  const inLast = props.index >= props.totalCount;

  return (
    <PageShell>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <Stack gap={14}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <ProgressDots total={props.totalCount} currentIndex1={props.index} />
          </div>

          <Card>
            <Stack gap={12}>
              <Heading level={2}>
                Question {props.index} / {props.totalCount}
              </Heading>

              <PromptCard
                question={props.promptText}
                min={props.min}
                max={props.max}
                value={props.value}
                onPickValue={props.onPickValue}
              />

              <Stack direction="row" justify="space-between" gap={10} wrap="wrap">
                <Button variant="ghost" onClick={props.onBack} disabled={!props.canGoBack}>
                  Back
                </Button>

                {props.isComplete && inLast ? (
                  <Button onClick={props.onFinish} style={{ fontWeight: 800 }}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={props.onNext} disabled={!props.canGoNext || props.value == null} style={{ fontWeight: 800 }}>
                    Next
                  </Button>
                )}
              </Stack>

              {props.value == null ? (
                <Text muted style={{ fontSize: 12 }}>
                  Pick an option to continue.
                </Text>
              ) : null}
            </Stack>
          </Card>
        </Stack>
      </div>
    </PageShell>
  );
}
