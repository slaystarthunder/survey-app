// /src/infra/firebase/mappers/surveyMapperV1.ts
import type { SurveyBlueprint } from "@core/domain/types";
import type { SurveyDocV1 } from "@infra/firebase/dto/SurveyDocV1";

export function surveyToDocV1(survey: SurveyBlueprint, now = Date.now()): SurveyDocV1 {
  return {
    schemaVersion: 1,
    surveyId: survey.surveyId,
    version: survey.version,
    title: survey.title,
    description: survey.description,
    scale: survey.scale,
    categories: survey.categories,
    prompts: survey.prompts,
    updatedAt: now,
  };
}

export function docToSurveyV1(doc: SurveyDocV1): SurveyBlueprint {
  // Minimal sanity guards. Keep it strict-ish to avoid silent bad data.
  if (doc.schemaVersion !== 1) {
    throw new Error(`Unsupported SurveyDoc schemaVersion: ${String((doc as any)?.schemaVersion)}`);
  }
  if (!doc.surveyId) {
    throw new Error("SurveyDoc missing surveyId");
  }

  return {
    surveyId: doc.surveyId,
    version: doc.version,
    title: doc.title,
    description: doc.description,
    scale: doc.scale,
    categories: doc.categories,
    prompts: doc.prompts,
  };
}
