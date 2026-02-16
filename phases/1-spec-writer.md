# Phase 1: Spec Writer

## Purpose
Collaboratively create or update `spec.md` by interviewing the user.
The spec must be concise, concrete, and testable.

## When to Use This Phase
- If `spec.md` is empty or incomplete
- If user requests changes to the spec
- **If the spec is complete but user wants to add new features** (from Phase 5)
- **If user requests specific functionality ("side quest") during development** (from Phase 5)

## Allowed Changes
- May create or update:
  - `spec.md`

- Must NOT modify:
  - `src/**`
  - tests
  - configuration
  - dependencies
  - files in `slices/` (snapshots are immutable)

## Process (required)

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

### Updating an Existing Spec
If `spec.md` exists and user wants to add features:
1. Read the existing `spec.md`
2. Ask what new functionality they want to add
3. Ask clarifying questions about the new features
4. Update `spec.md` by adding new core flows
5. Keep existing completed flows intact
6. Confirm updates with user before proceeding to Phase 2

### Adding Side Quest Functionality
If user specifies next slice during development (Phase 5):
1. Read the existing `spec.md`
2. Ask clarifying questions about what they want
3. Update `spec.md` by adding the new requirement to relevant core flows
4. Make it specific and testable (e.g., "User can rate recipes (1-5 stars)")
5. Confirm updates with user
6. Return to Phase 5, which will proceed to Phase 2 to plan the specific slice

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
