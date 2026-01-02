// /src/pages/needs/NeedsMapPage.tsx
// Needs Map hub – styled closer to customer mockups.

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";

type Status = "Not started" | "Done";

function SegmentedBar({ valuePct }: { valuePct: number }) {
  const segments = 10;
  const filled = Math.round((valuePct / 100) * segments);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < filled;
        return (
          <div
            key={i}
            style={{
              width: 18,
              height: 12,
              borderRadius: 3,
              border: "1px solid var(--border)",
              background: on ? "var(--secondary)" : "var(--surface)",
            }}
          />
        );
      })}
    </div>
  );
}

function statusToPct(status: Status) {
  // Simple now: done = 70-ish (like mockup), not started = 0
  return status === "Done" ? 75 : 0;
}

function pctToLabel(p: number) {
  if (p >= 85) return "Integrated";
  if (p >= 65) return "Developing";
  if (p >= 45) return "Exploring";
  return "Emerging";
}

export function NeedsMapPage() {
  const nav = useNavigate();

  const surveys = useMemo(() => surveyRepo.list(), []);
  const runs = useMemo(() => runRepo.listRuns(), []);

  const statusBySurveyId = useMemo(() => {
    const doneIds = new Set(runs.map((r) => r.surveyId));
    return new Map<string, Status>(
      surveys.map((s) => [s.surveyId, doneIds.has(s.surveyId) ? "Done" : "Not started"])
    );
  }, [runs, surveys]);

  const first = surveys[0] ?? null;
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>(() => first?.surveyId ?? "");

  if (!first) {
    return (
      <PageShell>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "14px 0 28px" }}>
          <Stack gap={14}>
            <Heading level={2}>Your Map Of Needs</Heading>
            <Text muted>No surveys found yet. Seed one first, then come back here.</Text>

            <Stack direction="row" gap={10} wrap="wrap">
              <Button onClick={() => nav("/dev/tools")}>Go to Dev Tools (seed)</Button>
              <Button variant="ghost" onClick={() => nav("/admin/surveys")}>
                Go to Admin
              </Button>
            </Stack>
          </Stack>
        </div>
      </PageShell>
    );
  }

  const selected = surveys.find((s) => s.surveyId === selectedSurveyId) ?? first;
  const selectedStatus = statusBySurveyId.get(selected.surveyId) ?? "Not started";
  const selectedPct = statusToPct(selectedStatus);

  return (
    <PageShell>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "14px 0 28px" }}>
        <Card>
          <div style={{ padding: 18 }}>
            <Stack gap={14}>
              <Heading level={2}>Your Map Of Needs</Heading>

              <Text muted style={{ lineHeight: 1.55 }}>
                You need a map to know where you are, &amp; to find the way to where you want to be.
                Without a map, you are lost. A good starting point are the universal human needs below.
              </Text>

              {/* Selected area (like right mockup) */}
              <div style={{ padding: "10px 0 6px" }}>
                <Stack gap={8}>
                  <Stack direction="row" justify="space-between" style={{ gap: 12, alignItems: "center" }}>
                    <Text style={{ fontWeight: 750 }}>{selected.title}</Text>
                    <Text muted style={{ fontSize: 12 }}>
                      {pctToLabel(selectedPct)}
                    </Text>
                  </Stack>

                  <SegmentedBar valuePct={selectedPct} />
                </Stack>
              </div>

              <div style={{ height: 1, background: "var(--border)", opacity: 0.7 }} />

              {/* List */}
              <Stack gap={10}>
                {surveys.map((s) => {
                  const isSelected = s.surveyId === selected.surveyId;
                  return (
                    <div
                      key={s.surveyId}
                      onClick={() => setSelectedSurveyId(s.surveyId)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "8px 10px",
                        borderRadius: 12,
                        background: isSelected ? "var(--surface-strong)" : "transparent",
                      }}
                    >
                      <Text style={{ fontWeight: 650 }}>{s.title}</Text>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Explore flow is marked 'later'. For now: use Reassess to run the assessment.");
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 999,
                          background: "var(--primary)",
                          color: "#ffffff",
                          border: "1px solid transparent",
                          fontWeight: 700,
                        }}
                      >
                        Explore
                      </Button>
                    </div>
                  );
                })}
              </Stack>

              <Stack direction="row" gap={10} wrap="wrap" style={{ marginTop: 6 }}>
                <Button
                  variant="ghost"
                  onClick={() => nav("/admin/surveys")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  Admin
                </Button>

                <Button
                  onClick={() => nav(`/intro/${selected.surveyId}`)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "var(--accent)",
                    color: "#ffffff",
                    border: "1px solid transparent",
                    fontWeight: 800,
                  }}
                >
                  Reassess
                </Button>
              </Stack>
            </Stack>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
