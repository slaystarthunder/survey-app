// /src/core/seed/seedMockupSurveyHeadlinesToFirebase.ts
// Seeds the customer's mockup survey headlines into Firestore.
// - Presence & Awareness is kept as the real survey IF you want (optional flag below)
// - Other surveys are "headline-only" (categories/prompts empty) => triggers "Coming soon" popup.

import type { SurveyBlueprint, ID } from "@core/domain/types";
import { surveyRepoFirebase } from "@infra/firebase/repos/surveyRepoFirebase";

// If you want Presence & Awareness to be full/real, import your real blueprint and set USE_REAL_PRESENCE = true.
// Otherwise it will also be seeded as a headline-only placeholder.
import { presenceAwarenessSurvey } from "@core/seed/seedPerspectiveCircle"; // <-- this exists in your project

const USE_REAL_PRESENCE = true;

const SCALE = { min: 1, max: 7, step: 1 };

function toSurveyId(title: string): ID {
  // Stable, readable ids. Matches your "s_presence_awareness_v1" style.
  const slug = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (`s_${slug}_v1` as ID);
}

function headlineOnlySurvey(title: string): SurveyBlueprint {
  return {
    surveyId: toSurveyId(title),
    version: 1,
    title,
    description: "",
    scale: SCALE,
    categories: [],
    prompts: [],
  };
}

export async function seedMockupSurveyHeadlinesToFirebase(): Promise<void> {
  const titles = [
    "Presence & Awareness",
    "Cognitive & Intellectual Fulfillment",
    "Rest & Recovery",
    "Identity & Esteem",
    "Social Connection",
    "Safety & Security",
    "Autonomy & Freedom",
    "Health & Vitality",
    "Purpose & Meaning",
  ];

  const surveys: SurveyBlueprint[] = titles.map(headlineOnlySurvey);

  if (USE_REAL_PRESENCE) {
    // Replace the placeholder version of Presence & Awareness with the real blueprint
    surveys[0] = presenceAwarenessSurvey;
  }

  for (const s of surveys) {
    await surveyRepoFirebase.save(s);
  }
}
