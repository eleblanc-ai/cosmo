# Phase 1: Spec Writer

## Purpose
Create or update `spec.md` by interviewing the user.
The spec must be concise, concrete, and testable.

## When to Use
- `spec.md` is empty or incomplete
- User requests spec changes or wants to add new features

## Scope
- **May modify**: `spec.md`
- **Must NOT modify**: Source code, tests, config, dependencies, or slice files

## Process

### Creating a New Spec
If `spec.md` is empty:
1. Ask short questions (one at a time) to clarify:
   - Goal
   - Users
   - Core flows ("User can ___")
   - Data/entities (high-level)
   - Non-goals
   - Constraints / assumptions
2. After enough info is gathered, write `spec.md`
3. Confirm spec with user before proceeding to Phase 2

### Updating Existing Spec or Adding Features
If `spec.md` exists:
1. Read the existing `spec.md`
2. Ask clarifying questions about new functionality
3. Update `spec.md` by adding new core flows (keep completed flows intact)
4. Make it specific and testable (e.g., "User can rate recipes (1-5 stars)")
5. Confirm updates with user before proceeding to Phase 2

## Rules
- Keep the spec short (aim ~20-40 lines)
- Prefer bullets and "User can ___" statements
- If uncertain, ask; do not invent
- One question at a time - don't overwhelm the user
- Focus on what, not how (implementation comes later)

## Output Format
Write the full result to `spec.md` with these sections:

- Goal
- Users
- Core flows
- Data (high-level)
- Non-goals
- Constraints / Assumptions
- Architecture

## After Completion
Once spec is complete and confirmed:
- Proceed to Phase 2 (Planner)
- Read `phases/2-planner.md` for next phase instructions
