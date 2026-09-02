# Data Model: Overdue Todo Items

## Todo Item

The persisted todo shape remains unchanged.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | integer | Existing unique todo identifier. |
| `title` | string | Required; 1-255 characters after trimming. |
| `dueDate` | `YYYY-MM-DD` string or `null` | Optional local calendar date. |
| `completed` | boolean-like integer | `0` means incomplete; `1` means completed. |
| `createdAt` | timestamp | Existing creation time; list remains ordered newest first. |

## Overdue Status

`isOverdue` is a frontend-only derived boolean. It is not persisted or sent over the
REST API.

| Input | Rule |
| --- | --- |
| `completed` | Must be false/`0`. A completed todo is never overdue. |
| `dueDate` | Must be present and parse as a local calendar date. An absent date is not overdue. |
| Local due date | Must be strictly before local today at midnight. A date equal to today is not overdue. |

## State Transitions

| Current condition | Event | Resulting overdue status |
| --- | --- | --- |
| Incomplete and past due | Completion toggled to complete | False |
| Incomplete and past due | Due date changed to today, future, or empty | False |
| Incomplete and today/future due | Due date changed to past | True |
| Incomplete and due today | List rendered after a later local date | True |

The status is recalculated whenever `TodoCard` receives a todo for rendering; it has no
stored transition of its own.