# Research: Overdue Todo Items

## Decision: Derive overdue state in the frontend

**Rationale**: The existing todo API already returns the required `dueDate` and
`completed` fields, and `App` replaces its displayed todo with each API update. A
derived presentation state therefore updates on future renders, date edits, completion
toggles, and a new calendar day without storage, endpoint, or ordering changes.

**Alternatives considered**:

- Persist an `overdue` column: rejected because it duplicates time-dependent derived
  state and risks becoming stale at midnight.
- Return `overdue` from `GET /api/todos`: rejected because client-local calendar dates
  are required and the existing payload is sufficient.
- Reorder overdue todos: rejected by FR-006.

## Decision: Compare locally parsed date-only values at local midnight

**Rationale**: Due dates are `YYYY-MM-DD` calendar dates. `new Date('YYYY-MM-DD')`
parses as UTC, which can shift the date for users west of UTC. A shared utility will
split the string and construct `new Date(year, month - 1, day)` as a local midnight;
it will compare that result to a local-midnight value for today. The utility accepts an
optional reference date to make required boundary tests deterministic.

**Alternatives considered**:

- Compare ISO strings lexicographically: workable only with validation assumptions and
  does not provide a single date-display solution.
- Compare UTC timestamps: rejected because the specification uses the user's local
  calendar date.
- Add a date library: rejected because native APIs handle this small, isolated need and
  the constitution requires dependency justification.

## Decision: Render semantic text plus icon in TodoCard

**Rationale**: `TodoCard` already owns title and due-date presentation. It will render
an icon and visible `Overdue` text only for an overdue todo, with semantic text exposed
to assistive technology. Styling will use existing CSS custom-property tokens so it
remains understandable in light and dark themes without relying on color.

**Alternatives considered**:

- Color-only due-date styling: rejected by FR-004.
- A tooltip-only or `aria-label`-only indicator: rejected because visible text is
  explicitly required.
- A separate status component: rejected as unnecessary abstraction for one card-local
  status display.

## Decision: Test utility decisions and observable card output

**Rationale**: Unit tests can cover past-due, today, future-due, undated, and completed
todos with a fixed local reference date. Component tests verify that the user-visible
and accessible status appears only for the past-due incomplete state. Existing App
update flows replace the card todo object, so rendering the returned objects exercises
the update behavior without testing internals.

**Alternatives considered**:

- Backend-only tests: rejected because the backend does not own the derived display
  state.
- Snapshot tests: rejected because direct role/text assertions are clearer and less
  brittle for the required accessibility behavior.