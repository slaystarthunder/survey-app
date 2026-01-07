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
    const obj = (raw ? (JSON.parse(raw) as Record<string, string>) : {}) as Record<string, string>;
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

    const nextRun = existing ?? runRepo.createRun(surveyId);
    if (!existing) writeLastRunId(surveyId, nextRun.runId);

    setRun(nextRun);
    setIndexState(0);
    setStatus("ready");
  }, [surveyId, survey]);

  const totalCount = survey?.prompts.length ?? 0;

  // ✅ Jump to first unanswered prompt ONLY when a run is first loaded (runId changes),
  // not on every answer update.
  useEffect(() => {
    if (!survey || !run) return;

    const firstUnanswered = survey.prompts.findIndex((p) => typeof run.answers[p.promptId] !== "number");
    if (firstUnanswered >= 0) setIndexState(firstUnanswered);
  }, [survey?.surveyId, run?.runId]);

  const currentPrompt: Prompt | null = useMemo(() => {
    if (!survey || survey.prompts.length === 0) return null;
    const i = Math.max(0, Math.min(indexState, survey.prompts.length - 1));
    return survey.prompts[i] ?? null;
  }, [survey, indexState]);

  const currentValue = useMemo(() => {
    if (!run || !currentPrompt) return null;
    const v = run.answers[currentPrompt.promptId];
    return typeof v === "number" ? v : null;
  }, [run, currentPrompt]);

  const answeredCount = useMemo(() => {
    if (!survey || !run) return 0;
    let n = 0;
    for (const p of survey.prompts) {
      if (typeof run.answers[p.promptId] === "number") n += 1;
    }
    return n;
  }, [survey, run]);

  const isComplete = totalCount > 0 && answeredCount === totalCount;

  const canGoBack = indexState > 0;

  // Next is disabled until current prompt is answered
  const canGoNext = useMemo(() => {
    if (!survey || !run || !currentPrompt) return false;
    const inLast = indexState >= survey.prompts.length - 1;
    const hasAnswer = typeof run.answers[currentPrompt.promptId] === "number";
    return !inLast && hasAnswer;
  }, [survey, run, currentPrompt, indexState]);

  const goBack = () => {
    if (!canGoBack) return;
    setIndexState((x) => Math.max(0, x - 1));
  };

  const goNext = () => {
    if (!survey || !currentPrompt || !run) return;

    const v = run.answers[currentPrompt.promptId];
    if (typeof v !== "number") return;
    if (!canGoNext) return;

    setIndexState((x) => Math.min(survey.prompts.length - 1, x + 1));
  };

  /**
   * Save every answer immediately,
   * AND if this pick completes the survey:
   * - mark completedAt
   * - save locally
   * - auto-save to Firebase (best-effort)
   */
  const onPickValue = (value: number) => {
    if (!run || !currentPrompt) return;

    const next: ResponseState = {
      ...run,
      answers: {
        ...run.answers,
        [currentPrompt.promptId]: value,
      },
    };

    // Save the answer update locally
    runRepo.saveRun(next);

    // If this pick completes the run, auto-complete + local save + cloud save once.
    if (survey && !next.completedAt) {
      const willBeComplete = survey.prompts.every((p) => typeof next.answers[p.promptId] === "number");
      if (willBeComplete) {
        const completed: ResponseState = {
          ...next,
          completedAt: Date.now(),
        };
        setRun(completed);
        runRepo.saveRun(completed);

        // fire-and-forget cloud save (best-effort)
        void saveCompletedRunToCloud(completed);

        return;
      }
    }

    setRun(next);
  };

  /**
   * Idempotent finish:
   * - If already completed, don't overwrite completedAt.
   * - Always returns runId when run exists.
   * Also triggers cloud save as a fallback.
   */
  const finish = () => {
    if (!run) return null;

    if (typeof run.completedAt === "number") {
      // fallback cloud save if needed (e.g. if completion happened while offline)
      void saveCompletedRunToCloud(run);
      return run.runId;
    }

    const next: ResponseState = {
      ...run,
      completedAt: Date.now(),
    };
    setRun(next);
    runRepo.saveRun(next);

    // fire-and-forget cloud save (best-effort)
    void saveCompletedRunToCloud(next);

    return next.runId;
  };

  return {
    status,
    error,
    survey,
    run,

    // current
    currentPrompt,
    currentValue,

    // progress
    index: totalCount ? indexState + 1 : 0, // 1-based
    index0: indexState, // 0-based
    totalCount,
    answeredCount,
    isComplete,

    // nav + input
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    onPickValue,

    // completion
    finish,
  };
}
