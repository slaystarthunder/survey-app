// /src/features/surveyRun/useSurveyRunController.ts
// v3: Prompt-based survey runner (1 prompt per screen).
// Phase 2.5: Auto-save completed run to Firebase when last question is answered.

import { useEffect, useMemo, useRef, useState } from "react";

import type { Prompt, ResponseState } from "@core/domain/types";
import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";

// Firebase auto-save (best-effort)
import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";

type Status = "loading" | "ready" | "error";

// NOTE: Must be per-user. We derive a user-specific suffix from runRepo.key (per-user in Phase 2).
const LAST_RUN_BY_SURVEY_KEY_BASE = "survey_app_last_run_by_survey_v1";

function lastRunKey(): string {
  return `${LAST_RUN_BY_SURVEY_KEY_BASE}__${runRepo.key}`;
}

function readLastRunId(surveyId: string): string | null {
  try {
    const raw = localStorage.getItem(lastRunKey());
    if (!raw) return null;
    const obj = JSON.parse(raw) as Record<string, string>;
    return obj[surveyId] ?? null;
  } catch {
    return null;
  }
}

function writeLastRunId(surveyId: string, runId: string) {
  try {
    const raw = localStorage.getItem(lastRunKey());
    const obj = (raw ? (JSON.parse(raw) as Record<string, string>) : {}) as Record<
      string,
      string
    >;
    obj[surveyId] = runId;
    localStorage.setItem(lastRunKey(), JSON.stringify(obj));
  } catch {
    // ignore
  }
}

export function useSurveyRunController(surveyId: string) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const [run, setRun] = useState<ResponseState | null>(null);
  const [indexState, setIndexState] = useState<number>(0);

  // Auth (for Firebase auto-save)
  const auth = useMemo(() => services.auth, []);
  const authState = useAuthState(auth);
  const uid = authState.user?.uid ?? null;

  // Prevent duplicate cloud-save for the same completed run
  const lastCloudSavedCompletedRunId = useRef<string | null>(null);

  const survey = useMemo(() => (surveyId ? surveyRepo.get(surveyId) : null), [surveyId]);

  // Best-effort Firebase save for a completed run
  const saveCompletedRunToCloud = async (completedRun: ResponseState) => {
    if (!uid) return;
    if (typeof completedRun.completedAt !== "number") return;

    // Skip if we already pushed this completed run
    if (lastCloudSavedCompletedRunId.current === completedRun.runId) return;
    lastCloudSavedCompletedRunId.current = completedRun.runId;

    try {
      await runRepoFirebase.saveRun(uid, completedRun);
    } catch (e) {
      // Don't block the user. Local save is already done.
      console.warn("Auto-save to account failed (kept locally).", e);
      // Allow retry later (e.g. user hits Finish again / retries)
      lastCloudSavedCompletedRunId.current = null;
    }
  };

  // Load/create run when surveyId changes
  useEffect(() => {
    setStatus("loading");
    setError(null);

    if (!surveyId) {
      setStatus("error");
      setError("Missing surveyId.");
      return;
    }

    if (!survey) {
      setStatus("error");
      setError(`Survey not found: ${surveyId}`);
      return;
    }

    const lastRunId = readLastRunId(surveyId);
    const existing = lastRunId ? runRepo.getRun(lastRunId) : null;

    // ✅ FIX: If the last run is already completed, DO NOT reuse it.
    // Create a fresh run so "Reassess" starts from question 1 and doesn't auto-complete.
    const shouldReuse =
      existing && typeof existing.completedAt !== "number"; // only reuse if in-progress

    const nextRun = shouldReuse ? existing : runRepo.createRun(surveyId);

    // Always point "last run" to the run we will actually use now
    if (!shouldReuse) writeLastRunId(surveyId, nextRun.runId);

    setRun(nextRun);
    setIndexState(0);
    setStatus("ready");
  }, [surveyId, survey]);

  const totalCount = survey?.prompts.length ?? 0;
  const prompts: Prompt[] = survey?.prompts ?? [];

  const index = indexState;
  const currentPrompt = prompts[index] ?? null;

  const currentValue = useMemo(() => {
    if (!run || !currentPrompt) return null;
    const v = run.answers?.[currentPrompt.promptId];
    return typeof v === "number" ? v : null;
  }, [run, currentPrompt]);

  const canGoBack = index > 0;
  const canGoNext = currentValue != null;

  const goBack = () => {
    setIndexState((i) => Math.max(0, i - 1));
  };

  const onPickValue = (value: number) => {
    if (!run || !currentPrompt) return;

    const next: ResponseState = {
      ...run,
      answers: {
        ...(run.answers ?? {}),
        [currentPrompt.promptId]: value,
      },
    };

    runRepo.saveRun(next);
    setRun(next);
  };

  const isComplete = index >= totalCount - 1;

  const goNext = () => {
    setIndexState((i) => Math.min(totalCount - 1, i + 1));
  };

  const finish = () => {
    if (!run) return null;

    const completed: ResponseState = {
      ...run,
      completedAt: Date.now(),
    };

    runRepo.saveRun(completed);
    setRun(completed);

    // Best-effort cloud save of the completed run (historic doc by runId)
    void saveCompletedRunToCloud(completed);

    // Also ensure lastRunId points at the completed run (latest result behavior)
    writeLastRunId(run.surveyId, run.runId);

    return run.runId;
  };

  return {
    status,
    error,
    survey,
    run,
    // progress
    index,
    totalCount,
    currentPrompt,
    currentValue,
    // nav
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    // input
    onPickValue,
    // completion
    isComplete,
    finish,
  };
}
