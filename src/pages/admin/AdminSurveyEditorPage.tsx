// [S08] Added: Route-level orchestration for survey editor.

import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@ui/PageShell";
import { Heading, Text } from "@ui/Text";

import { useSurveyEditorController } from "@features/admin/editor/useSurveyEditorController";
import { SurveyEditorView } from "@features/admin/editor/SurveyEditorView";


export function AdminSurveyEditorPage() {
  const { surveyId = "" } = useParams();
  const nav = useNavigate();
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
        c.update((x) => {
          const nextId = `c_${x.categories.length + 1}`;
          return { ...x, categories: [...x.categories, { categoryId: nextId, label: `Category ${x.categories.length + 1}` }] };
        })
      }
      onEditCategoryLabel={(categoryId, v) =>
        c.update((x) => ({
          ...x,
          categories: x.categories.map((c) => (c.categoryId === categoryId ? { ...c, label: v } : c)),
        }))
      }
      onRemoveCategory={(categoryId) =>
        c.update((x) => ({
          ...x,
          categories: x.categories.filter((c) => c.categoryId !== categoryId),
          prompts: x.prompts.filter((p) => p.categoryId !== categoryId), // v1 rule: remove prompts in removed category
        }))
      }
      onAddPrompt={() =>
        c.update((x) => {
          const cat = x.categories[0];
          const nextId = `p_${x.prompts.length + 1}`;
          return {
            ...x,
            prompts: [
              ...x.prompts,
              { promptId: nextId, categoryId: cat?.categoryId ?? "c_1", text: "New prompt" },
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
        c.update((x) => ({ ...x, prompts: x.prompts.filter((p) => p.promptId !== promptId) }))
      }
      onSave={() => c.save()}
    />
  );
}
