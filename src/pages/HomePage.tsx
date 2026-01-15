// /src/pages/HomePage.tsx
// FINAL – visual polish aligned with mockup (smaller text + dotted leaders)
// Segmented bar visually aligned with Compass page

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepoFirebase } from "@infra/firebase/repos/surveyRepoFirebase";
import { runRepo } from "@core/data/runRepo";
import type { ID, ResponseState, SurveyBlueprint } from "@core/domain/types";
import { computeSummary } from "@core/domain/computeSummary";

type Row = {
  surveyId: ID;
  title: string;
  latestRunId: ID | null;
  run: ResponseState | null;
  survey: SurveyBlueprint;
};

const ACTIVE_SURVEY_ID: ID = "s_presence_awareness_v1";

/* ---------- helpers ---------- */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function getIconForSurveyId(id: string) {
  if (id.includes("presence")) return "🖼️";
  return "⏱️";
}

function pctToLabel(p: number) {
  if (p >= 85) return "Integrated";
  if (p >= 65) return "Developing";
  if (p >= 45) return "Exploring";
  return "Emerging";
}

/* ---------- Compass-style segmented bar ---------- */

function SegmentedBar({ ratio }: { ratio: number }) {
  const total = 10;
  const filled = Math.round(clamp(ratio, 0, 1) * total);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${total}, 1fr)`,
        gap: 3,
        maxWidth: 220,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <div
            key={i}
            style={{
              height: 16,
              borderRadius: 2,
              background: on
                ? "rgba(94, 132, 86, 0.95)"
                : "rgba(67, 60, 94, 0.18)",
              border: "1px solid rgba(67, 60, 94, 0.14)",
            }}
          />
        );
      })}
    </div>
  );
}

function computeScorePct(survey: SurveyBlueprint, run: ResponseState): number {
  const summary = computeSummary(survey, run.answers ?? {});
  if (summary.overallAvg == null) return 0;

  const min = survey.scale?.min ?? 1;
  const max = survey.scale?.max ?? 7;
  return Math.round(clamp((summary.overallAvg - min) / (max - min), 0, 1) * 100);
}

/* ---------- page ---------- */

export function HomePage() {
  const nav = useNavigate();

  const [surveys, setSurveys] = useState<SurveyBlueprint[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await surveyRepoFirebase.list();
        if (cancelled) return;

        // Presence first – always
        list.sort((a, b) =>
          a.surveyId === ACTIVE_SURVEY_ID ? -1 : b.surveyId === ACTIVE_SURVEY_ID ? 1 : 0
        );

        setSurveys(list);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo<Row[]>(() => {
    return surveys.map((s) => {
      const latest = runRepo.getLatestRunForSurvey(s.surveyId);
      return {
        surveyId: s.surveyId,
        title: s.title,
        latestRunId: latest?.runId ?? null,
        run: latest ? runRepo.getRun(latest.runId) : null,
        survey: s,
      };
    });
  }, [surveys]);

  const hasCompletedAny = rows.some((r) => r.run?.completedAt);

  const isAvailable = (r: Row) =>
    r.surveyId === ACTIVE_SURVEY_ID && (r.survey.prompts?.length ?? 0) > 0;

  const comingSoon = () => alert("Evaluation not live yet. Coming soon.");

  const openSurvey = (r: Row) => {
    if (!isAvailable(r)) return comingSoon();
    if (r.run?.completedAt && r.latestRunId) return nav(`/result/${r.latestRunId}`);
    nav(`/intro/${r.surveyId}`);
  };

  return (
    <PageShell>
      <Card>
        <Stack gap={20}>
          {/* Header */}
          <Stack gap={4}>
            <Heading level={1} style={{ fontSize: 28 }}>
              Maps of Needs
            </Heading>
            <Text muted style={{ fontSize: 14 }}>
              Explore your categories after completing a survey.
            </Text>
          </Stack>

          {status === "loading" && <Text muted>Loading…</Text>}

          {status === "ready" && (
            <Stack gap={12}>
              {rows.map((r) => {
                const completed = Boolean(r.run?.completedAt);
                const pct = completed && r.run ? computeScorePct(r.survey, r.run) : 0;

                return (
                  <div
                    key={r.surveyId}
                    onClick={() => openSurvey(r)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 16,
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.35)",
                      cursor: "pointer",
                    }}
                  >
                    {/* Row header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span>{getIconForSurveyId(r.surveyId)}</span>

                      <Text style={{ fontSize: 15, fontWeight: 600 }}>{r.title}</Text>

                      {!completed && (
                        <>
                          {/* dotted leader */}
                          <div
                            style={{
                              flex: 1,
                              height: 1,
                              margin: "0 8px",
                              background:
                                "repeating-linear-gradient(to right, #bbb 0 4px, transparent 4px 8px)",
                            }}
                          />
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openSurvey(r);
                            }}
                            style={{
                              background: "#5B3A78",
                              padding: "8px 22px",
                              borderRadius: 999,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            Explore
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Completed bar */}
                    {completed && (
                      <div style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 13, marginBottom: 6 }}>
                          {pctToLabel(pct)}
                        </Text>
                        <SegmentedBar ratio={pct / 100} />
                        <Text muted style={{ fontSize: 12, marginTop: 6 }}>
                          {pct}%
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </Stack>
          )}

          {hasCompletedAny && (
            <Button
              onClick={() => nav("/compass")}
              style={{
                marginTop: 12,
                background: "#4E4964",
                borderRadius: 18,
                padding: "14px",
                fontWeight: 700,
              }}
            >
              Compass
            </Button>
          )}
        </Stack>
      </Card>
    </PageShell>
  );
}
