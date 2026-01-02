// /src/infra/firebase/repos/runRepoFirebase.ts
// Firestore-backed runs. Not wired into the app yet (Stage 1).

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    deleteDoc,
    orderBy,
    where,
    type DocumentData,
  } from "firebase/firestore";
  
  import type { ID, ResponseState } from "@core/domain/types";
  import { db } from "../firestore";
  import type { RunDocV1 } from "../dto/RunDocV1";
  import { toRunDoc, fromRunDoc } from "../mappers/runMapper";
  
  function runsCol(uid: string) {
    return collection(db, "users", uid, "runs");
  }
  
  function makeRunId(): ID {
    return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
  
  function asRunDocV1(d: DocumentData): RunDocV1 {
    return d as RunDocV1;
  }
  
  export const runRepoFirebase = {
    async createRun(uid: string, surveyId: ID): Promise<ResponseState> {
      const run: ResponseState = {
        runId: makeRunId(),
        surveyId,
        startedAt: Date.now(),
        answers: {},
      };
  
      const ref = doc(runsCol(uid), run.runId);
      await setDoc(ref, toRunDoc(run));
  
      return run;
    },
  
    async getRun(uid: string, runId: ID): Promise<ResponseState | null> {
      const ref = doc(runsCol(uid), runId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return fromRunDoc(asRunDocV1(snap.data()));
    },
  
    async saveRun(uid: string, run: ResponseState): Promise<void> {
      const ref = doc(runsCol(uid), run.runId);
      await setDoc(ref, toRunDoc(run), { merge: true });
    },
  
    async listRuns(uid: string, opts?: { surveyId?: ID }): Promise<ResponseState[]> {
      const base = runsCol(uid);
  
      const qy = opts?.surveyId
        ? query(base, where("surveyId", "==", opts.surveyId), orderBy("startedAt", "desc"))
        : query(base, orderBy("startedAt", "desc"));
  
      const snaps = await getDocs(qy);
      return snaps.docs.map((d) => fromRunDoc(asRunDocV1(d.data())));
    },
  
    async remove(uid: string, runId: ID): Promise<void> {
      await deleteDoc(doc(runsCol(uid), runId));
    },
  
    async clearAll(uid: string): Promise<void> {
      const snaps = await getDocs(runsCol(uid));
      await Promise.all(snaps.docs.map((d) => deleteDoc(d.ref)));
    },
  };
  