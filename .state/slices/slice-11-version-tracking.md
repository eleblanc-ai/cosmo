# Slice 11: Version Tracking

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Every recipe save (manual Edit or chat AI update) creates a version snapshot. A Version History view lists all versions with cook notes and lets the user compare any two versions side-by-side with diff highlighting.

**DB Migration (run manually in Supabase SQL editor):**
```sql
CREATE TABLE recipe_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  instructions text[] NOT NULL DEFAULT '{}',
  cook_notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE recipe_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage own versions" ON recipe_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_versions.recipe_id
        AND recipes.user_id = auth.uid()
    )
  );
```

**Files:**
- `src/features/recipes/recipe-service.ts` (modify) — `RecipeVersion` interface, `getRecipeVersions`, `saveRecipeVersion` (MAX version_number + insert), `updateVersionNotes`
- `src/features/recipes/recipe-version-history.tsx` (new) — Version list + inline cook notes editing + side-by-side diff with set-based `getDiff`
- `src/features/recipes/recipe-version-history.test.tsx` (new) — 5 tests
- `src/features/recipes/recipe-detail.tsx` (modify) — `saveRecipeVersion` fire-and-forget in `handleSave` + `onHistory` prop + "History" button
- `src/features/recipes/recipe-detail.test.tsx` (modify) — `onHistory={vi.fn()}` on all renders + new test
- `src/features/recipes/recipe-chat.tsx` (modify) — `saveRecipeVersion` fire-and-forget after `updateRecipe` on AI update
- `src/features/recipes/recipe-chat.test.tsx` (modify) — `saveRecipeVersion` mock + new test
- `src/app/App.tsx` (modify) — `'history'` view, `historyRecipeId` state, `openHistory`, `RecipeVersionHistory` rendering

**Outcome:** Edit and Chat AI updates both snapshot a version. History button opens version list with notes editing and compare diff.

**Verification:** `npm run verify` passes + DB migration run + manual browser test

---

## User Interactions

### Phase 2: Planning
```
User: go for it
Cosmo: Presented options for next feature
User: both (manual save AND chat AI update create versions)
User: Full: list + notes + diff
```

### Phase 3: Implementation
```
Debugging: getDiff test — checked wrong CSS class (text-green-600 vs text-red-500) based on compareA/compareB default ordering
Debugging: getByText('v2') multi-match — version card span + select options both match; fixed with getAllByText
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ recipe-list.test.tsx (2 tests)
 ✓ theme-provider.test.tsx (3 tests)
 ✓ source-comparison.test.tsx (6 tests)
 ✓ new-recipe-form.test.tsx (2 tests)
 ✓ auth-form.test.tsx (3 tests)
 ✓ recipe-version-history.test.tsx (5 tests)
 ✓ recipe-chat.test.tsx (8 tests)
 ✓ recipe-detail.test.tsx (9 tests)
 ✓ recipe-validation.test.ts (13 tests)
 Test Files  9 passed (9)
      Tests  51 passed (51)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 51/51 Passing

| # | File | Test name | Status |
|---|------|-----------|--------|
| 1 | `recipe-version-history.test.tsx` | renders version list on mount | ✅ Pass |
| 2 | `recipe-version-history.test.tsx` | shows "No versions yet" when empty | ✅ Pass |
| 3 | `recipe-version-history.test.tsx` | shows ingredient diff with correct highlighting | ✅ Pass |
| 4 | `recipe-version-history.test.tsx` | clicking "Edit notes" shows inline textarea | ✅ Pass |
| 5 | `recipe-version-history.test.tsx` | saving notes calls updateVersionNotes and exits edit mode | ✅ Pass |
| 6 | `recipe-detail.test.tsx` | shows History button when recipe has content | ✅ Pass |
| 7 | `recipe-chat.test.tsx` | calls saveRecipeVersion when AI returns updated recipe | ✅ Pass |
| 8 | `recipe-chat.test.tsx` | does not call updateRecipe when AI returns the same recipe | ✅ Pass |
| 9 | `recipe-chat.test.tsx` | shows version history unavailable when saveRecipeVersion fails | ✅ Pass |

---

## Manual Verification Tasks

- [ ] Run DB migration in Supabase SQL editor
- [ ] Save a recipe via Edit → open History → v1 appears
- [ ] Save again with changes → v2 appears
- [ ] Select two versions in diff dropdowns → ingredients/instructions shown with highlights (red strikethrough = only in A, green = only in B)
- [ ] Add cook notes on a version → persists on reload
- [ ] Chat AI update → also creates a version

---

## Summary

Added Version Tracking: every recipe save (manual Edit or chat AI update) snapshots ingredients and instructions to a `recipe_versions` table. A Version History view (via the new "History" button on recipe detail) lists all versions with editable cook notes. When ≥ 2 versions exist, a Compare section shows two `<select>` dropdowns and a 2×2 side-by-side grid of ingredients and instructions with diff highlighting (red strikethrough = only in A, green = only in B).

**Post-implementation bug fixes (same slice):**
- `chat-recipe` Edge Function: system prompt now always requires full recipe in response; fallback to original recipe when model omits the field — frontend change-detection prevents false writes
- `recipe-chat.tsx`: `currentRecipe` state tracks live recipe across multiple chat turns (fixes stale context on subsequent messages); `versionError` state surfaces version-save failures in the UI instead of swallowing them silently
- `sendChatMessage` return type updated to non-optional `recipe` field matching new Edge Function contract
