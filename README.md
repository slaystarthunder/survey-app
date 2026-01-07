Maps of Needs — Reflective Mapping App

Maps of Needs is a non-diagnostic, reflective survey app designed to help users explore where their needs feel met, where they call for attention, and how balance might be restored.

The system intentionally avoids recommendations, judgments, or clinical interpretations. It supports awareness, reflection, and choice — not prescriptions.

Core Principles

Reflective, not diagnostic
Results are subjective mappings, not scores or evaluations.

User agency over outcomes
The app does not tell users what to do. It presents patterns and lets users decide what to focus on next.

Simple, stable foundations
The system favors clarity and composability over analytics or optimization.

V1 Scope (Contract)

This repository currently implements Version 1, with the following constraints:

Authentication

Login is required (no guest mode in v1)

Google sign-in only

Anonymous users are redirected to Login

Home and Result pages are protected routes

Surveys

Exactly one runnable survey exists:

Presence / Awareness

Additional surveys may appear on the Home screen as visual placeholders only

Placeholder surveys must not create runs or store data

Survey Runs & Persistence

Each survey run belongs to one authenticated user

Default persistence: localStorage, namespaced per user

Firebase persistence exists but is optional and gated

Completing the final question automatically saves the run

Results

Results are shown as a mapping, not a score

Categories are displayed with:

Status labels (Emerging / Exploring / Developing / Integrated)

A 10-segment visual bar

No percentages or numeric emphasis

Results are accessible only to authenticated users

High-Level Architecture
Pages

LoginPage
Authentication entry point

HomePage
Survey overview (1 real survey + placeholders)

Survey Flow
Prompt-by-prompt numeric input

ResultPage
Pure orchestration:

Loads run + survey

Computes category summaries

Passes clean data to the view

ResultView
Owns all result UX and layout

Data Flow
Answers
  → Category averages
    → Visual mapping
      → User reflection & next action

Responsibilities

Pages orchestrate data and routing

Views own layout and interaction

Persistence is abstracted (local first, Firebase optional)

No business logic in UI components

Explicitly Not Implemented (Yet)

No recommendation engine

No focus-selection logic

No analytics or scoring optimization

No diagnostic semantics

No cross-survey inference

These are intentional omissions.

Future-Friendly by Design

While v1 supports only one real survey, the system is designed so that:

New surveys can be added as blueprints

Runs remain survey-agnostic

Home can later surface multiple real surveys without restructuring core flow

Development Philosophy

“This tool helps people notice patterns and decide where to place attention.”