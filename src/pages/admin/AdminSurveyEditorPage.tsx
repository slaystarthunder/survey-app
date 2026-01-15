// [S08] Added: Route-level orchestration for survey editor.

import { useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";

import { useSurveyEditorController } from "@features/admin/editor/useSurveyEditorController";
import { SurveyEditorView } from "@features/admin/editor/SurveyEditorView";

export function AdminSurveyEditorPage() {
  const { surveyId = "" } = useParams();
  const c = useSurveyEditorController(surveyId);

  if (c.status === "loading") {
    return (
      <PageShell>
        <Text muted>Loading…</Text>
      </PageShell>
    );
  }

  if (c.status === "error" || !c.draft) {
    return (
      <PageShell>
        <Heading level={2}>Editor error</Heading>
        <Text muted>{c.error ?? "Unknown error"}</Text>
        <Text muted>
          <a href="/admin/surveys">Back to surveys</a>
        </Text>
      </PageShell>
    );
  }

  const d = c.draft;

  return (
    <SurveyEditorView
      surveyId={d.surveyId}
      title={d.title}
      description={d.description ?? ""}
      categories={d.categories}
      prompts={d.prompts}
      issues={c.issues}
      canSave={c.canSave}
      savedAt={c.savedAt}
      onChangeTitle={(v) => c.update((x) => ({ ...x, title: v }))}
      onChangeDescription={(v) => c.update((x) => ({ ...x, description: v }))}
      onAddCategory={() =>
        c.update((x) => ({
          ...x,
          categories: [
            ...x.categories,
            { categoryId: `c_${Date.now().toString(36)}`, label: "New category" },
          ],
        }))
      }
      onEditCategoryLabel={(categoryId, v) =>
        c.update((x) => ({
          ...x,
          categories: x.categories.map((cat) => (cat.categoryId === categoryId ? { ...cat, label: v } : cat)),
        }))
      }
      onRemoveCategory={(categoryId) =>
        c.update((x) => ({
          ...x,
          categories: x.categories.filter((cat) => cat.categoryId !== categoryId),
          prompts: x.prompts.filter((p) => p.categoryId !== categoryId),
        }))
      }
      onAddPrompt={() =>
        c.update((x) => {
          const firstCat = x.categories[0]?.categoryId ?? "c_default";
          return {
            ...x,
            prompts: [
              ...x.prompts,
              {
                promptId: `p_${Date.now().toString(36)}`,
                categoryId: firstCat,
                text: "New prompt",
              },
            ],
          };
        })
      }
      onEditPromptText={(promptId, v) =>
        c.update((x) => ({
          ...x,
          prompts: x.prompts.map((p) => (p.promptId === promptId ? { ...p, text: v } : p)),
        }))
      }
      onEditPromptCategory={(promptId, categoryId) =>
        c.update((x) => ({
          ...x,
          prompts: x.prompts.map((p) => (p.promptId === promptId ? { ...p, categoryId } : p)),
        }))
      }
      onRemovePrompt={(promptId) =>
        c.update((x) => ({
          ...x,
          prompts: x.prompts.filter((p) => p.promptId !== promptId),
        }))
      }
      onSave={() => c.save()}
    />
  );
}
