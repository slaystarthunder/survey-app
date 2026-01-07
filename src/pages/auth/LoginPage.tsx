// /src/pages/auth/LoginPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";

import illustrationImg from "../../assets/login-illustration.png";
import googleG from "../../assets/google-g.png";

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

  useEffect(() => {
    if (authState.status === "authed") {
      nav(from, { replace: true });
    }
  }, [authState.status, from, nav]);

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

  const isLoading = busy || authState.status === "loading";

  return (
    <PageShell maxWidth={420}>
      <div style={{ paddingTop: "var(--s-4)", paddingBottom: "var(--s-6)" }}>
        {/* Outer frame: should feel like the same beige paper, not frosted white */}
        <Card
          style={{
            borderRadius: 28,
            padding: 14,
            background: "var(--bg)", // ✅ matches page tone
            border: "2px solid rgba(67, 60, 94, 0.35)",
          }}
        >
          {/* Inner panel: slightly lighter surface, like mock */}
          <div
            style={{
              borderRadius: 24,
              border: "2px solid rgba(67, 60, 94, 0.55)",
              padding: "var(--s-4)",
              background: "rgba(255,255,255,0.18)", // subtle lift
            }}
          >
            <Stack gap={18} align="center">
              {/* Title */}
              <Stack gap={10} align="center">
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Heading
                    level={1}
                    style={{
                      margin: 0,
                      fontSize: 44,
                      letterSpacing: 0.2,
                      color: "var(--fg)",
                      lineHeight: 1.05,
                    }}
                  >
                    Maps of Needs
                  </Heading>

                  {/* Underline like mock */}
                  <div
                    style={{
                      height: 3,
                      width: 260,
                      margin: "10px auto 0",
                      background: "rgba(67, 60, 94, 0.75)",
                      borderRadius: 999,
                    }}
                  />
                </div>

                <Text
                  muted
                  style={{
                    textAlign: "center",
                    lineHeight: 1.6,
                    maxWidth: 340,
                    fontSize: 15,
                  }}
                >
                  A gentle way to see where your needs are met, where they’re
                  calling for attention, and how to bring balance.
                </Text>
              </Stack>

              {/* Illustration (color-matched to background) */}
              <div style={{ width: "min(340px, 100%)", position: "relative" }}>
                <img
                  src={illustrationImg}
                  alt=""
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 18,

                    // ✅ soften + blend into the beige paper tone
                    filter: "saturate(0.85) contrast(0.95) brightness(1.03)",
                    opacity: 0.95,
                  }}
                />
                {/* subtle warm overlay to unify tones */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(180deg, rgba(255,248,240,0.25), rgba(255,248,240,0.15))",
                  }}
                />
              </div>

              {/* Error (kept minimal) */}
              {err ? (
                <Text style={{ lineHeight: 1.55, textAlign: "center" }}>
                  <b>Error:</b> {err}
                </Text>
              ) : null}

              {/* Google button */}
              <div style={{ width: "100%", maxWidth: 360 }}>
                <Button
                  onClick={onSignIn}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    padding: "16px 16px",
                    border: "2px solid rgba(67, 60, 94, 0.55)",
                    background: "rgba(255,255,255,0.35)", // ✅ closer to mock (not stark white)
                    color: "var(--fg)", // ✅ correct text color
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    fontWeight: 600,
                    opacity: isLoading ? 0.75 : 1,
                  }}
                >
                  {/* Icon holder (white rounded square like mock) */}
                  <span
                    aria-hidden
                    style={{
                      width: 42,
                      height: 34,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <img
                      src={googleG}
                      alt=""
                      style={{
                        width: 18,
                        height: 18,
                        display: "block",
                      }}
                    />
                  </span>

                  <span style={{ fontSize: 18 }}>
                    {isLoading ? "Signing in…" : "Google"}
                  </span>
                </Button>
              </div>

              {/* Create account link */}
              <button
                type="button"
                onClick={onSignIn}
                disabled={isLoading}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: isLoading ? "default" : "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  color: "var(--fg)",
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                <Text style={{ fontSize: 16 }}>Create your account</Text>
              </button>
            </Stack>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
