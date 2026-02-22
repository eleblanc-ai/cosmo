# Slice 13: Find Recipes

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Add a "Find recipes" mode to the new recipe form. User describes a dish, app calls the Brave Search API via a new Edge Function, shows top results as checkboxes, user selects which ones to use as sources — feeding into the existing create → compare → generate flow.

**Setup required:**
```
npx supabase secrets set BRAVE_SEARCH_API_KEY=your_key_here
```
Free key at brave.com/search/api (2000 queries/month)

**Files:**
- `supabase/functions/search-recipes/index.ts` (new) — auth check, Brave Search call with 10s timeout, returns top 8 results; gracefully returns empty on error
- `src/features/recipes/recipe-service.ts` (modify) — `SearchResult` interface + `searchRecipes()` function
- `src/features/recipes/new-recipe-form.tsx` (modify) — "Add sources" / "Find recipes" toggle; search input + results list with checkboxes + "Use N selected" button
- `src/features/recipes/new-recipe-form.test.tsx` (modify) — 4 new tests

**Outcome:** User can describe a dish, see web results, check candidates, and have their URLs pre-populated as sources before saving.

**Verification:**
- `npm run verify` passes (56 tests)
- `npx supabase functions deploy search-recipes --no-verify-jwt`
- Manual: search a dish → select → sources pre-filled → generate works

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Presented Slice 13 plan (last remaining spec feature)
User: approve
```

### Phase 3: Implementation
```
(no issues)
```

### Phase 4: Approval
```
User: approve (after bug fix interruption)
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ new-recipe-form.test.tsx (6 tests)
 ✓ recipe-detail.test.tsx (10 tests)
 ✓ recipe-chat.test.tsx (8 tests)
 ✓ recipe-version-history.test.tsx (5 tests)
 ✓ recipe-validation.test.ts (13 tests)
 ✓ recipe-list.test.tsx (2 tests)
 ✓ source-comparison.test.tsx (6 tests)
 ✓ auth-form.test.tsx (3 tests)
 ✓ theme-provider.test.tsx (3 tests)
 Test Files  9 passed (9)
      Tests  56 passed (56)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 56/56 Passing

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `new-recipe-form.test.tsx` | shows Find recipes tab and search input when Find recipes is clicked | ✅ Pass | Mode toggle renders search input and Search button |
| 2 | `new-recipe-form.test.tsx` | calls searchRecipes with description and shows results | ✅ Pass | Search call fires with description; results list rendered |
| 3 | `new-recipe-form.test.tsx` | selecting results and clicking Use selected switches to sources mode with pre-filled URLs | ✅ Pass | Checked URLs populate sources in sources mode |
| 4 | `new-recipe-form.test.tsx` | shows error when search fails | ✅ Pass | Network failure shows error message |

---

## Manual Verification Tasks

- [ ] Set `BRAVE_SEARCH_API_KEY` in Supabase secrets
- [ ] Click "New recipe" → "Find recipes" tab appears
- [ ] Describe a dish → results list appears with checkboxes
- [ ] Check 2-3 results → "Use X selected" → sources mode with URLs pre-filled
- [ ] Fill in title → save → compare/generate flow works end-to-end

---

## Summary

Added Find Recipes mode to the new recipe form — the last remaining spec feature. A "Find recipes" tab alongside "Add sources" lets users describe a dish (e.g. "tonkotsu ramen"), search the web via Brave Search API, and select candidate URLs as recipe sources. Selected URLs are pre-populated into the sources form for immediate use with the existing compare → generate flow. Requires `BRAVE_SEARCH_API_KEY` set in Supabase secrets.

**Same-session bug fix:** Double-numbered instructions fixed in `generate-recipe` and `chat-recipe` Edge Functions — added `stripStepNumber` post-processing and updated prompt/context formats so Claude stops copying numbered step format into JSON output.
