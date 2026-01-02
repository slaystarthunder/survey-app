import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";
import type { ID } from "@core/domain/types";

type SurveyRow = {
  surveyId: ID;
  title: string;
  description?: string;
  status: "Not started" | "Done";
  latestRunId: ID | null;
};

export function HomePage() {
  const navigate = useNavigate();

  const rows: SurveyRow[] = useMemo(() => {
    const surveys = surveyRepo.list();
    const runs = runRepo.listRuns();

    return surveys.map((s) => {
      const completed = runs
        .filter((r) => r.surveyId === s.surveyId && typeof r.completedAt === "number")
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

      const latest = completed[0] ?? null;

      return {
        surveyId: s.surveyId,
        title: s.title,
        description: s.description,
        status: latest ? "Done" : "Not started",
        latestRunId: latest?.runId ?? null,
      };
    });
  }, []);

  const onExplore = (surveyId: ID, latestRunId: ID | null) => {
    if (!latestRunId) navigate(`/intro/${surveyId}`);
    else navigate(`/result/${latestRunId}`);
  };

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1>Survey App</h1>
      <p>Select a survey to explore.</p>

      {rows.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No surveys found. (Seed one via <a href="/dev">/dev</a>.)
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((r) => (
            <div
              key={r.surveyId}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 240 }}>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                {r.description ? (
                  <div style={{ opacity: 0.75, marginTop: 4 }}>{r.description}</div>
                ) : null}
                <div style={{ marginTop: 6, opacity: 0.8 }}>
                  Status: <b>{r.status}</b>
                </div>
              </div>

              <button
                onClick={() => onExplore(r.surveyId, r.latestRunId)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
