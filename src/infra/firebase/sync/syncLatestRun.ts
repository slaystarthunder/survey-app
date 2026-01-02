import { runRepo } from "@core/data/runRepo";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";
import type { ID } from "@core/domain/types";

const LAST_RUN_BY_SURVEY_KEY = "survey_app_last_run_by_survey_v1";

function readLastRunId(surveyId: ID): ID | null {
  try {
    const raw = localStorage.getItem(LAST_RUN_BY_SURVEY_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Record<string, ID>;
    return obj[surveyId] ?? null;
  } catch {
    return null;
  }
}

/**
 * Uploads the latest local run for a given survey to Firebase.
 * Strategy A: local-first, cloud-backed.
 */
export async function syncLatestRunToFirebase(
  uid: ID,
  surveyId: ID
): Promise<void> {
  const runId = readLastRunId(surveyId);
  if (!runId) {
    throw new Error("No local run found for this survey.");
  }

  const run = runRepo.getRun(runId);
  if (!run) {
    throw new Error("Local run not found.");
  }

  // Create remote run if needed
  await runRepoFirebase.saveRun(uid, run);
}
