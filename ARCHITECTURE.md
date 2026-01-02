# Architecture Rules (Mini RFC)

This project follows a **data-first, composition-driven React architecture**.

---

## Core Principles

### 1. Small Finite UI Primitives
- UI primitives are domain-agnostic
- Reusable across features
- Live in src/ui
- No imports from core/domain or features

Examples:
- Card
- Stack
- Button
- Text
- PageShell

If a component needs domain language, it is NOT a primitive.

---

### 2. Semantic Components Where Meaning Matters
Domain-specific UI is allowed and encouraged:
- PromptCard
- SurveyProgress
- ResultSummaryCard

These live in src/features/** and may import domain types.

---

### 3. Predictable Orchestration
Side effects and state transitions live in:
- Feature controller hooks
- Route-level pages

Leaf UI components are pure and boring.

---

### 4. Pure Domain Core
Everything in src/core/domain must be:
- Deterministic
- Testable
- Free of React, IO, and browser APIs

This includes:
- Types (contracts)
- Validation
- Computation

---

### 5. Effects at the Boundary
useEffect is allowed ONLY in:
- Feature controller hooks
- Route-level pages
- Data repositories

useEffect is NOT allowed in:
- src/ui
- Leaf presentational components

---

## Folder Responsibilities

src/app  
- App bootstrapping
- Providers
- Routes

src/pages  
- Route-level orchestration
- Connects controllers to views

src/features  
- Feature logic
- Semantic components
- Controller hooks

src/ui  
- Pure UI primitives

src/core/domain  
- Types
- Pure logic
- Validation

src/core/data  
- Persistence
- IO adapters

---

## Section Tags (Permanent)

Every file that introduces a new responsibility must be tagged:

```ts
// [S01] Added: Survey result computation.