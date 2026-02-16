# Phase 4: Reviewer

## Purpose
Review the implementation as a strict senior engineer.
Automatically fix quality issues. Escalate behavior issues back to Phase 3.

## When to Use This Phase
- After implementation (Phase 3) is complete
- Before presenting to user for approval

## Allowed Changes
- May modify:
  - Code files to fix **quality issues** (unused imports, lint errors, formatting, etc.)
  - Tests to fix test issues (not behavior)

- May run:
  - Any verification commands (`npm test`, `npm run lint`, `npm run build`, etc.)

- Must NOT modify:
  - `spec.md` (only Phase 1 can modify)
  - `slices/` (only Phase 5 can add to this)
  - Files outside the current slice scope
  - **Core functionality or behavior** (only fix quality issues)

**Fix quality issues automatically. If behavior needs changing, go back to Phase 3.**

## Required Inputs
Before reviewing, you MUST read:
- `spec.md` - product requirements
- **`architecture.md`** - architecture rules and review criteria
- Architecture section in `spec.md` - project-specific rules
- The approved plan from Phase 2
- The git diff (all changed files)
- Test output from `npm run verify` (if available)

## Process (required)
1. **Read all required inputs** (listed above)

2. **Run automated checks** (if they exist):
   - `npm run verify` (or equivalent from spec.md)
   - `npm test`
   - `npm run lint`
   - `npm run build`

3. **Review as a strict senior engineer** using the checklist below

4. **Make a decision**:
   - **ACCEPT** → All criteria met, proceed to Phase 5
   - **REQUEST CHANGES** → Issues found

5. **If quality issues found** (unused imports, formatting, etc.):
   - Fix them immediately
   - Re-run checks
   - Continue review

6. **If behavior issues found** (incorrectness, missing tests, scope creep):
   - **Go back to Phase 3** with specific, actionable feedback
   - Do NOT proceed to Phase 5

7. **Once all issues resolved**:
   - Proceed to Phase 5 (User Approval)

## Review Checklist (Must Evaluate All)

Review the implementation against these criteria:

### 1. Scope
- ✓ Only implements what the approved plan requires
- ✓ No unrelated refactors or improvements
- ✓ No scope creep or "nice-to-have" additions
- ✓ Diff is minimal and localized

**If violated**: Go back to Phase 3 to remove out-of-scope changes

### 2. Architecture
- ✓ Follows `architecture.md` boundaries
- ✓ No feature-to-feature imports (run: `grep -r "from ['\"].*features/" src/features/`)
- ✓ Shared code is truly reusable (used by 2+ features)
- ✓ Files placed in correct buckets
- ✓ No new top-level buckets without approval
- ✓ Config is centralized

**If violated**: Go back to Phase 3 to fix architecture violations

### 3. Correctness
- ✓ No behavior regressions
- ✓ Edge cases considered
- ✓ No silent changes to public APIs
- ✓ Implementation matches the plan

**If violated**: Go back to Phase 3 to fix behavior

### 4. Tests
- ✓ New/changed behavior is covered by tests
- ✓ Tests are meaningful (not just snapshots or no-ops)
- ✓ No deleted tests without plan approval
- ✓ Test patterns match existing codebase
- ✓ All tests pass

**If violated**: Go back to Phase 3 to add/fix tests

### 5. Configuration
- ✓ Defaults are centralized
- ✓ New options are documented
- ✓ New options are tested
- ✓ No hidden config scattered across codebase

**If violated**: Go back to Phase 3 to centralize config

### 6. Documentation
- ✓ Exported components/hooks/utilities have concise doc comments
- ✓ Plan updated if scope changed
- ✓ Spec updated if requirements changed (requires user approval)

**If violated**: Fix doc comments immediately OR go back to Phase 3 for larger docs

### 7. Cleanliness
- ✓ No unused exports or imports
- ✓ No dead code or commented-out code
- ✓ Naming is clear and descriptive
- ✓ Minimal complexity (no premature abstraction)
- ✓ Code follows existing patterns

**If violated**: Fix immediately (quality issue)

## Rules
- **Be a strict senior engineer**: Evaluate all criteria rigorously
- **Fix quality issues immediately**: Unused imports, formatting, etc.
- **Never skip review**: Always complete the full checklist
- **Be specific**: When going back to Phase 3, provide exact files/lines/symbols
- **Don't change behavior**: Only fix quality issues, not functionality
- **Security first**: Security violations = immediate escalation

## What Gets Auto-Fixed vs. Escalated

### Auto-Fix (quality issues):
- Unused imports or exports
- Lint errors, formatting issues
- Obvious typos in variable names
- Missing trailing commas, semicolons (if project uses them)
- Simple doc comment additions

### Escalate to Phase 3 (behavior issues):
- Scope creep or out-of-plan features
- Architecture violations (import boundaries, file placement)
- Missing or inadequate tests
- Behavior bugs or regressions
- Silent API changes
- Configuration not centralized
- Substantial missing documentation

## When Escalating to Phase 3

Provide **specific, actionable feedback**:
- Exact file paths and line numbers
- Symbol names (functions, variables, classes)
- What needs to change and why
- Reference the checklist item that failed

Example:
```
Go back to Phase 3:
- src/features/users/UserProfile.tsx:15 - importing from features/auth (violates architecture rule 2)
- src/shared/Button.tsx - only used in one feature, should be in that feature (violates architecture)
- Missing tests for UserProfile.handleClick behavior
```

## Security Checklist
- ✓ No command injection vulnerabilities
- ✓ No XSS vulnerabilities
- ✓ No SQL injection risks
- ✓ Authentication/authorization secure
- ✓ No exposed secrets or credentials
- ✓ OWASP Top 10 considered

**Security violations = immediate escalation to Phase 3.**

