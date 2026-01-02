// No React, no IO.
// v3 change: answers are stored per *prompt* (one slider per prompt).

import type { ResultSummary, SurveyBlueprint } from "./types";

export function computeSummary(
  survey: SurveyBlueprint,
  answers: Record<string, number>
): ResultSummary {
  let overallSum = 0;
  let overallCount = 0;

  // Prep category buckets
  const byCategory: ResultSummary["byCategory"] = {};
  for (const c of survey.categories) {
    byCategory[c.categoryId] = { avg: null, count: 0 };
  }

  // Aggregate prompt answers into their categories
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const p of survey.prompts) {
    const v = answers[p.promptId];
    if (typeof v !== "number") continue;

    overallSum += v;
    overallCount += 1;

    sums[p.categoryId] = (sums[p.categoryId] ?? 0) + v;
    counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  }

  // Compute per-category averages
  for (const c of survey.categories) {
    const count = counts[c.categoryId] ?? 0;
    const sum = sums[c.categoryId] ?? 0;
    byCategory[c.categoryId] = {
      avg: count ? sum / count : null,
      count,
    };
  }

  return {
    answeredCount: overallCount,
    totalCount: survey.prompts.length,
    overallAvg: overallCount ? overallSum / overallCount : null,
    byCategory,
  };
}
