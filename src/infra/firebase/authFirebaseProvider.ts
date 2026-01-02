// /src/infra/firebase/authFirebaseProvider.ts
// Real Google auth provider (Firebase Auth). Not wired into UI yet.

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
  const auth = getAuth(getFirebaseApp());
  let state: AuthState = { status: "loading", user: null };
  const listeners = new Set<(s: AuthState) => void>();

  const emit = () => {
    for (const cb of listeners) cb(state);
  };

  onAuthStateChanged(auth, (u) => {
    state = u
      ? { status: "authed", user: toAuthUser(u) }
      : { status: "anon", user: null };
    emit();
  });

  return {
    getState() {
      return state;
    },

    onAuthStateChanged(cb) {
      listeners.add(cb);
      cb(state);
      return () => listeners.delete(cb);
    },

    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = toAuthUser(res.user);
      state = { status: "authed", user };
      emit();
      return user;
    },

    async signOut() {
      await signOut(auth);
      state = { status: "anon", user: null };
      emit();
    },
  };
}
