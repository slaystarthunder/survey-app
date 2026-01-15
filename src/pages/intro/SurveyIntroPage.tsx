// /src/pages/intro/SurveyIntroPage.tsx
// [FIX] If survey isn't in local surveyRepo yet, fetch it from Firebase and save it,
// so /run and other pages (which read surveyRepo) work normally.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import type { ID, SurveyBlueprint } from "@core/domain/types";

import { surveyRepoFirebase } from "@infra/firebase/repos/surveyRepoFirebase";

function getSurveyIcon(surveyId: ID) {
  if (surveyId.includes("presence")) return "🖼️";
  return "🧭";
}

function getCategoryEmoji(label: string, index: number) {
  const s = label.toLowerCase();
  if (s.includes("detached") || s.includes("meta") || s.includes("observe")) return "👁️";
  if (s.includes("dopamine") || s.includes("reward") || s.includes("motivation")) return "🍭";
  if (s.includes("absorbed") || s.includes("engage") || s.includes("flow")) return "⚡";
  if (s.includes("transcend") || s.includes("spiritual") || s.includes("connection")) return "✨";
  return ["👁️", "🍭", "⚡", "✨"][index % 4];
}

function getAboutNeedCopy(surveyId: ID) {
  if (surveyId.includes("presence")) {
    return {
      p1: "The foundational capacity to be consciously present with your inner experience in the moment, including thoughts, emotions, sensations, and impulses.",
      p2: "It creates the mental space required for self-observation, curiosity, and non-reactive choice.",
      p3: "It serves as the starting point for all deeper self-knowledge and authentic living by allowing you to witness rather than be consumed by your inner world.",
      impact: "Reduces automatic reactivity, supports self-regulation, and increases clarity of choice.",
    };
  }

  return {
    p1: "This assessment will help you map your current experience.",
    p2: "It’s a gentle tool for noticing patterns and deciding where to place attention.",
    p3: "It is not a clinical or diagnostic assessment.",
    impact: "Creates clarity on where attention may help most.",
  };
}

type Status = "loading" | "ready" | "error";

export function SurveyIntroPage() {
  const nav = useNavigate();
  const { surveyId = "" } = useParams();

  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [survey, setSurvey] = useState<SurveyBlueprint | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus("loading");
      setError(null);
      setSurvey(null);

      if (!surveyId) {
        setStatus("error");
        setError("Missing survey id.");
        return;
      }

      // 1) Try local cache first
      const local = surveyRepo.get(surveyId);
      if (local) {
        if (!cancelled) {
          setSurvey(local);
          setStatus("ready");
        }
        return;
      }

      // 2) Fallback: fetch from Firebase and persist to local repo
      try {
        const remote = await surveyRepoFirebase.get(surveyId);
        if (cancelled) return;

        if (!remote) {
          setStatus("error");
          setError("Missing or unknown survey id.");
          return;
        }

        // Save so /run and others (using surveyRepo) can find it
        surveyRepo.save(remote);

        setSurvey(remote);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  const about = useMemo(() => getAboutNeedCopy(surveyId as ID), [surveyId]);

  if (status === "loading") {
    return (
      <PageShell>
        <Card>
          <Stack gap={10}>
            <Heading level={2}>Loading…</Heading>
            <Text muted>Preparing survey.</Text>
          </Stack>
        </Card>
      </PageShell>
    );
  }

  if (status === "error" || !survey) {
    return (
      <PageShell>
        <Card>
          <Stack gap={10}>
            <Heading level={2}>Survey not found</Heading>
            <Text muted>{error ?? "Missing or unknown survey id."}</Text>
            <div style={{ marginTop: 6 }}>
              <Button onClick={() => nav("/", { replace: true })}>Back</Button>
            </div>
          </Stack>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card>
        <Stack gap={16}>
          {/* Top */}
          <Stack gap={8}>
            <Text muted style={{ fontWeight: 800, letterSpacing: 0.2 }}>
              Assessment
            </Text>
            <Heading level={1} style={{ margin: 0 }}>
              {survey.title}
            </Heading>

            <Text muted style={{ lineHeight: 1.65 }}>
              Answer honestly to create a relevant map of your current experience in life.
            </Text>

            <Text style={{ lineHeight: 1.6 }}>
              This is a self-reflection exercise.
              <br />
              <span style={{ fontWeight: 800 }}>Not a clinical or diagnostic assessment.</span>
            </Text>
          </Stack>

          {/* Categories */}
          <Stack gap={10}>
            <Text muted style={{ fontWeight: 800 }}>
              Included areas
            </Text>

            <div style={{ display: "grid", gap: 10 }}>
              {survey.categories.map((c, i) => (
                <div
                  key={c.categoryId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid rgba(67, 60, 94, 0.16)",
                    background: "rgba(255,255,255,0.10)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 18 }}>{getCategoryEmoji(c.label, i)}</div>
                    <Text style={{ fontWeight: 750 }}>{c.label}</Text>
                  </div>
                  <Text muted style={{ fontWeight: 800 }}>
                    {getSurveyIcon(survey.surveyId)}
                  </Text>
                </div>
              ))}
            </div>
          </Stack>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            <Button
              onClick={() => nav("/", { replace: true })}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.45)",
                color: "var(--fg)",
                border: "2px solid rgba(67, 60, 94, 0.55)",
                borderRadius: 12,
                padding: "12px 18px",
                fontWeight: 650,
              }}
            >
              Back
            </Button>

            <Button
              onClick={() => nav(`/run/${survey.surveyId}`)}
              style={{
                flex: 1,
                background: "rgba(67, 60, 94, 0.92)",
                color: "#fff",
                border: "2px solid rgba(67, 60, 94, 0.55)",
                borderRadius: 12,
                padding: "12px 18px",
                fontWeight: 700,
              }}
            >
              Start
            </Button>
          </div>

          {/* About the need */}
          <Stack gap={10} style={{ marginTop: 10 }}>
            <Heading level={3} style={{ margin: 0, fontSize: 22 }}>
              About the need
            </Heading>

            <Text style={{ lineHeight: 1.65 }}>{about.p1}</Text>
            <Text style={{ lineHeight: 1.65 }}>{about.p2}</Text>
            <Text style={{ lineHeight: 1.65 }}>{about.p3}</Text>

            <Text style={{ lineHeight: 1.65 }}>
              <span style={{ fontWeight: 800, color: "rgba(234, 135, 69, 0.95)" }}>Impact:</span>{" "}
              <span>{about.impact}</span>
            </Text>
          </Stack>
        </Stack>
      </Card>
    </PageShell>
  );
}
