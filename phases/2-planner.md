# Phase 2: Planner

## Purpose
Identify the next smallest, shippable slice of work toward completing the spec.

## When to Use This Phase
- After spec is complete
- After a slice has been approved
- When resuming work (check what's done, plan what's next)

## Allowed Changes
- May read ANY files to understand context
- May present plans to the user

- Must NOT modify:
  - `src/**` (implementation happens in Phase 3)
  - tests
  - configuration
  - dependencies
  - `spec.md` (only Phase 1 spec-writer can modify)
  - `slices/` (only Phase 5 approval can add to this)
  - Any code files

**The planner only plans. All code changes happen in Phase 3 (Implementer).**

## Required Inputs
Before planning, you MUST read:
- `spec.md` - what needs to be built
- `slices/` - what's already been completed
- Current codebase - what exists now
- **`architecture.md`** - architecture rules and patterns (READ THIS FIRST)
- Architecture section in `spec.md` - project-specific architectural constraints

**If requirements are unclear → STOP and ask the user.**
Never invent behavior or make assumptions about what the user wants.

## Architecture During Planning

When planning slices, follow the guidelines in `architecture.md`. Key considerations:

- **File placement**: Features vs shared vs app buckets
- **Import boundaries**: No feature-to-feature imports
- **Code organization**: Colocation, avoid premature abstraction
- **Verify compliance**: Check that the plan respects architectural rules

**Read `architecture.md` for complete details.**

If uncertain about architecture decisions, note them in "Risks/Open decisions" and discuss with user.

## Process (required)
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
- **One small vertical slice only**: Plan one slice at a time, not multiple
- **Prefer small slices**: 1-3 files per slice
- **One thing at a time**: Don't mix features, setup, and refactoring in one slice
- **Build in order**: Dependencies first, then features that use them
- **Stay focused**: Each slice should have one clear purpose
- **Never invent behavior**: If unclear, stop and ask the user
- **Complete plans only**: Don't produce partial or vague plans
- **Internal consistency**: Plan must be complete and internally consistent
- If a slice feels large, break it down further
- Don't plan multiple slices ahead - just the next one

## Stop Condition
Planning is finished when ALL of these are true:
- The slice is minimal and clear
- User-visible outcome is defined ("User can ___")
- Verification is defined (how to test/verify)
- No unanswered architectural conflicts remain
- Plan is complete and internally consistent

**Then STOP and present to user. Do NOT proceed to implementation without approval.**

## Slice Sizing Guidelines
**Good slice examples:**
- Project setup (package.json, basic structure)
- Single component with basic functionality
- One API endpoint with validation
- Database schema for one entity
- Authentication flow (login only)

**Too large (break down):**
- "Complete user management" → separate into: create user, list users, edit user
- "Full auth system" → separate into: login, logout, password reset
- "Dashboard with charts" → separate into: layout, data fetching, charts

## What Makes a Good Slice
- Can be implemented in one focused session
- Has clear done criteria
- Can be tested (even if manually)
- Adds value (user can see/test something)
- Doesn't leave code in broken state
- One vertical slice (touches all necessary layers)

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
