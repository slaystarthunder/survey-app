// /src/app/services.ts
import { createFirebaseAuthProvider } from "@infra/firebase/authFirebaseProvider";
import { runRepo } from "@core/data/runRepo";

const USE_FIREBASE_RUNS = false;

export const services = {
  auth: createFirebaseAuthProvider(),
  runs: runRepo,
  flags: { USE_FIREBASE_RUNS },
};
