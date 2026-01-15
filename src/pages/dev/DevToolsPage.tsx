// /src/pages/dev/DevToolsPage.tsx

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import { seedPerspectiveCircleSurvey } from "@core/seed/seedPerspectiveCircle";
import { surveyRepoFirebase } from "@infra/firebase/repos/surveyRepoFirebase";

import { seedMockupSurveyHeadlinesToFirebase } from "@core/seed/seedMockupSurveyHeadlinesToFirebase";

export function DevToolsPage() {
  return (
    <PageShell maxWidth={560}>
      <Heading level={2}>Dev Tools</Heading>
      <Text muted style={{ marginTop: 6, lineHeight: 1.6 }}>
        Seed surveys into local storage. This is dev-only.
      </Text>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <Button
          onClick={() => {
            try {
              seedPerspectiveCircleSurvey();
              alert("Seeded: Presence & Awareness ✅ (local)");
            } catch (e) {
              alert(`Seed failed: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          Seed Presence & Awareness survey (local)
        </Button>

        <Button
          onClick={async () => {
            try {
              const survey = seedPerspectiveCircleSurvey(); // returns blueprint
              await surveyRepoFirebase.save(survey);
              const all = await surveyRepoFirebase.list();
              alert(`Saved to Firestore ✅ Surveys in Firestore: ${all.length}`);
            } catch (e) {
              alert(
                `Firestore save failed: ${e instanceof Error ? e.message : String(e)}`
              );
            }
          }}
        >
          Seed + Save Presence & Awareness to Firestore
        </Button>

        {/* ✅ NEW: Export local code snapshot (served by Vite dev server plugin) */}
        <Button
          onClick={async () => {
            try {
              const res = await fetch("/__dev/snapshot");
              if (!res.ok) throw new Error(`HTTP ${res.status}`);

              const jsonText = await res.text(); // keep exact payload
              const blob = new Blob([jsonText], { type: "application/json" });
              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = `code-snapshot-${Date.now()}.json`;
              a.click();

              URL.revokeObjectURL(url);

              alert("Exported code snapshot ✅");
            } catch (e) {
              alert(`Export failed: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          Export code snapshot (JSON)
        </Button>

        <Button
          onClick={async () => {
            try {
              await seedMockupSurveyHeadlinesToFirebase();
              alert("Seeded mockup survey headlines to Firestore ✅");
            } catch (e) {
              alert(`Seed failed: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          Seed mockup survey headlines (Firestore)
        </Button>

        <Button variant="ghost" onClick={() => (window.location.href = "/")}>
          Back to app
        </Button>
      </div>
    </PageShell>
  );
}
