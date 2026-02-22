# Slice 10: AI Chat Refinement

**Timestamp:** 2026-02-18
**Status:** Approved

---

## Plan

**Goal:** Add a dedicated chat view where users can converse with AI to refine their recipe. AI responses can include updated ingredients/instructions applied immediately and persisted. Chat history persisted per recipe in `chat_messages` table.

**DB Migration (run manually in Supabase SQL editor):**
```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage own messages" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = chat_messages.recipe_id
        AND recipes.user_id = auth.uid()
    )
  );
```

**Files:**
- `supabase/functions/chat-recipe/index.ts` (new) — Edge Function using claude-3-haiku-20240307; receives recipe + message history; returns `{ message, recipe? }`
- `src/features/recipes/recipe-service.ts` (modify) — `ChatMessage` interface, `getChatMessages`, `saveChatMessage`, `sendChatMessage`
- `src/features/recipes/recipe-chat.tsx` (new) — Chat view; loads history on mount; optimistic user message; "Recipe updated" banner on AI changes
- `src/features/recipes/recipe-chat.test.tsx` (new) — 5 tests
- `src/features/recipes/recipe-detail.tsx` (modify) — `onChat` prop + Chat button when recipe has content
- `src/features/recipes/recipe-detail.test.tsx` (modify) — `onChat` added to all renders + 1 new test
- `src/app/App.tsx` (modify) — `chat` view, `chatRecipe` state, `openChat`, `RecipeChat` rendering

**Outcome:** Recipe detail shows Chat button alongside Edit. Chat view loads history, user sends messages, AI responds and optionally updates recipe in place.

**Verification:** `npm run verify` passes + DB migration run + deploy `chat-recipe` + manual browser test

---

## User Interactions

### Phase 2: Planning
```
User: cool let's go
Cosmo: Presented options for next feature (AI Chat, Version Tracking, AI Enrichment)
User: AI Chat Refinement
Cosmo: Asked where chat UI should live + how recipe updates work
User: dealer's choice [for location]; auto update with versioning when we get to that slice
Cosmo: Proposed separate chat view, auto-update without versioning
```

### Phase 3: Implementation
```
Debugging: scrollIntoView not available in jsdom → fixed with ?.scrollIntoView?.()
Debugging: 500 from chat-recipe — Claude returning literal newlines inside JSON string values → updated prompt to request compact single-line JSON + added sanitization regex before JSON.parse
```

### Phase 4: Approval
```
User: looks good
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
 ✓ recipe-chat.test.tsx (5 tests)
 ✓ recipe-detail.test.tsx (8 tests)
 ✓ recipe-validation.test.ts (13 tests)
 Test Files  8 passed (8)
      Tests  42 passed (42)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ 42/42 Passing

| # | File | Test name | Status |
|---|------|-----------|--------|
| 1 | `recipe-chat.test.tsx` | renders chat history loaded on mount | ✅ Pass |
| 2 | `recipe-chat.test.tsx` | sends a user message and shows it immediately | ✅ Pass |
| 3 | `recipe-chat.test.tsx` | shows assistant response after send | ✅ Pass |
| 4 | `recipe-chat.test.tsx` | calls updateRecipe and shows banner when AI returns updated recipe | ✅ Pass |
| 5 | `recipe-chat.test.tsx` | disables input and Send button while sending | ✅ Pass |
| 6 | `recipe-detail.test.tsx` | shows Chat button when recipe has content | ✅ Pass |

---

## Manual Verification Tasks

- [x] Run DB migration in Supabase SQL editor
- [x] Open a recipe with generated content — "Chat" button appears alongside Edit
- [x] Click Chat — opens chat view with recipe title in header
- [x] Type a message ("what are the key flavors?") — response appears without recipe change, no banner
- [x] Type a modification ("make it spicier") — AI responds, "Recipe updated" banner appears
- [x] Click Back — recipe detail shows updated ingredients/instructions
- [x] Re-open Chat — previous messages load from history

---

## Summary

Added AI Chat Refinement: a dedicated chat view reached from the recipe detail page. Messages are persisted to a new `chat_messages` table (with RLS). The `chat-recipe` Edge Function sends the current recipe snapshot + message history to Claude, which responds conversationally and optionally returns updated ingredients/instructions. When the AI makes changes, `updateRecipe` is called immediately and a "Recipe updated" banner confirms it. Navigating back to detail re-fetches from DB, reflecting any changes.
