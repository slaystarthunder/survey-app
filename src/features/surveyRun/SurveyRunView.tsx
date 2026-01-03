// /src/features/surveyRun/SurveyRunView.tsx

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

export function SurveyRunView(props: Props) {
  const inLast = props.index >= props.totalCount;

  return (
    <PageShell maxWidth={480}>
      <Stack gap={14} style={{ paddingTop: "var(--s-4)" }}>
        {/* Single card like the mock (no top dots / no nested cards) */}
        <Card
          style={{
            borderRadius: 22,
            background: "rgba(255,255,255,0.35)",
          }}
        >
          <Stack gap={14}>
            <Heading level={2} style={{ fontSize: "2rem" }}>
              Statement {props.index} / {props.totalCount}
            </Heading>

            <PromptCard
              question={props.promptText}
              min={props.min}
              max={props.max}
              value={props.value}
              onPickValue={props.onPickValue}
            />

            {/* Buttons row (side inset like mock) */}
            <div style={{ paddingTop: "var(--s-2)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--s-3)",
                  padding: "0 var(--s-2)",
                }}
              >
                <Button
                  variant="ghost"
                  onClick={props.onBack}
                  disabled={!props.canGoBack}
                  style={{
                    padding: "12px 22px",
                    minWidth: 120,
                  }}
                >
                  Back
                </Button>

                {props.isComplete && inLast ? (
                  <Button
                    onClick={props.onFinish}
                    style={{
                      fontWeight: 800,
                      padding: "12px 28px",
                      minWidth: 140,
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={props.onNext}
                    disabled={!props.canGoNext || props.value == null}
                    style={{
                      fontWeight: 800,
                      padding: "12px 28px",
                      minWidth: 140,
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>

            {props.value == null ? (
              <Text muted style={{ fontSize: 12, padding: "0 var(--s-2)" }}>
                Pick an option to continue.
              </Text>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
