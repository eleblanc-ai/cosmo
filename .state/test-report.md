# Test Report

## Slice 1: Project Setup

Full project foundation scaffolded: React 19 + Vite + TypeScript + Tailwind v4 with `@theme` design tokens, 3-bucket folder structure, Vitest + React Testing Library, and a working dark/light ThemeProvider that reads system preference, responds to toggle, and persists to localStorage.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/app/theme-provider.test.tsx` | applies dark class on system dark preference | ✅ Pass | On mount, reads `window.matchMedia('(prefers-color-scheme: dark)')` and adds `dark` class to `<html>` |
| 2 | `src/app/theme-provider.test.tsx` | toggles theme on button click | ✅ Pass | Calling `toggleTheme` switches between `dark`/`light`, updating the `<html>` class accordingly |
| 3 | `src/app/theme-provider.test.tsx` | persists theme to localStorage | ✅ Pass | After toggle, `localStorage.getItem('theme')` reflects the new value so preference survives page reload |

---

## Slice 2: Auth

Supabase Auth wired up end to end — `AuthProvider` manages session state via `onAuthStateChange`, exposing `signIn`, `signUp`, and `signOut` to the app. All future features can call `useAuth()` to get the current session and `user_id`.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/auth/auth-form.test.tsx` | renders email and password fields | ✅ Pass | Form renders email input, password input, and sign-in button in default mode |
| 2 | `src/features/auth/auth-form.test.tsx` | calls signIn with email and password on submit | ✅ Pass | Filling and submitting the form calls `signIn` with the entered credentials |
| 3 | `src/features/auth/auth-form.test.tsx` | toggles to sign-up mode | ✅ Pass | Clicking the toggle button switches from "Sign in" to "Create account" mode |

---

## Slice 3: Recipe Sources

Recipe library screen with a new recipe form supporting multi-source entry (URL or raw text). `recipe-service.ts` handles all Supabase I/O. App.tsx uses simple view state — React Router deferred until complexity warrants it.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-list.test.tsx` | renders empty state when no recipes | ✅ Pass | Shows "No recipes yet" when `listRecipes` returns empty array |
| 2 | `src/features/recipes/recipe-list.test.tsx` | renders recipe titles when recipes exist | ✅ Pass | Recipe title cards appear when `listRecipes` returns data |
| 3 | `src/features/recipes/new-recipe-form.test.tsx` | can add and remove a source | ✅ Pass | "+ Add another source" adds a row; remove button removes it |
| 4 | `src/features/recipes/new-recipe-form.test.tsx` | calls createRecipe with title and sources on submit | ✅ Pass | Submitting calls `createRecipe` with correct userId, title, and sources array |

---

## Slice 4: Source Validation

Validation logic extracted into `recipe-validation.ts` as pure functions — title length, URL format (http/https only), text length limits, and duplicate URL detection. Form wires errors per-field and blocks submission on failure; empty source rows are silently filtered before validation.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-validation.test.ts` | returns error for empty title | ✅ Pass | Empty/whitespace title returns error |
| 2 | `src/features/recipes/recipe-validation.test.ts` | returns error when over 200 characters | ✅ Pass | Title over 200 chars returns error |
| 3 | `src/features/recipes/recipe-validation.test.ts` | returns null for valid title | ✅ Pass | Normal title passes |
| 4 | `src/features/recipes/recipe-validation.test.ts` | returns null for empty content | ✅ Pass | Empty source is valid (will be filtered) |
| 5 | `src/features/recipes/recipe-validation.test.ts` | returns error for invalid URL format | ✅ Pass | `not-a-url`, `example.com` rejected |
| 6 | `src/features/recipes/recipe-validation.test.ts` | returns error for non-http URL | ✅ Pass | `ftp://` rejected |
| 7 | `src/features/recipes/recipe-validation.test.ts` | returns null for valid https URL | ✅ Pass | `https://example.com/recipe` accepted |
| 8 | `src/features/recipes/recipe-validation.test.ts` | returns null for valid http URL | ✅ Pass | `http://example.com` accepted |
| 9 | `src/features/recipes/recipe-validation.test.ts` | returns error for text over 10000 characters | ✅ Pass | Text > 10,000 chars rejected |
| 10 | `src/features/recipes/recipe-validation.test.ts` | returns null for valid text | ✅ Pass | Normal text passes |
| 11 | `src/features/recipes/recipe-validation.test.ts` | returns empty set when no duplicates | ✅ Pass | Two different URLs → no duplicates flagged |
| 12 | `src/features/recipes/recipe-validation.test.ts` | returns indices of duplicate URLs | ✅ Pass | Same URL twice → both indices returned |
| 13 | `src/features/recipes/recipe-validation.test.ts` | ignores text sources when checking for duplicates | ✅ Pass | Duplicate text content is not flagged |

