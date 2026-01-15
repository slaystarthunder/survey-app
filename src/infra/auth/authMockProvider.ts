// /src/infra/auth/authMockProvider.ts
// Mock auth provider for dev/testing. No Firebase required.

import type { AuthProvider } from "@core/auth/authProvider";
import type { AuthState, AuthUser } from "@core/auth/authTypes";

const MOCK_USER: AuthUser = {
  uid: "mock_uid",
  email: "mock@example.com",
  displayName: "Mock User",
};

export function createMockAuthProvider(): AuthProvider {
  let state: AuthState = { status: "anon", user: null };
  const subs = new Set<(s: AuthState) => void>();

  const notify = () => {
    for (const cb of subs) cb(state);
  };

  return {
    getState: () => state,

    onAuthStateChanged(cb) {
      subs.add(cb);
      cb(state); // immediate
      return () => subs.delete(cb);
    },

    async signInWithGoogle() {
      state = { status: "authed", user: MOCK_USER };
      notify();
    },

    async signOut() {
      state = { status: "anon", user: null };
      notify();
    },
  };
}
