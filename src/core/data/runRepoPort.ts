// /src/core/data/runRepoPort.ts
import type { ID, ResponseState } from "@core/domain/types";

export interface RunRepoPort {
  createRun(surveyId: ID): ResponseState;
  getRun(runId: ID): ResponseState | null;
  saveRun(run: ResponseState): void;

  // Optional utilities (nice to have)
  listRuns?(): ResponseState[];
  listRunsBySurveyId?(surveyId: ID): ResponseState[];
  getLatestRunForSurvey?(surveyId: ID): ResponseState | null;

  clearAll?(): void;
}
