// [S02] Updated: Central route table (wiring only).

import { Routes, Route } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { DevToolsPage } from "../pages/dev/DevToolsPage";
import { StorageTestPage } from "../pages/dev/StorageTestPage";
import { UiDemoPage } from "../pages/UiDemoPage";

import { SurveyIntroPage } from "../pages/intro/SurveyIntroPage";
import { SurveyRunPage } from "../pages/run/SurveyRunPage";
import { ResultPage } from "../pages/results/ResultPage";
import { FinishedPage } from "../pages/results/FinishedPage";

import { AdminSurveysPage } from "../pages/admin/AdminSurveysPage";
import { AdminSurveyEditorPage } from "../pages/admin/AdminSurveyEditorPage";

import { DevHomePage } from "../pages/dev/DevHomePage";

// NEW (to be implemented next)
import { NeedsMapPage } from "../pages/needs/NeedsMapPage";

import { DevDbPage } from "../pages/dev/DevDbPage";


export function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Core navigation */}
      <Route path="/needs" element={<NeedsMapPage />} />
      <Route path="/intro/:surveyId" element={<SurveyIntroPage />} />
      <Route path="/run/:surveyId" element={<SurveyRunPage />} />
      <Route path="/result/:runId" element={<ResultPage />} />
      <Route path="/result/:runId/finished" element={<FinishedPage />} />

      {/* Admin */}
      <Route path="/admin/surveys" element={<AdminSurveysPage />} />
      <Route path="/admin/surveys/:surveyId" element={<AdminSurveyEditorPage />} />

      {/* Dev / demo */}
      <Route path="/dev/tools" element={<DevToolsPage />} />
      <Route path="/dev/storage" element={<StorageTestPage />} />
      <Route path="/ui-demo" element={<UiDemoPage />} />

      <Route path="/dev" element={<DevHomePage />} />

      <Route path="/dev/db" element={<DevDbPage />} />

      
    </Routes>
  );
}
