// [S02] Updated: Central route table (wiring only)

import { Routes, Route } from "react-router-dom";

/* Pages */
import { HomePage } from "../pages/HomePage";
import { UiDemoPage } from "../pages/UiDemoPage";

import { SurveyIntroPage } from "../pages/intro/SurveyIntroPage";
import { SurveyRunPage } from "../pages/run/SurveyRunPage";
import { ResultPage } from "../pages/results/ResultPage";
import { FinishedPage } from "../pages/results/FinishedPage";
import { NeedsMapPage } from "../pages/needs/NeedsMapPage";

import { AdminSurveysPage } from "../pages/admin/AdminSurveysPage";
import { AdminSurveyEditorPage } from "../pages/admin/AdminSurveyEditorPage";

import { DevHomePage } from "../pages/dev/DevHomePage";
import { DevToolsPage } from "../pages/dev/DevToolsPage";
import { StorageTestPage } from "../pages/dev/StorageTestPage";
import { DevDbPage } from "../pages/dev/DevDbPage";

/* Auth */
import { LoginPage } from "../pages/auth/LoginPage";
import { RequireAuth } from "../infra/auth/RequireAuth";


export function AppRoutes() {
  return (
    <Routes>
      {/* ========================= */}
      {/* Public routes */}
      {/* ========================= */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<HomePage />} />

      <Route path="/needs" element={<NeedsMapPage />} />
      <Route path="/intro/:surveyId" element={<SurveyIntroPage />} />
      <Route path="/run/:surveyId" element={<SurveyRunPage />} />
      <Route path="/result/:runId" element={<ResultPage />} />
      <Route path="/result/:runId/finished" element={<FinishedPage />} />

      <Route path="/ui-demo" element={<UiDemoPage />} />

      {/* ========================= */}
      {/* Protected routes */}
      {/* ========================= */}
      <Route element={<RequireAuth />}>
        {/* Admin */}
        <Route path="/admin/surveys" element={<AdminSurveysPage />} />
        <Route path="/admin/surveys/:surveyId" element={<AdminSurveyEditorPage />} />

        {/* Dev */}
        <Route path="/dev" element={<DevHomePage />} />
        <Route path="/dev/tools" element={<DevToolsPage />} />
        <Route path="/dev/storage" element={<StorageTestPage />} />
        <Route path="/dev/db" element={<DevDbPage />} />
      </Route>
    </Routes>
  );
}
