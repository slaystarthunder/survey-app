// /src/pages/compass/CompassPage.tsx
// Compass view (ranked focus list) – aligned with customer mockup.

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";
import { computeSummary } from "@core/domain/computeSummary";

type StatusLabel = "Emerging" | "Exploring" | "Developing" | "Integrated";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function ratioFromAvg(avg: number | null, scaleMax: number) {
  if (avg == null || !Number.isFinite(avg) || scaleMax <= 0) return 0;
  return clamp(avg / scaleMax, 0, 1);
}

function statusFromRatio(r: number): StatusLabel {
  if (r < 0.25) return "Emerging";
  if (r < 0.5) return "Exploring";
  if (r < 0.75) return "Developing";
  return "Integrated";
}

function statusColor(s: StatusLabel) {
  if (s === "Integrated") return "rgba(94, 132, 86, 0.95)";
  if (s === "Developing") return "rgba(116, 144, 82, 0.95)";
  if (s === "Exploring") return "rgba(109, 151, 141, 0.95)";
  return "rgba(130, 130, 130, 0.9)";
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
        width: "100%",
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
              background: on ? "rgba(94, 132, 86, 0.95)" : "rgba(67, 60, 94, 0.18)",
              border: "1px solid rgba(67, 60, 94, 0.14)",
            }}
          />
        );
      })}
    </div>
  );
}

function iconForLabel(label: string) {
  const s = label.toLowerCase();
  if (s.includes("meta") || s.includes("observe")) return "👁️";
  if (s.includes("dopamine") || s.includes("reward") || s.includes("motivation")) return "🧠";
  if (s.includes("flow") || s.includes("absorbed") || s.includes("engagement")) return "⚡";
  if (s.includes("spiritual") || s.includes("transcend") || s.includes("connection")) return "✨";
  return "•";
}

export function CompassPage() {
  const nav = useNavigate();

  const model = useMemo(() => {
    const surveys = surveyRepo.list();

    // Pick the newest completed run among all surveys (simple + good enough for v1).
    let bestRun: ReturnType<typeof runRepo.getLatestRunForSurvey> | null = null;

    for (const s of surveys) {
      const r = runRepo.getLatestRunForSurvey(s.surveyId);
      if (!r) continue;

      // If your run model has timestamps, this still works; otherwise it just picks the last found.
      if (!bestRun) bestRun = r;
      else {
        const a = (bestRun as any).completedAt ?? (bestRun as any).createdAt ?? 0;
        const b = (r as any).completedAt ?? (r as any).createdAt ?? 0;
        if (b > a) bestRun = r;
      }
    }

    if (!bestRun) return { ok: false as const, reason: "No completed runs yet." };

    const run = runRepo.getRun(bestRun.runId);
    if (!run) return { ok: false as const, reason: "Run not found." };

    const survey = surveyRepo.get(run.surveyId);
    if (!survey) return { ok: false as const, reason: "Survey not found." };

    const summary = computeSummary(survey, run.answers);

    // Build ranked list of sub-categories (exclude “overall” if it exists).
    const rows = survey.categories
      .map((c) => ({
        categoryId: c.categoryId,
        label: c.label,
        avg: summary.byCategory[c.categoryId]?.avg ?? null,
      }))
      .filter((r) => !r.label.toLowerCase().includes("overall"))
      .map((r) => {
        const ratio = ratioFromAvg(r.avg, survey.scale.max);
        const status = statusFromRatio(ratio);
        return { ...r, ratio, status };
      })
      .sort((a, b) => a.ratio - b.ratio);

    return {
      ok: true as const,
      surveyTitle: survey.title,
      rows,
    };
  }, []);

  return (
    <PageShell maxWidth={480}>
      <Card
        style={{
          padding: "var(--s-5)",
          background: "rgba(255,255,255,0.35)",
          borderRadius: 22,
          border: "1px solid rgba(67, 60, 94, 0.22)",
        }}
      >
        <Stack gap={14}>
          <Stack gap={8}>
            <Heading level={2} style={{ margin: 0 }}>
              Compass
            </Heading>

            <div
              style={{
                height: 3,
                width: 220,
                background: "rgba(67, 60, 94, 0.65)",
                borderRadius: 999,
              }}
            />
          </Stack>

          <Text style={{ lineHeight: 1.55 }}>
            Evolving toward a life you want to live is a journey of small, continuous steps. You can not do at once. You
            have to choose what areas you want to focus on. Below are all need sub-categories, ranked based on your
            mapping.
          </Text>

          <Stack gap={10} style={{ marginTop: 6 }}>
            <Heading level={3} style={{ margin: 0, fontSize: 22 }}>
              Where Should Your Attention Be?
            </Heading>

            <div
              style={{
                height: 2,
                width: 280,
                background: "rgba(67, 60, 94, 0.35)",
                borderRadius: 999,
              }}
            />
          </Stack>

          {!model.ok ? (
            <Text muted style={{ lineHeight: 1.6 }}>
              {model.reason}
            </Text>
          ) : (
            <Stack gap={12} style={{ marginTop: 4 }}>
              {model.rows.map((r) => (
                <div
                  key={r.categoryId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <Stack gap={6}>
                    <Text style={{ fontWeight: 650 }}>
                      <span aria-hidden style={{ marginRight: 8 }}>
                        {iconForLabel(r.label)}
                      </span>
                      {r.label}
                    </Text>

                    <SegmentedBar ratio={r.ratio} />
                  </Stack>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      aria-hidden
                      style={{
                        width: 2,
                        height: 22,
                        background: "rgba(67, 60, 94, 0.35)",
                        borderRadius: 999,
                      }}
                    />
                    <Text style={{ fontWeight: 700, color: statusColor(r.status), minWidth: 86, textAlign: "right" }}>
                      {r.status}
                    </Text>
                  </div>
                </div>
              ))}
            </Stack>
          )}

          <Button
            onClick={() => nav("/needs")}
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 12,
              padding: "14px 16px",
              background: "rgba(67, 60, 94, 0.92)",
              color: "#fff",
              border: "2px solid rgba(67, 60, 94, 0.15)",
              fontWeight: 750,
              fontSize: 18,
            }}
          >
            Maps Of Needs
          </Button>
        </Stack>
      </Card>
    </PageShell>
  );
}
