# Slice 5: Recipe Detail

**Timestamp:** 2026-02-17
**Status:** Approved

---

## Plan

**Goal:** Clicking a recipe card opens a detail screen showing the recipe title, its sources (URLs as clickable links, raw text as a 2-line preview), and a delete button. Sets up the container where AI-generated content will live in later slices.

**Files:**
- `src/features/recipes/recipe-service.ts` (modify) — add `getRecipe(id)`, `deleteRecipe(id)`
- `src/features/recipes/recipe-detail.tsx` (create) — title, sources list, delete button with confirm modal, AI content placeholder
- `src/features/recipes/recipe-detail.test.tsx` (create) — 2 tests
- `src/shared/components/confirm-modal.tsx` (create) — reusable confirmation modal (replaces browser `confirm()`)
- `src/features/recipes/recipe-list.tsx` (modify) — cards call `onSelect(id)` on click
- `src/app/App.tsx` (modify) — add `'detail'` view + `selectedRecipeId` state; wire `onSelect`, `onBack`, `onDelete`

**Outcome:** User can open a recipe from the library, view its title and sources, delete it via a styled confirmation modal, and navigate back to the list.

**Verification:** `npm run verify` passes

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Proposed Slice 5: Recipe Detail
User: ok
```

### Phase 4: Approval
```
User: create a sharable confirmation modal instead of using the browser alert
Cosmo: Done — ConfirmModal in src/shared/components/confirm-modal.tsx
User: update and re-present the slice for approval
User: approve
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
 ✓ src/features/recipes/recipe-detail.test.tsx (2 tests)
 ✓ src/features/auth/auth-form.test.tsx (3 tests)
 ✓ src/features/recipes/new-recipe-form.test.tsx (2 tests)

 Test Files  6 passed (6)
      Tests  25 passed (25)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ All Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `recipe-detail.test.tsx` | renders recipe title and sources | ✅ Pass | Title and URL source appear after load |
| 2 | `recipe-detail.test.tsx` | calls onDelete after confirming deletion | ✅ Pass | Clicking "Delete recipe" → modal → "Delete" calls `deleteRecipe` and `onDelete` |

---

## Manual Verification Tasks

- [ ] Recipe cards are clickable, open detail screen
- [ ] Detail shows correct title and sources
- [ ] URL sources render as clickable links
- [ ] Raw text sources show a 2-line preview
- [ ] ← Back returns to the list
- [ ] "Delete recipe" opens the confirmation modal
- [ ] Cancelling the modal does nothing
- [ ] Confirming delete returns to the list with the recipe gone

---

## Summary

Recipe detail view wired into the app via simple view-state navigation. `ConfirmModal` added to `src/shared/components/` for reuse across future features. `recipe-detail.tsx` renders the AI content placeholder section that subsequent slices will populate.
