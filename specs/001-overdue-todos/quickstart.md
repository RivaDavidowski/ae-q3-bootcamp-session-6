# Quickstart: Validate Overdue Todo Items

## Prerequisites

- Node.js and npm installed.
- Repository dependencies installed from the repository root with `npm install`.

## Automated Validation

Run the focused frontend tests while implementing:

```bash
npm test --workspace=frontend -- TodoCard.test.js dateUtils.test.js
```

Run the full workspace suite before review:

```bash
npm test
```

Expected result: all tests pass, including date-decision coverage for past-due,
due-today, future-due, undated, and completed todos, plus card output coverage for the
visible `Overdue` status. See [data-model.md](data-model.md) and
[contracts/overdue-status-ui.md](contracts/overdue-status-ui.md) for the conditions and
display contract.

## Manual Browser Validation

Start both applications from the repository root:

```bash
npm start
```

In the todo list, create or edit five incomplete/completed todos using dates relative
to the current local date:

| Todo condition | Expected result |
| --- | --- |
| Incomplete, yesterday or earlier | Visible icon and `Overdue` label. |
| Incomplete, today | No overdue indicator. |
| Incomplete, future date | No overdue indicator. |
| Incomplete, no due date | No overdue indicator. |
| Completed, past due | No overdue indicator. |

Then edit a past-due incomplete todo to today's date and confirm the indicator disappears.
Change an incomplete current/future todo to a past date and confirm it appears. Toggle an
overdue todo complete and confirm it disappears. Verify list positions do not change and
check both light and dark theme modes.