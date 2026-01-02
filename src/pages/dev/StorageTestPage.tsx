// [S03] Added: Dev-only storage test page to validate repos (no new deps).

import { useMemo, useState } from "react";

import { defaultSurvey } from "@core/seed/defaultSurvey";
import { surveyRepo } from "@core/data/surveyRepo";
import { runRepo } from "@core/data/runRepo";


export function StorageTestPage() {
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [log, setLog] = useState<string>("");

  const surveys = useMemo(() => surveyRepo.list(), []);
  const runs = useMemo(() => runRepo.listRuns(), []);

  const append = (line: string) => setLog((prev) => prev + line + "\n");

  const seedSurvey = () => {
    const res = surveyRepo.save(defaultSurvey);
    if (res.ok) append("✅ Seed saved: defaultSurvey");
    else append("❌ Seed save failed: " + JSON.stringify(res.issues, null, 2));
  };

  const createAndSaveRun = () => {
    const run = runRepo.createRun(defaultSurvey.surveyId);
    run.answers["p_energy"] = 6;
run.answers["p_focus"] = 8;
run.answers["p_mood"] = 5;
   
    runRepo.saveRun(run);
    setLastRunId(run.runId);
    append(`✅ Run created + saved: ${run.runId}`);
  };

  const reloadLastRun = () => {
    if (!lastRunId) return append("ℹ️ No lastRunId yet.");
    const run = runRepo.getRun(lastRunId);
    append("🔁 Reloaded run: " + JSON.stringify(run, null, 2));
  };

  const clearAll = () => {
    surveyRepo.clearAll();
    runRepo.clearAll();
    setLastRunId(null);
    append("🧹 Cleared survey + run storage keys.");
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Storage Test (Section 3)</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={seedSurvey}>Save seed survey</button>
        <button onClick={createAndSaveRun}>Create + save run</button>
        <button onClick={reloadLastRun}>Reload last run</button>
        <button onClick={clearAll}>Clear storage</button>
      </div>

      <p style={{ opacity: 0.75, marginTop: 12 }}>
        Keys: <code>{surveyRepo.key}</code> and <code>{runRepo.key}</code>
      </p>

      <h3>Current snapshot</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>
Surveys: {JSON.stringify(surveys, null, 2)}

Runs: {JSON.stringify(runs, null, 2)}
      </pre>

      <h3>Log</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{log || "(no actions yet)"}</pre>

      <p style={{ opacity: 0.75 }}>
        Validation tip: after “Save seed survey” and “Create + save run”, refresh the browser and confirm data persists.
      </p>
    </div>
  );
}
