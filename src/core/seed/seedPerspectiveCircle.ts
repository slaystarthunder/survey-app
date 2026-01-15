// [SEED] Added: Seed the client's Perspective Circle survey into local storage via surveyRepo.

import type { SurveyBlueprint } from "../domain/types";
import { surveyRepo } from "../data/surveyRepo";

/**
 * NOTE:
 * - Scale requires { min, max, step } (step was missing).
 * - surveyRepo does NOT have upsert(); it has save().
 * - DevToolsPage expects an exported function named seedPerspectiveCircleSurvey.
 */

export const presenceAwarenessSurvey: SurveyBlueprint = {
  surveyId: "s_presence_awareness_v1",
  version: 1,

  title: "Presence & Awareness",
  description:
    "A short reflective assessment to map your awareness, motivation, and engagement patterns.",

  scale: { min: 1, max: 7, step: 1 },

  categories: [
    { categoryId: "c_meta_observation", label: "Meta-observation / Detached awareness" },
    { categoryId: "c_dopamine_awareness", label: "Dopamine awareness / Reward & motivation tracking" },
    { categoryId: "c_flow_engagement", label: "Absorbed engagement / Flow" },
    { categoryId: "c_spiritual_connection", label: "Spiritual connection / Transcendence" },
  ],

  prompts: [
    {
      promptId: "p_meta_01",
      categoryId: "c_meta_observation",
      text: "I can notice when my mind is wandering without getting lost in it.",
    },
    {
      promptId: "p_meta_02",
      categoryId: "c_meta_observation",
      text: "I can observe emotions without needing to immediately act on them.",
    },
    {
      promptId: "p_meta_03",
      categoryId: "c_meta_observation",
      text: "I can recognize impulses as impulses before following them.",
    },

    {
      promptId: "p_dopa_01",
      categoryId: "c_dopamine_awareness",
      text: "I can tell when I’m chasing short-term reward rather than what truly matters to me.",
    },
    {
      promptId: "p_dopa_02",
      categoryId: "c_dopamine_awareness",
      text: "I notice what triggers my craving for stimulation or distraction.",
    },
    {
      promptId: "p_dopa_03",
      categoryId: "c_dopamine_awareness",
      text: "I can choose actions that align with long-term values over quick relief.",
    },

    {
      promptId: "p_flow_01",
      categoryId: "c_flow_engagement",
      text: "I regularly become fully absorbed in activities that feel meaningful.",
    },
    {
      promptId: "p_flow_02",
      categoryId: "c_flow_engagement",
      text: "When I work on something important, I can stay engaged without constant friction.",
    },
    {
      promptId: "p_flow_03",
      categoryId: "c_flow_engagement",
      text: "I experience moments where action feels natural and effortless.",
    },

    {
      promptId: "p_spirit_01",
      categoryId: "c_spiritual_connection",
      text: "I sometimes feel connected to something larger than myself (nature, meaning, life).",
    },
    {
      promptId: "p_spirit_02",
      categoryId: "c_spiritual_connection",
      text: "I can access a sense of awe, wonder, or deep appreciation in daily life.",
    },
    {
      promptId: "p_spirit_03",
      categoryId: "c_spiritual_connection",
      text: "I feel grounded in a sense of purpose beyond short-term outcomes.",
    },
  ],
};

export function seedPresenceAwarenessSurvey(): SurveyBlueprint {
  const res = surveyRepo.save(presenceAwarenessSurvey);
  if (!res.ok) {
    throw new Error("Seed failed: survey is invalid. Check validateSurvey issues.");
  }
  return presenceAwarenessSurvey;
}

/** Back-compat name expected by /dev/tools */
export function seedPerspectiveCircleSurvey(): SurveyBlueprint {
  return seedPresenceAwarenessSurvey();
}

