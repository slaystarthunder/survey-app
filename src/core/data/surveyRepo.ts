// [S03] Added: Survey repository (persist SurveyBlueprint). Validates before save.

import type { ID, SurveyBlueprint } from "../domain/types";
import { validateSurvey } from "../domain/validateSurvey";
import { readJson, writeJson, removeKey } from "./storage";

const KEY = "survey_app_surveys_v1";

type SurveyStore = {
  byId: Record<ID, SurveyBlueprint>;
};

function emptyStore(): SurveyStore {
  return { byId: {} };
}

export const surveyRepo = {
  key: KEY,

  list(): SurveyBlueprint[] {
    const store = readJson<SurveyStore>(KEY, emptyStore());
    return Object.values(store.byId);
  },

  get(surveyId: ID): SurveyBlueprint | null {
    const store = readJson<SurveyStore>(KEY, emptyStore());
    return store.byId[surveyId] ?? null;
  },

  save(survey: SurveyBlueprint): { ok: true } | { ok: false; issues: unknown } {
    const v = validateSurvey(survey);
    if (!v.ok) return { ok: false, issues: v.issues };

    const store = readJson<SurveyStore>(KEY, emptyStore());
    store.byId[survey.surveyId] = survey;
    writeJson(KEY, store);
    return { ok: true };
  },

  remove(surveyId: ID): void {
    const store = readJson<SurveyStore>(KEY, emptyStore());
    delete store.byId[surveyId];
    writeJson(KEY, store);
  },

  clearAll(): void {
    removeKey(KEY);
  },
};
