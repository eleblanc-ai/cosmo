# Slice 6: Source Comparison

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Show side-by-side source content comparison for a recipe, fetching URL sources via an Edge Function.

**Files:**
- `supabase/functions/fetch-sources/index.ts` (create) — Edge Function: validates user JWT, fetches URL sources, strips HTML, returns text content
- `src/features/recipes/recipe-service.ts` (modify) — adds `fetchSourceContents(sources)` via `supabase.functions.invoke()`
- `src/features/recipes/source-comparison.tsx` (create) — side-by-side source columns component
- `src/features/recipes/source-comparison.test.tsx` (create) — 2 tests for comparison component
- `src/features/recipes/recipe-detail.tsx` (modify) — adds "Compare sources" button + `onCompare` prop
- `src/app/App.tsx` (modify) — wires up `'comparison'` view

**Outcome:** User can open a recipe and click "Compare sources" to view side-by-side content from all sources.

**Verification:** `npm run verify` passes + manual browser test confirms comparison loads.

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Planned side-by-side source comparison backed by Supabase Edge Function.
```

### Phase 3: Implementation
```
Cosmo: Implemented all files. Hit 401 on manual verification.
Debugging: getUser() called without JWT in Deno context (no localStorage session) → fixed to getUser(jwt).
Further debugging: Supabase gateway JWT verification blocking requests before function ran (no dashboard logs).
Fix: redeployed with --no-verify-jwt so function handles auth in code.
```

### Phase 4: Approval
```
User: it worked!!
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ src/features/recipes/recipe-validation.test.ts (13 tests)
 ✓ src/features/recipes/recipe-list.test.tsx (2 tests)
 ✓ src/features/recipes/source-comparison.test.tsx (2 tests)
 ✓ src/app/theme-provider.test.tsx (3 tests)
 ✓ src/features/recipes/recipe-detail.test.tsx (2 tests)
 ✓ src/features/auth/auth-form.test.tsx (3 tests)
 ✓ src/features/recipes/new-recipe-form.test.tsx (2 tests)

 Test Files  7 passed (7)
      Tests  27 passed (27)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 27/27 Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/source-comparison.test.tsx` | renders source columns | ✅ Pass | Shows a column per source with correct label/content |
| 2 | `src/features/recipes/source-comparison.test.tsx` | shows loading state | ✅ Pass | Displays loading indicator while fetching |

---

## Manual Verification Tasks

- [x] Open a recipe with at least one URL source
- [x] Click "Compare sources"
- [x] Sources load and appear side-by-side (no 401 error)

**Expected Results:**
- Side-by-side columns of source content, one per source, with hostname as label.

---

## Summary

Built side-by-side source comparison backed by a Supabase Edge Function that fetches URL content server-side (bypassing browser CORS restrictions). Two bugs were fixed during verification: (1) `getUser()` without explicit JWT fails in Deno's sessionless context — fixed to `getUser(jwt)`; (2) Supabase gateway JWT verification was blocking requests before the function ran — fixed by deploying with `--no-verify-jwt`, letting the function handle auth in code. Future redeploys must include the `--no-verify-jwt` flag.
