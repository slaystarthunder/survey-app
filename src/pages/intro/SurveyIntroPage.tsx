// /src/pages/intro/SurveyIntroPage.tsx
// [S08] Updated: Survey intro (Section 3) — mock-aligned layout + copy framing.

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { surveyRepo } from "@core/data/surveyRepo";
import type { ID } from "@core/domain/types";

function getSurveyIcon(surveyId: ID) {
  // simple placeholder until surveys have an icon field
  if (surveyId.includes("presence")) return "🖼️";
  return "🧭";
}

function getCategoryEmoji(label: string, index: number) {
  const s = label.toLowerCase();
  if (s.includes("detached") || s.includes("meta") || s.includes("observe")) return "👁️";
  if (s.includes("dopamine") || s.includes("reward") || s.includes("motivation")) return "🍭";
  if (s.includes("absorbed") || s.includes("engage") || s.includes("flow")) return "⚡";
  if (s.includes("transcend") || s.includes("spiritual") || s.includes("connection")) return "✨";
  // fallback: rotate a few friendly icons
  return ["👁️", "🍭", "⚡", "✨"][index % 4];
}

function getAboutNeedCopy(surveyId: ID) {
  // v1: only one real survey exists; match the mock tone for this one.
  if (surveyId.includes("presence")) {
    return {
      p1: "The foundational capacity to be consciously present with your inner experience in the moment, including thoughts, emotions, sensations, and impulses.",
      p2: "It creates the mental space required for self-observation, curiosity, and non-reactive choice.",
      p3: "It serves as the starting point for all deeper self-knowledge and authentic living by allowing you to witness rather than be consumed by your inner world.",
      impact:
        "It reduces automatic reactivity, fosters true freedom of response, and enables access to higher states of flow and transcendence.",
    };
  }

  // placeholder for future surveys
  return {
    p1: "A foundational capacity that supports self-awareness and balance in daily life.",
    p2: "It helps you notice patterns, understand what matters, and respond with more intention.",
    p3: "This is not about being perfect — it’s about seeing clearly and choosing what to attend to next.",
    impact: "It supports steady change by making your next step feel simpler and more honest.",
  };
}

export function SurveyIntroPage() {
  const { surveyId = "" } = useParams();
  const nav = useNavigate();

  const survey = useMemo(() => (surveyId ? surveyRepo.get(surveyId) : null), [surveyId]);

  if (!survey) {
    return (
      <PageShell maxWidth={480}>
        <Card style={{ padding: "var(--s-5)", borderRadius: 26, background: "rgba(255,255,255,0.18)" }}>
          <Stack gap={10}>
            <Heading level={2}>Survey not found</Heading>
            <Text muted>Missing or unknown survey id.</Text>
            <div style={{ marginTop: 8 }}>
              <Button onClick={() => nav("/", { replace: true })}>Back</Button>
            </div>
          </Stack>
        </Card>
      </PageShell>
    );
  }

  const about = getAboutNeedCopy(survey.surveyId);

  // categories shown in mock as "4 sub-categories"
  const cats = survey.categories ?? [];

  return (
    <PageShell maxWidth={480}>
      <Card
        style={{
          padding: "var(--s-5)",
          borderRadius: 26,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(67, 60, 94, 0.10)",
          boxShadow: "var(--shadow-1)",
        }}
      >
        <Stack gap={18}>
          {/* Header row: icon tile + assessment label + title */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Icon tile */}
            <div
              aria-hidden
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(67, 60, 94, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              <span style={{ fontSize: 18 }}>{getSurveyIcon(survey.surveyId)}</span>
            </div>

            <div style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: 700, color: "rgba(234, 135, 69, 0.95)", marginBottom: 2 }}>
                Assessment
              </Text>

              <Heading
                level={2}
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.1,
                  letterSpacing: 0.2,
                }}
              >
                {survey.title}
              </Heading>

              {/* Divider line under title */}
              <div
                style={{
                  height: 2,
                  width: 240,
                  marginTop: 10,
                  background: "rgba(67, 60, 94, 0.65)",
                  borderRadius: 999,
                }}
              />
            </div>
          </div>

          {/* Intro copy */}
          <Stack gap={12}>
            <Text style={{ lineHeight: 1.6 }}>
              Take{" "}
              <span style={{ fontWeight: 800, color: "rgba(74, 140, 122, 0.95)" }}>5–7 minutes</span> to assess yourself
              and explore how present and aware you are in your daily life.
            </Text>

            <Text style={{ lineHeight: 1.6 }}>
              Using a {survey.scale?.max ?? 7}-point scale, rate statements across{" "}
              <span style={{ fontWeight: 800 }}>{cats.length || 4}</span> sub-categories:
            </Text>

            {/* Category list */}
            <div style={{ paddingLeft: 4 }}>
              {cats.slice(0, 4).map((c, i) => (
                <div key={c.categoryId ?? c.label ?? i} style={{ display: "flex", gap: 10, margin: "6px 0" }}>
                  <Text style={{ width: 18, textAlign: "right" }}>{i + 1}.</Text>
                  <Text style={{ width: 24 }}>{getCategoryEmoji(c.label ?? "", i)}</Text>
                  <Text style={{ fontWeight: 650 }}>{c.label}</Text>
                </div>
              ))}
            </div>

            <Text style={{ lineHeight: 1.6 }}>
              Needs are subjective - there are no right or wrong answers. Answer honestly to create a relevant map of your
              current experience in life.
            </Text>

            <Text style={{ lineHeight: 1.6 }}>
              This is a self-reflection exercise.
              <br />
              <span style={{ fontWeight: 800 }}>Not a clinical or diagnostic assessment.</span>
            </Text>
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
