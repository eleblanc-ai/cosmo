# Phase 1: Spec Writer

**⚠️ You are in Phase 1. ONLY work on cosmo/spec.md. Do NOT implement code or do work outside this phase.**

## Purpose
Create or update `cosmo/spec.md` by interviewing the user.
The spec must be concise, concrete, and testable.

## When to Use
- `cosmo/spec.md` is empty or incomplete
- User requests spec changes or wants to add new features

## Scope
- **May modify**: `cosmo/spec.md`
- **Must NOT modify**: Source code, tests, config, dependencies, or slice files

## Process

### Creating a New Spec
If `cosmo/spec.md` is empty:
1. Ask short questions (one at a time) to clarify:
   - Goal
   - Users
   - Core flows ("User can ___")
   - Data/entities (high-level)
   - Non-goals
   - Constraints / assumptions
2. After enough info is gathered, write `cosmo/spec.md`
3. Note: If user ran init.sh, Vitest and verify script already installed - document in spec
4. Confirm spec with user before proceeding to Phase 2

### Updating Existing Spec or Adding Features
If `cosmo/spec.md` exists:
1. Read the existing `cosmo/spec.md`
2. Ask clarifying questions about new functionality
3. Update `cosmo/spec.md` by adding new core flows (keep completed flows intact)
4. Make it specific and testable (e.g., "User can rate recipes (1-5 stars)")
5. Confirm updates with user before proceeding to Phase 2

## Rules
- Keep the spec short (aim ~20-40 lines)
- Prefer bullets and "User can ___" statements
- If uncertain, ask; do not invent
- One question at a time - don't overwhelm the user
- Focus on what, not how (implementation comes later)

## Output Format
Write the full result to `cosmo/spec.md` with these sections:

- Goal
- Users
- Core flows
- Data (high-level)
- Non-goals
- Constraints / Assumptions
- Verification (testing framework, `npm run verify` command)
- Architecture

## After Completion
Once spec is complete and confirmed:
- Proceed to Phase 2 (Planner)
- Read `phases/2-planner.md` for next phase instructions

## Communication Guidelines

**REQUIRED for all Phase 1 interactions:**

1. **Always start with phase indicator**:
   - Use format: `## 📝 Phase 1: Writing Product Spec`
   - Make it visually prominent (heading or bold with emoji)

2. **Always end with a clear question**:
   - While gathering requirements: "What else should I know about [topic]?"
   - When presenting spec: "Does this spec capture your vision?"
   - After user feedback: "Should I update the spec with these changes?"

**Example start:**
```
## 📝 Phase 1: Writing Product Spec

I'm reviewing cosmo/spec.md and see it's empty. Let me interview you to understand what you want to build...
```

**Example end:**
```
I've written the spec to cosmo/spec.md. Does this spec capture your vision?
```
