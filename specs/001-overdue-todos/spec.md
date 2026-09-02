# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-09-02

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items"

## Clarifications

### Session 2026-09-02

- Q: How should an overdue task communicate its status without relying on color? → A: Display an overdue icon with a visible Overdue text label.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify Overdue Work (Priority: P1)

As a todo application user, I can immediately distinguish incomplete tasks whose due
dates have passed from other tasks in my list, so I can prioritize them.

**Why this priority**: Clearly exposing overdue work is the core user value of this
feature.

**Independent Test**: Create incomplete tasks with past, current, future, and absent
due dates, then view the list and verify that only the past-due task is identified as
overdue.

**Acceptance Scenarios**:

1. **Given** an incomplete task with a due date before the current calendar date,
   **When** the user views the todo list, **Then** the task is visually identified as
   overdue.
2. **Given** incomplete tasks due today, due in the future, and without due dates,
   **When** the user views the todo list, **Then** none are identified as overdue.
3. **Given** an overdue task, **When** the user marks it complete, **Then** it is no
   longer identified as overdue.

---

### User Story 2 - Keep Overdue State Current (Priority: P2)

As a todo application user, I see the overdue identification update when I change a
task's completion status or due date, so the list continues to reflect my current work.

**Why this priority**: A stale overdue state could cause users to prioritize the wrong
work.

**Independent Test**: Change an overdue task's due date to today or later, and toggle
its completion status, verifying that the overdue identification updates each time.

**Acceptance Scenarios**:

1. **Given** an incomplete overdue task, **When** the user changes its due date to
   today or a future date, **Then** the task is no longer identified as overdue.
2. **Given** an incomplete task that is not overdue, **When** the user changes its due
   date to a date before the current calendar date, **Then** the task is identified as
   overdue.

### Edge Cases

- A task whose due date is the current calendar date is not overdue until the next
  calendar date.
- A completed task with a past due date is not overdue.
- A task without a due date is not overdue.
- The overdue indicator must remain understandable when color alone is unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine a task is overdue when it is incomplete and
  its due date is before the current calendar date.
- **FR-002**: The system MUST not identify a task as overdue when it has no due date,
  is due on or after the current calendar date, or is complete.
- **FR-003**: The todo list MUST provide an overdue icon and visible `Overdue` text
  label for every overdue task while retaining the existing task title, due date,
  completion control, and actions.
- **FR-004**: The visible `Overdue` label MUST be available to users of assistive
  technology and communicate the task's status without relying on color.
- **FR-005**: The overdue indicator MUST update when a task's due date or completion
  status changes and when the list is next viewed on a later calendar date.
- **FR-006**: The system MUST preserve the existing creation-date ordering of the todo
  list; overdue tasks are identified in place rather than reordered or filtered.
- **FR-007**: Automated verification MUST cover the overdue decision and the visible
  overdue state for past-due, due-today, future-due, undated, and completed tasks.

### Key Entities

- **Todo item**: A user task with a title, optional due date, and completion status.
- **Overdue status**: A derived state indicating that an incomplete todo item's due
  date is before the current calendar date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In verification across past-due, due-today, future-due, undated, and
  completed tasks, 100% of tasks receive the correct overdue status.
- **SC-002**: Users can identify every past-due incomplete task in a displayed list
  without manually comparing its due date to the current date.
- **SC-003**: In a representative five-task list containing one overdue task, users
  can identify the overdue task within 5 seconds.
- **SC-004**: In verification, changing a task from incomplete to complete or changing
  its due date results in the correct overdue status on the next displayed list state.

## Assumptions

- The current calendar date is evaluated using the user's local date.
- Existing todo items already retain an optional due date and a completion status.
- The feature adds an indicator only; it does not add sorting, filtering,
  notifications, reminders, or new task fields.
- Existing automated test practices will be extended to cover this behavior.