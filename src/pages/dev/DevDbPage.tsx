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

import { auth } from "@infra/firebase/firebaseApp";
import { signOut } from "firebase/auth";

export function DevDbPage() {
  const authProvider = useMemo(() => createFirebaseAuthProvider(), []);
const a = useAuthState(authProvider);

  const uid = a.user?.uid ?? null;

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [runs, setRuns] = useState<ResponseState[]>([]);

  const refresh = async () => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      const q = await runRepoFirebase.listRuns(uid);
      setRuns(q);
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!uid) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const seedOne = async () => {
    if (!uid) return;
    const surveys = surveyRepo.list();
    const first = surveys[0];
    if (!first) {
      setErr("No surveys found to seed runs for.");
      return;
    }

    setBusy(true);
    setErr(null);
    try {
      const run = await runRepoFirebase.createRun(uid, first.surveyId);
      await runRepoFirebase.saveRun(uid, { ...run, completedAt: Date.now() });
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
      // Your repo already has clearAll(uid)
      await runRepoFirebase.clearAll(uid);
      await refresh();
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const removeOne = async (runId: string) => {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      await runRepoFirebase.remove(uid, runId); // ✅ correct method name
      await refresh();
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell maxWidth={720}>
      <Heading level={2}>Dev DB</Heading>

      <Text muted style={{ marginTop: 6 }}>
        Firebase sync sandbox. Seed and inspect Firestore runs.
      </Text>

      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
      <Button disabled={busy} onClick={() => authProvider.signInWithGoogle()}>
  Sign in (Google)
</Button>


                <Button
          variant="ghost"
          onClick={async () => {
            await signOut(auth);
            window.location.href = "/login";
          }}
        >
          Log out
        </Button>


        <Button disabled={!uid || busy} onClick={seedOne}>
          Seed one completed run
        </Button>

        <Button disabled={!uid || busy} onClick={refresh}>
          Refresh
        </Button>

        <Button disabled={!uid || busy} onClick={clearAll} variant="ghost">
          Clear all runs
        </Button>
      </div>

      {err ? (
        <Text style={{ marginTop: 14 }}>
          <b>Error:</b> {err}
        </Text>
      ) : null}

      <div style={{ marginTop: 18 }}>
        <Heading level={3}>Runs</Heading>
        {runs.length === 0 ? (
          <Text muted>None</Text>
        ) : (
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {runs.map((r) => (
              <div
                key={r.runId}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 10,
                  background: "var(--surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Text style={{ fontWeight: 700 }}>{r.runId}</Text>
                  <Text muted style={{ fontSize: 12 }}>
                    survey: {r.surveyId}
                  </Text>
                </div>

                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => removeOne(r.runId)}
                  style={{ borderRadius: 10 }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
