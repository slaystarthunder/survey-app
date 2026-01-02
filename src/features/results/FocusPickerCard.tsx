// /src/features/results/FocusPickerCard.tsx
// [V2.5-D] Added: Post-result focus selection UI (rank or points). No IO.

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { Button } from "@ui/Button";

import type { FocusState, ID, FocusMode } from "@core/domain/types";


type CatRow = { categoryId: ID; label: string };

type Props = {
  categories: CatRow[];
  value?: FocusState;
  onChange: (next: FocusState) => void;
};

function defaultFocus(): FocusState {
  return {
    mode: "rank",
    selectedCategoryIds: [],
    ranks: [],
    budget: 10,
    points: {},
  };
}

function uniq(xs: string[]) {
  return Array.from(new Set(xs));
}

export function FocusPickerCard({ categories, value, onChange }: Props) {
  const v = value ?? defaultFocus();
  const mode: FocusMode = v.mode ?? "rank";

  const selected = new Set(v.selectedCategoryIds ?? []);
  const ranks = v.ranks ?? [];
  const budget = v.budget ?? 10;
  const points = v.points ?? {};

  const toggleSelected = (categoryId: ID) => {
    const nextSelected = new Set(selected);
    if (nextSelected.has(categoryId)) nextSelected.delete(categoryId);
    else nextSelected.add(categoryId);

    // If you deselect, also remove from rank order + points.
    const nextRanks = (ranks ?? []).filter((id) => nextSelected.has(id));
    const nextPoints: Record<ID, number> = { ...points };
    if (!nextSelected.has(categoryId)) delete nextPoints[categoryId];

    onChange({
      ...v,
      selectedCategoryIds: Array.from(nextSelected),
      ranks: nextRanks,
      points: nextPoints,
    });
  };

  const setMode = (m: FocusMode) => {
    onChange({
      ...v,
      mode: m,
      // Keep existing data so switching modes doesn’t destroy work.
      selectedCategoryIds: v.selectedCategoryIds ?? [],
      ranks: v.ranks ?? [],
      points: v.points ?? {},
      budget: v.budget ?? 10,
    });
  };

  // Rank click: builds top-3 order by click order
  const rankClick = (categoryId: ID) => {
    // Must be selected first (or auto-select)
    const nextSelected = uniq([...(v.selectedCategoryIds ?? []), categoryId]);

    let nextRanks = [...(v.ranks ?? [])];
    const exists = nextRanks.includes(categoryId);

    if (exists) {
      nextRanks = nextRanks.filter((x) => x !== categoryId);
    } else {
      if (nextRanks.length >= 3) return; // keep it simple for v1
      nextRanks.push(categoryId);
    }

    onChange({
      ...v,
      mode: "rank",
      selectedCategoryIds: nextSelected,
      ranks: nextRanks,
    });
  };

  // Points
  const totalAllocated = Object.values(points).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  const remaining = Math.max(0, budget - totalAllocated);

  const setPoints = (categoryId: ID, nextVal: number) => {
    const safe = Math.max(0, Math.min(budget, Math.floor(nextVal)));
    const nextPoints = { ...points, [categoryId]: safe };

    // Ensure it’s selected if it has points
    const nextSelected = uniq([...(v.selectedCategoryIds ?? []), categoryId]);

    onChange({
      ...v,
      mode: "points",
      selectedCategoryIds: nextSelected,
      points: nextPoints,
      budget,
    });
  };

  return (
    <Card>
      <Stack gap={12}>
        <Stack gap={6}>
          <Heading level={3}>Choose focus categories</Heading>
          <Text muted>
            Pick the categories you want to focus on next. You can do it as “Top 3” (rank) or “Allocate points” (budget).
          </Text>
        </Stack>

        <Stack direction="row" gap={10} wrap="wrap">
          <Button variant={mode === "rank" ? "solid" : "ghost"} onClick={() => setMode("rank")}>
            Rank (Top 3)
          </Button>
          <Button variant={mode === "points" ? "solid" : "ghost"} onClick={() => setMode("points")}>
            Points (budget)
          </Button>
        </Stack>

        <Stack gap={10}>
          <Text muted style={{ fontWeight: 700 }}>
            Categories
          </Text>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {categories.map((c) => {
              const isOn = selected.has(c.categoryId);

              let badge = "";
              if (mode === "rank") {
                const idx = ranks.indexOf(c.categoryId);
                badge = idx >= 0 ? `#${idx + 1}` : "";
              } else {
                badge = isOn ? String(points[c.categoryId] ?? 0) : "";
              }

              return (
                <button
                  key={c.categoryId}
                  onClick={() => toggleSelected(c.categoryId)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border)",
                    background: isOn ? "var(--surface)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{c.label}</span>
                  {badge ? (
                    <span
                      style={{
                        fontSize: 12,
                        opacity: 0.8,
                        padding: "2px 8px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                      }}
                    >
                      {badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Stack>

        {mode === "rank" ? (
          <Stack gap={10}>
            <Text muted>
              Click categories to set your <b style={{ color: "var(--fg)" }}>Top 3</b> in order. (Click again to remove.)
            </Text>

            <Stack direction="row" gap={10} wrap="wrap">
              {categories
                .filter((c) => selected.has(c.categoryId))
                .map((c) => {
                  const idx = ranks.indexOf(c.categoryId);
                  return (
                    <Button
                      key={c.categoryId}
                      variant={idx >= 0 ? "solid" : "ghost"}
                      onClick={() => rankClick(c.categoryId)}
                      title="Click to add/remove from Top 3"
                    >
                      {idx >= 0 ? `#${idx + 1} ` : ""}{c.label}
                    </Button>
                  );
                })}
            </Stack>

            <Text muted style={{ fontSize: 12 }}>
              Current Top 3: {ranks.length ? ranks.map((id) => categories.find((c) => c.categoryId === id)?.label ?? id).join(" → ") : "—"}
            </Text>
          </Stack>
        ) : (
          <Stack gap={10}>
            <Text muted>
              Budget: <b style={{ color: "var(--fg)" }}>{budget}</b> points • Allocated:{" "}
              <b style={{ color: "var(--fg)" }}>{totalAllocated}</b> • Remaining:{" "}
              <b style={{ color: "var(--fg)" }}>{remaining}</b>
            </Text>

            <Stack gap={10}>
              {categories
                .filter((c) => selected.has(c.categoryId))
                .map((c) => (
                  <div
                    key={c.categoryId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      background: "var(--surface)",
                    }}
                  >
                    <Text style={{ fontWeight: 700 }}>{c.label}</Text>
                    <input
                      type="number"
                      min={0}
                      max={budget}
                      step={1}
                      value={points[c.categoryId] ?? 0}
                      onChange={(e) => setPoints(c.categoryId, Number(e.target.value))}
                      style={{
                        width: 80,
                        padding: "8px 10px",
                        borderRadius: "var(--r-md)",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--fg)",
                      }}
                      aria-label={`Points for ${c.label}`}
                    />
                  </div>
                ))}
            </Stack>

            <Text muted style={{ fontSize: 12 }}>
              (We’ll enforce “must sum to budget” later if you want strictness. For now it’s flexible + persisted.)
            </Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
