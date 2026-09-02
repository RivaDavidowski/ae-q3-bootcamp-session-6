<!--
Sync Impact Report
Version change: [CONSTITUTION_VERSION] (unset template) → 1.0.0
Modified principles: none (initial ratification; all placeholders replaced)
Added sections:
  - Core Principles: I. Scope Discipline, II. Single Responsibility & DRY,
    III. Test-Backed Development (NON-NEGOTIABLE), IV. Design System Fidelity,
    V. Consistency & Readability
  - Technology & Quality Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none
Templates requiring updates: none (dependent templates read this file at runtime)
Deferred TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Scope Discipline

Features MUST be limited to the behaviors defined in `docs/functional-requirements.md`.
Anything listed under "Out of Scope" (authentication, multi-user support, priorities,
categories, recurring todos, reminders, undo/redo, bulk operations, search, filtering,
mobile-specific optimization) MUST NOT be implemented without a constitution amendment
or an explicit requirements update. Contributors MUST NOT add features, abstractions,
refactors, or configuration beyond what the current requirement demands.

Rationale: The project is a teaching-oriented, single-user application. Unrequested
scope inflates review cost and obscures the reference implementation.

### II. Single Responsibility & DRY

Every module, component, and function MUST have one well-defined responsibility.
Presentation components MUST NOT perform data fetching or persistence; that work
belongs in the service layer (`src/services/`). Logic repeated in more than one place
MUST be extracted into a shared utility or reusable component. Dependencies MUST be
injected through props or parameters rather than hardcoded, so units stay
independently testable.

Rationale: Focused units are the precondition for the isolated, non-brittle tests
required by Principle III.

### III. Test-Backed Development (NON-NEGOTIABLE)

Tests MUST accompany every behavior change and MUST be written before or alongside the
implementation, following the red-green-refactor cycle where practical. Tests MUST live
in colocated `__tests__/` directories, be named `{filename}.test.js`, and follow the
Arrange-Act-Assert structure with descriptive names. Tests MUST verify observable
behavior, never implementation details, and MUST be independent with all external
dependencies mocked. Code coverage MUST be at or above 80% overall, and 100% for the
critical user workflows in `docs/functional-requirements.md`. Bug fixes MUST add a
failing test before the fix. `npm test` MUST pass before any pull request is opened.

Rationale: Coverage of behavior, not structure, is what makes the codebase safe to
change; enforcing it as a gate prevents silent regressions.

### IV. Design System Fidelity

All UI work MUST use the tokens defined in `docs/ui-guidelines.md`: the light and dark
mode color palettes, the system font stack with its defined type scale, and the 8px
spacing grid (xs 8, sm 16, md 24, lg 32, xl 48). Colors, font sizes, and spacing values
MUST be referenced through CSS custom properties in `src/styles/theme.css` rather than
hardcoded literals in component styles. Every surface MUST render correctly in both
light and dark mode. Layout MUST remain a single column with a 600px maximum width.
Destructive actions MUST use the danger color and MUST require a confirmation dialog.

Rationale: Centralized tokens keep the Halloween-themed design coherent and make theme
changes a one-file operation.

### V. Consistency & Readability

Code MUST follow `docs/coding-guidelines.md`: 2-space indentation, LF line endings, no
trailing whitespace, lines under 100 characters, `camelCase` for variables and
functions, `UPPER_SNAKE_CASE` for constants, and `PascalCase` for React components and
classes with matching file names. Imports MUST be ordered external libraries, internal
modules, then styles, separated by blank lines, and circular dependencies are
prohibited. Operations that can fail MUST be wrapped in error handling that logs the
cause and surfaces an actionable message to the user. Comments MUST explain *why*, not
*what*; public functions and components MUST carry JSDoc. No `console.log` statements
may remain in production code.

Rationale: Uniform, self-explanatory code lowers the cost of every future read, which
dominates the cost of every future write.

## Technology & Quality Constraints

- The project is an npm-workspaces monorepo with exactly two packages:
  `packages/frontend` (React) and `packages/backend` (Express.js). New packages require
  an amendment.
- The language is JavaScript. Type safety MUST be approached through JSDoc annotations,
  guard clauses, and default values rather than by introducing a type system.
- Frontend structure MUST follow `components/`, `services/`, `utils/`, `styles/`.
  Backend structure MUST follow `routes/`, `controllers/`, `services/`, `middleware/`.
- All persistence MUST go through the backend REST API. The frontend MUST NOT hold
  durable state of its own; every create, update, and delete MUST persist immediately.
- Input data MUST be validated at API boundaries. Todo titles are required and capped
  at 255 characters; due dates are optional.
- Dependencies MUST be justified before being added; prefer the standard library and
  existing packages.
- Performance work MUST be deferred until a measured need exists; `useMemo` and
  `useCallback` are applied to solve observed re-render problems, not preemptively.

## Development Workflow & Quality Gates

- Work MUST happen on feature branches named `feature/<short-description>`. Direct
  commits to `main` are prohibited.
- Commits MUST be atomic and carry messages explaining the *why*, using a conventional
  prefix (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
- Every change MUST reach `main` through a pull request that passes review.
- Before opening a pull request, the author MUST confirm: lint is clean, `npm test`
  passes, coverage thresholds hold, naming and import conventions are followed, error
  handling exists on fallible paths, and no debug logging remains.
- Reviewers MUST verify compliance with this constitution and MUST block merges that
  introduce out-of-scope functionality or unjustified complexity.
- When a change makes documentation in `docs/` inaccurate, the documentation MUST be
  updated in the same pull request.

## Governance

This constitution supersedes all other development practices. Where it conflicts with a
document in `docs/`, this constitution wins and the conflicting document MUST be
corrected.

Amendments MUST be proposed in a pull request that states the motivation, the exact
textual change, and the migration impact on existing code. An amendment takes effect
only when merged.

Versioning follows semantic versioning:

- **MAJOR**: a principle is removed or redefined in a backward-incompatible way.
- **MINOR**: a principle or section is added, or existing guidance is materially
  expanded.
- **PATCH**: clarifications, wording, and typo fixes that do not change meaning.

Compliance is reviewed on every pull request. Any deviation MUST be documented in the
pull request description with an explicit justification for why the simpler, compliant
approach is insufficient; unjustified deviations MUST be rejected. Runtime development
guidance lives in `.github/copilot-instructions.md` and the `docs/` directory, which
MUST remain consistent with this document.

**Version**: 1.0.0 | **Ratified**: 2026-09-02 | **Last Amended**: 2026-09-02
