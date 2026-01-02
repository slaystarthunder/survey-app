// [S08] Added: Admin survey list controller (IO boundary: surveyRepo). Predictable orchestration.

import { useEffect, useState } from "react";
import type { SurveyBlueprint } from "@core/domain/types";
import { surveyRepo } from "@core/data/surveyRepo";



export function useAdminSurveyList() {
  const [surveys, setSurveys] = useState<SurveyBlueprint[]>([]);

  const reload = () => setSurveys(surveyRepo.list());

  useEffect(() => {
    reload();
  }, []);

  return { surveys, reload };
}
