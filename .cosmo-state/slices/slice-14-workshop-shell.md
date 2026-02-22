# Slice 14: Workshop Shell + Analysis

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Replace the old source comparison → generate → chat creation flow with a unified Workshop view. Search-only creation: user describes a dish, selects sources, lands in a split-screen Workshop where analysis + initial recipe draft are auto-generated and auto-saved.

**Files:**
- `cosmo/spec.md` (modify) — updated Recipe Collection, Source Comparison → Workshop, AI Generation, AI Chat sections
- `supabase/functions/analyze-sources/index.ts` (new) — auth check, fetch source URLs, extract content via Claude, then generate `general_context` + `source_insights` + `recipe` in one combined Claude call; same JSON robustness as other functions
- `src/features/recipes/recipe-service.ts` (modify) — `WorkshopAnalysis` interface + `analyzeAndGenerate()` function
- `src/features/recipes/new-recipe-form.tsx` (modify) — stripped to search-only; removed "Add sources" mode, title input, sources form; replaced `onSuccess` with `onWorkshop` callback; "Use N selected" moved to top of results list
- `src/features/recipes/new-recipe-form.test.tsx` (modify) — removed sources tests, updated mocks for new interface (4 tests)
- `src/features/recipes/recipe-workshop.tsx` (new) — split-screen shell: left panel (Recipe Context cards + per-source insights + recipe draft), right panel ("Guided chat coming soon" placeholder); autosaves to DB on mount via createRecipe + analyzeAndGenerate + updateRecipe
- `src/features/recipes/recipe-workshop.test.tsx` (new) — 4 tests
- `src/app/App.tsx` (modify) — added `'workshop'` view, `workshopData` state, wired `NewRecipeForm.onWorkshop`

**Outcome:** User searches → selects sources → Workshop opens with loading skeleton → analysis + recipe draft render → recipe saved in DB → "Done" routes to recipe detail.

**Verification:**
- `npm run verify` passes (58 tests)
- `npx supabase functions deploy analyze-sources --no-verify-jwt`
- Manual: New recipe → search → select → workshop → analysis renders → recipe in DB → Done → detail

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Presented Slice 14 plan
User: approve
```

### Phase 3: Implementation
```
Bug fix: "Use N selected" button moved from bottom to top of results list (UX: user kept accidentally hitting Search instead of selecting)
```

### Phase 4: Approval
```
User: ok it's a great start approve, and move on to the next slice
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ new-recipe-form.test.tsx (4 tests)
 ✓ recipe-workshop.test.tsx (4 tests)
 ✓ recipe-detail.test.tsx (10 tests)
 ✓ recipe-chat.test.tsx (8 tests)
 ✓ recipe-version-history.test.tsx (5 tests)
 ✓ recipe-validation.test.ts (13 tests)
 ✓ recipe-list.test.tsx (2 tests)
 ✓ source-comparison.test.tsx (6 tests)
 ✓ auth-form.test.tsx (3 tests)
 ✓ theme-provider.test.tsx (3 tests)
 Test Files  10 passed (10)
      Tests  58 passed (58)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 58/58 Passing

| # | File | Test name | Status |
|---|------|-----------|--------|
| 1 | `new-recipe-form.test.tsx` | shows search input and Search button on initial render | ✅ Pass |
| 2 | `new-recipe-form.test.tsx` | calls searchRecipes with description and shows results | ✅ Pass |
| 3 | `new-recipe-form.test.tsx` | selecting results and clicking Use selected calls onWorkshop with description and sources | ✅ Pass |
| 4 | `new-recipe-form.test.tsx` | shows error when search fails | ✅ Pass |
| 1 | `recipe-workshop.test.tsx` | shows loading skeleton on mount | ✅ Pass |
| 2 | `recipe-workshop.test.tsx` | renders analysis section after load | ✅ Pass |
| 3 | `recipe-workshop.test.tsx` | renders recipe draft after load | ✅ Pass |
| 4 | `recipe-workshop.test.tsx` | autosaves recipe to DB on mount | ✅ Pass |

---

## Manual Verification Tasks

- [ ] New recipe → describe dish → Search → select 2-3 results → workshop opens with loading skeleton
- [ ] Analysis renders: flavor profile, highlights, pitfalls, notes, per-source insights
- [ ] Recipe draft renders: ingredients + instructions
- [ ] Recipe saved in DB (visible in Supabase table editor)
- [ ] "Done — view recipe" → recipe detail view

---

## Summary

Added the Workshop creation flow — the first of three slices in the Workshop redesign. New recipe creation is now search-only: user describes a dish, selects candidate recipes, and lands directly in the Workshop. The Workshop auto-fetches and analyzes all selected sources via a new `analyze-sources` Edge Function (fetches URLs, extracts content, calls Claude once for a combined analysis + initial recipe draft), autosaves to the DB, and displays a split-screen shell (left: analysis + recipe draft, right: chat placeholder). The "Use N selected" button was moved to the top of the results list to fix an accidental re-search UX issue.
