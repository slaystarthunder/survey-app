// /src/infra/firebase/dto/RunDocV1.ts

import type { FocusState, ID } from "@core/domain/types";

export type RunDocV1 = {
  schemaVersion: 1;

  runId: ID;
  surveyId: ID;

  startedAt: number;
  completedAt?: number;

  // prompt-based answers
  answers: Record<ID /* promptId */, number>;

  // optional post-result state
  focus?: FocusState;

  // bookkeeping (optional but helpful)
  updatedAt: number;
};
