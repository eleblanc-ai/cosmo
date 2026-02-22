# Slice 15: Sign-up Confirmation

**Timestamp:** 2026-02-22
**Status:** Approved

---

## Plan

**Goal:** Fix spurious "Cannot coerce the result to a single JSON object" error on sign-up, and show a confirmation message when sign-up succeeds but email confirmation is required.

**Files:**
- `src/features/auth/auth-provider.tsx` (modify) — `signUp` now returns `{ user, error }` instead of just `{ error }`
- `src/features/auth/auth-form.tsx` (modify) — split sign-in/sign-up paths in `handleSubmit`; on sign-up success show confirmation banner and switch to sign-in mode; only show error if `user` is null
- `src/features/auth/auth-form.test.tsx` (modify) — updated mock to match new `signUp` signature; added confirmation message test

**Outcome:** Sign-up no longer shows a spurious internal error. When email confirmations are enabled, a saffron banner appears with a dismiss button. When disabled, the user is logged in directly with no error.

**Verification:** `npm run verify` passes (65 tests)

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Presented Slice 15 plan (sign-up confirmation toast)
User: fix and show me i'll approve if it works
```

### Phase 3: Implementation
```
Discovered the error fires post-sign-up (Supabase internal query), not from auth itself.
Split sign-up/sign-in paths in handleSubmit — only show error if user was not created.
Added confirmed state + saffron banner with dismiss.
```

### Phase 4: Approval
```
User: it worked fine thanks, no need to enable for now. approved
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ src/features/auth/auth-form.test.tsx (4 tests)
 ✓ src/features/recipes/recipe-validation.test.ts (13 tests)
 ✓ src/features/recipes/source-comparison.test.tsx (6 tests)
 ✓ src/features/recipes/new-recipe-form.test.tsx (4 tests)
 ✓ src/features/recipes/recipe-detail.test.tsx (11 tests)
 ✓ src/features/recipes/recipe-version-history.test.tsx (5 tests)
 ✓ src/features/recipes/recipe-workshop.test.tsx (9 tests)
 ✓ src/features/recipes/recipe-chat.test.tsx (8 tests)
 ✓ src/app/theme-provider.test.tsx (3 tests)
 ✓ src/features/recipes/recipe-list.test.tsx (2 tests)

 Test Files  10 passed (10)
      Tests  65 passed (65)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 65/65 Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/auth/auth-form.test.tsx` | renders email and password fields | ✅ Pass | Form renders correctly in default sign-in mode |
| 2 | `src/features/auth/auth-form.test.tsx` | calls signIn with email and password on submit | ✅ Pass | Sign-in path calls signIn with correct credentials |
| 3 | `src/features/auth/auth-form.test.tsx` | toggles to sign-up mode | ✅ Pass | Mode toggle switches to sign-up UI |
| 4 | `src/features/auth/auth-form.test.tsx` | shows confirmation message and switches to sign-in after successful sign-up | ✅ Pass | On successful sign-up, confirmation banner appears and form switches to sign-in mode |

---

## Manual Verification Tasks

- [x] Sign up with a new email → no error message, logged in directly
- [x] No "Cannot coerce the result to a single JSON object" error

---

## Summary

Fixed a post-sign-up error from Supabase's internal query that was surfacing as a false failure in the auth form. Split the sign-in and sign-up submit paths so sign-up only treats it as a failure if no user was created. Added a persistent saffron confirmation banner (`confirmed` state) for when email confirmations are enabled — shown after sign-up succeeds but before the user is logged in. When confirmations are disabled (current setup), sign-up logs the user in directly with no error or banner.
