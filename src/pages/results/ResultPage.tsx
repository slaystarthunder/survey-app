// /src/pages/results/ResultPage.tsx
// Orchestration for new result screen

import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";

import { runRepo } from "@core/data/runRepo";
import { surveyRepo } from "@core/data/surveyRepo";
import { computeSummary } from "@core/domain/computeSummary";

import { ResultView } from "@features/results/ResultView";

// Firebase “Save to account”
import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";

export function ResultPage() {
  const { runId = "" } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const run = useMemo(
    () => (runId ? runRepo.getRun(runId) : null),
    [runId]
  );

  const survey = useMemo(
    () => (run ? surveyRepo.get(run.surveyId) : null),
    [run]
  );

  // Auth singleton (composition root)
  const auth = useMemo(() => services.auth, []);
  const authState = useAuthState(auth);
  const uid = authState.user?.uid ?? null;

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
      onSave={async () => {
        // Phase 1 behavior: auth is explicit via /login
        if (!uid) {
          nav("/login", { replace: true, state: { from: loc.pathname } });
          return;
        }

        try {
          await runRepoFirebase.saveRun(uid, run);
          alert("Saved to account ✅");
        } catch (e) {
          console.error(e);
          alert(
            `Save failed: ${e instanceof Error ? e.message : String(e)}`
          );
        }
      }}
    />
  );
}
