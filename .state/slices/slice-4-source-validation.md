# Slice 4: Source Validation

**Timestamp:** 2026-02-17
**Status:** Approved

---

## Plan

**Goal:** Client-side validation on the new recipe form — field requirements, URL format, length limits, and duplicate URL detection within a recipe.

**Files:**
- `src/features/recipes/recipe-validation.ts` (create) — pure validation functions: `validateTitle`, `validateSourceContent`, `findDuplicateUrlIndices`
- `src/features/recipes/recipe-validation.test.ts` (create) — 13 tests
- `src/features/recipes/new-recipe-form.tsx` (modify) — wire in validation, show inline field errors, block submission on invalid state

**Outcome:** Form validates on submit. Invalid fields show inline errors. Duplicate URLs are flagged. Empty source rows are silently dropped (sources are optional per spec data model).

**Verification:** `npm run verify` passes

---

## User Interactions

### Phase 2: Planning
```
User: can we do some validation, make sure the fields are secure and protect the database from prompt injection etc. also make sure the urls are unique
User: within the form only [for duplicate URL check scope]
Cosmo: Proposed Slice 4: Source Validation
User: yeah
```

### Phase 4: Approval
```
User: based on the spec, do you think that URL has to be required
Cosmo: No — spec data model has url? and raw_text? as optional; empty rows are dropped
User: yep
User: approved
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ src/features/recipes/recipe-validation.test.ts (13 tests)
 ✓ src/features/recipes/recipe-list.test.tsx (2 tests)
 ✓ src/app/theme-provider.test.tsx (3 tests)
 ✓ src/features/auth/auth-form.test.tsx (3 tests)
 ✓ src/features/recipes/new-recipe-form.test.tsx (2 tests)

 Test Files  5 passed (5)
      Tests  23 passed (23)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ All Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `recipe-validation.test.ts` | returns error for empty title | ✅ Pass | Empty/whitespace title returns error |
| 2 | `recipe-validation.test.ts` | returns error when over 200 characters | ✅ Pass | Title over 200 chars returns error |
| 3 | `recipe-validation.test.ts` | returns null for valid title | ✅ Pass | Normal title passes |
| 4 | `recipe-validation.test.ts` | returns null for empty content | ✅ Pass | Empty source is valid (will be filtered) |
| 5 | `recipe-validation.test.ts` | returns error for invalid URL format | ✅ Pass | `not-a-url`, `example.com` rejected |
| 6 | `recipe-validation.test.ts` | returns error for non-http URL | ✅ Pass | `ftp://` rejected |
| 7 | `recipe-validation.test.ts` | returns null for valid https URL | ✅ Pass | `https://example.com/recipe` accepted |
| 8 | `recipe-validation.test.ts` | returns null for valid http URL | ✅ Pass | `http://example.com` accepted |
| 9 | `recipe-validation.test.ts` | returns error for text over 10000 characters | ✅ Pass | Text > 10,000 chars rejected |
| 10 | `recipe-validation.test.ts` | returns null for valid text | ✅ Pass | Normal text passes |
| 11 | `recipe-validation.test.ts` | returns empty set when no duplicates | ✅ Pass | Two different URLs → no duplicates flagged |
| 12 | `recipe-validation.test.ts` | returns indices of duplicate URLs | ✅ Pass | Same URL twice → both indices returned |
| 13 | `recipe-validation.test.ts` | ignores text sources when checking for duplicates | ✅ Pass | Duplicate text content is not flagged |

---

## Manual Verification Tasks

- [ ] Submit with empty title — title field turns red with error message
- [ ] Submit with empty URL source — source row is dropped, form submits fine
- [ ] Enter `not-a-url` in a URL field — shows URL format error
- [ ] Enter `ftp://example.com` — shows URL format error
- [ ] Add two sources with the same URL — both turn red with "Duplicate URL"
- [ ] Fix one duplicate URL — both errors clear
- [ ] Valid title + valid URL — form submits, navigates back to list

---

## Summary

Validation logic extracted into `recipe-validation.ts` as pure functions, independently testable. Form wires in errors per-field and blocks submission when validation fails. Empty source rows are silently filtered before validation and submission — consistent with the spec data model where sources are optional fields.
