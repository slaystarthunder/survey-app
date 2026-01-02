// [S08] Added: Survey editor controller (loads, edits, validates, saves).

import { useEffect, useMemo, useState } from "react";

import type { SurveyBlueprint } from "@core/domain/types";
import { surveyRepo } from "@core/data/surveyRepo";
import { validateSurvey } from "@core/domain/validateSurvey";

import type { EditorIssue } from "./editorTypes";


type Status = "loading" | "ready" | "error";

export function useSurveyEditorController(surveyId: string) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<SurveyBlueprint | null>(null);
  const [issues, setIssues] = useState<EditorIssue[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      setStatus("loading");
      setError(null);
      const s = surveyRepo.get(surveyId);
      if (!s) {
        setStatus("error");
        setError(`Survey not found: ${surveyId}`);
        return;
      }
      setDraft(structuredClone(s));
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [surveyId]);

  const validate = (next: SurveyBlueprint) => {
    const v = validateSurvey(next);
    if (v.ok) return [];
    return v.issues.map((x) => ({ path: x.path, message: x.message }));
  };

  const update = (fn: (d: SurveyBlueprint) => SurveyBlueprint) => {
    if (!draft) return;
    const next = fn(draft);
    setDraft(next);
    setIssues(validate(next));
  };

  const canSave = useMemo(() => issues.length === 0 && !!draft, [issues.length, draft]);

  const save = () => {
    if (!draft) return;
    const res = surveyRepo.save(draft);
    if (res.ok) {
      setSavedAt(Date.now());
      setIssues([]);
      return;
    }
    // Should be covered by issues, but keep safe.
    setIssues([{ path: "save", message: "Save failed. Survey is invalid." }]);
  };

  return { status, error, draft, issues, canSave, savedAt, update, save };
}
