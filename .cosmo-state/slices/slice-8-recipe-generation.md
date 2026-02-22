# Slice 8: Recipe Generation

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Wire "Generate recipe" to call Claude and merge source ingredients + instructions into a single recipe, saved to the DB.

**DB Migration (run manually in Supabase SQL editor):**
```sql
ALTER TABLE recipes
  ADD COLUMN ingredients text[] NOT NULL DEFAULT '{}',
  ADD COLUMN instructions text[] NOT NULL DEFAULT '{}';
```

**Files:**
- `supabase/functions/generate-recipe/index.ts` (new) — auth via `getUser(jwt)`, receives `{ sources: SourceContent[] }`, calls Claude to merge, returns `{ ingredients, instructions }`
- `src/features/recipes/recipe-service.ts` (modify) — add `ingredients`/`instructions` to `Recipe` type, add `generateRecipe()` and `updateRecipe()`
- `src/features/recipes/source-comparison.tsx` (modify) — `onGenerate` signature `() => void` → `(contents: SourceContent[]) => Promise<void>`, button shows "Generating…" and disabled while in flight
- `src/features/recipes/source-comparison.test.tsx` (modify) — add `ingredients`/`instructions` to recipe fixture
- `src/app/App.tsx` (modify) — `handleGenerate`: call `generateRecipe(contents)` → `updateRecipe(id, result)` → navigate to `'detail'`

**Outcome:** Clicking "Generate recipe" shows "Generating…", calls Claude (haiku), saves merged recipe to DB, navigates to detail view.

**Verification:** `npm run verify` passes + DB migration run + deploy `generate-recipe` + manual browser test

---

## User Interactions

### Phase 2: Planning
```
User: next i want to get into the layout of the recipe display placement of things, and ability to edit
Cosmo: Planned as two slices — Slice 8 (generation) and Slice 9 (display + edit)
User: yes! [approved]
```

### Phase 3: Implementation
```
Debugging: model claude-3-5-sonnet-20241022 returned 404
Debugging: model claude-3-5-sonnet-20240620 returned 404 → fixed to claude-3-haiku-20240307
Added: "Generating…" button state + disabled while loading or generating
Added: disabled Generate button while sources are still loading
```

### Phase 4: Approval
```
User: ok let's look at the slice
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ source-comparison.test.tsx (5 tests)
 Test Files  7 passed (7)
      Tests  30 passed (30)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 30/30 Passing

---

## Manual Verification Tasks

- [x] Run DB migration in Supabase SQL editor
- [x] Generate button disabled while sources loading
- [x] Generate button shows "Generating…" while in flight
- [x] After generation, navigates to recipe detail view
- [x] Recipe ingredients/instructions saved in DB

---

## Summary

Added `generate-recipe` Edge Function (claude-3-haiku-20240307, `--no-verify-jwt`) that receives already-extracted SourceContent from Slice 7, merges into a unified recipe via Claude, and returns `{ ingredients, instructions }`. Added `generateRecipe()` and `updateRecipe()` to recipe-service. Wired `handleGenerate` in App.tsx to call both then navigate to detail. Button shows "Generating…" while in flight and is disabled until sources finish loading. Recipe detail display deferred to Slice 9.
