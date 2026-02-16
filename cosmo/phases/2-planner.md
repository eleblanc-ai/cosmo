# Phase 2: Planner

**⚠️ You are in Phase 2. ONLY plan the next slice. Do NOT implement code or do work outside this phase.**

## Purpose
Identify the next smallest, shippable slice of work toward completing the spec.

## When to Use
- After spec is complete
- After a slice has been approved
- When resuming work

## Scope
- **May read**: Any files to understand context
- **May present**: Plans to the user
- **Must NOT modify**: Any code files, `cosmo/spec.md`, or `cosmo/slices/`

**The planner only plans. All code changes happen in Phase 3.**

## Required Reading
Before planning, you MUST read:
- **`architecture.md`** - Architecture rules (READ THIS FIRST)
- `cosmo/spec.md` - What needs to be built
- Architecture section in `cosmo/spec.md` - Project-specific constraints
- `cosmo/slices/` - What's already completed
- Current codebase - What exists now

**If requirements are unclear → STOP and ask the user.**

## Process
1. **Read all required inputs** (listed above)

2. **Check if this is the first slice**:
   - If no slices exist yet, the first slice MUST include:
     - Project setup (folder structure, config)
     - Basic example component/function
     - Test for the example to verify test infrastructure works
     - Must achieve: `npm run verify` passes
   - Note: init script already installed Vitest and created verify script
   - This ensures all future slices can include tests

3. **Identify the next logical slice**:
   - What are the prerequisites/dependencies?
   - What's the smallest vertical slice that makes progress?
   - What can be tested independently?
   - What provides user-visible value?

4. **Check for refactoring needs**:
   - Will this slice use any code currently in a feature folder?
   - If yes, that code needs to be promoted to `src/shared` first
   - Plan a separate refactoring slice before the feature slice
   - Example: "Move ConfirmModal from features/auth to src/shared"

5. **Create the slice plan** with these elements:
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

6. **Verify plan completeness**:
   - Is the slice minimal and clear?
   - Is verification defined?
   - Are there unanswered architectural conflicts?
   - If yes to any → refine the plan

7. **Present the complete plan to user**

8. **Get user approval before proceeding**

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

A slice is a small, focused increment of work—like adding a login button, creating a user profile page, or implementing a search feature. 

**Good slices** (1-3 files, one focused session):
- Project setup, single component, one API endpoint, database schema for one entity, auth flow (login only)
- Has clear done criteria, can be tested, adds user value, doesn't break code, touches all necessary layers
- Refactoring slice: Move component from feature to shared (when needed by 2+ features)

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

## Communication Guidelines

**REQUIRED for all Phase 2 interactions:**

1. **Always start with phase indicator**:
   - Use format: `## 📋 Phase 2: Planning Next Slice`
   - Make it visually prominent (heading or bold with emoji)

2. **Always end with a clear question**:
   - When presenting a plan: "Approve this plan?"
   - If clarification needed: "Should I adjust the scope to [option]?"
   - After feedback: "Does this revised plan work better?"

**Example start:**
```
## 📋 Phase 2: Planning Next Slice

I've reviewed cosmo/spec.md and the completed slices. Let me plan the next logical increment...
```

**Example end:**
```
This slice will set up the project structure and verify that our test infrastructure works.

Approve this plan?
```
