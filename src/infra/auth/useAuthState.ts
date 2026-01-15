import { useEffect, useState } from "react";
import type { AuthProvider } from "@core/auth/authProvider";
import type { AuthState } from "@core/auth/authTypes";

const FALLBACK: AuthState = { status: "loading", user: null };

export function useAuthState(provider: AuthProvider) {
  const [state, setState] = useState<AuthState>(() => provider.getState?.() ?? FALLBACK);

  useEffect(() => provider.onAuthStateChanged(setState), [provider]);

  return state;
}
