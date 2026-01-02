import { useEffect, useState } from "react";
import type { AuthProvider } from "@core/auth/authProvider";
import type { AuthState } from "@core/auth/authTypes";

export function useAuthState(provider: AuthProvider) {
  const [state, setState] = useState<AuthState>(() => provider.getState());

  useEffect(() => provider.onAuthStateChanged(setState), [provider]);

  return state;
}
