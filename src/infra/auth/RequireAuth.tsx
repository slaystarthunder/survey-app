// /src/app/RequireAuth.tsx

import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Text } from "@ui/Text";

import { services } from "@app/services";
import { useAuthState } from "@infra/auth/useAuthState";

export function RequireAuth() {
  const loc = useLocation();
  const auth = useMemo(() => services.auth, []);
  const s = useAuthState(auth);

  if (s.status === "loading") {
    return (
      <PageShell>
        <Text muted>Loading…</Text>
      </PageShell>
    );
  }

  if (s.status !== "authed") {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}
