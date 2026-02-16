# Phase 3: Implementer

## Purpose
Implement **exactly one slice** defined in the approved plan from Phase 2.
Deliver a fully verified, minimal, production-ready change.

## When to Use This Phase
- After slice plan has been approved by user
- When implementing changes requested during review

## Allowed Changes
- May create or modify:
  - `src/**` (project source code)
  - tests
  - configuration files (if part of the approved plan)
  - dependencies (if part of the approved plan)
  - Any files specified in the approved plan

- Must NOT modify:
  - `spec.md` (only Phase 1 can modify)
  - `slices/` (only Phase 5 can add to this)
  - Files outside the approved plan scope

**Only implement what was approved in the plan. No scope creep.**

## Required Inputs
Before coding, you MUST read:
- The approved plan from Phase 2
- `spec.md` - product requirements
- **`architecture.md`** - architecture rules and patterns
- Architecture section in `spec.md` - project-specific rules
- Relevant existing code to understand patterns

**If the plan is missing, unclear, or incomplete → STOP and ask the user.**
Do not improvise requirements or make assumptions.

## Process (required)
1. **Read all required inputs** (listed above)
2. Read relevant existing code to understand patterns
3. Implement the slice:
   - Create/modify files as planned
   - Follow architecture rules from `architecture.md` and `spec.md`
   - Write code that matches existing patterns
   - Add or update tests for any new or changed behavior

4. **Verify your work** (mandatory):
   - Run `npm run verify` (or equivalent from spec.md)
   - If verification fails: fix, rerun, repeat until passing
   - **Completion is impossible while verification fails**

5. After verification passes, proceed to Phase 4 (Review)

## Architecture Compliance

**Read `architecture.md` for complete architecture guidelines.**

Key points to follow during implementation:

### File Placement
- Feature-specific code → inside that feature
- Code used by 2+ features → `src/shared`
- App-level concerns → `src/app`
- No new top-level buckets without user approval

### Import Boundaries (Critical)
- ❌ Features must NOT import other features
- ✅ Features may import from `shared/` and `app/`
- ❌ Shared must NOT import from features
- Violations = review failures

**See `architecture.md` for complete details.**

## Scope of Work
- **Implement only what is listed in the approved plan**
- Do not extend scope or add "nice-to-have" features
- Do not refactor unrelated code
- Keep diffs minimal and localized to the slice
- If you notice something else that needs fixing, note it for a future slice

## Testing Requirements
You MUST:
- **Add or update tests** for any new or changed behavior
- **Ensure regression safety** for existing behavior
- **Never remove tests** unless explicitly part of the approved plan
- Tests should match the existing test patterns in the codebase

## Rules
- **Follow the plan exactly**: Only implement what was approved
- **Follow the architecture**: Respect bucket rules and import boundaries
- **Match existing patterns**: Read similar code first, follow established conventions
- **Keep it simple**: No premature optimization or abstraction
- **Stay focused**: Don't add extras, improvements, or refactors beyond the plan
- **No improvisation**: If unclear or blocked, stop and ask the user

## Code Quality Standards
- **Clean imports**: Only import what you need
- **No dead code**: Don't leave commented-out code or unused functions
- **No unused exports**: Remove exports that aren't actually used
- **Meaningful names**: Use clear, descriptive variable/function names
- **Consistent style**: Match the existing codebase style
- **Error handling**: Handle errors appropriately (but don't over-engineer)
- **Comments**: Only where logic isn't self-evident
- **Doc comments**: Exported APIs must include concise documentation comments
- **Configuration**: Defaults must live in the proper config location (see `architecture.md`)

## Completion Criteria
The slice is complete ONLY when ALL of these are true:
- ✓ Implementation matches the approved plan
- ✓ `npm run verify` passes (or equivalent)
- ✓ All tests pass (existing + new)
- ✓ Diff is minimal and scoped to the slice
- ✓ Architecture boundaries respected
- ✓ No unused imports, exports, or dead code
- ✓ Documentation updated where required
- ✓ Codebase remains architecturally consistent

**If any criterion fails, the slice is not complete.**

## Stop Condition
When all completion criteria are satisfied:
- **STOP** - Do not add extra improvements
- **STOP** - Do not refactor unrelated code
- **STOP** - Do not optimize prematurely
- Proceed to Phase 4 (Review)

## Common Pitfalls to Avoid
- ❌ Don't refactor existing code unless that's the slice goal
- ❌ Don't add features beyond the approved plan
- ❌ Don't create abstractions for one-time use
- ❌ Don't add configuration for hypothetical future needs
- ❌ Don't skip tests if the existing codebase has them
- ❌ Don't change architecture patterns without discussing first
- ❌ Don't remove tests unless the plan explicitly requires it

## Security Considerations
Be careful to avoid:
- Command injection vulnerabilities
- XSS vulnerabilities
- SQL injection
- Insecure authentication/authorization
- Exposed secrets or credentials
- OWASP Top 10 vulnerabilities

**If you notice security issues: fix them immediately OR note them for the next slice.**

