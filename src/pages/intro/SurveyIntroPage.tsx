// /src/pages/intro/SurveyIntroPage.tsx
// Presenter screen (comes before the questions)

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";


export function SurveyIntroPage() {
  const { surveyId = "" } = useParams();
  const nav = useNavigate();

  const survey = useMemo(() => (surveyId ? surveyRepo.get(surveyId) : null), [surveyId]);

  if (!survey) {
    return (
      <PageShell>
        <Stack gap={12}>
          <Heading level={2}>Intro error</Heading>
          <Text muted>Could not find survey: {surveyId || "(missing surveyId)"}</Text>
          <Text muted>
            Try: <a href="/admin/surveys">/admin/surveys</a>
          </Text>
        </Stack>
      </PageShell>
    );
  }

  // This is the text from your screenshot.
  // (Later we can make this come from the survey blueprint if you want.)
  return (
    <PageShell>
      <div
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Card style={{ width: "min(820px, 100%)" }}>
          <Stack gap={16} style={{ padding: 10 }}>
            <Stack gap={8}>
              <Heading level={2}>Welcome to the Presence &amp; Awareness Assessment</Heading>
              <Text>
                This short self-reflection tool helps you explore how present and aware you are in your daily life.
              </Text>
              <Text>It focuses on four key aspects:</Text>

              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                <li>👁️ Detached awareness / meta-observation</li>
                <li>🍬 Dopamine awareness / reward &amp; motivation tracking</li>
                <li>⚡ Absorbed engagement / flow</li>
                <li>✨ Transcendence / spiritual connection</li>
              </ul>

              <Text muted style={{ lineHeight: 1.5 }}>
                This is a self-reflection exercise and not a clinical or diagnostic assessment. The questionnaire takes
                about 5–7 minutes to complete. You will rate 20 statements about the four aspects plus 3 overall
                statements. For each statement please indicate how much it describes your current experience, using a
                7-point scale.
              </Text>

              <Text muted>There are no right or wrong answers — answer honestly and complete all questions.</Text>
            </Stack>

            <Stack direction="row" justify="space-between" gap={10} wrap="wrap">
              <Button variant="ghost" onClick={() => nav("/admin/surveys")}>
                Back
              </Button>
              <Button onClick={() => nav(`/run/${survey.surveyId}`)} style={{ fontWeight: 800 }}>
                Start
              </Button>
            </Stack>
          </Stack>
        </Card>
      </div>
    </PageShell>
  );
}