---

## Slice 5: Recipe Detail

Recipe detail view with title, sources, and delete via `ConfirmModal`. `ConfirmModal` added to `src/shared/components/` for reuse across future features. Detail includes an AI content placeholder section that subsequent slices will populate.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-detail.test.tsx` | renders recipe title and sources | ✅ Pass | Title and URL source appear after load |
| 2 | `src/features/recipes/recipe-detail.test.tsx` | calls onDelete after confirming deletion | ✅ Pass | Clicking "Delete recipe" → modal → "Delete" calls `deleteRecipe` and `onDelete` |

---

## Slice 6: Source Comparison

Side-by-side source comparison backed by a Supabase Edge Function that fetches URL content server-side (bypassing browser CORS). Fixed two JWT auth bugs — `getUser(jwt)` required in Deno's sessionless context, and `--no-verify-jwt` needed on deploy so the gateway doesn't block requests before the function handles auth in code.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/source-comparison.test.tsx` | renders source columns | ✅ Pass | Shows a column per source with correct label/content |
| 2 | `src/features/recipes/source-comparison.test.tsx` | shows loading state | ✅ Pass | Displays loading indicator while fetching |

---

## Slice 7: Source Extraction

Claude (claude-3-haiku, temperature 0) integrated into the fetch-sources Edge Function to extract structured recipe content from scraped page text. Prompt explicitly forbids using prior knowledge to prevent hallucination. Skeleton loading animation shows placeholder columns during fetch.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/source-comparison.test.tsx` | shows skeleton columns while loading | ✅ Pass | animate-pulse present before fetch resolves |
| 2 | `src/features/recipes/source-comparison.test.tsx` | renders extracted title, ingredients, and instructions | ✅ Pass | Claude-extracted content displayed correctly |
| 3 | `src/features/recipes/source-comparison.test.tsx` | uses source title as header link when extracted title is empty | ✅ Pass | Falls back to stored source title |
| 4 | `src/features/recipes/source-comparison.test.tsx` | shows no recipe found message with link | ✅ Pass | Empty state with clickable domain link |
| 5 | `src/features/recipes/source-comparison.test.tsx` | shows error when fetch fails | ✅ Pass | Network error displayed |

---

## Slice 8: Recipe Generation

`generate-recipe` Edge Function merges already-extracted source content into a unified recipe via Claude, returning `{ ingredients, instructions }`. Button shows "Generating…" during the call and is disabled until sources finish loading. No new tests were added; existing 30 tests continue to pass.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| — | — | No new tests | — | Existing 30 tests pass; behavior covered by integration |

---

## Slice 9: Recipe Display, Edit + Source Caching

Recipe detail now renders generated ingredients (two-column grid) and instructions (numbered list) with inline edit mode. Source content is cached in a new `source_contents jsonb` column — saved on first extraction, loaded directly on subsequent comparisons to skip the Claude call entirely.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-detail.test.tsx` | renders recipe title and sources | ✅ Pass | Title and URL source appear after load |
| 2 | `src/features/recipes/recipe-detail.test.tsx` | shows no recipe generated when empty | ✅ Pass | Empty state message when no ingredients/instructions |
| 3 | `src/features/recipes/recipe-detail.test.tsx` | renders ingredients and instructions when present | ✅ Pass | Generated content displays correctly |
| 4 | `src/features/recipes/recipe-detail.test.tsx` | enters edit mode when Edit is clicked | ✅ Pass | Edit button switches to inline input mode |
| 5 | `src/features/recipes/recipe-detail.test.tsx` | saves changes and exits edit mode | ✅ Pass | Save persists changes and returns to view mode |
| 6 | `src/features/recipes/recipe-detail.test.tsx` | cancels edit mode without saving | ✅ Pass | Cancel discards changes and returns to view mode |
| 7 | `src/features/recipes/recipe-detail.test.tsx` | calls onDelete after confirming deletion | ✅ Pass | Delete flow with confirmation modal |
| 8 | `src/features/recipes/source-comparison.test.tsx` | uses cached source_contents and skips fetch | ✅ Pass | Second comparison loads instantly from cache |

