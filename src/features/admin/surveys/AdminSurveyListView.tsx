// [S08] Added: Admin list view (presentation).

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";


type SurveyRow = {
  surveyId: string;
  title: string;
  version: number;
  promptCount: number;
};

type Props = {
  rows: SurveyRow[];
  onCreateNew: () => void;
  onOpenEditor: (surveyId: string) => void;
  onRun: (surveyId: string) => void;
};

export function AdminSurveyListView({ rows, onCreateNew, onOpenEditor, onRun }: Props) {
  return (
    <PageShell>
      <Stack gap={16}>
        <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 12 }}>
          <Stack gap={6}>
            <Heading level={1}>Admin • Surveys</Heading>
            <Text muted>Create and manage surveys/assessments.</Text>
          </Stack>
          <Button onClick={onCreateNew}>New survey</Button>
        </Stack>

        <Card>
          <Stack gap={12}>
            {rows.length === 0 ? (
              <Text muted>No surveys yet.</Text>
            ) : (
              rows.map((r) => (
                <div
                  key={r.surveyId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)",
                    background: "var(--surface)",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Stack gap={2} style={{ minWidth: 220 }}>
                    <Text>
                      <b style={{ color: "var(--fg)" }}>{r.title}</b>
                    </Text>
                    <Text muted mono>
                      {r.surveyId} • v{r.version} • prompts {r.promptCount}
                    </Text>
                  </Stack>

                  <Stack direction="row" gap={8} wrap="wrap">
                    <Button variant="ghost" onClick={() => onOpenEditor(r.surveyId)}>
                      Edit
                    </Button>
                    <Button onClick={() => onRun(r.surveyId)}>Run</Button>
                  </Stack>
                </div>
              ))
            )}
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
