# Phase 2: Planner

## Purpose
Identify the next smallest, shippable slice of work toward completing the spec.

## When to Use
- After spec is complete
- After a slice has been approved
- When resuming work

## Scope
- **May read**: Any files to understand context
- **May present**: Plans to the user
- **Must NOT modify**: Any code files, `spec.md`, or `slices/`

**The planner only plans. All code changes happen in Phase 3.**

## Required Reading
Before planning, you MUST read:
- **`architecture.md`** - Architecture rules (READ THIS FIRST)
- `spec.md` - What needs to be built
- Architecture section in `spec.md` - Project-specific constraints
- `slices/` - What's already completed
- Current codebase - What exists now

**If requirements are unclear → STOP and ask the user.**

## Process
1. **Read all required inputs** (listed above)

2. **Identify the next logical slice**:
   - What are the prerequisites/dependencies?
   - What's the smallest vertical slice that makes progress?
   - What can be tested independently?
   - What provides user-visible value?

3. **Create the slice plan** with these elements:
   - **Name**: 1-3 word description (becomes SLICE-NNN-name.md)
   - **Goal**: One sentence - what this accomplishes
   - **Why now**: Prerequisites, dependencies, logical order
   - **Scope**:
     - **In scope**: What will be built in this slice
     - **Out of scope**: What explicitly won't be included (avoid scope creep)
   - **User-visible outcome**: "User can ___" statement
   - **File map**: Files to create or modify
   - **Data/API assumptions**: Brief notes on data structures or API contracts (if relevant)
   - **Tests**: What tests will be added or updated
   - **Verification**: How to verify it works (e.g., `npm run verify`, manual test steps)
   - **Risks/Open decisions**: Any unknowns or tradeoffs to discuss

4. **Verify plan completeness**:
   - Is the slice minimal and clear?
   - Is verification defined?
   - Are there unanswered architectural conflicts?
   - If yes to any → refine the plan

5. **Present the complete plan to user**

6. **Get user approval before proceeding**

## Rules
- **One slice at a time**: Don't plan multiple slices ahead
- **Small and focused**: 1-3 files per slice, one clear purpose
- **Build in order**: Dependencies first, then features that use them
- **Never invent behavior**: If unclear, stop and ask
- **Complete plans only**: Internal consistency is required
- If a slice feels large, break it down further

## Stop Condition
Planning is finished when ALL of these are true:
- The slice is minimal and clear
- User-visible outcome is defined ("User can ___")
- Verification is defined (how to test/verify)
- No unanswered architectural conflicts remain
- Plan is complete and internally consistent

**Then STOP and present to user. Do NOT proceed to implementation without approval.**

## Slice Sizing Guidelines

**Good slices** (1-3 files, one focused session):
- Project setup, single component, one API endpoint, database schema for one entity, auth flow (login only)
- Has clear done criteria, can be tested, adds user value, doesn't break code, touches all necessary layers

**Too large** (break down):
- "Complete user management" → create, list, edit (separate slices)
- "Full auth system" → login, logout, password reset (separate)
- "Dashboard with charts" → layout, data fetching, charts (separate)

## Plan Presentation Format

Present your plan to the user in this format:

```
## Slice [N]: [1-3 word name]

**Goal**: [One sentence describing what this accomplishes]

**Why now**: [Prerequisites, dependencies, why this is the logical next step]

**Scope**:
- In scope: [What will be built]
- Out of scope: [What won't be included]

**User-visible outcome**: User can [do something specific]

**Files**:
- `path/to/file.ts` (create) - [brief purpose]
- `path/to/other.ts` (modify) - [what changes]

**Data/API assumptions**: [Any assumptions about data structures or APIs]

**Tests**:
- [What tests will be added/updated]

**Verification**:
- Run `npm run verify` (or equivalent)
- [Any manual verification steps]

**Risks/Open decisions**:
- [Any unknowns or tradeoffs to discuss]

Approve this plan?
```

## After User Approves
- Proceed to Phase 3 (Implementer)
- Read `phases/3-implementer.md` for next phase instructions

## If User Requests Changes to Plan
- Adjust the plan based on feedback
- Re-present for approval
- Stay in Phase 2 until plan is approved
