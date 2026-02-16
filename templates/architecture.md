# Architecture Guidelines

This file defines the architecture rules that IRIS follows when planning, implementing, and reviewing code.

## Buckets (Folder Structure)

Your project should be organized into three top-level buckets:

- **`src/features`** = User capabilities ("user can ___")
- **`src/shared`** = Reusable building blocks used by 2+ features
- **`src/app`** = App shell (providers, routing, layout)

## Placement Rules

Where should code live?

- **If used by 1 feature**: Keep it inside that feature folder
- **If used by 2+ features**: Promote to `src/shared`
- **App-level concerns** (routing, providers, global layout): Place in `src/app`
- **Do not create new top-level buckets** without user approval

## Import Boundaries (Critical)

These rules prevent tight coupling and maintain clean architecture:

- ❌ **Features must NOT import other features directly**
- ✅ Features MAY import from `src/shared` and `src/app`
- ❌ **Shared must NOT import from features**

### Why This Matters
- Prevents circular dependencies
- Makes features independently testable
- Allows features to be extracted or replaced easily
- Shared code stays truly reusable

### Example Violations
```typescript
// ❌ BAD - feature importing another feature
import { UserProfile } from 'features/users/UserProfile'

// ✅ GOOD - feature importing from shared
import { Button } from 'shared/components/Button'
```

### How to Check for Violations
Run this command to detect feature-to-feature imports:
```bash
grep -r "from ['\"].*features/" src/features/
```

## Configuration

- **Centralize config**: Defaults live in one place (e.g., `src/shared/config`)
- **New options require**: Default value + documentation + test
- **Don't scatter config** across the codebase

## Code Organization Principles

- **Colocation**: Keep related code together
- **Avoid premature abstraction**: Don't create shared code until it's actually used by 2+ features
- **Minimal abstractions**: Only abstract when there's real duplication, not hypothetical future reuse

## Definition of Done

Before marking any work complete, verify:

- ✓ **Minimal diff** - No unrelated refactors or changes
- ✓ **No unused code** - No unused exports, imports, or dead helpers
- ✓ **Docs updated** - If behavior or config changed
- ✓ **Architecture boundaries respected** - No import violations
- ✓ **Code follows existing patterns** - Consistent with codebase style
- ✓ **Verification passes** - `npm run verify` (or equivalent) passes

## When Planning (Phase 2)

Consider:
- Does the file placement follow bucket rules?
- Are any imports crossing forbidden boundaries?
- If creating shared code, is it actually used by 2+ features?
- Does this maintain or improve the architecture?

If uncertain, note in "Risks/Open decisions" and discuss with user.

## When Implementing (Phase 3)

Follow:
1. Read the Architecture section in `spec.md` (project-specific rules)
2. Place files according to bucket rules
3. Respect import boundaries
4. Centralize any new configuration
5. Before proceeding to review, verify Definition of Done

## When Reviewing (Phase 4)

Check:
1. **Run the import boundary check**: `grep -r "from ['\"].*features/" src/features/`
2. **Verify file placement**: Is code in the right bucket?
3. **Check for new top-level buckets**: Should only have `features/`, `shared/`, `app/`
4. **Config centralization**: Is config in one place?
5. **Definition of Done**: All items checked?

Architecture violations = review failure. Fix before presenting to user.

---

**This is the single source of truth for architecture rules. Update this file when architecture changes.**
