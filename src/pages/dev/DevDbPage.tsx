// /src/pages/dev/DevDbPage.tsx

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { createFirebaseAuthProvider } from "@infra/firebase/authFirebaseProvider";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";
import { useAuthState } from "@infra/auth/useAuthState";

import { surveyRepo } from "@core/data/surveyRepo";
import type { ResponseState } from "@core/domain/types";

import { syncLatestRunToFirebase } from "@infra/firebase/sync/syncLatestRun";


function firstSurveyId(): string | null {
  // surveyRepo.get(...) exists; list() may or may not exist depending on your repo.
  // We try list() first; if not present, we fail gracefully.
  const anyRepo = surveyRepo as unknown as { list?: () => Array<{ surveyId?: string; id?: string }> };

  const list = anyRepo.list?.();
  if (!list || list.length === 0) return null;

  const s0 = list[0];
  return s0.surveyId ?? s0.id ?? null;
}

export function DevDbPage() {
  const auth = useMemo(() => createFirebaseAuthProvider(), []);
  const authState = useAuthState(auth);
  const uid = authState.user?.uid ?? null;

  const [runs, setRuns] = useState<ResponseState[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refresh = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      const list = await runRepoFirebase.listRuns(uid);
      setRuns(list);
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const syncLatest = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
  
    try {
      // Pick the survey you want to sync the latest run for
      // Using the first available survey keeps it deterministic
      const anyRepo = surveyRepo as unknown as {
        list?: () => Array<{ surveyId?: string; id?: string }>;
      };
  
      const surveys = anyRepo.list?.() ?? [];
      const surveyId = surveys[0]?.surveyId ?? surveys[0]?.id;
  
      if (!surveyId) {
        throw new Error("No surveys found to sync.");
      }
  
      await syncLatestRunToFirebase(uid, surveyId);
      await refresh();
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };
  

  // Auto-refresh once after login (nice UX)
  useEffect(() => {
    if (!uid) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const seedTestRun = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);

    try {
      const surveyId = firstSurveyId();
      if (!surveyId) {
        throw new Error(
          "No surveys found in surveyRepo. Add a survey seed or expose surveyRepo.list()."
        );
      }

      const run = await runRepoFirebase.createRun(uid, surveyId as any);

      // Seed a couple values + mark as completed so Stage 3 'Done' flows are testable
      await runRepoFirebase.saveRun(uid, {
        ...run,
        answers: { ...run.answers, p1: 4, p2: 6 } as any,
        completedAt: Date.now(),
      });

      await refresh();
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const clearAll = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      await runRepoFirebase.clearAll(uid);
      await refresh();
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <Heading level={2}>Firebase DB / Auth (Dev)</Heading>
      <Text muted>This page is dev-only. It does not change the main app flow.</Text>

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {authState.status !== "authed" ? (
          <Button onClick={() => auth.signInWithGoogle()}>Sign in with Google</Button>
        ) : (
          <Button onClick={() => auth.signOut()}>Sign out</Button>
        )}

        <Button disabled={!uid || busy} onClick={refresh}>
          {busy ? "Loading…" : "Refresh runs"}
        </Button>

        <Button disabled={!uid || busy} onClick={seedTestRun}>
          Seed completed run
        </Button>

        <Button disabled={!uid || busy || runs.length === 0} onClick={clearAll}>
          Clear all runs
        </Button>

        <Button onClick={() => syncAllRunsToFirebase(uid)}>
        Sync all local runs
        </Button>

        <Button disabled={!uid || busy} onClick={syncLatest}>
          Sync latest run
        </Button>


      </div>

      <div style={{ marginTop: 16 }}>
        <Heading level={3}>Auth</Heading>
        <Text>
          Status: <b>{authState.status}</b>
        </Text>
        {authState.user ? (
          <Text muted>
            uid: {authState.user.uid}
            {authState.user.email ? ` • ${authState.user.email}` : ""}
          </Text>
        ) : (
          <Text muted>No user signed in.</Text>
        )}
      </div>

      {err ? (
        <div style={{ marginTop: 12 }}>
          <Text muted>Error: {err}</Text>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Heading level={3}>Runs ({runs.length})</Heading>

        {uid ? (
          runs.length ? (
            <ul style={{ lineHeight: 1.6 }}>
              {runs.map((r) => (
                <li key={r.runId}>
                  <b>{r.runId}</b> • survey: {r.surveyId} • completed:{" "}
                  {typeof r.completedAt === "number"
                    ? new Date(r.completedAt).toLocaleString()
                    : "—"}{" "}
                  • answers: {Object.keys(r.answers ?? {}).length}
                </li>
              ))}
            </ul>
          ) : (
            <Text muted>No runs found for this user.</Text>
          )
        ) : (
          <Text muted>Sign in to load runs.</Text>
        )}
      </div>
    </PageShell>
  );
}
