// /src/core/auth/authProvider.ts
import type { AuthState } from "./authTypes";

export type Unsubscribe = () => void;

export interface AuthProvider {
  /** Optional synchronous getter (nice-to-have). */
  getState?: () => AuthState;

  /** Subscribe to auth state changes. Should call cb whenever auth changes. */
  onAuthStateChanged: (cb: (s: AuthState) => void) => Unsubscribe;

  /** Sign in with Google (required by LoginPage). */
  signInWithGoogle: () => Promise<void>;

  /** Optional sign out (some places may use it later). */
  signOut?: () => Promise<void>;
}
