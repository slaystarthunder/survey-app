# Survey / Assessment App — Build Plan

This plan enforces:
- Small, testable steps
- Clear validation before progress
- Frozen sections to localize bugs
- Persistent section tags in code for traceability

This file is a living *process document*, but earlier sections are frozen once validated.

---

## Global Rules

### Freeze Rule
After a section is validated, its files are **FROZEN**.

Later sections may only modify:
- Wiring files:
  - src/app/App.tsx
  - src/app/routes.tsx
- New files
- Small additive exports (no rewrites)

If frozen code must change, it must be explicitly noted in this plan.

---

### Section Tags (Permanent)
Each section has a tag: `[S00]`, `[S01]`, ...

When a file gains a new responsibility, add a top-level comment:

```ts
// [S01] Added: Pure domain computation for result summaries.
