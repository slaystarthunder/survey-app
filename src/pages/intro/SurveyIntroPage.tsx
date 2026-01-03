// /src/pages/intro/SurveyIntroPage.tsx

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

  return (
    <PageShell maxWidth={480}>
      {/* Optional: add a bit of top breathing room */}
      <div style={{ paddingTop: "var(--s-4)" }}>
        <Card
          style={{
            background: "rgba(255,255,255,0.35)", // closer to mock soft card
            borderRadius: "22px",
            padding: "var(--s-4)",
          }}
        >
          <Stack gap={16}>
            <Stack gap={10}>
              <Heading level={2}>Welcome to the Presence &amp; Awareness Assessment</Heading>

              <Text>
                This need is the foundational capacity to be consciously present with your inner experience in the
                moment, including thoughts, emotions, sensations, and impulses.
              </Text>

              <Text>It creates the mental space required for self-observation, curiosity, and non-reactive choice.</Text>

              <Text>
                It serves as the starting point for all deeper self-knowledge and authentic living by allowing you to
                witness rather than be consumed by your inner world.
              </Text>

              <Text>
                <b style={{ color: "var(--accent)" }}>Impact:</b>{" "}
                Presence &amp; Awareness reduces automatic reactivity, fosters true freedom of response, and enables
                access to higher states of flow and transcendence.
              </Text>

              <Text muted>This short self-assessment tool helps you explore how present and aware you are in your daily life.</Text>

              <Text muted>It consists of four key categories:</Text>

              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                <li>👁️ Detached awareness / meta-observation</li>
                <li>🍬 Dopamine awareness / reward &amp; motivation tracking</li>
                <li>⚡ Absorbed engagement / flow</li>
                <li>✨ Transcendence / spiritual connection</li>
              </ul>

              <Text muted style={{ lineHeight: 1.5 }}>
                This is a self-reflection exercise, not a clinical or diagnostic assessment.
                <br />
                It takes about <b style={{ color: "var(--fg)" }}>5–7 minutes</b> to complete.
                <br />
                You will rate 20 statements about the four categories plus 3 overall statements using a 7-point scale.
              </Text>

              <Text muted>
                There are no right or wrong answers — answer honestly indicating how much it describes your current experience.
              </Text>
            </Stack>

            {/* Button row */}
            <div
              style={{
                width: "100%",
                paddingTop: "var(--s-2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "var(--s-3)",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="ghost"
                  onClick={() => nav("/needs")}
                  style={{
                    padding: "12px 22px", // wider side padding
                    minWidth: 120,
                  }}
                >
                  Back
                </Button>

                <Button
                  onClick={() => nav(`/run/${survey.surveyId}`)}
                  style={{
                    fontWeight: 800,
                    padding: "12px 28px", // wider side padding
                    minWidth: 140,
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          </Stack>
        </Card>
      </div>
    </PageShell>
  );
}
