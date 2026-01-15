// /src/infra/firebase/authFirebaseProvider.ts
// Real Google auth provider (Firebase Auth).

import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { AuthProvider as IAuthProvider } from "@core/auth/authProvider";
import type { AuthState, AuthUser } from "@core/auth/authTypes";
import { getFirebaseApp } from "./firebaseApp";

function toAuthUser(u: import("firebase/auth").User): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? undefined,
    displayName: u.displayName ?? undefined,
    photoURL: u.photoURL ?? undefined,
  };
}

export function createFirebaseAuthProvider(): IAuthProvider {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const google = new GoogleAuthProvider();

  let latest: AuthState = { status: "loading", user: null };

  return {
    getState: () => latest,

    onAuthStateChanged(cb: (s: AuthState) => void) {
      const unsub = onAuthStateChanged(auth, (u) => {
        latest = u ? { status: "authed", user: toAuthUser(u) } : { status: "anon", user: null };
        cb(latest);
      });

      // Ensure callers don't stay in "loading" forever if Firebase is slow:
      cb(latest);

      return unsub;
    },

    async signInWithGoogle() {
      await signInWithPopup(auth, google);
    },

    async signOut() {
      await signOut(auth);
    },
  };
}
