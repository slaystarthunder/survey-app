// /src/pages/HomePage.tsx
// [S10] Updated: HomePage with “completed/in-progress” row UI (Section 6).
// - Real survey shows progress/status instead of Explore button when a run exists.
// - Title + progress bar are clickable.
// - Placeholder surveys remain visible for UI polish.

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";
import type { ID, ResponseState } from "@core/domain/types";

type Row = {
  surveyId: ID;
  title: string;
  latestRunId: ID | null;
  run: ResponseState | null;
  totalCount: number;
  answeredCount: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function getIconForSurveyId(surveyId: string) {
  if (surveyId.includes("presence")) return "🖼️";
  return "🧭";
}

function statusFromProgress(answered: number, total: number) {
  if (total <= 0) return "Emerging";
  const r = answered / total;
  if (r < 0.25) return "Emerging";
  if (r < 0.5) return "Exploring";
  if (r < 0.75) return "Developing";
  return "Integrated";
}

function SegmentedBar({ ratio }: { ratio: number }) {
  const total = 10;
  const filled = Math.round(clamp(ratio, 0, 1) * total);

  return (
    <div
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${total}, 1fr)`,
        gap: 3,
        width: 170,
        maxWidth: "100%",
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <div
            key={i}
            style={{
              height: 14,
              borderRadius: 2,
              background: on ? "rgba(128, 150, 80, 0.95)" : "rgba(67, 60, 94, 0.12)",
              border: "1px solid rgba(67, 60, 94, 0.10)",
            }}
          />
        );
      })}
    </div>
  );
}

export function HomePage() {
  const nav = useNavigate();

  const rows = useMemo<Row[]>(() => {
    const surveys = surveyRepo.list();

    return surveys.map((s) => {
      const latest = runRepo.getLatestRunForSurvey(s.surveyId);
      const run = latest ? runRepo.getRun(latest.runId) : null;

      const totalCount = s.prompts?.length ?? 0;

      let answeredCount = 0;
      if (run && s.prompts) {
        for (const p of s.prompts) {
          if (typeof run.answers?.[p.promptId] === "number") answeredCount += 1;
        }
      }

      return {
        surveyId: s.surveyId,
        title: s.title,
        latestRunId: latest?.runId ?? null,
        run,
        totalCount,
        answeredCount,
      };
    });
  }, []);

  const goToSurvey = (surveyId: ID, run: ResponseState | null, latestRunId: ID | null) => {
    if (!latestRunId || !run) {
      nav(`/intro/${surveyId}`);
      return;
    }

    if (run.completedAt) {
      nav(`/result/${latestRunId}`);
      return;
    }

    // in-progress: resume run flow
    nav(`/run/${surveyId}`);
  };

  return (
    <PageShell maxWidth={480}>
      <Card style={{ padding: "var(--s-5)", borderRadius: 26, background: "rgba(255,255,255,0.18)" }}>
        <Stack gap={14}>
          <Stack gap={10}>
            <Heading level={2}>Maps Of Needs</Heading>

            <Text style={{ lineHeight: 1.5 }}>
              You need a map to know where You are.
              <br />
              And to find the way to where You want to be.
              <br />
              Without a map, You are lost.
            </Text>

            <Heading level={3} style={{ marginTop: 8 }}>
              What do you need?
            </Heading>

            <div
              style={{
                height: 2,
                width: 210,
                background: "rgba(67, 60, 94, 0.55)",
                borderRadius: 999,
                marginTop: -6,
              }}
            />
          </Stack>

          {rows.length === 0 ? (
            <Text muted>No surveys found.</Text>
          ) : (
            <Stack gap={14} style={{ marginTop: 6 }}>
              {rows.map((r) => {
                const hasRun = Boolean(r.latestRunId && r.run);
                const isCompleted = Boolean(r.run?.completedAt);
                const ratio = r.totalCount > 0 ? r.answeredCount / r.totalCount : 0;
                const status = hasRun
                  ? isCompleted
                    ? statusFromProgress(r.answeredCount, r.totalCount)
                    : "In progress"
                  : null;

                return (
                  <div
                    key={r.surveyId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    {/* Left: icon + title + (optional) progress; clickable when run exists */}
                    <button
                      type="button"
                      onClick={() => goToSurvey(r.surveyId, r.run, r.latestRunId)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        textAlign: "left",
                        cursor: "pointer",
                        minWidth: 0,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <span aria-hidden="true">{getIconForSurveyId(r.surveyId)}</span>

                        <div style={{ minWidth: 0 }}>
                          <Text
                            style={{
                              fontWeight: 650,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {r.title}
                          </Text>

                          {/* Only show progress block when we have a run */}
                          {hasRun ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                              <SegmentedBar ratio={ratio} />

                              {/* status column like mock */}
                              <div
                                aria-hidden
                                style={{
                                  width: 2,
                                  height: 16,
                                  background: "rgba(110, 155, 145, 0.55)",
                                  borderRadius: 999,
                                }}
                              />

                              <Text muted style={{ fontWeight: 800 }}>
                                {status}
                              </Text>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>

                    {/* Right: Explore button for “no run yet” OR placeholder surveys */}
                    {!hasRun ? (
                      <Button
                        onClick={() => nav(`/intro/${r.surveyId}`)}
                        style={{
                          background: "rgba(67, 60, 94, 0.92)",
                          color: "#fff",
                          border: "1px solid transparent",
                          padding: "8px 14px",
                          borderRadius: 8,
                          minWidth: 96,
                          fontWeight: 700,
                        }}
                      >
                        Explore
                      </Button>
                    ) : (
                      // For run rows we hide the button like the mock (clickable title + bar instead)
                      <div style={{ width: 96 }} />
                    )}
                  </div>
                );
              })}
            </Stack>
          )}

          {/* Optional: big CTA like mock (“Compass”) — keep as placeholder for now */}
          <div style={{ marginTop: 14 }}>
            <Button
              variant="ghost"
              style={{
                width: "100%",
                borderRadius: 14,
                padding: "14px 16px",
                border: "2px solid rgba(67, 60, 94, 0.22)",
                background: "rgba(67, 60, 94, 0.92)",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              Compass
            </Button>
          </div>
        </Stack>
      </Card>
    </PageShell>
  );
}
