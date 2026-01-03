// /src/pages/auth/LoginPage.tsx

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";

type LocationState = {
  from?: string;
};

export function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = (loc.state ?? {}) as LocationState;

  const auth = useMemo(() => services.auth, []);
  const authState = useAuthState(auth);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const from = state.from ?? "/";

  const onSignIn = async () => {
    setBusy(true);
    setErr(null);
    try {
      await auth.signInWithGoogle();
      nav(from, { replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  // If already authed, just continue.
  if (authState.status === "authed") {
    nav(from, { replace: true });
    return null;
  }

  return (
    <PageShell maxWidth={480}>
      <div style={{ paddingTop: "var(--s-4)" }}>
        <Card
          style={{
            background: "rgba(255,255,255,0.35)",
            borderRadius: 22,
            padding: "var(--s-4)",
          }}
        >
          <Stack gap={16}>
            <Stack gap={8}>
              <Heading level={2}>Sign in</Heading>
              <Text muted style={{ lineHeight: 1.55 }}>
                Log in to access the app. Your results can then be saved to your account.
              </Text>
            </Stack>

            {err ? (
              <Text style={{ lineHeight: 1.55 }}>
                <b>Error:</b> {err}
              </Text>
            ) : null}

            <Stack direction="row" gap={10} wrap="wrap">
              <Button onClick={onSignIn} disabled={busy || authState.status === "loading"} style={{ fontWeight: 800 }}>
                {busy || authState.status === "loading" ? "Signing in…" : "Continue with Google"}
              </Button>

              <Button variant="ghost" onClick={() => nav("/", { replace: true })} disabled={busy}>
                Back
              </Button>
            </Stack>

            <Text muted style={{ fontSize: 12, lineHeight: 1.5 }}>
              (Later: you can add “anonymous/guest mode” without changing this page—just add another button.)
            </Text>
          </Stack>
        </Card>
      </div>
    </PageShell>
  );
}
