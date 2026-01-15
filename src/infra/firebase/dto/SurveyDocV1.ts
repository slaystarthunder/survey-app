// /src/infra/firebase/dto/SurveyDocV1.ts
// Firestore document shape for SurveyBlueprint (v1)

import type { ID, SurveyBlueprint } from "@core/domain/types";

export type SurveyDocV1 = {
  schemaVersion: 1;

  // Use surveyId as the Firestore doc id AND store it in the doc for redundancy.
  surveyId: ID;

  // Core survey fields
  version: SurveyBlueprint["version"];
  title: SurveyBlueprint["title"];
  description?: SurveyBlueprint["description"];

  scale: SurveyBlueprint["scale"];
  categories: SurveyBlueprint["categories"];
  prompts: SurveyBlueprint["prompts"];

  // bookkeeping
  updatedAt: number;
};