---

## Slice 10: AI Chat Refinement

Dedicated chat view for refining recipes via Claude. Messages are persisted to a `chat_messages` table with RLS. The `chat-recipe` Edge Function sends the current recipe snapshot + message history to Claude; when the model returns updated ingredients/instructions, `updateRecipe` is called immediately and a "Recipe updated" banner confirms the change.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-chat.test.tsx` | renders chat history loaded on mount | ✅ Pass | Existing messages appear when chat opens |
| 2 | `src/features/recipes/recipe-chat.test.tsx` | sends a user message and shows it immediately | ✅ Pass | User message appears in the thread before response |
| 3 | `src/features/recipes/recipe-chat.test.tsx` | shows assistant response after send | ✅ Pass | AI response appended to thread |
| 4 | `src/features/recipes/recipe-chat.test.tsx` | calls updateRecipe and shows banner when AI returns updated recipe | ✅ Pass | Recipe saved and banner shown on AI-driven changes |
| 5 | `src/features/recipes/recipe-chat.test.tsx` | disables input and Send button while sending | ✅ Pass | UI locked during in-flight request |
| 6 | `src/features/recipes/recipe-detail.test.tsx` | shows Chat button when recipe has content | ✅ Pass | Chat entry point only visible when recipe is generated |

---

## Slice 11: Version Tracking

Every recipe save (manual edit or AI chat update) snapshots ingredients and instructions to a `recipe_versions` table. A Version History view lists all versions with editable cook notes. When ≥ 2 versions exist, a Compare section shows side-by-side diff with red strikethrough for removed content and green for additions.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-version-history.test.tsx` | renders version list on mount | ✅ Pass | Version entries appear after load |
| 2 | `src/features/recipes/recipe-version-history.test.tsx` | shows "No versions yet" when empty | ✅ Pass | Empty state message shown |
| 3 | `src/features/recipes/recipe-version-history.test.tsx` | shows ingredient diff with correct highlighting | ✅ Pass | Red/green diff highlights render correctly |
| 4 | `src/features/recipes/recipe-version-history.test.tsx` | clicking "Edit notes" shows inline textarea | ✅ Pass | Cook notes field becomes editable on click |
| 5 | `src/features/recipes/recipe-version-history.test.tsx` | saving notes calls updateVersionNotes and exits edit mode | ✅ Pass | Notes persisted and view mode restored |
| 6 | `src/features/recipes/recipe-detail.test.tsx` | shows History button when recipe has content | ✅ Pass | Version history entry point visible when content exists |
| 7 | `src/features/recipes/recipe-chat.test.tsx` | calls saveRecipeVersion when AI returns updated recipe | ✅ Pass | AI updates create a new version snapshot |
| 8 | `src/features/recipes/recipe-chat.test.tsx` | does not call updateRecipe when AI returns the same recipe | ✅ Pass | No-op when AI response matches current recipe |
| 9 | `src/features/recipes/recipe-chat.test.tsx` | shows version history unavailable when saveRecipeVersion fails | ✅ Pass | Version save failure surfaced in UI |

---

## Slice 12: AI Context Enrichment

