---
description: "Task list for overdue todo items implementation"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)
**Tests**: Required by FR-007 and constitution Principle III; write or update tests before implementation tasks.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks.
- **[Story]**: User story label for traceability (`US1`, `US2`).
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing workspace and feature file targets before changing behavior.

- [ ] T001 Verify frontend package scripts and test command expectations in package.json and packages/frontend/package.json
- [ ] T002 Confirm existing todo card, list, and theme file locations in packages/frontend/src/components/TodoCard.js, packages/frontend/src/components/TodoList.js, packages/frontend/src/App.css, and packages/frontend/src/styles/theme.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared derived-status utility path used by all overdue behavior.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create the frontend utility test directory and implementation directory at packages/frontend/src/utils/__tests__/ and packages/frontend/src/utils/

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Identify Overdue Work (Priority: P1) MVP

**Goal**: Incomplete todos with due dates before the user's local calendar date show a visible overdue icon and `Overdue` label in place.

**Independent Test**: Create incomplete todos with past, current, future, and absent due dates, plus a completed past-due todo, then verify that only the incomplete past-due todo renders the overdue indicator while list order and existing card controls remain unchanged.

### Tests for User Story 1

- [ ] T004 [P] [US1] Add local date parsing and overdue decision tests for past-due, due-today, future-due, undated, and completed todos in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T005 [P] [US1] Extend card output tests for visible `Overdue` text, supplementary icon, preserved title/due date/actions, and non-overdue states in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [ ] T006 [US1] Implement local `YYYY-MM-DD` parsing, local-today normalization, due-date formatting, and `isTodoOverdue` logic in packages/frontend/src/utils/dateUtils.js
- [ ] T007 [US1] Update packages/frontend/src/components/TodoCard.js to import date utilities, render the overdue icon plus visible `Overdue` label for overdue todos, and preserve existing title, due date, checkbox, edit, and delete controls
- [ ] T008 [US1] Add theme-token-backed overdue indicator and card state styles in packages/frontend/src/App.css
- [ ] T009 [US1] Add or reuse light and dark theme custom properties needed by the overdue styles in packages/frontend/src/styles/theme.css
- [ ] T010 [US1] Run the focused frontend validation command from specs/001-overdue-todos/quickstart.md against packages/frontend/src/utils/__tests__/dateUtils.test.js and packages/frontend/src/components/__tests__/TodoCard.test.js

**Checkpoint**: User Story 1 is functional and testable independently.

---

## Phase 4: User Story 2 - Keep Overdue State Current (Priority: P2)

**Goal**: Overdue status updates when a todo's due date or completion status changes and when the list is viewed on a later local calendar date.

**Independent Test**: Render the same todo after changing its due date from past to today/future, from today/future to past, and from incomplete to complete; verify the overdue indicator appears or disappears correctly without changing API payloads or list ordering.

### Tests for User Story 2

- [ ] T011 [P] [US2] Add rerender-based TodoCard tests for due date and completion changes in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T012 [P] [US2] Add reference-date boundary tests proving a due-today todo becomes overdue when rendered on a later local date in packages/frontend/src/utils/__tests__/dateUtils.test.js

### Implementation for User Story 2

- [ ] T013 [US2] Ensure packages/frontend/src/components/TodoCard.js recalculates overdue status from current props on each render after edit or toggle results replace the todo object
- [ ] T014 [US2] Verify packages/frontend/src/components/TodoList.js preserves API-provided creation-date ordering and does not sort, filter, or group overdue todos
- [ ] T015 [US2] Confirm packages/frontend/src/services/todoService.js request and response handling remains unchanged with no persisted `isOverdue` field
- [ ] T016 [US2] Run the focused frontend validation command from specs/001-overdue-todos/quickstart.md against packages/frontend/src/utils/__tests__/dateUtils.test.js and packages/frontend/src/components/__tests__/TodoCard.test.js

**Checkpoint**: User Stories 1 and 2 both work independently and together.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility review, and documentation alignment.

- [ ] T017 [P] Validate the overdue UI contract in specs/001-overdue-todos/contracts/overdue-status-ui.md against packages/frontend/src/components/TodoCard.js and packages/frontend/src/App.css
- [ ] T018 [P] Confirm existing project documentation remains accurate or update overdue behavior notes in docs/functional-requirements.md and docs/ui-guidelines.md
- [ ] T019 Run the full workspace test suite described in specs/001-overdue-todos/quickstart.md from package.json
- [ ] T020 Perform the manual light-theme and dark-theme browser validation checklist from specs/001-overdue-todos/quickstart.md against packages/frontend/src/components/TodoCard.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on the shared utility and card integration from User Story 1, but is independently testable through rerendered todo states.
- **Polish (Phase 5)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 - Identify Overdue Work (P1)**: Starts after Phase 2 and has no dependency on other user stories.
- **US2 - Keep Overdue State Current (P2)**: Starts after Phase 2; implementation uses the same derived utility and current-props rendering introduced for US1.

### Within Each User Story

- Write or update tests first and confirm they fail for the missing behavior.
- Implement utility logic before component integration.
- Integrate component rendering before styling validation.
- Run the focused tests before moving to the next story.

### Parallel Opportunities

- T004 and T005 can run in parallel after T003 because they target different test files.
- T011 and T012 can run in parallel after US1 because they target component and utility tests separately.
- T017 and T018 can run in parallel after both user stories because one validates the feature contract and the other checks documentation.

---

## Parallel Example: User Story 1

```bash
# Launch test authoring for User Story 1 in parallel:
Task: "Add local date parsing and overdue decision tests in packages/frontend/src/utils/__tests__/dateUtils.test.js"
Task: "Extend card output tests in packages/frontend/src/components/__tests__/TodoCard.test.js"
```

---

## Parallel Example: User Story 2

```bash
# Launch state-refresh test authoring for User Story 2 in parallel:
Task: "Add rerender-based TodoCard tests in packages/frontend/src/components/__tests__/TodoCard.test.js"
Task: "Add reference-date boundary tests in packages/frontend/src/utils/__tests__/dateUtils.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational utility directory setup.
3. Complete Phase 3: User Story 1.
4. Stop and validate with `npm test --workspace=frontend -- TodoCard.test.js dateUtils.test.js`.
5. Demo the in-place overdue icon and visible `Overdue` label for one past-due incomplete todo.

### Incremental Delivery

1. Complete Setup and Foundational phases.
2. Add US1 to show correct overdue identification for the full status matrix.
3. Add US2 to prove status refreshes after due-date, completion, and local-date changes.
4. Complete Polish tasks, then run `npm test` before review.

### Notes

- Keep overdue status derived in the frontend; do not add API fields, database columns, sorting, filtering, reminders, or notifications.
- Use local calendar-date parsing for `YYYY-MM-DD`; avoid `new Date('YYYY-MM-DD')` for overdue decisions.
- Preserve the existing single-column card layout and both theme modes.
- Commit after each task or logical group when implementing.