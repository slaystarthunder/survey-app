// /src/core/domain/types.ts

export type ID = string;

export type Scale = {
  min: number;
  max: number;
  step: number;
};

export type Category = {
  categoryId: ID;
  label: string;
};

export type Prompt = {
  promptId: ID;
  categoryId: ID;
  text: string;
  helpText?: string;
};

export type SurveyBlueprint = {
  surveyId: ID;
  version: number;
  title: string;
  description?: string;
  scale: Scale;
  categories: Category[];
  prompts: Prompt[];
};

/* ------------------------------------------------------------
 * [V2.5-D] Added: Focus selection (post-results)
 * ------------------------------------------------------------ */

export type FocusMode = "rank" | "points";

export type FocusState = {
  mode: FocusMode;

  /**
   * The categories the user wants to focus on (order irrelevant).
   * In rank-mode, this is usually derived from ranks, but keep it explicit for flexibility.
   */
  selectedCategoryIds: ID[];

  /**
   * Rank mode: ordered categoryIds (e.g. top 3).
   * Example: ["c_energy", "c_sleep", "c_stress"]
   */
  ranks?: ID[];

  /**
   * Points mode: points by categoryId
   * Example: { "c_energy": 4, "c_sleep": 3 }
   */
  points?: Record<ID, number>;

  /** Points mode budget, default 10 */
  budget?: number;
};

export type ResponseState = {
  runId: ID;
  surveyId: ID;
  startedAt: number;
  completedAt?: number;

  // v3: prompt-based answers (one slider value per prompt)
answers: Record<ID /* promptId */, number /* scale value */>;


  // [V2.5-D] Added
  focus?: FocusState;
};

export type ResultSummary = {
  answeredCount: number;
  totalCount: number;
  overallAvg: number | null;
  byCategory: Record<ID /* categoryId */, { avg: number | null; count: number }>;
};

export type ValidationIssue = {
  path: string;
  code:
    | "EMPTY"
    | "DUPLICATE_ID"
    | "MISSING_REF"
    | "OUT_OF_RANGE"
    | "INVALID_SCALE"
    | "INVALID_VALUE";
  message: string;
};

export type ValidationResult = | { ok: true } | { ok: false; issues: ValidationIssue[] };
