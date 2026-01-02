// [V2.4-B] Added: Finished result view (stable layout for export)

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { ResultRadarCard } from "./ResultRadarCard";


function onExportPdf() {
  window.print();
}

type Row = {
  label: string;
  avg: number | null;
  count: number;
};

type Props = {
  surveyTitle: string;
  overallAvg: number | null;
  answeredCount: number;
  totalCount: number;
  rows: Row[];
};

export function FinishedView(props: Props) {
  const axes = props.rows.map((r) => ({
    label: r.label,
    value: r.avg ?? 0, // null averages treated as 0
  }));

  return (
    <div
      id="finished-page"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <Stack gap={24}>
        {/* Header */}
        <Stack gap={6}>
          <Heading level={1}>{props.surveyTitle}</Heading>
          <Text muted>
            Completed {props.answeredCount} of {props.totalCount} questions
          </Text>
        </Stack>

        {/* Export button (screen only) */}
        <div className="no-print">
          <Button onClick={onExportPdf} style={{ fontWeight: 800 }}>
            Export PDF
          </Button>
        </div>

        {/* Reflection section */}
        <Card className="print-avoid-break print-flat">
          <Stack gap={8}>
            <Heading level={3}>Reflection</Heading>
            <Text muted>
              (This section can later be filled with notes, insights, or interpretation.)
            </Text>

            <div
              style={{
                minHeight: 120,
                border: "1px dashed var(--border)",
                borderRadius: 8,
                padding: 12,
                opacity: 0.6,
              }}
            >
              <Text muted>Your notes or reflections will appear here.</Text>
            </div>
          </Stack>
        </Card>

        {/* Radar */}
        <Card className="print-avoid-break print-flat">
          <ResultRadarCard axes={axes} max={10} />
        </Card>

        {/* Summary */}
        <Card className="print-avoid-break print-flat">
          <Stack gap={6}>
            <Heading level={3}>Overall score</Heading>
            <Text>
              {props.overallAvg !== null ? props.overallAvg.toFixed(2) : "—"}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}
