// /src/infra/firebase/firebaseApp.ts

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

/**
 * Firebase config via Vite env:
 * VITE_FIREBASE_API_KEY
 * VITE_FIREBASE_AUTH_DOMAIN
 * VITE_FIREBASE_PROJECT_ID
 * VITE_FIREBASE_STORAGE_BUCKET
 * VITE_FIREBASE_MESSAGING_SENDER_ID
 * VITE_FIREBASE_APP_ID
 */
function readConfig() {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  };

  // Don't throw here; Stage 1 wants “safe to exist without wiring”.
  return cfg;
}

export function getFirebaseApp(): FirebaseApp {
  const apps = getApps();
  if (apps.length) return apps[0]!;
  return initializeApp(readConfig());
}
