// /src/core/seed/seedMockSurveysToFirebase.ts
import type { SurveyBlueprint, ID } from "@core/domain/types";
import { surveyRepoFirebase } from "@infra/firebase/repos/surveyRepoFirebase";

const SCALE = { min: 1, max: 7, step: 1 };

function slugToId(title: string): ID {
  return (
    "s_" +
    title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") +
    "_v1"
  ) as ID;
}

function headlineOnlySurvey(title: string): SurveyBlueprint {
  return {
    surveyId: slugToId(title),
    version: 1,
    title,
    description: "",
    scale: SCALE,
    categories: [],
    prompts: [],
  };
}

export async function seedMockupHeadlinesToFirebase() {
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

  // If you want Presence & Awareness to remain your full “real” one,
  // you can replace surveys[0] with your real blueprint instead.
  // (We can wire that in right after you confirm where the real blueprint lives.)

  for (const s of surveys) {
    await surveyRepoFirebase.save(s);
  }
}
