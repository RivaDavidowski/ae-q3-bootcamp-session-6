# Overdue Status UI Contract

## Scope

This feature does not change the backend REST contract. The frontend derives and
displays overdue status from the existing todo response.

## Input Contract

`TodoCard` continues to accept a todo object with:

```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-09-01",
  "completed": 0,
  "createdAt": "2026-09-01T09:00:00Z"
}
```

`dueDate` is a nullable `YYYY-MM-DD` date-only value. `completed` can be the existing
SQLite boolean-like `0` or `1` value.

## Output Contract

When the todo is incomplete and its locally parsed due date is before the current local
calendar date, the card MUST:

- Retain its title, formatted due date, checkbox, edit action, and delete action.
- Render a recognizable overdue icon and visible text exactly `Overdue` adjacent to the
  todo's content.
- Expose the status text to assistive technologies as readable content; the icon is
  supplementary, not the only signal.
- Use styles based on existing theme custom properties and preserve legibility in both
  supported themes.

For todos that are completed, undated, due today, or due in the future, no overdue icon
or `Overdue` text is rendered.

## Compatibility

No request paths, request bodies, response shapes, database columns, ordering, filtering,
or persistence behavior change. Status updates occur naturally after the existing edit
and completion APIs return an updated todo and when the list is rendered on a later day.