// /src/infra/firebase/firestore.ts

import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./firebaseApp";

export const db = getFirestore(getFirebaseApp());
