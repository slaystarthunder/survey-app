// [S08] Added: Survey editor view. Semantic, but no repo calls here.

import { PageShell } from "@ui/PageShell";
import { Stack } from "@ui/Stack";
import { Card } from "@ui/Card";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";


type Category = { categoryId: string; label: string };
type Prompt = { promptId: string; categoryId: string; text: string; helpText?: string };

type Props = {
  surveyId: string;
  title: string;
  description: string;
  categories: Category[];
  prompts: Prompt[];
  issues: { path: string; message: string }[];
  canSave: boolean;
  savedAt: number | null;

  onChangeTitle: (v: string) => void;
  onChangeDescription: (v: string) => void;

  onAddCategory: () => void;
  onEditCategoryLabel: (categoryId: string, v: string) => void;
  onRemoveCategory: (categoryId: string) => void;

  onAddPrompt: () => void;
  onEditPromptText: (promptId: string, v: string) => void;
  onEditPromptCategory: (promptId: string, categoryId: string) => void;
  onRemovePrompt: (promptId: string) => void;

  onSave: () => void;
};

export function SurveyEditorView(p: Props) {
  return (
    <PageShell>
      <Stack gap={16}>
        <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 12 }}>
          <Stack gap={6}>
            <Heading level={1}>Admin • Edit Survey</Heading>
            <Text muted mono>
              {p.surveyId}
            </Text>
          </Stack>
          <Stack direction="row" gap={10} wrap="wrap">
            <Button variant="ghost" onClick={p.onSave} disabled={!p.canSave}>
              Save
            </Button>
          </Stack>
        </Stack>

        {p.savedAt ? <Text muted>Saved {new Date(p.savedAt).toLocaleTimeString()}</Text> : null}

        {p.issues.length ? (
          <Card>
            <Stack gap={8}>
              <Heading level={3}>Validation issues</Heading>
              {p.issues.map((x, i) => (
                <Text key={i} mono muted>
                  {x.path}: {x.message}
                </Text>
              ))}
            </Stack>
          </Card>
        ) : null}

        <Card>
          <Stack gap={10}>
            <Heading level={2}>Basics</Heading>

            <label>
              <Text muted>Title</Text>
              <input
                value={p.title}
                onChange={(e) => p.onChangeTitle(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--fg)",
                }}
              />
            </label>

            <label>
              <Text muted>Description</Text>
              <textarea
                value={p.description}
                onChange={(e) => p.onChangeDescription(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--fg)",
                }}
              />
            </label>
          </Stack>
        </Card>

        <Card>
          <Stack gap={12}>
            <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 12 }}>
              <Heading level={2}>Categories</Heading>
              <Button onClick={p.onAddCategory}>Add category</Button>
            </Stack>

            <Stack gap={10}>
              {p.categories.map((c) => (
                <div key={c.categoryId} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <Text mono muted style={{ minWidth: 90 }}>
                    {c.categoryId}
                  </Text>
                  <input
                    value={c.label}
                    onChange={(e) => p.onEditCategoryLabel(c.categoryId, e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 220,
                      padding: "10px 12px",
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--fg)",
                    }}
                  />
                  <Button variant="ghost" onClick={() => p.onRemoveCategory(c.categoryId)}>
                    Remove
                  </Button>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap={12}>
            <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 12 }}>
              <Heading level={2}>Prompts</Heading>
              <Button onClick={p.onAddPrompt}>Add prompt</Button>
            </Stack>

            <Stack gap={14}>
              {p.prompts.map((q) => (
                <div
                  key={q.promptId}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <Stack gap={10}>
                    <Stack direction="row" justify="space-between" wrap="wrap" style={{ gap: 10 }}>
                      <Text mono muted>
                        {q.promptId}
                      </Text>
                      <Button variant="ghost" onClick={() => p.onRemovePrompt(q.promptId)}>
                        Remove
                      </Button>
                    </Stack>

                    <label>
                      <Text muted>Text</Text>
                      <input
                        value={q.text}
                        onChange={(e) => p.onEditPromptText(q.promptId, e.target.value)}
                        style={{
                          width: "100%",
                          marginTop: 6,
                          padding: "10px 12px",
                          borderRadius: "var(--r-md)",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--fg)",
                        }}
                      />
                    </label>

                    <label>
                      <Text muted>Category</Text>
                      <select
                        value={q.categoryId}
                        onChange={(e) => p.onEditPromptCategory(q.promptId, e.target.value)}
                        style={{
                          width: "100%",
                          marginTop: 6,
                          padding: "10px 12px",
                          borderRadius: "var(--r-md)",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--fg)",
                        }}
                      >
                        {p.categories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.label} ({c.categoryId})
                          </option>
                        ))}
                      </select>
                    </label>
                  </Stack>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
