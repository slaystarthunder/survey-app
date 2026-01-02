import { useMemo, useState } from "react";
import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { createFirebaseAuthProvider } from "@infra/firebase/authFirebaseProvider";
import { runRepoFirebase } from "@infra/firebase/repos/runRepoFirebase";
import { useAuthState } from "@infra/auth/useAuthState";
import type { ResponseState } from "@core/domain/types";

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
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const seedTestRun = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      // Pick an existing surveyId in your app (example: "presence_awareness_v1")
      // If you don't know one, we can add a dropdown later.
      const surveyId = "presence_awareness_v1";

      const run = await runRepoFirebase.createRun(uid, surveyId as any);

      // seed 2 fake answers just to prove shape works
      await runRepoFirebase.saveRun(uid, {
        ...run,
        answers: { ...run.answers, p1: 4, p2: 6 } as any,
      });

      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <Heading level={2}>Firebase DB / Auth (Dev)</Heading>
      <Text muted>
        This page is dev-only. It does not change the main app flow.
      </Text>

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
          Seed test run
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
                  {typeof r.completedAt === "number" ? new Date(r.completedAt).toLocaleString() : "—"} • answers:{" "}
                  {Object.keys(r.answers ?? {}).length}
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
