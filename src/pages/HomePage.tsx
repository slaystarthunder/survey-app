// /src/pages/HomePage.tsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";
import type { ID } from "@core/domain/types";

type Row = {
  surveyId: ID;
  title: string;
  latestRunId: ID | null;
};

function getIconForSurveyId(surveyId: string) {
  // quick placeholder mapping — tweak later
  if (surveyId.includes("presence")) return "🖼️";
  return "🧭";
}

export function HomePage() {
  const nav = useNavigate();

  const rows = useMemo<Row[]>(() => {
    const surveys = surveyRepo.list();

    return surveys.map((s) => {
      const latest = runRepo.getLatestRunForSurvey(s.surveyId);

      return {
        surveyId: s.surveyId,
        title: s.title,
        latestRunId: latest?.runId ?? null,
      };
    });
  }, []);

  const onExplore = (surveyId: ID, latestRunId: ID | null) => {
    // If completed, go to result; else intro
    if (latestRunId) nav(`/result/${latestRunId}`);
    else nav(`/intro/${surveyId}`);
  };

  return (
    <PageShell maxWidth={480}>
      <Card style={{ padding: "var(--s-5)" }}>
        <Stack gap={14}>
          <Stack gap={10}>
            <Heading level={2}>Your Map Of Needs</Heading>

            <Text style={{ lineHeight: 1.5 }}>
              You need a map to know where you are, &amp; to find the way to where you want to be. Without a map, you
              are lost. A good starting point are the universal human needs below.
            </Text>
          </Stack>

          {rows.length === 0 ? (
            <Text muted>No surveys found.</Text>
          ) : (
            <Stack gap={12} style={{ marginTop: 6 }}>
              {rows.map((r) => (
                <div
                  key={r.surveyId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span aria-hidden="true">{getIconForSurveyId(r.surveyId)}</span>
                    <Text style={{ fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.title}
                    </Text>
                  </div>

                  <Button
                    onClick={() => onExplore(r.surveyId, r.latestRunId)}
                    style={{
                      background: "var(--primary)",
                      color: "#fff",
                      border: "1px solid transparent",
                      padding: "8px 14px",
                      borderRadius: 8,
                      minWidth: 96,
                    }}
                  >
                    Explore
                  </Button>
                </div>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </PageShell>
  );
}
