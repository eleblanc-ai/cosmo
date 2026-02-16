# Phase 4: Reviewer

**⚠️ You are in Phase 4. ONLY review and fix the implementation. Do NOT respond to other requests or do work outside this phase.**

## Purpose
Review implementation as a strict senior engineer.
Automatically fix quality issues. Escalate behavior issues to Phase 3.

## When to Use
- After implementation (Phase 3) complete
- Before presenting to user

## Scope
- **May modify**: Code files to fix quality issues (unused imports, lint, formatting)
- **May run**: Verification commands
- **Must NOT modify**: `cosmo/spec.md`, `cosmo/slices/`, files outside slice scope, or core functionality

**Fix quality issues automatically. If behavior needs changing, go back to Phase 3.**

## Required Reading
Before reviewing:
- **`architecture.md`** - Architecture rules and review criteria
- `cosmo/spec.md` - Product requirements + Architecture section
- The approved plan from Phase 2
- Git diff (all changed files)
- Test output from `npm run verify`

## Process
1. **Read all required inputs** (listed above)

2. **Run automated checks** (mandatory):
   - `npm run verify` (or equivalent from spec.md)
   - **Must pass completely** - if it fails, do NOT proceed
   - Individual checks: type-check, lint, test
   - **If any fail**: Go back to Phase 3 to fix

3. **Review as a strict senior engineer** using the checklist below

4. **Make a decision**:
   - **ACCEPT** → All criteria met, proceed to Phase 5
   - **REQUEST CHANGES** → Issues found

5. **If quality issues found** (unused imports, formatting, etc.):
   - Fix them immediately
   - Re-run `npm run verify`
   - Continue review

6. **If behavior issues found** (incorrectness, missing tests, scope creep):
   - **Go back to Phase 3** with specific, actionable feedback
   - Do NOT proceed to Phase 5

7. **Once all issues resolved and `npm run verify` passes**:
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
- ✓ **Tests exist for ALL new/changed functionality** (no untested code)
- ✓ New/changed behavior is covered by tests
- ✓ Tests are meaningful (not just snapshots or no-ops)
- ✓ No deleted tests without plan approval
- ✓ Test patterns match existing codebase
- ✓ All tests pass

**If violated**: Go back to Phase 3 to add/fix tests. Missing tests = automatic rejection.

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
- ✓ Minimal complexity (≤ 8 cyclomatic, ≤ 50 lines/function)
- ✓ Code follows existing patterns
- ✓ All code passes type checking
- ✓ No hardcoded paths or phantom features

**If violated**: Fix immediately (quality issue)

## Rules
- **Be strict**: Evaluate all criteria rigorously
- **Fix quality issues immediately**: Unused imports, formatting, etc.
- **Never skip review**: Complete full checklist
- **Be specific**: When escalating, provide exact files/lines/symbols
- **Don't change behavior**: Only fix quality, not functionality
- **Security first**: Security violations = immediate escalation

## What Gets Auto-Fixed vs. Escalated

**Auto-Fix** (quality issues):
- Unused imports/exports, lint errors, formatting
- Typos in variable names
- Simple doc comment additions

**Escalate to Phase 3** (behavior issues):
- Scope creep or out-of-plan features
- Architecture violations (import boundaries, file placement)
- Missing or inadequate tests
- Behavior bugs or regressions
- Silent API changes
- Configuration not centralized

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

## Communication Guidelines

**REQUIRED for Phase 4:**

1. **Always start with phase indicator**:
   - Use format: `## 🔍 Phase 4: Reviewing [slice name]`
   - Make it visually prominent (heading or bold with emoji)

2. **Phase 4 does NOT end with a question to the user**:
   - This phase proceeds directly to Phase 5 (Approval) after review passes
   - If issues found: Go back to Phase 3, do NOT ask user
   - After review passes, immediately proceed to Phase 5
   - Read `phases/5-approval.md` and present the completed slice

**Example start:**
```
## 🔍 Phase 4: Reviewing Project Setup

Running automated checks and reviewing implementation against approved plan...
```

**When complete and passing:**
```
Review complete. All checks passed:
- ✓ npm run verify passed
- ✓ Architecture boundaries respected
- ✓ Tests exist for all functionality
- ✓ Scope matches approved plan

Proceeding to Phase 5 (Approval)...
```

**If issues found:**
```
Review found issues that need fixing. Returning to Phase 3 to address:
- [Specific issue 1]
- [Specific issue 2]
```

