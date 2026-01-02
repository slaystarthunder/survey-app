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
  // We’re matching your screenshot scale (1–7). If you later change scale, this still works,
  // but labels will only show for 1–7.
  const options: number[] = [];
  for (let n = props.min; n <= props.max; n++) options.push(n);

  return (
    <Card style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <Stack gap={10}>
        <Text style={{ lineHeight: 1.35, fontWeight: 650 }}>{props.question}</Text>

        <div style={{ height: 1, background: "var(--border)", opacity: 0.7 }} />

        <Stack gap={8}>
          {options.map((n) => {
            const checked = props.value === n;
            return (
              <label
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  padding: "6px 4px",
                  borderRadius: "var(--r-md)",
                }}
              >
                <input
                  type="radio"
                  name="scale"
                  value={n}
                  checked={checked}
                  onChange={() => props.onPickValue(n)}
                />
                <Text>
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
