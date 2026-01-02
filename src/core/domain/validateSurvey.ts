// [S01] Added: SurveyBlueprint validation (invariants). Pure TS, returns structured issues.

import type { SurveyBlueprint, ValidationIssue, ValidationResult } from "./types";

function issue(path: string, code: ValidationIssue["code"], message: string): ValidationIssue {
  return { path, code, message };
}

export function validateSurvey(survey: SurveyBlueprint): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!survey.surveyId?.trim()) issues.push(issue("surveyId", "EMPTY", "surveyId is required."));
  if (!survey.title?.trim()) issues.push(issue("title", "EMPTY", "title is required."));
  if (!Number.isInteger(survey.version) || survey.version < 1) {
    issues.push(issue("version", "INVALID_VALUE", "version must be an integer >= 1."));
  }

  // Scale checks (v1 expects min=1 max=10 step=1, but keep generic + sanity)
  const { min, max, step } = survey.scale ?? { min: NaN, max: NaN, step: NaN };
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0 || min >= max) {
    issues.push(issue("scale", "INVALID_SCALE", "scale must have finite min/max and step > 0 and min < max."));
  }

  // Categories
  const categoryIds = new Set<string>();
  (survey.categories ?? []).forEach((c, i) => {
    const base = `categories[${i}]`;
    if (!c.categoryId?.trim()) issues.push(issue(`${base}.categoryId`, "EMPTY", "categoryId is required."));
    if (!c.label?.trim()) issues.push(issue(`${base}.label`, "EMPTY", "label is required."));
    if (c.categoryId?.trim()) {
      if (categoryIds.has(c.categoryId)) issues.push(issue(`${base}.categoryId`, "DUPLICATE_ID", "Duplicate categoryId."));
      categoryIds.add(c.categoryId);
    }
  });

  if ((survey.categories ?? []).length === 0) {
    issues.push(issue("categories", "EMPTY", "At least one category is required."));
  }

  // Prompts
  const promptIds = new Set<string>();
  (survey.prompts ?? []).forEach((p, i) => {
    const base = `prompts[${i}]`;
    if (!p.promptId?.trim()) issues.push(issue(`${base}.promptId`, "EMPTY", "promptId is required."));
    if (!p.text?.trim()) issues.push(issue(`${base}.text`, "EMPTY", "text is required."));
    if (!p.categoryId?.trim()) issues.push(issue(`${base}.categoryId`, "EMPTY", "categoryId is required."));

    if (p.promptId?.trim()) {
      if (promptIds.has(p.promptId)) issues.push(issue(`${base}.promptId`, "DUPLICATE_ID", "Duplicate promptId."));
      promptIds.add(p.promptId);
    }

    if (p.categoryId?.trim() && !categoryIds.has(p.categoryId)) {
      issues.push(issue(`${base}.categoryId`, "MISSING_REF", "prompt.categoryId must reference an existing categoryId."));
    }
  });

  if ((survey.prompts ?? []).length === 0) {
    issues.push(issue("prompts", "EMPTY", "At least one prompt is required."));
  }

  return issues.length ? { ok: false, issues } : { ok: true };
}
