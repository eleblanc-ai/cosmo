# Slice 9: Recipe Display, Edit + Source Caching

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Display generated recipe in detail view with inline editing; cache extracted source contents in DB so re-opening Compare sources skips the Claude call.

**DB Migration (run manually in Supabase SQL editor):**
```sql
ALTER TABLE recipes ADD COLUMN source_contents jsonb;
```

**Files:**
- `src/features/recipes/recipe-service.ts` (modify) — `source_contents?: SourceContent[]` on `Recipe` type, all `.select()` strings updated, `saveSourceContents()` added
- `src/features/recipes/source-comparison.tsx` (modify) — initialize state from `recipe.source_contents` if present; after fetch, call `saveSourceContents` to cache; skips Edge Function call when cached
- `src/features/recipes/recipe-detail.tsx` (modify) — replace placeholder with two-column ingredient grid + numbered instructions; Edit mode with inline inputs, add/remove rows, Save/Cancel; "No recipe generated yet." when empty; Compare sources always visible
- `src/features/recipes/recipe-detail.test.tsx` (modify) — updated fixture, 5 new tests (display, empty state, edit mode, save, cancel)
- `src/features/recipes/source-comparison.test.tsx` (modify) — added caching test + `beforeEach` mock clearing

**Outcome:** Detail page shows generated recipe with Edit and Compare sources buttons. Edit mode allows inline editing with save/cancel. Comparing sources a second time loads instantly from DB cache.

**Verification:** `npm run verify` passes + DB migration run + manual browser test

---

## User Interactions

### Phase 2: Planning
```
User: yes pleez [start Slice 9]
User: I think we could save them so we don't have to claude for the same info if we do want to look at the recipes again... loading from supabase instead of calling claude
Cosmo: Added source caching to scope
```

### Phase 3: Implementation
```
Debugging: saveSourceContents silently failing → added .catch(err => console.error(...))
Debugging: compare sources still calling AI → resolved after error logging revealed the issue
```

### Phase 4: Approval
```
User: perfect. ok slice approved
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ source-comparison.test.tsx (6 tests)
 ✓ recipe-detail.test.tsx (7 tests)
 Test Files  7 passed (7)
      Tests  36 passed (36)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 36/36 Passing

| # | File | Test name | Status |
|---|------|-----------|--------|
| 1 | `recipe-detail.test.tsx` | renders recipe title and sources | ✅ Pass |
| 2 | `recipe-detail.test.tsx` | shows no recipe generated when empty | ✅ Pass |
| 3 | `recipe-detail.test.tsx` | renders ingredients and instructions when present | ✅ Pass |
| 4 | `recipe-detail.test.tsx` | enters edit mode when Edit is clicked | ✅ Pass |
| 5 | `recipe-detail.test.tsx` | saves changes and exits edit mode | ✅ Pass |
| 6 | `recipe-detail.test.tsx` | cancels edit mode without saving | ✅ Pass |
| 7 | `recipe-detail.test.tsx` | calls onDelete after confirming deletion | ✅ Pass |
| 8 | `source-comparison.test.tsx` | uses cached source_contents and skips fetch | ✅ Pass |

---

## Manual Verification Tasks

- [x] Run DB migration in Supabase SQL editor
- [x] Detail page shows two-column ingredients + numbered instructions
- [x] "No recipe generated yet." shown for ungenerated recipes
- [x] Edit mode works: inputs visible, add/remove rows, Save persists, Cancel discards
- [x] Compare sources loads instantly (from cache) on second visit

---

## Summary

Recipe detail now displays generated ingredients (two-column grid) and instructions (numbered list) with Edit and Compare sources buttons. Edit mode provides inline text inputs for each item with add/remove controls. Source contents are cached in a new `source_contents jsonb` column on the recipes table — saved after first extraction, loaded directly on subsequent comparisons to skip the Claude call entirely.
