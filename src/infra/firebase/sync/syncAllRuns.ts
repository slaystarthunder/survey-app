import { runRepo } from "@core/data/runRepo";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";
import type { ID } from "@core/domain/types";

export async function syncAllRunsToFirebase(uid: ID): Promise<void> {
  const runs = runRepo.listRuns?.() ?? [];
  for (const run of runs) {
    await runRepoFirebase.saveRun(uid, run);
  }
}
