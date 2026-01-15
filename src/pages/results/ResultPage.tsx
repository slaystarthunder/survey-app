// /src/pages/results/ResultPage.tsx
// Orchestration for result screen

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";

import { runRepo } from "@core/data/runRepo";
import { surveyRepo } from "@core/data/surveyRepo";
import type { ResponseState, SurveyBlueprint } from "@core/domain/types";

import { ResultView } from "@features/results/ResultView";

type Row = {
  categoryId: string;
  label: string;
  avg: number | null;
};

function computeRows(run: ResponseState, survey: SurveyBlueprint): Row[] {
  // group promptIds by category
  const promptIdsByCategory = new Map<string, string[]>();
  for (const p of survey.prompts) {
    const arr = promptIdsByCategory.get(p.categoryId) ?? [];
    arr.push(p.promptId);
    promptIdsByCategory.set(p.categoryId, arr);
  }

  return survey.categories.map((c) => {
    const ids = promptIdsByCategory.get(c.categoryId) ?? [];
    const vals: number[] = [];

    for (const pid of ids) {
      const v = run.answers[pid];
      if (typeof v === "number" && Number.isFinite(v)) vals.push(v);
    }

    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

    return {
      categoryId: c.categoryId,
      label: c.label,
      avg,
    };
  });
}

export function ResultPage() {
  const nav = useNavigate();
  const params = useParams();
  const runId = params.runId ?? "";

  const run = useMemo(() => (runId ? runRepo.getRun(runId) : null), [runId]);
  const survey = useMemo(() => (run ? surveyRepo.get(run.surveyId) : null), [run]);

  const rows = useMemo(() => {
    if (!run || !survey) return [];
    return computeRows(run, survey);
  }, [run, survey]);

  if (!run || !survey) {
    return (
      <PageShell>
        <Heading level={2}>Result not found</Heading>
        <Text muted>Missing run or survey.</Text>
      </PageShell>
    );
  }

  return (
    <ResultView
      rows={rows}
      scaleMax={survey.scale.max}
      surveyTitle={survey.title}
      onNeedsMap={() => nav("/")}
      onReassess={() => nav(`/intro/${survey.surveyId}`)}
    />
  );
}
