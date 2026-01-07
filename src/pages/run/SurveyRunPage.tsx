// [S05] Updated: Route-level orchestration for running a survey (prompt-based: 1 question per screen).

import { useParams, useNavigate } from "react-router-dom";

import { Heading, Text } from "@ui/Text";
import { PageShell } from "@ui/PageShell";

import { useSurveyRunController } from "@features/surveyRun/useSurveyRunController";
import { SurveyRunView } from "@features/surveyRun/SurveyRunView";

export function SurveyRunPage() {
  const params = useParams();
  const surveyId = params.surveyId ?? "";
  const navigate = useNavigate();

  const c = useSurveyRunController(surveyId);

  if (c.status === "loading") {
    return (
      <PageShell>
        <Text muted>Loading…</Text>
      </PageShell>
    );
  }

  // v3: prompt-based controller exposes `currentPrompt`
  if (c.status === "error" || !c.survey || !c.run || !c.currentPrompt) {
    return (
      <PageShell>
        <Heading level={2}>Run error</Heading>
        <Text muted>{c.error ?? "Unknown error"}</Text>
      </PageShell>
    );
  }

  return (
    <SurveyRunView
      // Header
      title={c.survey.title}
      description={c.survey.description}
      // Progress
      index={c.index}
      totalCount={c.totalCount}
      // Current
      promptText={c.currentPrompt.text}
      // Scale
      min={c.survey.scale.min}
      max={c.survey.scale.max}
      value={c.currentValue}
      onPickValue={c.onPickValue}
      // Nav
      canGoBack={c.canGoBack}
      canGoNext={c.canGoNext}
      onBack={c.goBack}
      onNext={c.goNext}
      isComplete={c.isComplete}
      // Finish
      onFinish={() => {
        const runId = c.finish(); // now also triggers cloud save (fallback)
        if (runId) navigate(`/result/${runId}`);
      }}
    />
  );
}
