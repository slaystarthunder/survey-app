import type { ResponseState } from "@core/domain/types";
import type { RunDocV1 } from "../dto/RunDocV1";

export function toRunDoc(run: ResponseState): RunDocV1 {
  const doc: RunDocV1 = {
    schemaVersion: 1,
    runId: run.runId,
    surveyId: run.surveyId,
    startedAt: run.startedAt,
    answers: run.answers ?? {},
    updatedAt: Date.now(),
  };

  // Only set optional fields when they exist
  if (typeof run.completedAt === "number") doc.completedAt = run.completedAt;
  if (run.focus) doc.focus = run.focus;

  return doc;
}

export function fromRunDoc(doc: RunDocV1): ResponseState {
  return {
    runId: doc.runId,
    surveyId: doc.surveyId,
    startedAt: doc.startedAt,
    completedAt: doc.completedAt,
    answers: doc.answers ?? {},
    focus: doc.focus,
  };
}
