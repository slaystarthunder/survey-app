// /src/pages/results/FinishedPage.tsx
// Minimal printable/export view (placeholder).

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { runRepo } from "@core/data/runRepo";
import { surveyRepo } from "@core/data/surveyRepo";
import { computeSummary } from "@core/domain/computeSummary";



export function FinishedPage() {
  const { runId = "" } = useParams();

  const run = useMemo(() => (runId ? runRepo.getRun(runId) : null), [runId]);
  const survey = useMemo(() => (run ? surveyRepo.get(run.surveyId) : null), [run]);

  if (!run || !survey) {
    return (
      <PageShell>
        <Heading level={2}>Print view error</Heading>
        <Text muted>Missing run or survey.</Text>
      </PageShell>
    );
  }

  const summary = computeSummary(survey, run.answers);


  return (
    <PageShell>
      <Stack gap={14}>
        <Stack direction="row" justify="space-between" gap={10} wrap="wrap">
          <Heading level={2}>Printable Result</Heading>
          <Button onClick={() => window.print()} style={{ fontWeight: 800 }}>
            Print
          </Button>
        </Stack>

        <Card>
          <Stack gap={10}>
            <Text muted>Survey</Text>
            <Heading level={3}>{survey.title}</Heading>

            <Text muted>
              Answered {summary.answeredCount}/{summary.totalCount}
            </Text>

            <div style={{ height: 1, background: "var(--border)", opacity: 0.7 }} />

            <Stack gap={8}>
              {survey.categories.map((c) => {
                const avg = summary.byCategory[c.categoryId]?.avg ?? null;
                return (
                  <div key={c.categoryId} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <Text>{c.label}</Text>
                    <Text mono muted>
                      {avg == null ? "—" : avg.toFixed(2)}
                    </Text>
                  </div>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
