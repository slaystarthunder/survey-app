// [S06] Added: Summary card for overall + per-category averages.

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";


type Row = { label: string; avg: number | null; count: number };

type Props = {
  title: string;
  overallAvg: number | null;
  answeredCount: number;
  totalCount: number;
  rows: Row[];
};

function fmt(n: number | null) {
  return n == null ? "—" : n.toFixed(2);
}

export function ResultSummaryCard({ title, overallAvg, answeredCount, totalCount, rows }: Props) {
  return (
    <Card>
      <Stack gap={14}>
        <Stack gap={6}>
          <Heading level={2}>{title}</Heading>
          <Text muted>
            Answered {answeredCount}/{totalCount} • Overall average: <b style={{ color: "var(--fg)" }}>{fmt(overallAvg)}</b>
          </Text>
        </Stack>

        <Stack gap={10}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
              }}
            >
              <Text>{r.label}</Text>
              <Text mono muted>
                avg {fmt(r.avg)} • n={r.count}
              </Text>
            </div>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
