// /src/infra/firebase/repos/surveyRepoFirebase.ts
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    query,
    orderBy,
  } from "firebase/firestore";
  
  import type { SurveyBlueprint } from "@core/domain/types";
  import { db } from "@infra/firebase/firestore";
  
  import type { SurveyDocV1 } from "@infra/firebase/dto/SurveyDocV1";
  import { docToSurveyV1, surveyToDocV1 } from "@infra/firebase/mappers/surveyMapperV1";
  
  const SURVEYS_COLLECTION = "surveys";
  
  export const surveyRepoFirebase = {
    async list(): Promise<SurveyBlueprint[]> {
      const col = collection(db, SURVEYS_COLLECTION);
  
      // If you don’t have an index/field yet, you can remove orderBy.
      // We store updatedAt in doc to allow ordering.
      const q = query(col, orderBy("updatedAt", "desc"));
  
      const snap = await getDocs(q);
  
      const out: SurveyBlueprint[] = [];
      snap.forEach((d) => {
        const data = d.data() as SurveyDocV1;
        out.push(docToSurveyV1(data));
      });
  
      return out;
    },
  
    async get(surveyId: string): Promise<SurveyBlueprint | null> {
      const ref = doc(db, SURVEYS_COLLECTION, surveyId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
  
      const data = snap.data() as SurveyDocV1;
      return docToSurveyV1(data);
    },
  
    async save(survey: SurveyBlueprint): Promise<void> {
      // Use surveyId as document id => stable URLs and easy updates
      const ref = doc(db, SURVEYS_COLLECTION, survey.surveyId);
      const payload = surveyToDocV1(survey);
  
      await setDoc(ref, payload, { merge: true });
    },
  
    async remove(surveyId: string): Promise<void> {
      const ref = doc(db, SURVEYS_COLLECTION, surveyId);
      await deleteDoc(ref);
    },
  };
  