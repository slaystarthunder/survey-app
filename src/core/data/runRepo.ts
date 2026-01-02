// [S03] Added: Run repository (persist ResponseState). Does not compute results; stores answers only.

import type { ID, ResponseState } from "../domain/types";
import { readJson, writeJson, removeKey } from "./storage";

const KEY = "survey_app_runs_v1";

type RunStore = {
  byId: Record<ID, ResponseState>;
};

function emptyStore(): RunStore {
  return { byId: {} };
}

function makeRunId(): ID {
  // Good enough for localStorage v1. (Deterministic IDs can come later if needed.)
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const runRepo = {
  key: KEY,

  createRun(surveyId: ID): ResponseState {
    const run: ResponseState = {
      runId: makeRunId(),
      surveyId,
      startedAt: Date.now(),
      answers: {},
    };
    const store = readJson<RunStore>(KEY, emptyStore());
    store.byId[run.runId] = run;
    writeJson(KEY, store);
    return run;
  },

  getRun(runId: ID): ResponseState | null {
    const store = readJson<RunStore>(KEY, emptyStore());
    return store.byId[runId] ?? null;
  },

  saveRun(run: ResponseState): void {
    const store = readJson<RunStore>(KEY, emptyStore());
    store.byId[run.runId] = run;
    writeJson(KEY, store);
  },

  listRuns(): ResponseState[] {
    const store = readJson<RunStore>(KEY, emptyStore());
    return Object.values(store.byId);
  },

  remove(runId: ID): void {
    const store = readJson<RunStore>(KEY, emptyStore());
    delete store.byId[runId];
    writeJson(KEY, store);
  },

  clearAll(): void {
    removeKey(KEY);
  },
};
