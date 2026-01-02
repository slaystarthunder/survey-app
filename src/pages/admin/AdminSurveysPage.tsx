// [S08] Added: Route-level orchestration for admin survey list.

import { useNavigate } from "react-router-dom";

import { useAdminSurveyList } from "@features/admin/surveys/useAdminSurveyList";
import { AdminSurveyListView } from "@features/admin/surveys/AdminSurveyListView";

import { surveyRepo } from "@core/data/surveyRepo";
import type { SurveyBlueprint } from "@core/domain/types";


function makeNewSurvey(): SurveyBlueprint {
  const now = Date.now();
  return {
    surveyId: `s_${now}`,
    version: 1,
    title: "New Survey",
    description: "",
    scale: { min: 1, max: 10, step: 1 },
    categories: [{ categoryId: "c_1", label: "Category 1" }],
    prompts: [{ promptId: "p_1", categoryId: "c_1", text: "New prompt" }],
  };
}

export function AdminSurveysPage() {
  const nav = useNavigate();
  const { surveys, reload } = useAdminSurveyList();

  return (
    <AdminSurveyListView
      rows={surveys.map((s) => ({
        surveyId: s.surveyId,
        title: s.title,
        version: s.version,
        promptCount: s.prompts.length,
      }))}
      onCreateNew={() => {
        const survey = makeNewSurvey();
        const res = surveyRepo.save(survey);
        if (res.ok) {
          reload();
          nav(`/admin/surveys/${survey.surveyId}`);
        } else {
          alert("Validation failed for new survey. This should not happen in v1 seed.");
        }
      }}
      onOpenEditor={(surveyId) => nav(`/admin/surveys/${surveyId}`)}
      onRun={(surveyId) => nav(`/intro/${surveyId}`)}

    />
  );
}
