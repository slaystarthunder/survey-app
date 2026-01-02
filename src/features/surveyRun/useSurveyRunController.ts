// /src/features/surveyRun/useSurveyRunController.ts
// v3: Prompt-based survey runner (1 prompt per screen).

import { useEffect, useMemo, useState } from "react";

import type { Prompt, ResponseState } from "@core/domain/types";
import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";

type Status = "loading" | "ready" | "error";

const LAST_RUN_BY_SURVEY_KEY = "survey_app_last_run_by_survey_v1";

function readLastRunId(surveyId: string): string | null {
  try {
    const raw = localStorage.getItem(LAST_RUN_BY_SURVEY_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Record<string, string>;
    return obj[surveyId] ?? null;
  } catch {
    return null;
  }
}

function writeLastRunId(surveyId: string, runId: string) {
  try {
    const raw = localStorage.getItem(LAST_RUN_BY_SURVEY_KEY);
    const obj = (raw ? (JSON.parse(raw) as Record<string, string>) : {}) as Record<string, string>;
    obj[surveyId] = runId;
    localStorage.setItem(LAST_RUN_BY_SURVEY_KEY, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

export function useSurveyRunController(surveyId: string) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const [run, setRun] = useState<ResponseState | null>(null);
  const [indexState, setIndexState] = useState<number>(0);

  const survey = useMemo(
    () => (surveyId ? surveyRepo.get(surveyId) : null),
    [surveyId]
  );

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

    const firstUnanswered = survey.prompts.findIndex(
      (p) => typeof run.answers[p.promptId] !== "number"
    );

    if (firstUnanswered >= 0) setIndexState(firstUnanswered);
  }, [survey?.surveyId, run?.runId]); // <- critical change

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

  const onPickValue = (value: number) => {
    if (!run || !currentPrompt) return;

    const next: ResponseState = {
      ...run,
      answers: {
        ...run.answers,
        [currentPrompt.promptId]: value,
      },
    };

    setRun(next);
    runRepo.saveRun(next);
  };

  const finish = () => {
    if (!run) return null;
    const next: ResponseState = {
      ...run,
      completedAt: Date.now(),
    };
    setRun(next);
    runRepo.saveRun(next);
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
