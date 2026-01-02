// [S03] Added: Seed SurveyBlueprint for v1 testing and demos.

import type { SurveyBlueprint } from "../domain/types";

export const defaultSurvey: SurveyBlueprint = {
  surveyId: "s_default_v1",
  version: 1,
  title: "Default Assessment",
  description: "A simple 1–10 scale assessment to validate the system.",
  scale: { min: 1, max: 10, step: 1 },
  categories: [
    { categoryId: "c_energy", label: "Energy" },
    { categoryId: "c_focus", label: "Focus" },
    { categoryId: "c_mood", label: "Mood" },
  ],
  prompts: [
    { promptId: "p_energy", categoryId: "c_energy", text: "How is your energy today?" },
    { promptId: "p_focus", categoryId: "c_focus", text: "How focused do you feel?" },
    { promptId: "p_mood", categoryId: "c_mood", text: "How is your mood today?" },
  ],
};
