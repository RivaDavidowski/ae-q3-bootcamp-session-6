# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-09-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [specs/001-overdue-todos/spec.md](spec.md)

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Identify incomplete todos whose optional date-only due date precedes the user's local
calendar date. Add a tested frontend date utility that compares locally parsed calendar
dates and renders a non-color-only icon plus visible `Overdue` label in `TodoCard`.
The existing API response, persistence model, and creation-date list ordering remain
unchanged.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript; Node.js for Express backend; React 18.2 frontend

**Primary Dependencies**: React, react-scripts, Express.js, better-sqlite3, Jest,
React Testing Library, MSW

**Storage**: In-memory SQLite through the existing Express REST API; todo `dueDate`
values are nullable `YYYY-MM-DD` strings

**Testing**: Jest with React Testing Library and MSW; backend Jest with Supertest

**Target Platform**: Modern desktop browsers via Create React App; Node.js server

**Project Type**: npm-workspaces web application with React frontend and Express API

**Performance Goals**: Determine and render derived overdue state during normal list
rendering; no additional network requests or list passes beyond existing rendering

**Constraints**: Compare the user's local calendar dates, retain creation-date ordering,
use existing CSS custom-property tokens in both themes, expose text status to assistive
technology, add no dependencies or persistence changes

**Scale/Scope**: One derived status, one frontend utility, `TodoCard` indicator and
styles, and focused unit/component tests; single-user todo list

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-design review: PASS**

- Scope: The feature adds only an in-place visual status to the existing todo workflow;
  it does not add filtering, sorting, reminders, or new fields.
- Responsibility and DRY: Local calendar-date parsing and overdue determination belong
  in one reusable frontend utility; `TodoCard` remains responsible for presentation.
- Testing: Add colocated unit tests for all required status outcomes and component tests
  for the visible, accessible indicator. Run workspace tests before review.
- Design: Add theme-token-backed card styles and a textual status to support both themes
  and non-color-only recognition within the existing 600px single-column layout.
- Architecture: Existing API payload and frontend service satisfy the feature; no new
  dependency, package, database, endpoint, or backend responsibility is justified.

**Post-design review: PASS**

The artifacts retain the same boundaries. The UI contract explicitly preserves API
compatibility, ordering, and the required accessible text status; no constitution
violations require complexity tracking.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
packages/
├── backend/
│   ├── src/
│   │   └── app.js                 # Existing REST API and persistence; unchanged
│   └── __tests__/
│       └── app.test.js
└── frontend/
  └── src/
    ├── App.js                 # Replaces todo objects after API mutations
    ├── App.css                # Existing todo-card styles and theme-token use
    ├── components/
    │   ├── TodoCard.js        # Renders derived overdue state
    │   ├── TodoList.js        # Preserves API-provided creation-date ordering
    │   └── __tests__/
    │       └── TodoCard.test.js
    ├── services/
    │   └── todoService.js     # Existing REST client; unchanged
    ├── styles/
    │   └── theme.css          # Existing design tokens; extended only if needed
    └── utils/
      ├── dateUtils.js       # Local-calendar parsing, display, overdue decision
      └── __tests__/
        └── dateUtils.test.js
```

**Structure Decision**: Use the existing two-package web application. The derived
status is computed in a new frontend utility and consumed by the existing card rather
than changing the backend REST contract or adding durable state.

