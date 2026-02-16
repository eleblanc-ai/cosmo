# Spec

## Goal
One-sentence description of the product’s purpose.

> A web app that helps users ___.

---

## Users
Who this is for (keep high level).

- Primary:
- Secondary (optional):

---

## Core Flows
List only **user-visible capabilities** using:

**User can ___**

- User can ___
- User can ___
- User can ___

Do **not** include implementation details here.

---

## Data (high level)
Only the main entities and relationships.

- Entities:
  - ___
  - ___
- Relationships:
  - ___ → ___

No schemas. No field lists. Keep conceptual.

---

## Non-Goals
What we are **explicitly NOT building** (for now).

- ___
- ___

This prevents scope creep during planning.

---

## Constraints / Assumptions
Important rules the system must respect.

- Must pass `npm run verify` (or equivalent test command)
- ___

Include only things that affect design or behavior.

## Architecture
Project-specific architectural constraints (if any).

> General architecture rules live in `architecture.md`.
> Only add project-specific overrides or constraints here.

Example:
- Use React Query for all data fetching
- Use Tailwind for styling
- API calls must go through `src/app/api.ts`

---

## Done Definition (for the whole spec)
When is this **product direction** considered complete?

Example:

- All core flows implemented
- Tests cover critical behavior
- No placeholder UI or stub logic remains

Keep this high level — not per iteration.

---

## Notes (optional)
Anything unclear, risky, or worth remembering later.

- ___