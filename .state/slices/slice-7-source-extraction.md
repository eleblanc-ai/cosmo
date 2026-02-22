# Slice 7: Source Extraction

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Use Claude to extract structured ingredients and instructions from each source, replacing raw scraped text with readable recipe content.

**Files:**
- `supabase/functions/fetch-sources/index.ts` (modify) — add Claude extraction after URL fetch
- `src/features/recipes/recipe-service.ts` (modify) — update SourceContent type (title, ingredients[], instructions[])
- `src/features/recipes/source-comparison.tsx` (modify) — skeleton loading, structured display, extracted title as header
- `src/features/recipes/source-comparison.test.tsx` (modify) — update tests for new data shape

**Outcome:** Each source column shows extracted recipe title + domain as a clickable header, ingredient list, and numbered instructions. Skeleton columns pulse while loading. "No recipe found at [link]" shown when extraction fails.

**Verification:** `npm run verify` passes + manual browser test

---

## User Interactions

### Phase 2: Planning
```
User: it's just all of the text instead of scraping out the recipe. could we involve ai
Cosmo: Planned Claude extraction of structured recipe content.
```

### Phase 3: Implementation
```
Debugging: model claude-3-5-haiku-20241022 returned 404 → fixed to claude-3-haiku-20240307
Debugging: API key was in .env.local not Supabase secrets → user set secret
Debugging: Claude wrapping JSON in code fences → strip fences before JSON.parse
Added: temperature: 0 + explicit "do not invent" prompt after hallucination concern
Added: recipe title extraction + domain subtitle in column header
Added: skeleton column animation while loading
```

### Phase 4: Approval
```
User: yes!
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

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `source-comparison.test.tsx` | shows skeleton columns while loading | ✅ Pass | animate-pulse present before fetch resolves |
| 2 | `source-comparison.test.tsx` | renders extracted title, ingredients, and instructions | ✅ Pass | Claude-extracted content displayed correctly |
| 3 | `source-comparison.test.tsx` | uses source title as header link when extracted title is empty | ✅ Pass | Falls back to stored source title |
| 4 | `source-comparison.test.tsx` | shows no recipe found message with link | ✅ Pass | Empty state with clickable domain link |
| 5 | `source-comparison.test.tsx` | shows error when fetch fails | ✅ Pass | Network error displayed |

---

## Manual Verification Tasks

- [x] Skeleton columns pulse while loading
- [x] Columns show extracted recipe title (saffron) + domain (muted) as clickable header
- [x] Ingredients list and numbered instructions render correctly
- [x] "No recipe found at [link]" shown for unextractable sources

---

## Summary

Integrated Claude (claude-3-haiku-20240307, temperature 0) into the fetch-sources Edge Function to extract structured recipe content from scraped page text. Prompt explicitly forbids using prior knowledge to prevent hallucination. JSON response parsing strips markdown code fences. Column headers show extracted recipe title above the domain, both as a clickable link. Skeleton loading animation shows placeholder columns while waiting. Redeployed with --no-verify-jwt.
