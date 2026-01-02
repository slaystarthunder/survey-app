// /src/infra/auth/authMockProvider.ts
// Mock auth provider for dev/testing. No Firebase required.

import type { AuthProvider } from "@core/auth/authProvider";
import type { AuthState, AuthUser } from "@core/auth/authTypes";

const MOCK_USER: AuthUser = {
  uid: "mock_uid_001",
  email: "mock@example.com",
  displayName: "Mock User",
};

export function createMockAuthProvider(): AuthProvider {
  let state: AuthState = { status: "anon", user: null };
  const listeners = new Set<(s: AuthState) => void>();

  const emit = () => {
    for (const cb of listeners) cb(state);
  };

  return {
    getState() {
      return state;
    },

    onAuthStateChanged(cb) {
      listeners.add(cb);
      // immediate emit so subscribers get a value
      cb(state);
      return () => listeners.delete(cb);
    },

    async signInWithGoogle() {
      // simulate latency
      await new Promise((r) => setTimeout(r, 150));
      state = { status: "authed", user: MOCK_USER };
      emit();
      return MOCK_USER;
    },

    async signOut() {
      await new Promise((r) => setTimeout(r, 50));
      state = { status: "anon", user: null };
      emit();
    },
  };
}
