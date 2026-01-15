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