`generate-recipe` Edge Function now prompts Claude to return an `ai_context` block alongside the recipe — flavor profile, technique highlights, common pitfalls, and ingredient variation notes. Stored as `jsonb` and displayed on the recipe detail view in a bordered "Recipe Context" card. Pre-existing recipes without `ai_context` are unaffected.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/recipe-detail.test.tsx` | shows AI context section when present | ✅ Pass | Renders Recipe Context section with flavor profile, highlights, pitfalls, and notes from `ai_context` |

---

## Slice 13: Find Recipes

Find Recipes mode added to the new recipe form — users describe a dish, search the web via Brave Search API (called from an Edge Function), and select candidate URLs as recipe sources that pre-populate the sources form. This completes the last remaining spec feature for recipe collection.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/new-recipe-form.test.tsx` | shows Find recipes tab and search input when Find recipes is clicked | ✅ Pass | Mode toggle renders search input and Search button |
| 2 | `src/features/recipes/new-recipe-form.test.tsx` | calls searchRecipes with description and shows results | ✅ Pass | Search call fires with description; results list rendered |
| 3 | `src/features/recipes/new-recipe-form.test.tsx` | selecting results and clicking Use selected switches to sources mode with pre-filled URLs | ✅ Pass | Checked URLs populate sources in sources mode |
| 4 | `src/features/recipes/new-recipe-form.test.tsx` | shows error when search fails | ✅ Pass | Network failure shows error message |

---

## Slice 14: Workshop Shell + Analysis

New recipe creation is now search-only, flowing directly into the Workshop — a split-screen shell (left: analysis + recipe draft, right: chat placeholder). A new `analyze-sources` Edge Function fetches all selected URLs, extracts content, and calls Claude once for a combined analysis + initial recipe draft, which is autosaved to the DB.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/recipes/new-recipe-form.test.tsx` | shows search input and Search button on initial render | ✅ Pass | Search-only form renders correctly |
| 2 | `src/features/recipes/new-recipe-form.test.tsx` | calls searchRecipes with description and shows results | ✅ Pass | Search call fires with description; results rendered |
| 3 | `src/features/recipes/new-recipe-form.test.tsx` | selecting results and clicking Use selected calls onWorkshop with description and sources | ✅ Pass | Workshop launched with selected sources |
| 4 | `src/features/recipes/new-recipe-form.test.tsx` | shows error when search fails | ✅ Pass | Network failure shows error message |
| 5 | `src/features/recipes/recipe-workshop.test.tsx` | shows loading skeleton on mount | ✅ Pass | Skeleton renders while analysis loads |
| 6 | `src/features/recipes/recipe-workshop.test.tsx` | renders analysis section after load | ✅ Pass | Flavor profile, highlights, pitfalls, notes displayed |
| 7 | `src/features/recipes/recipe-workshop.test.tsx` | renders recipe draft after load | ✅ Pass | Initial ingredients and instructions displayed |
| 8 | `src/features/recipes/recipe-workshop.test.tsx` | autosaves recipe to DB on mount | ✅ Pass | `createRecipe` called on Workshop mount |

---

## Slice 15: Sign-up Confirmation

Fixed a post-sign-up Supabase internal error ("Cannot coerce the result to a single JSON object") that was surfacing as a false failure in the auth form. Split sign-up and sign-in submit paths so the error is only shown when user creation actually failed. Added a persistent saffron confirmation banner for when email confirmations are enabled; when disabled (current setup) the user is logged in directly with no error.

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/auth/auth-form.test.tsx` | renders email and password fields | ✅ Pass | Form renders correctly in default sign-in mode |
| 2 | `src/features/auth/auth-form.test.tsx` | calls signIn with email and password on submit | ✅ Pass | Sign-in path calls signIn with correct credentials |
| 3 | `src/features/auth/auth-form.test.tsx` | toggles to sign-up mode | ✅ Pass | Mode toggle switches to sign-up UI |
| 4 | `src/features/auth/auth-form.test.tsx` | shows confirmation message and switches to sign-in after successful sign-up | ✅ Pass | On successful sign-up, confirmation banner appears and form switches to sign-in mode |

---
