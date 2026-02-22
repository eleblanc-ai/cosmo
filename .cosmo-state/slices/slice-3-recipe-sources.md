# Slice 3: Recipe Sources

**Timestamp:** 2026-02-17
**Status:** Approved

---

## Plan

**Goal:** Recipe library screen and new recipe flow — title + multi-source entry (URL or raw text), saved to Supabase.

**Files:**
- `src/features/recipes/recipe-service.ts` (create) — `listRecipes`, `createRecipe`
- `src/features/recipes/recipe-list.tsx` (create) — empty state + recipe cards + "New recipe" button
- `src/features/recipes/new-recipe-form.tsx` (create) — title input, add/remove sources, save
- `src/features/recipes/recipe-list.test.tsx` (create) — 2 tests
- `src/features/recipes/new-recipe-form.test.tsx` (create) — 2 tests
- `src/app/App.tsx` (modify) — `view` state (`'list' | 'new'`), renders appropriate screen

**Outcome:** User can create a titled recipe with multiple sources (URL or text) and see it in their library.

**Verification:** `npm run verify` passes

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Proposed Slice 3: Recipe Sources — list + new recipe form
User: yes
```

### Phase 4: Approval
```
User: an issue popped up, if i'm in the recipe creation flow and navigate away from the page, the form closes
Cosmo: React Router would fix full-page refresh; switching tabs already preserves state
User: oh ok maybe it's fine after all, next step can we do some validation...
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ src/features/recipes/recipe-list.test.tsx (2 tests)
 ✓ src/app/theme-provider.test.tsx (3 tests)
 ✓ src/features/auth/auth-form.test.tsx (3 tests)
 ✓ src/features/recipes/new-recipe-form.test.tsx (2 tests)

 Test Files  4 passed (4)
      Tests  10 passed (10)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ All Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-list.test.tsx` | renders empty state when no recipes | ✅ Pass | Shows "No recipes yet" when `listRecipes` returns empty array |
| 2 | `src/features/recipes/recipe-list.test.tsx` | renders recipe titles when recipes exist | ✅ Pass | Recipe title cards appear when `listRecipes` returns data |
| 3 | `src/features/recipes/new-recipe-form.test.tsx` | can add and remove a source | ✅ Pass | "+ Add another source" adds a row; remove button removes it |
| 4 | `src/features/recipes/new-recipe-form.test.tsx` | calls createRecipe with title and sources on submit | ✅ Pass | Submitting calls `createRecipe` with correct userId, title, and sources array |

---

## Manual Verification Tasks

- [x] Sign in → recipe library shows empty state
- [x] "New recipe" → form with title + source entry
- [x] Add URL + text sources, remove one
- [x] Save → back to library with new recipe card
- [x] Switching tabs preserves form state

---

## Summary

Recipe library and creation flow in place. `recipe-service.ts` handles all Supabase I/O for recipes. `App.tsx` uses simple view state for now — React Router to be added when navigation complexity warrants it.
