// [S05] Added: Progress indicator (semantic UI). No effects.

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Text } from "@ui/Text";

type Props = {
  index: number;
  totalCount: number;
  answeredCount: number;
  isComplete: boolean;
};

export function SurveyProgress({ index, totalCount, answeredCount, isComplete }: Props) {
  const step = Math.min(totalCount, index); // index is already 1-based in your controller
  const pct = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <Card style={{ padding: "var(--s-3)" }}>
      <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 10 }}>
        <Text muted>
          Step <b style={{ color: "var(--fg)" }}>{step}</b> / {totalCount}
        </Text>

        <Text muted>
          Answered <b style={{ color: "var(--fg)" }}>{answeredCount}</b> ({pct}%)
          {isComplete ? <b style={{ marginLeft: 8, color: "var(--fg)" }}>✓ Complete</b> : null}
        </Text>
      </Stack>
    </Card>
  );
}
