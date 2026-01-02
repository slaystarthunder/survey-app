// /src/pages/results/ResultPage.tsx
// Orchestration for new result screen

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";

import { runRepo } from "@core/data/runRepo";
import { surveyRepo } from "@core/data/surveyRepo";
import { computeSummary } from "@core/domain/computeSummary";


import { ResultView } from "@features/results/ResultView";


export function ResultPage() {
  const { runId = "" } = useParams();
  const nav = useNavigate();

  const run = useMemo(() => (runId ? runRepo.getRun(runId) : null), [runId]);
  const survey = useMemo(() => (run ? surveyRepo.get(run.surveyId) : null), [run]);

  if (!run || !survey) {
    return (
      <PageShell>
        <Heading level={2}>Result error</Heading>
        <Text muted>Missing run or survey.</Text>
      </PageShell>
    );
  }

  const summary = computeSummary(survey, run.answers);

  const rows = survey.categories.map((c) => ({
    categoryId: c.categoryId,
    label: c.label,
    avg: summary.byCategory[c.categoryId]?.avg ?? null,
  }));

  return (
    <ResultView
      rows={rows}
      scaleMax={survey.scale.max}
      surveyTitle={survey.title}
      onNeedsMap={() => nav("/needs")}
      onReassess={() => nav(`/intro/${survey.surveyId}`)}
      onDownload={() => nav(`/result/${run.runId}/finished`)}
      onSave={() => {
        alert("Saved (placeholder). Next step: wire to export / backend / share link.");
      }}
    />
  );
}
