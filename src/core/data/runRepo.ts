// /src/core/data/runRepo.ts
// [S03 -> S09] Updated: Run repository (persist ResponseState) with per-user localStorage scoping.
// Goal: each authed user sees ONLY their own runs in localStorage.
//
// - Storage key becomes: `${BASE_KEY}__uid_${uid}`
// - RequireAuth calls runRepo.setActiveUser(uid) once authed
// - If not set yet, we fall back to an "anon" bucket (should be empty in this no-guest version)

import type { ID, ResponseState } from "../domain/types";
import { readJson, writeJson, removeKey } from "./storage";

const BASE_KEY = "survey_app_runs_v1";

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

let activeUid: string | null = null;

function keyFor(uid: string | null): string {
  // No-guest app, but auth state can briefly be loading.
  // Keep a safe fallback bucket that *should remain empty* in production use.
  const safe = uid?.trim();
  if (!safe) return `${BASE_KEY}__uid_anon`;
  return `${BASE_KEY}__uid_${safe}`;
}

function readStore(): RunStore {
  return readJson<RunStore>(keyFor(activeUid), emptyStore());
}

function writeStore(store: RunStore): void {
  writeJson(keyFor(activeUid), store);
}

export const runRepo = {
  /**
   * Set/clear the active user scope for run persistence.
   * Call with uid when authed; call with null when anon/signed out.
   */
  setActiveUser(uid: string | null) {
    activeUid = uid?.trim() ? uid : null;
  },

  /**
   * Expose the computed key (mostly for debugging/dev tools).
   */
  get key() {
    return keyFor(activeUid);
  },

  createRun(surveyId: ID): ResponseState {
    const run: ResponseState = {
      runId: makeRunId(),
      surveyId,
      startedAt: Date.now(),
      answers: {},
    };

    const store = readStore();
    store.byId[run.runId] = run;
    writeStore(store);

    return run;
  },

  getRun(runId: ID): ResponseState | null {
    const store = readStore();
    return store.byId[runId] ?? null;
  },

  saveRun(run: ResponseState): void {
    const store = readStore();
    store.byId[run.runId] = run;
    writeStore(store);
  },

  listRuns(): ResponseState[] {
    const store = readStore();
    return Object.values(store.byId);
  },

  listRunsBySurveyId(surveyId: ID): ResponseState[] {
    return this.listRuns().filter((r) => r.surveyId === surveyId);
  },

  getLatestRunForSurvey(surveyId: ID): ResponseState | null {
    const runs = this.listRunsBySurveyId(surveyId);

    const completed = runs
      .filter((r) => typeof r.completedAt === "number")
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

    return completed[0] ?? null;
  },

  remove(runId: ID): void {
    const store = readStore();
    delete store.byId[runId];
    writeStore(store);
  },

  /**
   * Clears ONLY the current active user's bucket.
   */
  clearAll(): void {
    removeKey(keyFor(activeUid));
  },
};
