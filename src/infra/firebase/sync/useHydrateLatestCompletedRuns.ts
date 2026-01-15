// /src/infra/firebase/sync/useHydrateLatestCompletedRuns.ts

import { useEffect, useRef } from "react";

import { runRepo } from "@core/data/runRepo";
import type { ID, ResponseState } from "@core/domain/types";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";

const LAST_RUN_BY_SURVEY_KEY_BASE = "survey_app_last_run_by_survey_v1";

// mirrors useSurveyRunController’s keying (per-user bucket via runRepo.key)
function lastRunKey(): string {
  return `${LAST_RUN_BY_SURVEY_KEY_BASE}__${runRepo.key}`;
}

function readLastRunMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(lastRunKey());
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeLastRunMap(next: Record<string, string>) {
  try {
    localStorage.setItem(lastRunKey(), JSON.stringify(next));
  } catch {
    // ignore
  }
}

function hydrateDoneKey(uid: string) {
  return `mn_hydrate_latest_completed_done_v1__uid_${uid}`;
}

/**
 * Hydrates local "latest run per survey" pointers from Firestore when local storage is missing.
 * Policy: latest COMPLETED only (no resume UX yet).
 *
 * - If local pointer exists (non-empty), do nothing.
 * - If local pointer is missing/empty, fetch runs from Firestore, pick latest completed per survey,
 *   save them into local runRepo, and rebuild the pointer map.
 */
export function useHydrateLatestCompletedRuns(uid: string | null) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!uid) return;

    // Run once per mount/session
    if (startedRef.current) return;
    startedRef.current = true;

    // If we already hydrated for this uid in this browser, skip
    if (localStorage.getItem(hydrateDoneKey(uid)) === "1") return;

    // If local pointer already exists (meaning user has local state), skip.
    const existingMap = readLastRunMap();
    if (Object.keys(existingMap).length > 0) {
      localStorage.setItem(hydrateDoneKey(uid), "1");
      return;
    }

    (async () => {
      try {
        const runs = await runRepoFirebase.listRuns(uid);

        // latest completed per surveyId
        const latestBySurvey = new Map<ID, ResponseState>();

        for (const r of runs) {
          if (typeof r.completedAt !== "number") continue;

          const prev = latestBySurvey.get(r.surveyId);
          if (!prev) {
            latestBySurvey.set(r.surveyId, r);
            continue;
          }

          const prevT = prev.completedAt ?? 0;
          const nextT = r.completedAt ?? 0;
          if (nextT > prevT) latestBySurvey.set(r.surveyId, r);
        }

        if (latestBySurvey.size === 0) {
          // New user or no completed runs yet
          localStorage.setItem(hydrateDoneKey(uid), "1");
          return;
        }

        // Save runs locally + rebuild pointer map
        const nextMap: Record<string, string> = { ...existingMap };

        for (const [surveyId, run] of latestBySurvey.entries()) {
          runRepo.saveRun(run);
          nextMap[surveyId] = run.runId;
        }

        writeLastRunMap(nextMap);

        localStorage.setItem(hydrateDoneKey(uid), "1");
      } catch (e) {
        // Non-blocking: app can still work “fresh”.
        console.warn("Hydrate latest completed runs failed:", e);
      }
    })();
  }, [uid]);
}
