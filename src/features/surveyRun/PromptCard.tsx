// /src/features/surveyRun/PromptCard.tsx

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

export function PromptCard({ question, min, max, value, onPickValue }: Props) {
  return (
    <div
      style={{
        padding: "var(--s-3)",
        borderRadius: 18,
        background: "rgba(255,255,255,0.12)", // faint, not “double card”
      }}
    >
      <Stack gap={12}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.18,
          }}
        >
          {question}
        </Text>

        <div style={{ height: 1, background: "var(--border)", opacity: 0.7 }} />

        <div style={{ paddingTop: 6 }}>
          <Stack gap={6}>
            {Array.from({ length: max - min + 1 }).map((_, i) => {
              const n = min + i;
              const checked = value === n;

              return (
                <label
                  key={n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",

                    // Row geometry (closer to mock)
                    padding: "6px 10px",
                    borderRadius: 14,
                    minHeight: 42,

                    background: checked ? "rgba(94, 58, 122, 0.08)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="scale"
                    checked={checked}
                    onChange={() => onPickValue(n)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "var(--primary)",
                      flex: "0 0 auto",
                      marginTop: 1, // helps baseline alignment with tighter text
                    }}
                  />

                  {/* Critical part: tighter text line-height */}
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 650,
                      lineHeight: 1.12,
                      color: "inherit",
                      // This prevents odd extra spacing in some text components
                      display: "block",
                      paddingTop: 1,
                    }}
                  >
                    {n} = {LABELS[n] ?? `Option ${n}`}
                  </span>
                </label>
              );
            })}
          </Stack>
        </div>
      </Stack>
    </div>
  );
}
