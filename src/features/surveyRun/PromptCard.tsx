// /src/features/surveyRun/PromptCard.tsx

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Text } from "@ui/Text";

type Props = {
  question: string;
  min: number;
  max: number;
  value: number | null;
  onPickValue: (value: number) => void;
};

const LABELS: Record<number, string> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Somewhat disagree",
  4: "Neither agree nor disagree",
  5: "Somewhat agree",
  6: "Agree",
  7: "Strongly agree",
};

export function PromptCard(props: Props) {
  const options: number[] = [];
  for (let n = props.min; n <= props.max; n++) options.push(n);

  return (
    <Card
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(67, 60, 94, 0.14)",
        borderRadius: 20,
        padding: "var(--s-4)",
        boxShadow: "0 1px 0 rgba(67,60,94,0.06)",
      }}
    >
      <Stack gap={14}>
        {/* Question */}
        <Text
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            lineHeight: 1.25,
            color: "var(--fg)",
            padding: "0 var(--s-2)",
          }}
        >
          {props.question}
        </Text>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(67, 60, 94, 0.12)",
            margin: "0 var(--s-2)",
          }}
        />

        {/* Options */}
        <Stack gap={10} style={{ padding: "0 var(--s-2)" }}>
          {options.map((n) => {
            const checked = props.value === n;

            return (
              <label
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  userSelect: "none",

                  padding: "12px 14px",
                  borderRadius: "var(--r-md)",

                  background: checked
                    ? "rgba(94, 58, 122, 0.08)"
                    : "transparent",

                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!checked) {
                    e.currentTarget.style.background =
                      "rgba(94, 58, 122, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!checked) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <input
                  type="radio"
                  name="scale"
                  value={n}
                  checked={checked}
                  onChange={() => props.onPickValue(n)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--primary)",
                    cursor: "pointer",
                  }}
                />

                <Text
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 650,
                    lineHeight: 1.35,
                  }}
                >
                  {n} = {LABELS[n] ?? `Option ${n}`}
                </Text>
              </label>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}
