# Phase 3: Implementer

## Purpose
Implement exactly one slice from the approved plan.
Deliver a fully verified, minimal, production-ready change.

## When to Use
- After slice plan approved by user
- When implementing changes requested during review

## Scope
- **May modify**: `src/**`, tests, config, dependencies (only as specified in approved plan)
- **Must NOT modify**: `spec.md` or `slices/`, or files outside approved plan scope

**Only implement what was approved. No scope creep.**

## Required Reading
Before coding, you MUST read:
- The approved plan from Phase 2
- **`architecture.md`** - Architecture rules
- `spec.md` - Product requirements + Architecture section (project-specific rules)
- Relevant existing code to understand patterns

**If the plan is unclear or incomplete → STOP and ask.**

## Process
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

**Read `architecture.md` for complete guidelines.**

Key points:
- **File placement**: Features vs shared vs app buckets (no new top-level buckets)
- **Import boundaries**: ❌ No feature-to-feature imports
- **Avoid premature abstraction**: Only create shared code when used by 2+ features

## Testing Requirements
You MUST:
- **Add or update tests** for any new or changed behavior
- **Ensure regression safety** for existing behavior
- **Never remove tests** unless explicitly part of the approved plan
- Tests should match the existing test patterns in the codebase

## Rules
- **Follow the plan exactly**: Only implement what was approved
- **Follow architecture**: Respect boundaries from `architecture.md`
- **Match existing patterns**: Read similar code first, follow conventions
- **Keep it simple**: No premature optimization or abstraction
- **Stay focused**: No extras, improvements, or refactors beyond the plan
- **No improvisation**: If unclear or blocked, stop and ask

## Code Quality
- **Functions**: ≤ 50 lines, cyclomatic complexity ≤ 8, ≤ 5 positional params
- **Lines**: 100-char max, no relative `..` imports
- **Naming**: Clear, descriptive names that reduce need for comments
- **Imports**: Only what you need, no unused exports or dead code
- **Style**: Consistent with codebase
- **Error handling**: Fail fast with clear messages, never swallow exceptions silently
- **Type checking**: All code must pass (Python: `mypy --strict`, TypeScript: `tsc --noEmit`)
- **Doc comments**: Google-style on non-trivial public APIs
- **Comments**: Only where logic isn't self-evident (no obvious, repeated, or commented-out code)
- **Configuration**: In proper location per `architecture.md`, no hardcoded paths

## Additional Standards

**Bash**: Use strict mode (`#!/bin/bash` + `set -euo pipefail`). Lint with `shellcheck` and `shfmt`.

**Git**: Imperative mood, ≤72 char subject. One logical change per commit. Never amend/rebase pushed commits.

**Secrets**: Never commit secrets. Use gitignored `.env` files and environment variables.

**Testing**: Mock boundaries (I/O, time, external services), not logic or pure functions. Verify tests fail when code breaks. Test file placement: Python uses `tests/`, Node/TS uses colocated `*.test.ts`. Integration tests when in doubt.

**CI**: No scheduled runs without code changes.

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

## Common Pitfalls (Avoid These)
- Refactoring code not in the approved plan
- Adding features beyond the plan or speculative "might be useful" functionality
- Creating abstractions for one-time use (wait until code is written 3+ times)
- Adding config for hypothetical future needs
- Adding unnecessary dependencies (each is attack surface + maintenance burden)
- Documenting or validating features that aren't implemented yet (no phantom features)
- Skipping tests when codebase has them
- Changing architecture patterns without discussion
- Using `type: ignore` or skipping type checks without justification

## Security Considerations
Be careful to avoid:
- Command injection vulnerabilities
- XSS vulnerabilities
- SQL injection
- Insecure authentication/authorization
- Exposed secrets or credentials
- OWASP Top 10 vulnerabilities

**If you notice security issues: fix them immediately OR note them for the next slice.**
