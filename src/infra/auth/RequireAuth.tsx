// /src/infra/auth/RequireAuth.tsx

import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Text } from "@ui/Text";

import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";

export function RequireAuth() {
  const loc = useLocation();
  const auth = useMemo(() => services.auth, []);
  const s = useAuthState(auth);

  // Preserve full location (path + query + hash)
  const from = loc.pathname + loc.search + loc.hash;

  // Keep runRepo scoped to the current user.
  useEffect(() => {
    if (s.status === "authed" && s.user?.uid) {
      services.runs.setActiveUser?.(s.user.uid);
    } else {
      services.runs.setActiveUser?.(null);
    }
  }, [s.status, s.user?.uid]);

  if (s.status === "loading") {
    return (
      <PageShell>
        <Text muted>Loading…</Text>
      </PageShell>
    );
  }

  if (s.status !== "authed") {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
